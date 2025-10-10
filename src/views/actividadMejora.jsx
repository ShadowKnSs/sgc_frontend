import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Box, Container, CircularProgress, Typography, Alert } from "@mui/material";
import axios from "axios";

import PlanCorrectivoContainer from "../components/PlanCorrectivoContainer";
import ProyectoMejoraContainer from "../components/ProyectoMejoraContainer";
import PlanTrabajo from "../views/planTrabajoForm";
import ContextoProcesoEntidad from "../components/ProcesoEntidad";
import Permiso from "../hooks/userPermiso";
import SectionTabs from "../components/SectionTabs";
import BreadcrumbNav from "../components/BreadcrumbNav";
import FolderIcon from '@mui/icons-material/Folder';
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FeedbackSnackbar from "../components/Feedback";

const ProcessView = () => {
  const { idRegistro } = useParams();
  const location = useLocation();
  const rolActivo = location.state?.rolActivo || JSON.parse(localStorage.getItem("rolActivo"));

  const { soloLectura, puedeEditar } = Permiso("Acciones de Mejora");
  const [selectedTab, setSelectedTab] = useState(0);

  const sections = [
    "Plan de Acción Correctivo",
    "Plan de Trabajo",
    "Proyecto de Mejora",
  ];

  const [datosProceso, setDatosProceso] = useState({ idProceso: null, anio: null });
  const [loadingProceso, setLoadingProceso] = useState(true);
  const [errorProceso, setErrorProceso] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
  });

  const idProcesoFromState = location.state?.idProceso || null;
  const [idProcesoResolved] = useState(
    () => idProcesoFromState || localStorage.getItem("idProcesoActivo") || null
  );

  const showSnackbar = (message, type = "info", title = "") => {
    setSnackbar({
      open: true,
      type,
      title,
      message,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    if (idProcesoResolved) {
      localStorage.setItem("idProcesoActivo", String(idProcesoResolved));
    }
  }, [idProcesoResolved]);

  const breadcrumbItems = useMemo(() => ([
    {
      label: 'Estructura',
      to: idProcesoResolved ? `/estructura-procesos/${idProcesoResolved}` : '/estructura-procesos',
      icon: AccountTreeIcon
    },
    {
      label: 'Carpetas',
      to: idProcesoResolved ? `/carpetas/${idProcesoResolved}/Acciones de Mejora` : undefined,
      icon: FolderIcon
    },
    { label: 'Acciones de Mejora', icon: TrendingUpIcon }
  ]), [idProcesoResolved]);

  useEffect(() => {
    const fetchProceso = async () => {
      try {
        setErrorProceso(null);
        setLoadingProceso(true);
        
        const response = await axios.get(`http://localhost:8000/api/getIdRegistro`, {
          params: { idRegistro }
        });
        
        if (response.data?.proceso?.idProceso) {
          setDatosProceso({
            idProceso: response.data.proceso.idProceso,
            anio: response.data.anio
          });
          showSnackbar("Datos del proceso cargados correctamente", "success", "Éxito");
        } else {
          setErrorProceso("No se encontraron datos para este registro");
          showSnackbar("No se encontraron datos del proceso", "warning", "Advertencia");
        }
      } catch (error) {
        console.error("Error al obtener el idProceso desde idRegistro:", error);
        
        let errorMessage = "Error al cargar los datos del proceso";
        if (error.response) {
          if (error.response.status === 404) {
            errorMessage = "No se encontró el registro solicitado";
          } else if (error.response.status >= 500) {
            errorMessage = "Error del servidor al cargar los datos";
          }
        } else if (error.request) {
          errorMessage = "Error de conexión. Verifique su internet";
        }
        
        setErrorProceso(errorMessage);
        showSnackbar(errorMessage, "error", "Error");
      } finally {
        setLoadingProceso(false);
      }
    };

    if (idRegistro) {
      fetchProceso();
    } else {
      setLoadingProceso(false);
      setErrorProceso("No se proporcionó un ID de registro válido");
    }
  }, [idRegistro]);

  const renderContent = () => {
    if (loadingProceso) {
      return (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Cargando datos del proceso...
          </Typography>
        </Box>
      );
    }

    if (errorProceso) {
      return (
        <Box sx={{ textAlign: "center", mt: 4, p: 3 }}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2, 
              maxWidth: 500,
              '& .MuiAlert-message': { textAlign: 'left' }
            }}
          >
            <Typography variant="h6" gutterBottom>
              Error al cargar
            </Typography>
            <Typography variant="body2">
              {errorProceso}
            </Typography>
          </Alert>
        </Box>
      );
    }

    if (!datosProceso.idProceso) {
      return (
        <Box sx={{ textAlign: "center", mt: 4, p: 3 }}>
          <Alert 
            severity="info" 
            sx={{ 
              mb: 2, 
              maxWidth: 500,
              '& .MuiAlert-message': { textAlign: 'left' }
            }}
          >
            <Typography variant="h6" gutterBottom>
              No hay datos disponibles
            </Typography>
            <Typography variant="body2">
              No se encontró información del proceso para el registro especificado.
            </Typography>
          </Alert>
        </Box>
      );
    }

    switch (sections[selectedTab]) {
      case "Plan de Acción Correctivo":
        return (
          <PlanCorrectivoContainer 
            idProceso={datosProceso.idProceso} 
            soloLectura={soloLectura} 
            puedeEditar={puedeEditar} 
            showSnackbar={showSnackbar}
          />
        );
      case "Plan de Trabajo":
        return (
          <PlanTrabajo 
            idRegistro={idRegistro} 
            soloLectura={soloLectura} 
            puedeEditar={puedeEditar} 
            rolActivo={rolActivo} 
            showSnackbar={showSnackbar}
          />
        );
      case "Proyecto de Mejora":
        return (
          <ProyectoMejoraContainer 
            idRegistro={idRegistro} 
            soloLectura={soloLectura} 
            puedeEditar={puedeEditar} 
            showSnackbar={showSnackbar}
          />
        );
      default:
        return (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Seleccione una opción del menú
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 2 }}>
        <BreadcrumbNav items={breadcrumbItems} />
      </Box>
      
      {/* ✅ Mostrar contexto solo si hay datos del proceso */}
      {datosProceso.idProceso && !loadingProceso && !errorProceso && (
        <Box sx={{ marginTop: 2 }}>
          <ContextoProcesoEntidad 
            idProceso={datosProceso.idProceso} 
            showSnackbar={showSnackbar}
          />
        </Box>
      )}

      {/* ✅ Mostrar tabs solo si hay datos y no hay errores */}
      {!loadingProceso && !errorProceso && datosProceso.idProceso && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: 2 }}>
          <SectionTabs
            sections={sections}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
          />
        </Box>
      )}

      {/* ✅ Contenedor principal con manejo de estados */}
      <Box
        sx={{
          padding: "20px",
          minHeight: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: loadingProceso || errorProceso || !datosProceso.idProceso ? "center" : "flex-start",
          alignItems: "center",
          margin: "auto",
          backgroundColor: "white",
          textAlign: "center",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s ease-in-out"
        }}
      >
        {renderContent()}
      </Box>

      <FeedbackSnackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        type={snackbar.type}
        title={snackbar.title}
        message={snackbar.message}
        autoHideDuration={6000}
      />
    </Container>
  );
};

export default ProcessView;