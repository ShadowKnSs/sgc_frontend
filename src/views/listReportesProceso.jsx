/**
 * Vista: ReportesDeProceso.jsx
 * Descripción:
 * Pantalla principal para gestionar y visualizar los reportes de proceso generados por año. 
 * Permite crear, visualizar y eliminar reportes asociados a procesos específicos, agrupados por entidad.

 * Funcionalidades clave:
 * - Visualización de todos los reportes generados (`GET /api/reportes-proceso`)
 * - Creación de nuevo reporte:
 *    - Selección de entidad, proceso y año
 *    - Verificación de existencia previa
 *    - Confirmación si los datos están incompletos
 *    - Registro en base de datos (`POST /api/reportes-proceso`)
 * - Eliminación de reporte con confirmación (`DELETE /api/reportes-proceso/{id}`)
 * - Filtro lateral de búsqueda para encontrar reportes por término (`FiltroReportes`)
 * - Redirección a vista detallada del reporte (`/reporte-proceso/:idProceso/:anio`)

 * Estado local:
 * - `entities`, `processes`, `years`: Datos dependientes de la selección del usuario
 * - `selectedEntity`, `selectedProcess`, `selectedYear`: Parámetros seleccionados para crear reporte
 * - `reports`: Lista de reportes ya registrados
 * - `openModal`, `confirmIncompleteOpen`, `warningReportExistsOpen`: Estado de los modales
 * - `reportCard`: Objeto para vista previa del nuevo reporte
 * - `reportToDelete`: Objeto del reporte en proceso de eliminación
 * - `searchTerm`, `searchOpen`: Control del filtro lateral de búsqueda
 * - `snackbarOpen`, `snackbarMessage`: Notificaciones

 * Componentes personalizados usados:
 * - `Title`: Encabezado estilizado
 * - `ReportCard`: Card visual de cada reporte
 * - `GenerateReportModal`: Modal para crear nuevo reporte
 * - `ConfirmModal`: Modal para confirmar creación con datos incompletos
 * - `WarningModal`: Modal de advertencia por duplicidad
 * - `DeleteConfirmModal`: Modal para confirmar eliminación
 * - `FloatingActionButton`: Botón flotante para nuevo reporte
 * - `FiltroReportes`: Panel lateral para búsqueda

 * Flujo de generación de reporte:
 * 1. Usuario da clic en botón nuevo.
 * 2. Llena entidad, proceso y año.
 * 3. Se verifica si ya existe (`reports.find()`).
 * 4. Si falta información básica, se lanza confirmación.
 * 5. Si todo está válido, se guarda en base de datos.

 * Recomendaciones:
 * - Mover `entities`, `processes`, `years` a un contexto compartido si se reutilizan.
 * - Mejorar validaciones con librerías como `Yup`.
 * - Hacer paginación o lazy loading de reportes si la lista crece.
 * - Incluir filtro por año o entidad.

 * Seguridad:
 * - Asegurar protección de endpoints en backend (según rol).
 * - Validar que el usuario tenga permiso sobre el proceso seleccionado antes de permitir crear/eliminar.

 */

import React, { useState, useEffect } from "react";
import {Box, Snackbar, Alert, Typography, CircularProgress, IconButton, Tooltip} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import ReportCard from "../components/CardReport";
import GenerateReportModal from "../components/Modals/GenerarReporteModal";
import FloatingActionButton from "../components/ButtonNewReport";
import ConfirmModal from "../components/Modals/ConfIrmModal";
import WarningModal from "../components/Modals/AvisoModal";
import DeleteConfirmModal from "../components/Modals/DeleteConfirmModal";
import FiltroReportes from "../components/buscadorProceso";
import axios from "axios";

