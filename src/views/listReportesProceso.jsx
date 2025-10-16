import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, CircularProgress, IconButton, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AssignmentIcon from '@mui/icons-material/Assignment';
import Title from "../components/Title";
import ReportCard from "../components/CardReport";
import GenerateReportModal from "../components/Modals/GenerarReporteModal";
import ReportProgressDialog from "../components/Modals/ReportProgressDialog";
import FloatingActionButton from "../components/ButtonNewReport";
import WarningModal from "../components/Modals/AvisoModal";
import FiltroReportes from "../components/buscadorProceso";
import FeedbackSnackbar from "../components/Feedback";
import ConfirmDelete from "../components/confirmDelete";
import BreadcrumbNav from "../components/BreadcrumbNav";
import axios from "axios";

const API = "http://localhost:8000/api";

const ReportesDeProceso = () => {
  const [openModal, setOpenModal] = useState(false);
  const [warningReportExistsOpen, setWarningReportExistsOpen] = useState(false);

  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  const [reportToDelete, setReportToDelete] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [progress, setProgress] = useState({
    open: false,
    idProceso: null,
    anio: null,
    entidadNombre: "",
    procesoNombre: "",
  });

  // Feedback global
  const [fb, setFb] = useState({ open: false, type: "info", title: "", message: "" });
  const showFb = (type, title, message) => setFb({ open: true, type, title, message });

  // Reportes
  const fetchReports = useCallback(async () => {
    setLoadingReports(true);
    try {
      const { data } = await axios.get(`${API}/reportes-proceso`);
      setReports(data.reportes || []);
    } catch {
      setFb({ open: true, type: "error", title: "Error", message: "Error al obtener reportes." });
    } finally {
      setLoadingReports(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleOpenDeleteModal = (report) => setReportToDelete(report);

  const handleConfirmDelete = async () => {
    if (!reportToDelete) return;
    try {
      await axios.delete(`${API}/reportes-proceso/${reportToDelete.idReporteProceso}`);
      await fetchReports();
      showFb("success", "Eliminado", "Reporte eliminado correctamente.");
    } catch (err) {
      showFb("error", "Error", "Error al eliminar el reporte.");
      throw err; // mantiene abierto el modal de confirmación
    }
  };

  const handleCloseDelete = () => setReportToDelete(null);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const alreadyExists = (processId, year) =>
    reports.some(r => Number(r.idProceso) === Number(processId) && String(r.anio) === String(year));

  const handleGuardarReporte = async ({ idProceso, anio, entidadNombre, procesoNombre }) => {
    if (!idProceso || !anio) {
      showFb("warning", "Aviso", "Seleccione un proceso y año.");
      return;
    }

    if (alreadyExists(idProceso, anio)) {
      setWarningReportExistsOpen(true);
      return;
    }

    setProgress({
      open: true,
      idProceso: Number(idProceso),
      anio: Number(anio),
      entidadNombre,
      procesoNombre,
    });
  };

  const handleProgressDone = async ({ idProceso, anio, entidad, proceso, storedUrl }) => {
    try {
      await axios.post(`${API}/reportes-proceso`, {
        idProceso,
        nombreReporte: `Reporte ${proceso} ${entidad}`,
        anio,
        ruta: storedUrl || null,
      });
      await fetchReports();
      showFb("success", "Listo", "Reporte generado y guardado correctamente.");
    } catch {
      showFb("warning", "Atención", "El PDF se generó, pero falló el guardado en la base de datos.");
    } finally {
      setProgress(s => ({ ...s, open: false }));
      handleCloseModal();
    }
  };

  return (
    <Box sx={{ p: 2, position: "relative", minHeight: "100vh", display: "flex", flexDirection: "row" }}>
      {/* Filtro lateral */}
      <FiltroReportes
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Contenido principal */}
      <Box sx={{ flex: 1 }}>
        {/* Breadcrumb */}
        <BreadcrumbNav
          items={[
            { label: "Reportes", to: "/typesReports", icon: AssignmentIcon  },
            { label: "Reportes de Proceso", icon:AssignmentIcon }
          ]}
        />

        <Box sx={{ textAlign: "center", pt: 1 }}>
          <Title text="Reportes de Proceso" />
        </Box>

        {loadingReports ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4, gap: 1 }}>
            <CircularProgress />
            <Typography variant="body2">Cargando reportes…</Typography>
          </Box>
        ) : (
          <>
            {reports && reports.length > 0 ? (
              <Box
                sx={{
                  mt: 2,
                  display: "grid",
                  gap: 1.5,
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                }}
              >
                {reports.map((rep) => (
                  <ReportCard
                    key={rep.idReporteProceso}
                    report={rep}
                    // navegación desactivada
                    onDelete={() => handleOpenDeleteModal(rep)}
                  />
                ))}
              </Box>
            ) : (
              // MEJORA VISUAL: Contenedor con icono y texto gris
              <Box 
                sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  mt: 8,
                  color: "text.secondary" // Color gris del tema
                }}
              >
                <FolderOpenIcon 
                  sx={{ 
                    fontSize: 64, 
                    mb: 2,
                    opacity: 0.5 
                  }} 
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 400,
                    color: "text.secondary"
                  }}
                >
                  No hay reportes registrados
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mt: 1,
                    color: "text.secondary",
                    opacity: 0.8
                  }}
                >
                  Comienza creando tu primer reporte
                </Typography>
              </Box>
            )}
          </>
        )}

        {/* Botón flotante de búsqueda */}
        <Box sx={{ position: "fixed", bottom: 90, right: 16 }}>
          <Tooltip title="Buscar Reportes" placement="left">
            <IconButton
              onClick={() => setSearchOpen(!searchOpen)}
              sx={{
                backgroundColor: "#004A98",
                color: "white",
                "&:hover": { backgroundColor: "#003366" },
                width: 56, height: 56, borderRadius: "50%", boxShadow: 3
              }}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Botón flotante para agregar */}
        <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
          <FloatingActionButton onClick={handleOpenModal} />
        </Box>

        {/* Modales */}
        <ConfirmDelete
          open={Boolean(reportToDelete)}
          onClose={handleCloseDelete}
          entityType="reporte"
          entityName={reportToDelete ? reportToDelete.nombreReporte : ""}
          onConfirm={handleConfirmDelete}
          isPermanent={true}
        />

        <GenerateReportModal
          open={openModal}
          onClose={handleCloseModal}
          onSave={handleGuardarReporte}
        />

        <WarningModal
          open={warningReportExistsOpen}
          title="Reporte existente"
          message={`Ya existe un reporte para ese Proceso y Año.`}
          onClose={() => setWarningReportExistsOpen(false)}
        />
      </Box>

      {/* Modal de progreso */}
      <ReportProgressDialog
        open={progress.open}
        onClose={() => setProgress(s => ({ ...s, open: false }))}
        idProceso={progress.idProceso}
        anio={progress.anio}
        entidadNombre={progress.entidadNombre}
        procesoNombre={progress.procesoNombre}
        onDone={handleProgressDone}
      />

      {/* Feedback global */}
      <FeedbackSnackbar
        open={fb.open}
        type={fb.type}
        title={fb.title}
        message={fb.message}
        onClose={() => setFb(s => ({ ...s, open: false }))}
      />
    </Box>
  );
};

export default ReportesDeProceso;
