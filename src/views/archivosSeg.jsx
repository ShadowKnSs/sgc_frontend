import React from "react";
import { useParams } from "react-router-dom";
import { Box, Grid2 } from "@mui/material";
import CardFile from "../components/CardFile";
import CardAddArchivo from "../components/CardAddArchivo";

function ArchivosSeg() {
  const { nombreCarpeta } = useParams();

  return (
    <Box sx={{ p: 4 }}>
      <h1 style={{ textAlign: "center", marginBottom: "32px", fontFamily: "'Roboto', sans-serif", color: "#004A98" }}>
        Archivos {nombreCarpeta} de Seguimiento
      </h1>

      <Grid2 container spacing={3} justifyContent="center">
        <CardFile nombreCarpeta="Archivo 1" />
        <CardFile nombreCarpeta="Archivo 2" />
        <CardFile nombreCarpeta="Archivo 3" />
        <CardAddArchivo />
      </Grid2>
    </Box>
  );
}

export default ArchivosSeg;
