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
import MenuNavegacionProceso from "../components/MenuProcesoEstructura";
import useMenuProceso from "../hooks/useMenuProceso";
import SectionTabs from "../components/SectionTabs";

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

// Custom hook mejorado con reintentos y gestión de caché
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
        
        // Almacenar con timestamp
        const dataToCache = {
          data: res.data,
          timestamp: Date.now()
        };
        
        sessionStorage.setItem(cacheKey, JSON.stringify(dataToCache));
        setData(res.data);
        setError("");
      } catch (err) {
        console.error("Error cargando entidad y proceso", err);
        
        // Reintentar hasta 3 veces con delay exponencial
        if (retryCount < 3) {
          setTimeout(() => fetchData(retryCount + 1), 1000 * Math.pow(2, retryCount));
          return;
        }
        
        setError("No se pudo cargar la información del proceso. Por favor, intente nuevamente.");
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
  console.log('[ProcessView] soloLectura:', soloLectura, 'puedeEditar:', puedeEditar);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isFixed] = useState(false);
  const { idProceso } = useParams();
  const { data, loading, error } = useEntidadProceso(idProceso);
  const menuItems = useMenuProceso();

  const nombreEntidad = data?.entidad || "";
  const nombreProceso = data?.proceso || "";

  const sectionMap = {
    "Carátula": Caratula,
    "Control de Cambios": ControlCambios,
    "Mapa de Proceso": MapaProceso,
    "Diagrama de Flujo": DiagramaFlujo,
    "Plan de Control": PlanControl,
    "Control de documentos": ControlDocuments,
  };

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
    const Component = sectionMap[sections[selectedTab]];
    return Component ? (
      <Component 
        idProceso={idProceso} 
        soloLectura={soloLectura} 
        puedeEditar={puedeEditar} 
        key={selectedTab} // Forzar recreación al cambiar pestaña
      />
    ) : null;
  }, [selectedTab, idProceso, soloLectura, puedeEditar]);

  // Efecto para cambiar el título de la página
  useEffect(() => {
    if (nombreEntidad && nombreProceso) {
      document.title = `${nombreEntidad} - ${nombreProceso} | Manual Operativo`;
    }
    
    return () => {
      document.title = "Sistema de Gestión";
    };
  }, [nombreEntidad, nombreProceso]);

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

  return (
    <Container maxWidth="xl" sx={{ py: isMobile ? 1 : 0 }}>
           
      <Box sx={{ mt: 2, position: "sticky", top: 0, zIndex: 10 }}>
        <Title 
          text={`Manual Operativo de ${nombreEntidad}: ${nombreProceso}`} 
          mode="sticky" 
        />
      </Box>

      <MenuNavegacionProceso items={menuItems} />

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
    </Container>
  );
};

export default ProcessView;