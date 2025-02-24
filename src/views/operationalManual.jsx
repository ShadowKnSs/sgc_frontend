import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import PageButton from "../components/PageButton";
import CaratulaMenu from "../components/CaratulaMenu";

//Importar vistas
import MapaProceso from "../views/formProcessMap";
import Caratula from "../views/caratula";

const ProcessView = () => {
  const [activeButton, setActiveButton] = useState("Caratula");
  const [menuAnchor, setMenuAnchor] = useState(null);

  const buttons = [
    "Caratula",
    "Control de Cambios",
    "Mapa de Proceso",
    "Diagrama de Flujo",
    "Plan de Control",
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
        return <h2>Contenido de Plan de Control</h2>;
      default:
        return <h2>Seleccione una opción</h2>;
    }
  };

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "20px",
          marginTop: "40px",
          flexWrap: "nowrap",
          width: "100%",
          gap: "30px",
        }}
      >
        {buttons.map((label) => (
          <Box
            key={label}
            onClick={(event) => handleButtonClick(event, label)}
          >
            <PageButton
              label={label}
              active={activeButton === label}
              onClick={() => setActiveButton(label)}
            />
          </Box>
        ))}
      </Box>

      <CaratulaMenu menuAnchor={menuAnchor} handleCloseMenu={handleCloseMenu} />

      <Box
        sx={{
          border: "2px solid black",
          padding: "10px",
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
