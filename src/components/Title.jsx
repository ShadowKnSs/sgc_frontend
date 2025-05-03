import React from "react";
import { Typography, Box } from "@mui/material";

const colorPalette = {
  azulOscuro: "#185FA4",
  azulClaro: "#68A2C9",
  verdeAgua: "#BBD8D7",
  verdeClaro: "#DFECDF",
  verdePastel: "#E3EBDA",
  grisClaro: "#DEDFD1",
  grisOscuro: "#A4A7A0",
};


const Title = ({ text }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      mb: 4,            // margen inferior
      px: 2,            // padding horizontal
    }}
  >
    <Typography
      variant="h4"
      sx={{
        color: colorPalette.azulOscuro,
        fontWeight: "bold",
        position: "relative",
        textAlign: "center",
        // Pseudo-elemento para el subrayado
        "&::after": {
          content: '""',
          width: "100%",
          height: "4px",
          backgroundColor: colorPalette.azulClaro,
          position: "absolute",
          left: "50%",
          bottom: -6,
          transform: "translateX(-50%)",
          borderRadius: "2px",
        },
      }}
    >
      {text}
    </Typography>
  </Box>
);

export default Title;

