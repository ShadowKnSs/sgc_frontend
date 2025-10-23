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
import React, { useEffect, useState, useCallback } from "react";
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
import FeedbackSnackbar from "../components/Feedback";

const API_BASE = "http://127.0.0.1:8000/api";

function ProcessList() {
  const [processes, setProcesses] = useState([]);
  const [entidades, setEntidades] = useState([]);
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  const [openConfirmEdit, setOpenConfirmEdit] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [openForceDelete, setOpenForceDelete] = useState(false);

  const [q, setQ] = useState(""); // buscador
  const [selectedTab, setSelectedTab] = useState(0); // tabs estado
  const [macroFilter, setMacroFilter] = useState(""); // filtro macroproceso

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "info", // success | info | warning | error
    title: "",
    message: "",
  });
  const showFeedback = useCallback((type, message, title = "") =>
    setSnackbar({ open: true, type, message, title }), []);

  const closeFeedback = useCallback(() =>
    setSnackbar((s) => ({ ...s, open: false })), []);

  const macroprocesosMap = {
    1: "Gestión Escolar",
    2: "Desarrollo y Formación Integral del Estudiante",
    3: "Gestión Administrativa",
  };


  // Obtener la lista de procesos
  const fetchProcesses = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/procesos`);
      const list = data.procesos || data || [];
      setProcesses(Array.isArray(list) ? list : []);
    } catch {
      setProcesses([]);
      showFeedback("error", "No se pudieron cargar los procesos.", "Error");
    }
  }, [showFeedback]);

  // Obtener entidades
  const fetchEntidades = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/entidades`);
      setEntidades(data.entidades || []);
    } catch {
      setEntidades([]);
      showFeedback("error", "No se pudieron cargar las entidades.", "Error");
    }
  }, [showFeedback]);

  useEffect(() => {
    fetchProcesses();
    fetchEntidades();
  }, [fetchProcesses, fetchEntidades]);

  // Enriquecer procesos
  const enrichedProcesses = processes.map((process) => {
    const processId = process.idProceso || process.idProcesoPK;
    const entity = entidades.find(
      (ent) => ent?.idEntidadDependencia?.toString() === process?.idEntidad?.toString()
    );
    const macroproceso = macroprocesosMap[process.idMacroproceso] || "Sin macroproceso";

    return {
      ...process,
      id: processId,
      name: process.nombreProceso,
      entidad: entity ? entity.nombreEntidad : "Sin entidad",
      macroproceso: macroproceso,
    };
  });

  // Filtros
  const filteredProcesses = enrichedProcesses.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(q.toLowerCase()) ||
      p.entidad?.toLowerCase().includes(q.toLowerCase());

    const matchesEstado =
      (selectedTab === 0 && p.estado === "Activo") ||
      (selectedTab === 1 && p.estado === "Inactivo");

    const matchesMacro = macroFilter === "" || p.idMacroproceso === parseInt(macroFilter);

    return matchesSearch && matchesEstado && matchesMacro;
  });

  // Confirmaciones
  const handleConfirmDelete = async () => {
    if (!selectedProcess) return;
    await handleDeactivate(selectedProcess.id); // Cambiado de handleDelete a handleDeactivate
    setOpenDelete(false);
  };

  const handleConfirmForceDelete = async () => {
    if (!selectedProcess) return;
    await handleForceDelete(selectedProcess.id);
    setOpenForceDelete(false);
  };

  const handleConfirmActivate = async () => {
    if (!selectedProcess) return;
    await handleActivate(selectedProcess.id);
    setOpenConfirmEdit(false); // Reutilizamos este estado o podríamos crear uno nuevo
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

  // Helpers IDs
  const getPid = (p) => (p.idProceso ?? p.idProcesoPK)?.toString();

  // Eliminar (inactivar)
  const handleDeactivate = async (id) => {
    try {
      const { data } = await axios.delete(`${API_BASE}/procesos/${id}`);
      const updated = data?.proceso || null;

      setProcesses((prev) =>
        prev.map((p) => {
          if (getPid(p) === String(id)) {
            return updated ? { ...p, ...updated, estado: "Inactivo" } : { ...p, estado: "Inactivo" };
          }
          return p;
        })
      );

      showFeedback("success", "El proceso fue movido a Inactivos.");
    } catch {
      showFeedback("error", "No se pudo desactivar el proceso.", "Error");
    }
  };

  // Función para activar proceso
  const handleActivate = async (id) => {
    try {
      const { data } = await axios.put(`${API_BASE}/procesos/${id}/activar`);
      const updated = data?.proceso || null;

      setProcesses((prev) =>
        prev.map((p) => {
          if (getPid(p) === String(id)) {
            return updated ? { ...p, ...updated, estado: "Activo" } : { ...p, estado: "Activo" };
          }
          return p;
        })
      );

      showFeedback("success", "El proceso fue activado exitosamente.");
    } catch (error) {
      showFeedback("error", "No se pudo activar el proceso.", "Error");
    }
  };

  const handleForceDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/procesos/${id}/force`);

      // Remover completamente de la lista
      setProcesses((prev) => prev.filter((p) => getPid(p) !== String(id)));

      showFeedback("success", "El proceso fue eliminado permanentemente.");
    } catch (error) {
      showFeedback("error", "No se pudo eliminar el proceso.", "Error");
    }
  };
  // Funciones para abrir modales

  const confirmForceDelete = (process) => {
    setSelectedProcess(process);
    setOpenForceDelete(true);
  };

  const confirmActivate = (process) => {
    setSelectedProcess(process);
    setOpenConfirmEdit(true);
  };

  return (
    <Box sx={{ p: 3.5, mb:3 }}>
      <BreadcrumbNav items={[{ label: "Procesos", icon: AccountTreeIcon }]} />
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
                <IconButton onClick={() => setQ("")} size="small" aria-label="limpiar búsqueda">
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

      {/* Grid / vacío */}
      {filteredProcesses.length === 0 ? (
        <Box
          sx={{
            mt: 4,
            textAlign: "center",
            color: "text.secondary",
            fontStyle: "italic",
            fontSize: 16,
          }}
        >
          No hay registros
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredProcesses.map((process) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={process.id}>
              <ProcessCard
                process={process}
                onEdit={() => confirmEdit(process)}
                onDelete={() => confirmDelete(process)}
                onActive={() => confirmActivate(process)}
                onForceDelete={() => confirmForceDelete(process)}
              />
            </Grid>
          ))}
        </Grid>
      )}

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
        isPermanent={false}
        description="El proceso se moverá a la sección de inactivos y podrá ser reactivado posteriormente."
      />

      <ConfirmDelete
        open={openForceDelete}
        onClose={() => setOpenForceDelete(false)}
        onConfirm={handleConfirmForceDelete}
        entityType="proceso"
        entityName={selectedProcess?.nombreProceso}
        isPermanent={true}
        description="Esta acción no se puede deshacer. El proceso será eliminado permanentemente del sistema."
      />

      <ConfirmEdit
        open={openConfirmEdit}
        onClose={() => setOpenConfirmEdit(false)}
        onConfirm={selectedProcess?.estado === "Activo" ? handleConfirmEdit : handleConfirmActivate}
        entityType="proceso"
        entityName={selectedProcess?.nombreProceso}
        actionText={selectedProcess?.estado === "Activo" ? "Editar" : "Activar"}
      />

      {/* Feedback */}
      <FeedbackSnackbar
        open={snackbar.open}
        onClose={closeFeedback}
        type={snackbar.type}
        title={snackbar.title}
        message={snackbar.message}
      />
    </Box>
  );
}

export default ProcessList;
