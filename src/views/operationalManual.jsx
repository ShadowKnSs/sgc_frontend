import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import PageButton from "../components/PageButton";
import UASLPLogo from "../assests/UASLP_SICAL_Logo.png"; //Amigos revisar el nombre de la carpeta "assests"

const ProcessView = () => {
  const [activeButton, setActiveButton] = useState("Caratula");

  const buttons = [
    "Caratula",
    "Control de Cambios",
    "Mapa de Proceso",
    "Diagrama de Flujo",
    "Plan de Control",
  ];

  const renderContent = () => {
    switch (activeButton) {
      case "Caratula":
        return (
          <>
            <Box sx={{ position: "relative", height: "180px", width: "220px", marginBottom: "50px" }}>
              <img src={UASLPLogo} alt="UASLP Logo" style={{ position: "absolute", top: "-90px", left: "-10px", width: "100%" }} />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
              <Box>
                <p>Dr. Juanito Perez</p>
                <p>Secretario General</p>
                <p>Responsable</p>
              </Box>
              <Box>
                <p>Dr. Pedro Sanchez</p>
                <p>Secretario Escolar</p>
                <p>Revisó</p>
              </Box>
              <Box>
                <p>Dra. Paola Rivera</p>
                <p>Directora de Facultad</p>
                <p>Aprobó</p>
              </Box>
            </Box>
          </>
        );
      case "Control de Cambios":
        return <h2>Contenido de Control de Cambios</h2>;
      case "Mapa de Proceso":
        return <h2>Contenido de Mapa de Proceso</h2>;
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
          <PageButton
            key={label}
            label={label}
            active={activeButton === label}
            onClick={() => setActiveButton(label)}
          />
        ))}
      </Box>

      <Box
        sx={{
          border: "2px solid black",
          padding: "50px",
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
