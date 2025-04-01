import React, { useState, useEffect } from "react";
import {
  Box,
  Snackbar,
  Alert,
  Typography,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import ReportCard from "../components/CardReport";
import GenerateReportModal from "../components/Modals/GenerarReporteModal";
import FloatingActionButton from "../components/ButtonNewReport";
import ConfirmModal from "../components/Modals/ConfIrmModal";
import WarningModal from "../components/Modals/AvisoModal";
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

    // Verificar si ya existe un reporte para ese proceso y año
    const existingReport = reports.find(
      (r) =>
        r.idProceso === newReportCard.processId &&
        new Date(r.fechaElaboracion).getFullYear().toString() === newReportCard.year
    );
    if (existingReport) {
      setWarningReportExistsOpen(true);
      return;
    }

    axios
      .post("http://localhost:8000/api/reportes-proceso", {
        idProceso: newReportCard.processId,
        nombreReporte: `Reporte ${newReportCard.processName} ${newReportCard.entityName}`,
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
    const entity = entities.find((e) => e.idEntidadDependecia === Number(selectedEntity));
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
  const handleDeleteReport = (report) => {
    if (!report) return;
    axios
      .delete(`http://localhost:8000/api/reportes-proceso/${report.idReporteProceso}`)
      .then((res) => {
        console.log("Reporte eliminado:", res.data);
        fetchReports();
      })
      .catch((err) => {
        console.error("Error al eliminar el reporte:", err);
        setSnackbarMessage("Error al eliminar el reporte.");
        setSnackbarOpen(true);
      });
  };

  const handleCardClick = (report) => {
    if (!report) return;
    console.log("Clicked report:", report);
    const processId = report.idProceso;
    const reportYear = new Date(report.fechaElaboracion).getFullYear();
    console.log("🔍 ID Proceso:", processId);
    console.log("🔍 Año:", reportYear);
    navigate(`/reporte-proceso/${processId}/${reportYear}`);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Box sx={{ p: 2, position: 'relative', minHeight: '100vh' }}>
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
                onDelete={handleDeleteReport}
              />
            ))
          ) : (
            <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
              No hay reportes registrados.
            </Typography>
          )}
        </>
      )}

      <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <FloatingActionButton onClick={handleOpenModal} />
      </Box>

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
  );
};

export default ReportesDeProceso;
