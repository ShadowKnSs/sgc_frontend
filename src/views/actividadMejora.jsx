import React, { useState } from "react";
import { Box, Container, Button, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import Caratula from "../views/caratula";
import PlanCorrectivo from "./correctivePlan";
import FormProyMejora from "../components/Forms/FormProyMejora";
import PlanTrabajo from "../views/planTrabajoForm";

const ProcessView = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const sections = [
    "Caratula",
    "Plan de Acción Correctiva",
    "Plan de Trabajo",
    "Proyecto de Mejora",
  ];

  const renderContent = () => {
    switch (sections[selectedTab]) {
      case "Caratula":
        return <Caratula />;
      case "Plan de Acción Correctiva":
        return <PlanCorrectivo />;
      case "Plan de Trabajo":
        return (
          <Box>
              <PlanTrabajo/>
          </Box>
        );
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

  const scrollNav = (direction) => {
    // Implementa la lógica de desplazamiento aquí
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: 2 }}>
        <IconButton onClick={() => scrollNav("left")} sx={{ color: "#0056b3", mx: 1 }}>
          <ArrowBackIos />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            backgroundColor: "#0056b3",
            borderRadius: "40px",
            padding: "5px",
            width: "auto", 
            overflowX: "auto",
            scrollBehavior: "smooth",
            whiteSpace: "nowrap",
            "&::-webkit-scrollbar": { display: "none" } 
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

        <IconButton onClick={() => scrollNav("right")} sx={{ color: "#0056b3", mx: 1 }}>
          <ArrowForwardIos />
        </IconButton>
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