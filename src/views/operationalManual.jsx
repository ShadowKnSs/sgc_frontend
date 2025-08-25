import React, { useState, useEffect, Suspense, useMemo } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Title from "../components/Title";
import { Box, Container, CircularProgress, Typography } from "@mui/material";

import Permiso from "../hooks/userPermiso";
import MenuNavegacionProceso from "../components/MenuProcesoEstructura";
import useMenuProceso from "../hooks/useMenuProceso";
import SectionTabs from "../components/SectionTabs";

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


const useEntidadProceso = (idProceso) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cacheKey = `entidadProceso:${idProceso}`;
    const cache = sessionStorage.getItem(cacheKey);

    if (cache) {
      setData(JSON.parse(cache));
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/proceso-entidad/${idProceso}`);
        sessionStorage.setItem(cacheKey, JSON.stringify(res.data));
        setData(res.data);
      } catch (err) {
        console.error("Error cargando entidad y proceso", err);
        setError("No se pudo cargar la información del proceso");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idProceso]);

  return { data, loading, error };
};

const ProcessView = () => {
  
  const { soloLectura, puedeEditar } = Permiso("Manual Operativo");
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

  useEffect(() => {
    if (selectedTab === 0) import("../views/controlCambios");
    if (selectedTab === 1) import("../views/processMap");
  }, [selectedTab]);

  const MemoizedSection = useMemo(() => {
    const Component = sectionMap[sections[selectedTab]];
    return Component ? <Component idProceso={idProceso} soloLectura={soloLectura} puedeEditar={puedeEditar} /> : null;
  }, [selectedTab, idProceso, soloLectura, puedeEditar]);

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", py: 5 }}><CircularProgress size={40} /></Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <MenuNavegacionProceso items={menuItems} />

      <Box
        sx={{
          mt: 1.3,
          width: "100%",
          maxWidth: "100vw",
          zIndex: 30,
          backgroundColor: "#fff",
          paddingTop: 1.5,
          paddingBottom: 0,
        }}
      >
        <Box sx={{ mt: 2, mb: 1.5, display: "flex", justifyContent: "center" }}>
          <Title text={`Manual Operativo de ${nombreEntidad}: ${nombreProceso}`} />
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", my: 2, mb: 0 }}>
        <SectionTabs
          sections={sections}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        />

      </Box>

      <Suspense fallback={<Box sx={{ textAlign: "center", py: 5 }}><CircularProgress size={40} /></Box>}>
        <Box
          sx={{
            padding: { xs: "16px", md: "20px" },
            minHeight: "500px",
            width: "100%",
            maxWidth: "1400px",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#fff",
            textAlign: "center",
            borderRadius: "20px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            transition: "opacity 0.3s ease-in-out",
            opacity: 1,
            mt: isFixed ? "70px" : "20px"
          }}
        >
          {MemoizedSection}
        </Box>
      </Suspense>
    </Container>
  );
};

export default ProcessView;
