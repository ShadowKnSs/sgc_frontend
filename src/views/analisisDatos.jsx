import React from "react";
import { Box, Grid, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CardArchivos from "../components/CardArchivos";
import CardAddFolder from "../components/CardAddFolder";
function AnalisisDatos() {
  
  return (
    <Box sx={{ p: 4 }}>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "32px",
          fontFamily: "'Roboto', sans-serif",
          color: "#004A98",
        }}
      >
        Analisis de Datos
      </h1>

      <Grid container spacing={3} justifyContent="left" paddingLeft={20}>
        {/* Carpeta 2024 */}
        <CardArchivos nombreCarpeta="2024" ruta="/archivos/2024" />


        {/* Carpeta 2023 */}
        <CardArchivos nombreCarpeta="2023" ruta="/archivos/2023" />
        <CardArchivos nombreCarpeta="2025" ruta="/archivos/2024" />
        


        {/* Botón para agregar nueva carpeta */}
        <CardAddFolder/>
      </Grid>
    </Box>
  );
}

export default AnalisisDatos;
