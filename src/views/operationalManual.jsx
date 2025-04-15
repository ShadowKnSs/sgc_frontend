import React, { useState, useRef, useEffect } from "react";
import { useParams, useLocation} from "react-router-dom";

import { Box, Container, Button } from "@mui/material";

// Importar vistas
import Caratula from "../views/caratula";
import PlanControl from "../views/planControl";
import ControlDocuments from "../views/controlDocuments";
import MapaProceso from "./processMap";
import ControlCambios from "./controlCambios";
import DiagramaFlujo from "./diagramaFlujo";
import Permiso from "../hooks/userPermiso";

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
  const [isFixed, setIsFixed] = useState(false);
  const navbarRef = useRef(null);
  const { idProceso } = useParams(); 
  

  console.log("El rol desde ManualOperativo: ", rolActivo);
  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", my: 2 }}>
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
          top: isFixed ? 0 : "80px",
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
      >
        Nombre del Proceso
      </Box>

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
