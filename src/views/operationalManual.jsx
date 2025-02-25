import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import CaratulaMenu from "../components/CaratulaMenu";
import ButtonScrollNav from "../components/ButtonScrollNav";

// Importar vistas
import MapaProceso from "../views/formProcessMap";
import Caratula from "../views/caratula";
import PlanControl from "../views/planControl";
import ControlDocuments from "../views/controlDocuments";

const ProcessView = () => {
  const [activeButton, setActiveButton] = useState("Caratula");
  const [menuAnchor, setMenuAnchor] = useState(null);

  const buttons = [
    "Caratula",
    "Control de Cambios",
    "Mapa de Proceso",
    "Diagrama de Flujo",
    "Plan de Control",
    "Control de documentos",
  ];

  const handleButtonClick = (event, label) => {
    if (activeButton === "Caratula" && label === "Caratula") {
      setMenuAnchor(event.currentTarget);
    }
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const renderContent = () => {
    switch (activeButton) {
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
      default:
        return <h2>Seleccione una opción</h2>;
    }
  };

  return (
    <Container maxWidth="xl">
      {/* Se importan los botones para deslizar entre botones de vistas */}
      <ButtonScrollNav
        buttons={buttons}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
        handleButtonClick={handleButtonClick}
      />

      <CaratulaMenu menuAnchor={menuAnchor} handleCloseMenu={handleCloseMenu} />

      <Box
        sx={{
          border: "2px solid black",
          padding: "5px",
          minHeight: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
          backgroundColor: "white",
          textAlign: "center",
        }}
      >
        {renderContent()}
      </Box>
    </Container>
  );
};

export default ProcessView;
