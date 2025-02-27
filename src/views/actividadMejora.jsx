import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import CaratulaMenu from "../components/CaratulaMenu";
import ButtonScrollNav from "../components/ButtonScrollNav";
import Caratula from "../views/caratula";
import FormProyMejora from "../components/Forms/FormProyMejora";

const ProcessView = () => {
  const [activeButton, setActiveButton] = useState("Caratula");
  const [menuAnchor, setMenuAnchor] = useState(null);

  const buttons = [
    "Caratula",
    "Plan de Acción Correctiva",
    "Plan de Trabajo",
    "Proyecto de Mejora",
  ];

  const handleButtonClick = (event, label) => {
    if (activeButton === label) {
      setMenuAnchor(event.currentTarget);
    } else {
      setActiveButton(label);
      setMenuAnchor(null);
    }
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const renderContent = () => {
    switch (activeButton) {
      case "Caratula":
        return <Caratula />;
      case "Plan de Acción Correctiva":
        return <h2>Contenido del Plan de Acción Correctiva</h2>;
      case "Plan de Trabajo":
        return <h2>Contenido del Plan de Trabajo</h2>;
      case "Proyecto de Mejora":
        return (
          <Box>
              <FormProyMejora />
          </Box>
        );
      default:
        return <h2>Seleccione una opción</h2>;
    }
  };

  return (
    <Container maxWidth="xl">
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