const ReportesDeProceso = () => {
  const [openModal, setOpenModal] = useState(false);
  const [confirmIncompleteOpen, setConfirmIncompleteOpen] = useState(false);
  const [warningReportExistsOpen, setWarningReportExistsOpen] = useState(false);
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [processes, setProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState('');
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [reportCard, setReportCard] = useState(null);
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [reportToDelete, setReportToDelete] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Funciones para obtener entidades, procesos, años y reportes...
  // Obtener entidades
  const fetchEntities = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/entidades');
      console.log("Respuesta de entities:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching entities:", error);
      throw error;
    }
  };

  // Obtener procesos por entidad
  const fetchProcesses = async (entityId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/procesos/entidad/${entityId}`);
      console.log("Respuesta de processes:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching processes:", error);
      throw error;
    }
  };

  // Obtener años por proceso
  const fetchYears = async (processId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/registros/years/${processId}`);
      console.log("Respuesta de years:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching years:", error);
      throw error;
    }
  };

  // Obtener reportes existentes
  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const response = await axios.get('http://localhost:8000/api/reportes-proceso');
      console.log("Reportes existentes:", response.data.reportes);
      setReports(response.data.reportes);
    } catch (error) {
      console.error("Error al obtener reportes:", error);
      setSnackbarMessage("Error al obtener reportes.");
      setSnackbarOpen(true);
    }
    setLoadingReports(false);
  };


  useEffect(() => {
    fetchEntities()
      .then((data) => setEntities(data.entidades))
      .catch((error) => {
        setSnackbarMessage("Error al obtener entidades: " + error.message);
        setSnackbarOpen(true);
      });
    fetchReports();
  }, []);

  useEffect(() => {
    if (selectedEntity) {
      fetchProcesses(selectedEntity)
        .then((data) => {
          console.log("Fetched processes:", data);
          setProcesses(Array.isArray(data) ? data : data.procesos);
        })
        .catch((error) => {
          setSnackbarMessage("Error al obtener procesos: " + error.message);
          setSnackbarOpen(true);
        });
    } else {
      setProcesses([]);
    }
    setSelectedProcess('');
    setYears([]);
    setSelectedYear('');
  }, [selectedEntity]);

  useEffect(() => {
    if (selectedProcess) {
      fetchYears(selectedProcess)
        .then((data) => setYears(data))
        .catch((error) => {
          setSnackbarMessage("Error al obtener años: " + error.message);
          setSnackbarOpen(true);
        });
    } else {
      setYears([]);
    }
    setSelectedYear('');
  }, [selectedProcess]);

  const handleOpenDeleteModal = (report) => {
    setReportToDelete(report);
  };
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEntity('');
    setSelectedProcess('');
    setSelectedYear('');
  };

  const saveReport = () => {
    const entity = entities.find((e) => e.idEntidadDependecia === Number(selectedEntity));
    const process = processes.find((p) => p.idProceso === Number(selectedProcess));
    const newReportCard = {
      processId: Number(selectedProcess),
      year: selectedYear,
      entityName: entity ? entity.nombreEntidad : '',
      processName: process ? process.nombreProceso : '',
    };

    console.log("New Report", newReportCard);
    // Verificar si ya existe un reporte para ese proceso y año (usando el año seleccionado)
    const existingReport = reports.find(
      (r) =>
        r.idProceso === newReportCard.processId &&
        String(r.anio) === String(newReportCard.year)
    );

    if (existingReport) {
      setWarningReportExistsOpen(true);
      return;
    }

    // Enviar la solicitud POST sin enviar la fechaElaboracion para que el backend asigne la fecha actual.
    axios
      .post("http://localhost:8000/api/reportes-proceso", {
        idProceso: newReportCard.processId,
        nombreReporte: `Reporte ${newReportCard.processName} ${newReportCard.entityName}`,
        anio: newReportCard.year
        // No enviamos fechaElaboracion; el backend usará la fecha actual.
      })
      .then((res) => {
        console.log("Reporte guardado en base de datos", res.data);
        setReportCard(newReportCard);
        fetchReports();
        setOpenModal(false);
        setSelectedEntity('');
        setSelectedProcess('');
        setSelectedYear('');
      })
      .catch((err) => {
        console.error("Error al guardar el reporte:", err);
        setSnackbarMessage("Error al guardar el reporte en la base de datos.");
        setSnackbarOpen(true);
      });
  };


  // Si los datos están incompletos, se muestra el modal de confirmación
  const handleGuardarReporte = () => {
    if (!selectedEntity || !selectedProcess || !selectedYear) {
      setSnackbarMessage('Por favor, seleccione todos los campos.');
      setSnackbarOpen(true);
      return;
    }
    const entity = entities.find((e) => e.idEntidadDependencia === Number(selectedEntity));
    const process = processes.find((p) => p.idProceso === Number(selectedProcess));
    if (!entity || !process) {
      setSnackbarMessage('Datos inválidos seleccionados.');
      setSnackbarOpen(true);
      return;
    }
    // Si falta información importante, consideramos que los apartados están incompletos
    if (!process.nombreProceso || !entity.nombreEntidad) {
      setConfirmIncompleteOpen(true);
    } else {
      saveReport();
    }
  };

  const handleConfirmIncompleteAccept = () => {
    setConfirmIncompleteOpen(false);
    saveReport();
  };

  const handleConfirmIncompleteCancel = () => {
    setConfirmIncompleteOpen(false);
  };

  // Función para eliminar reporte
  const handleConfirmDelete = () => {
    if (!reportToDelete) return;
    axios
      .delete(`http://localhost:8000/api/reportes-proceso/${reportToDelete.idReporteProceso}`)
      .then((res) => {
        console.log("Reporte eliminado:", res.data);
        fetchReports();
        setReportToDelete(null);
      })
      .catch((err) => {
        console.error("Error al eliminar el reporte:", err);
        setSnackbarMessage("Error al eliminar el reporte.");
        setSnackbarOpen(true);
        setReportToDelete(null);
      });
  };

  // Función para cancelar la eliminación
  const handleCancelDelete = () => {
    setReportToDelete(null);
  };

  const handleCardClick = (report) => {
    if (!report) return;
    console.log("Clicked report:", report);
    const processId = report.idProceso;
    const reportYear = report.anio;
    console.log("🔍 ID Proceso:", processId);
    console.log("🔍 Año:", reportYear);
    navigate(`/reporte-proceso/${processId}/${reportYear}`);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
  <Box sx={{ p: 2, position: 'relative', minHeight: '100vh', display: "flex", flexDirection: "row" }}>

    {/* Filtro lateral */}
    <FiltroReportes
      open={searchOpen}
      onClose={() => setSearchOpen(false)}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />

    {/* Contenido principal */}
    <Box sx={{ flex: 1 }}>
      <Box sx={{ textAlign: "center", paddingTop: 3 }}>
        <Title text="Reportes de Proceso" />
      </Box>

      {loadingReports ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {reports && reports.length > 0 ? (
            reports.map((rep) => (
              <ReportCard
                key={rep.idReporteProceso}
                report={rep}
                onClick={() => handleCardClick(rep)}
                onDelete={() => handleOpenDeleteModal(rep)}
              />
            ))
          ) : (
            <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
              No hay reportes registrados.
            </Typography>
          )}
        </>
      )}

      {/* Botón flotante de búsqueda */}
      <Box sx={{ position: "fixed", bottom: 90, right: 16 }}>
        <Tooltip title="Buscar Reportes">
          <IconButton
            onClick={() => setSearchOpen(!searchOpen)}
            sx={{
              backgroundColor: "#004A98",
              color: "white",
              "&:hover": { backgroundColor: "#003366" },
              width: 56,
              height: 56,
              borderRadius: "50%",
              boxShadow: 3
            }}
          >
            <SearchIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Botón flotante para agregar */}
      <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <FloatingActionButton onClick={handleOpenModal} />
      </Box>

      {/* Modales */}
      <DeleteConfirmModal
        open={Boolean(reportToDelete)}
        reportName={reportToDelete ? reportToDelete.nombreReporte : ""}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <GenerateReportModal
        open={openModal}
        onClose={handleCloseModal}
        onSave={handleGuardarReporte}
        entities={entities}
        processes={processes}
        years={years}
        selectedEntity={selectedEntity}
        selectedProcess={selectedProcess}
        selectedYear={selectedYear}
        setSelectedEntity={setSelectedEntity}
        setSelectedProcess={setSelectedProcess}
        setSelectedYear={setSelectedYear}
      />

      <ConfirmModal
        open={confirmIncompleteOpen}
        title="Información incompleta"
        message="Algunos apartados del reporte no están completos. ¿Desea continuar?"
        onAccept={handleConfirmIncompleteAccept}
        onCancel={handleConfirmIncompleteCancel}
      />

      <WarningModal
        open={warningReportExistsOpen}
        title="Reporte Existente"
        message={`Ya existe el reporte para el año ${selectedYear}. No se puede generar uno nuevo.`}
        onClose={() => setWarningReportExistsOpen(false)}
      />

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  </Box>
);

};

export default ReportesDeProceso;
