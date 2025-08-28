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
import { Box, Grid, Stack, TextField, InputAdornment, IconButton, MenuItem } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FabCustom from "../components/FabCustom";
import Add from "@mui/icons-material/Add";
import ProcessCard from "../components/processCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Title from "../components/Title";
import ConfirmDelete from "../components/confirmDelete";
import ConfirmEdit from "../components/confirmEdit";
import BreadcrumbNav from "../components/BreadcrumbNav";
import SectionTabs from "../components/SectionTabs";


function ProcessList() {
  const [processes, setProcesses] = useState([]);
  const [entidades, setEntidades] = useState([]);
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  const [openConfirmEdit, setOpenConfirmEdit] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);

  const [q, setQ] = useState(""); // buscador
  const [selectedTab, setSelectedTab] = useState(0); // tabs estado
  const [macroFilter, setMacroFilter] = useState(""); // filtro macroproceso

  const macroprocesosMap = {
    1: "Gestión Escolar",
    2: "Desarrollo y Formación Integral del Estudiante",
    3: "Gestión Administrativa",
  };

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

  // aplicar filtros
  const filteredProcesses = enrichedProcesses.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.entidad.toLowerCase().includes(q.toLowerCase());

    // filtro por estado
    const matchesEstado =
      (selectedTab === 0 && p.estado === "Activo") ||
      (selectedTab === 1 && p.estado === "Inactivo");

    // filtro por macroproceso
    const matchesMacro = macroFilter === "" || p.idMacroproceso === parseInt(macroFilter);

    return matchesSearch && matchesEstado && matchesMacro;
  });

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

  return (
    <Box sx={{ p: 4 }}>
      <BreadcrumbNav items={[{ label: "Gestión de Procesos", icon: AccountTreeIcon }]} />

      <Title text="Procesos" mode="sticky" />

      {/* Toolbar de filtros */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        sx={{
          mb: 3,
          top: 64,
          zIndex: 1,
          bgcolor: "background.paper",
          py: 1.5,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        {/* Buscador */}
        <TextField
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o entidad"
          size="small"
          fullWidth
          sx={{ maxWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: q ? (
              <InputAdornment position="end">
                <IconButton onClick={() => setQ("")} size="small">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        {/* Tabs de estado */}
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <SectionTabs
            sections={["Activos", "Inactivos"]}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
          />
        </Box>

        {/* Filtro por Macroproceso */}
        <TextField
          select
          size="small"
          label="Macroproceso"
          value={macroFilter}
          onChange={(e) => setMacroFilter(e.target.value)}
          sx={{ minWidth: 250 }}
        >
          <MenuItem value="">Todos</MenuItem>
          {Object.entries(macroprocesosMap).map(([id, nombre]) => (
            <MenuItem key={id} value={id}>
              {nombre}
            </MenuItem>
          ))}
        </TextField>

      </Stack>

      {/* Grid de procesos filtrados */}
      <Grid container spacing={2}>
        {filteredProcesses.map((process) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={process.id}>
            <ProcessCard
              process={process}
              onEdit={() => confirmEdit(process)}
              onDelete={() => confirmDelete(process)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Botón agregar */}
      <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <FabCustom
          onClick={() => navigate("/nuevo-proceso")}
          title="Agregar Proceso"
          icon={<Add />}
        />
      </Box>

      {/* Modales */}
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
