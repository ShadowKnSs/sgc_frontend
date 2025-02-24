import React from "react";
import { Box } from "@mui/material";
import UASLPLogo from "../assests/UASLP_SICAL_Logo.png";

const Caratula = () => {
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Box
        sx={{
          position: "relative",
          height: "320px",
          width: "250px",
          marginBottom: "30px",
          left: "-15px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img src={UASLPLogo} alt="UASLP Logo" style={{ width: "100%" }} />
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
    </Box>
  );
};

export default Caratula;
