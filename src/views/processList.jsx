/**
 * Vista: ProcessList
 * Descripción:
 * Esta vista muestra un listado de procesos registrados en el sistema, cada uno representado como una tarjeta (`ProcessCard`).
 * Permite a los usuarios con permisos adecuados:
 * - Visualizar procesos y sus entidades correspondientes.
 * - Agregar un nuevo proceso mediante botón flotante.
 * - Editar o eliminar procesos existentes con confirmación previa.
 *
 * Funcionalidades clave:
 * - Carga asincrónica de procesos desde el endpoint `/api/procesos`.
 * - Obtención de entidades desde `/api/entidades` para vincular el nombre de la entidad al proceso.
 * - Enriquecimiento de los datos de proceso para mostrar `nombreProceso`, `nombreEntidad`, y `id` unificado.
 * - Botón de creación (`FAB`) fijo en esquina inferior derecha.
 * - Confirmación de edición y eliminación mediante componentes modales reutilizables (`ConfirmDelete`, `ConfirmEdit`).
 *
 * Endpoints utilizados:
 * - `GET /api/procesos` → Lista de procesos.
 * - `GET /api/entidades` → Lista de entidades.
 * - `DELETE /api/procesos/{id}` → Elimina un proceso específico.
 *
 * Componentes externos:
 * - `ProcessCard`: Tarjeta visual de cada proceso.
 * - `Title`: Encabezado principal.
 * - `ConfirmDelete`, `ConfirmEdit`: Diálogos de confirmación reutilizables.
 *
 * Estado local:
 * - `processes`, `entidades`: Datos cargados desde el backend.
 * - `selectedProcess`: Proceso seleccionado para edición o eliminación.
 * - `openDelete`, `openConfirmEdit`: Estados de visibilidad para los diálogos modales.
 *
 * Navegación:
 * - Al editar, redirige a `/editar-proceso/{id}`.
 * - Al crear, redirige a `/nuevo-proceso`.
 *
 * Observación:
 * El componente contempla compatibilidad flexible con estructuras de datos del backend usando `idProceso || idProcesoPK`.
 */

import React, { useEffect, useState } from "react";
import { Box, Grid, Fab } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import ProcessCard from "../components/processCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Title from "../components/Title";
import ConfirmDelete from "../components/confirmDelete";
import ConfirmEdit from "../components/confirmEdit";

function ProcessList() {
  const [processes, setProcesses] = useState([]);
  const [entidades, setEntidades] = useState([]);
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  const [openConfirmEdit, setOpenConfirmEdit] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);


  // Función para obtener la lista de procesos
  const fetchProcesses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/procesos");
      const data = response.data.procesos || response.data;
      console.log("Fetched processes:", data);
      setProcesses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching processes:", error);
      setProcesses([]);
    }
  };

  // Función para obtener las entidades
  const fetchEntidades = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/entidades");
      setEntidades(response.data.entidades || []);
    } catch (error) {
      console.error("Error fetching entidades:", error);
      setEntidades([]);
    }
  };

  useEffect(() => {
    fetchProcesses();
    fetchEntidades();
  }, []);

  const handleConfirmDelete = async () => {
    if (!selectedProcess) return;
    await handleDelete(selectedProcess.id);
    setOpenDelete(false);
  };

  const handleConfirmEdit = () => {
    if (!selectedProcess) return;
    navigate(`/editar-proceso/${selectedProcess.id}`);
    setOpenConfirmEdit(false);
  };
  const confirmDelete = (process) => {
    setSelectedProcess(process);
    setOpenDelete(true);
  };
  
  const confirmEdit = (process) => {
    setSelectedProcess(process);
    setOpenConfirmEdit(true);
  };
  


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/procesos/${id}`);
      setProcesses((prev) => prev.filter((p) => {
        const pid = p.idProceso || p.idProcesoPK;
        return pid !== id;
      }));
    } catch (error) {
      console.error("Error deleting process:", error);
    }
  };

  // Enriquecer cada proceso para agregar el nombre de la entidad y asegurar el id
  const enrichedProcesses = processes.map((process) => {
    // Verificamos ambos nombres de propiedad, por si el backend usa otro nombre
    const processId = process.idProceso || process.idProcesoPK;
    const entity = entidades.find(
      (ent) => ent?.idEntidadDependencia?.toString() === process?.idEntidad?.toString()
    );
    return {
      ...process,
      id: processId,
      name: process.nombreProceso,
      entidad: entity ? entity.nombreEntidad : "Sin entidad",
    };
  });

  return (
    <Box sx={{ p: 4 }}>
      <Title text="Procesos" ></Title>
      <Grid container spacing={2}>
        {enrichedProcesses.map((process) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={process.id}>
            <ProcessCard
              process={process}
              onEdit={() => confirmEdit(process)}
              onDelete={() => confirmDelete(process)}
            />
          </Grid>
        ))}
      </Grid>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => navigate("/nuevo-proceso")}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          backgroundColor: "secondary.main",
          "&:hover": { backgroundColor: "primary.main" },
        }}
      >
        <AddIcon />
      </Fab>
      <ConfirmDelete
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        entityType="proceso"
        entityName={selectedProcess?.nombreProceso}
      />

      <ConfirmEdit
        open={openConfirmEdit}
        onClose={() => setOpenConfirmEdit(false)}
        onConfirm={handleConfirmEdit}
        entityType="proceso"
        entityName={selectedProcess?.nombreProceso}
      />

    </Box>

  );
}

export default ProcessList;
