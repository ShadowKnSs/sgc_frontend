import React, { useState, useRef, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import Title from "../components/Title";
import { Box, Container, Button } from "@mui/material";

// Importar vistas
import Caratula from "../views/caratula";
import PlanControl from "../views/planControl";
import ControlDocuments from "../views/controlDocuments";
import MapaProceso from "./processMap";
import ControlCambios from "./controlCambios";
import DiagramaFlujo from "./diagramaFlujo";
import Permiso from "../hooks/userPermiso";
import MenuNavegacionProceso from "../components/MenuProcesoEstructura";
import useMenuProceso from "../hooks/useMenuProceso";

const sections = [
  "Caratula",
  "Control de Cambios",
  "Mapa de Proceso",
  "Diagrama de Flujo",
  "Plan de Control",
  "Control de documentos",
];

const ProcessView = () => {
  const location = useLocation();
  const rolActivo = location.state?.rolActivo || JSON.parse(localStorage.getItem("rolActivo"));
  const { soloLectura, puedeEditar } = Permiso("Manual Operativo");
  const [selectedTab, setSelectedTab] = useState(0);
  const [isFixed] = useState(false);
  const navbarRef = useRef(null);
  const { idProceso } = useParams();

  const [nombreEntidad, setNombreEntidad] = useState("");
  const [nombreProceso, setNombreProceso] = useState("");

  const menuItems = useMenuProceso();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/proceso-entidad/${idProceso}`)
      .then((res) => {
        setNombreEntidad(res.data.entidad);
        setNombreProceso(res.data.proceso);
      })
      .catch((err) => {
        console.error("Error al obtener datos del proceso:", err);
      });
  }, [idProceso]);

  const renderContent = () => {
    const props = { idProceso, soloLectura, puedeEditar };
    switch (sections[selectedTab]) {
      case "Caratula": return <Caratula {...props} />;
      case "Control de Cambios": return <ControlCambios {...props} />;
      case "Mapa de Proceso": return <MapaProceso {...props} />;
      case "Diagrama de Flujo": return <DiagramaFlujo {...props} />;
      case "Plan de Control": return <PlanControl {...props} />;
      case "Control de documentos": return <ControlDocuments {...props} />;
      default: return <h2>Seleccione una opción</h2>;
    }
  };

  return (
    <Container maxWidth="xl">
      <MenuNavegacionProceso items={menuItems} />
      <Box
        sx={{
          mt: 1.3,
          width: "100vw",
          position: "sticky",
          top: 0,
          zIndex: 30,
          backgroundColor: "#fff",
          paddingTop: 2,
          paddingBottom: 0,
        }}
      >
        <Box sx={{ mt: 2, mb: 0, display: "flex", justifyContent: "center" }}>
          <Title text={`Manual Operativo de ${nombreEntidad}: ${nombreProceso}`} />
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", my: 2, mb: 0 }}>
        <Box
          ref={navbarRef}
          sx={{
            display: "flex",
            backgroundColor: "#0056b3",
            borderRadius: "40px",
            padding: "5px",
            width: "86%",
            overflowX: "auto",
            scrollBehavior: "smooth",
            whiteSpace: "nowrap",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {sections.map((section, index) => (
            <Button
              key={index}
              onClick={() => setSelectedTab(index)}
              sx={{
                minWidth: "auto",
                padding: "10px 20px",
                marginX: "5px",
                textAlign: "center",
                color: selectedTab === index ? "black" : "white",
                backgroundColor: selectedTab === index ? "#F9B800" : "transparent",
                borderRadius: "40px",
                transition: "all 0.3s ease-in-out",
                fontSize: "1rem",
                fontWeight: "normal",
                boxShadow: selectedTab === index ? "0px 4px 10px rgba(0, 0, 0, 0.3)" : "none",
                whiteSpace: "nowrap",
              }}
            >
              {section}
            </Button>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          position: isFixed ? "fixed" : "sticky",
          top: isFixed ? 0 : "48px",
          zIndex: 20,
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "10px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.4rem",
          color: "#004A98",
          left: "0px",
          borderBottom: "2px solid #ddd",
          boxShadow: isFixed ? "0px 4px 10px rgba(0, 0, 0, 0.1)" : "none",
          transition: "all 0.1s ease-in-out",
        }}
      ></Box>

      <Box
        sx={{
          padding: "20px",
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
          transition: "all 0.3s ease-in-out",
          marginTop: isFixed ? "70px" : "20px",
        }}
      >
        {renderContent()}
      </Box>
    </Container>
  );
};

export default ProcessView;
