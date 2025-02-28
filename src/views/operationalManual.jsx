import React, { useState, useRef } from "react";
import { Box, Container, Button } from "@mui/material";

// Importar vistas
import Caratula from "../views/caratula";
import PlanControl from "../views/planControl";
import ControlDocuments from "../views/controlDocuments";
import MapaProceso from "./processMap";
import PlanCorrectivo from "./correctivePlan";

const sections = [
  "Caratula",
  "Control de Cambios",
  "Mapa de Proceso",
  "Diagrama de Flujo",
  "Plan de Control",
  "Control de documentos",
];

const ProcessView = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const navbarRef = useRef(null);

  const renderContent = () => {
    switch (sections[selectedTab]) {
      case "Caratula":
        return <Caratula />;
      case "Control de Cambios":
        return <h2>Contenido de Control de Cambios</h2>;
      case "Mapa de Proceso":
        return <MapaProceso />;
      case "Diagrama de Flujo":
        return <h2>Contenido de Diagrama de Flujo</h2>;
      case "Plan de Control":
        return <PlanControl />;
      case "Control de documentos":
        return <ControlDocuments />;
      case "Plan Correctivo":
        return <PlanCorrectivo />;
      default:
        return <h2>Seleccione una opción</h2>;
    }
  };

  return (
    <Container maxWidth="xl">
      {/* Contenedor del navbar con botones de desplazamiento */}
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
            "&::-webkit-scrollbar": { display: "none" } // Ocultar scrollbar en navegadores webkit
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
                whiteSpace: "nowrap", // Evita que el texto se divida en varias líneas
              }}
            >
              {section}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Contenido dinámico según la pestaña seleccionada */}
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
          transition: "all 0.3s ease-in-out"
        }}
      >
        {renderContent()}
      </Box>
    </Container>
  );
};

export default ProcessView;
