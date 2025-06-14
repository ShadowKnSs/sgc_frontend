import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Box, Container, CircularProgress } from "@mui/material";
import axios from "axios";

import PlanCorrectivoContainer from "../components/PlanCorrectivoContainer";
import ProyectoMejoraContainer from "../components/ProyectoMejoraContainer";
import PlanTrabajo from "../views/planTrabajoForm";
import ContextoProcesoEntidad from "../components/ProcesoEntidad";
import MenuNavegacionProceso from "../components/MenuProcesoEstructura";
import useMenuProceso from "../hooks/useMenuProceso";
import Permiso from "../hooks/userPermiso";
import SectionTabs from "../components/SectionTabs"; // 🔁 Nuevo componente importado

const ProcessView = () => {
  const { idRegistro } = useParams();
  const location = useLocation();
  const rolActivo = location.state?.rolActivo || JSON.parse(localStorage.getItem("rolActivo"));

  const { soloLectura, puedeEditar } = Permiso("Acciones de Mejora");
  const menuItems = useMenuProceso();
  const [selectedTab, setSelectedTab] = useState(0);

  const sections = [
    "Plan de Acción Correctivo",
    "Plan de Trabajo",
    "Proyecto de Mejora",
  ];

  const [datosProceso, setDatosProceso] = useState({ idProceso: null, anio: null });
  const [loadingProceso, setLoadingProceso] = useState(true);

  useEffect(() => {
    const fetchProceso = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/getIdRegistro`, {
          params: { idRegistro }
        });
        if (response.data?.proceso?.idProceso) {
          setDatosProceso({
            idProceso: response.data.proceso.idProceso,
            anio: response.data.anio
          });
        }
      } catch (error) {
        console.error("Error al obtener el idProceso desde idRegistro:", error);
      } finally {
        setLoadingProceso(false);
      }
    };

    if (idRegistro) fetchProceso();
  }, [idRegistro]);

  if (loadingProceso) {
    return <Box sx={{ textAlign: "center", mt: 4 }}><CircularProgress /></Box>;
  }

  const renderContent = () => {
    switch (sections[selectedTab]) {
      case "Plan de Acción Correctivo":
        return <PlanCorrectivoContainer idProceso={datosProceso.idProceso} soloLectura={soloLectura} puedeEditar={puedeEditar} />;
      case "Plan de Trabajo":
        return <PlanTrabajo idRegistro={idRegistro} soloLectura={soloLectura} puedeEditar={puedeEditar} rolActivo={rolActivo} />;
      case "Proyecto de Mejora":
        return <ProyectoMejoraContainer idRegistro={idRegistro} soloLectura={soloLectura} puedeEditar={puedeEditar} />;
      default:
        return <h2>Seleccione una opción</h2>;
    }
  };

  return (
    <Container maxWidth="xl">
      {datosProceso.idProceso && (
        <Box sx={{ marginTop: 2 }}>
          <ContextoProcesoEntidad idProceso={datosProceso.idProceso} />
        </Box>
      )}

      <MenuNavegacionProceso items={menuItems} />

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: 2 }}>
        <SectionTabs
          sections={sections}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        />
      </Box>

      <Box
        sx={{
          padding: "5px",
          minHeight: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
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
    </Container>
  );
};

export default ProcessView;
