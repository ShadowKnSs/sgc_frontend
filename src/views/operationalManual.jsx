import React, { useState, useEffect, Suspense, useMemo } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Title from "../components/Title";
import {
  Box,
  Container,
  CircularProgress,
  Typography,
  Alert,
  useTheme,
  useMediaQuery,
  Fade
} from "@mui/material";

import Permiso from "../hooks/userPermiso";
import BreadcrumbNav from "../components/BreadcrumbNav";
import SectionTabs from "../components/SectionTabs";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BookIcon from "@mui/icons-material/Book";
import FeedbackSnackbar from "../components/Feedback";

// Lazy loading con preloading estratégico
const Caratula = React.lazy(() => import("../views/caratula"));
const PlanControl = React.lazy(() => import("../views/planControl"));
const ControlDocuments = React.lazy(() => import("../views/controlDocuments"));
const MapaProceso = React.lazy(() => import("./processMap"));
const ControlCambios = React.lazy(() => import("./controlCambios"));
const DiagramaFlujo = React.lazy(() => import("./diagramaFlujo"));

const sections = [
  "Carátula",
  "Control de Cambios",
  "Mapa de Proceso",
  "Diagrama de Flujo",
  "Plan de Control",
  "Control de documentos",
];

// Custom hook mejorado con reintentos, gestión de caché y manejo de errores
const useEntidadProceso = (idProceso) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cacheKey = `entidadProceso:${idProceso}`;
    const cache = sessionStorage.getItem(cacheKey);
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

    if (cache) {
      const cachedData = JSON.parse(cache);
      // Verificar si la caché sigue siendo válida
      if (Date.now() - cachedData.timestamp < CACHE_DURATION) {
        setData(cachedData.data);
        setLoading(false);
        return;
      }
    }

    const fetchData = async (retryCount = 0) => {
      try {
        const res = await axios.get(`http://localhost:8000/api/proceso-entidad/${idProceso}`);
        
        // Verificar si la respuesta es exitosa pero no hay datos
        if (!res.data) {
          setError("No se encontraron datos para este proceso.");
          setData(null);
          return;
        }

        // Almacenar con timestamp
        const dataToCache = {
          data: res.data,
          timestamp: Date.now()
        };

        sessionStorage.setItem(cacheKey, JSON.stringify(dataToCache));
        setData(res.data);
        setError("");
      } catch (err) {
        console.error("Error fetching proceso data:", err);
        
        // Reintentar hasta 3 veces con delay exponencial
        if (retryCount < 3) {
          setTimeout(() => fetchData(retryCount + 1), 1000 * Math.pow(2, retryCount));
          return;
        }

        // Manejo específico de diferentes tipos de errores
        if (err.response) {
          // Error de respuesta del servidor
          if (err.response.status === 404) {
            setError("El proceso solicitado no fue encontrado.");
          } else if (err.response.status >= 500) {
            setError("Error del servidor. Por favor, intente más tarde.");
          } else {
            setError("Error al cargar la información del proceso.");
          }
        } else if (err.request) {
          // Error de conexión
          setError("Error de conexión. Verifique su conexión a internet e intente nuevamente.");
        } else {
          setError("Error inesperado. Por favor, intente nuevamente.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idProceso]);

  return { data, loading, error };
};

const ProcessView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { soloLectura, puedeEditar } = Permiso("Manual Operativo");
  const [selectedTab, setSelectedTab] = useState(0);
  const [isFixed] = useState(false);
  const { idProceso } = useParams();
  const { data, loading, error } = useEntidadProceso(idProceso);
  
  // Estado para Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success", // success, info, warning, error
    title: "",
    message: ""
  });

  const nombreEntidad = data?.entidad || "";
  const nombreProceso = data?.proceso || "";

  const sectionMap = useMemo(() => ({
    "Carátula": Caratula,
    "Control de Cambios": ControlCambios,
    "Mapa de Proceso": MapaProceso,
    "Diagrama de Flujo": DiagramaFlujo,
    "Plan de Control": PlanControl,
    "Control de documentos": ControlDocuments,
  }), []);

  // Función para mostrar Snackbar
  const showSnackbar = (message, type = "success", title = "") => {
    setSnackbar({
      open: true,
      message,
      type,
      title
    });
  };

  // Función para cerrar Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const breadcrumbItems = [
    {
      label: 'Estructura',
      to: idProceso ? `/estructura-procesos/${idProceso}` : '/estructura-procesos',   
      icon: AccountTreeIcon
    },
    {
      label: 'Manual Operativo',
      to: idProceso ? `/manual-operativo/${idProceso}` : '/manual-operativo',
      icon: BookIcon
    }
  ];

  const currentKey = sections[selectedTab];
  
  // Precarga estratégica de componentes
  useEffect(() => {
    if (selectedTab === 0) {
      import("../views/controlCambios");
    } else if (selectedTab === 1) {
      import("../views/processMap");
    } else if (selectedTab === 2) {
      import("./diagramaFlujo");
    }
  }, [selectedTab]);

  const MemoizedSection = useMemo(() => {
    const Component = sectionMap[currentKey];
    return Component ? (
      <Component
        idProceso={idProceso}
        soloLectura={soloLectura}
        puedeEditar={puedeEditar}
        key={currentKey}
        showSnackbar={showSnackbar} // Pasar función a componentes hijos
      />
    ) : null;
  }, [currentKey, idProceso, soloLectura, puedeEditar, sectionMap]);

  // Efecto para cambiar el título de la página
  useEffect(() => {
    if (nombreEntidad && nombreProceso) {
      document.title = `${nombreEntidad} - ${nombreProceso} | Manual Operativo`;
    }

    return () => {
      document.title = "Sistema de Gestión";
    };
  }, [nombreEntidad, nombreProceso]);

  // Verificar si no hay datos después de cargar
  const hasData = data && data.entidad && data.proceso;

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={50} thickness={4} sx={{ mb: 2, color: "primary.main" }} />
            <Typography variant="h6" color="text.secondary">
              Cargando proceso...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Box sx={{ mt: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              No se pudo cargar la información del proceso
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  if (!hasData) {
    return (
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Box sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            No hay registros disponibles para este proceso
          </Alert>
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              No se encontraron datos para mostrar
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: isMobile ? 1 : 0 }}>
      
      <Box
        sx={{
          mt: 1.3,
          width: "100%",
          maxWidth: "100vw",
          zIndex: 30,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <BreadcrumbNav items={breadcrumbItems} />
        <Box sx={{ mt: 2, mb: 1.5, display: "flex", justifyContent: "center", px: isMobile ? 1 : 0 }}>
          <Title
            text={`Manual Operativo de ${nombreEntidad}: ${nombreProceso}`}
            variant={isMobile ? "h5" : "h4"}
          />
        </Box>
      </Box>

      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <SectionTabs
          sections={sections}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          orientation={isMobile ? "vertical" : "horizontal"}
        />
      </Box>

      <Suspense fallback={
        <Box sx={{
          textAlign: "center",
          py: 5,
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Cargando {sections[selectedTab]}...
          </Typography>
        </Box>
      }>
        <Fade in={true} timeout={500}>
          <Box
            sx={{
              padding: { xs: 2, md: 3 },
              minHeight: "500px",
              width: "100%",
              maxWidth: "1400px",
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
              transition: "all 0.3s ease",
              mt: isFixed ? "70px" : "20px",
              mb: 4,
              "&:hover": {
                boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.12)",
              }
            }}
          >
            {MemoizedSection}
          </Box>
        </Fade>
      </Suspense>

      {/* FeedbackSnackbar personalizado */}
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