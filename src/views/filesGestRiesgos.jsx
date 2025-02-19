import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import CardArchivos from "../components/CardArchivos";
import CardAddFolder from "../components/CardAddFolder";

function FilesGestRiesgos({ year }) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{
          marginBottom: 4,
          fontFamily: "'Roboto', sans-serif",
          color: "#004A98",
        }}
      >
        Archivos Gestión de Riesgos <span style={{ color: "blue" }}>{year}</span>
      </Typography>

      <Grid container spacing={3} justifyContent="left" paddingLeft={20}>
        {/* Carpeta con el año recibido */}

        {/* Otras carpetas */}
        <CardArchivos nombreCarpeta="Archivo 1" ruta="/archivos/2023" />
        <CardArchivos nombreCarpeta="Archivo 2" ruta="/archivos/2025" />

        {/* Botón para agregar nueva carpeta */}
        <CardAddFolder />
      </Grid>
    </Box>
  );
}

export default FilesGestRiesgos;

