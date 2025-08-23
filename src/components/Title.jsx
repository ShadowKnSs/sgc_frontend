/**
 * Componente: Title
 * Descripción:
 * Muestra un título principal centrado con una línea decorativa inferior.
 * Admite contenido adicional (children) como íconos, botones u otros elementos.
 */
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

const Title = ({ text, children }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "baseline",
      gap: 2,
      mb: 4,
      px: 2,
    }}
  >
    <Typography
      variant="h4"
      sx={{
        color: colorPalette.azulOscuro,
        fontWeight: "bold",
        position: "relative",
        textAlign: "center",
        "&::after": {
          content: '""',
          width: "100%",
          height: "5px",
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
    {children}
  </Box>
);


export default Title;

