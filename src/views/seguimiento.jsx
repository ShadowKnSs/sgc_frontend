import { Box, Grid2 } from "@mui/material";
import { Link } from "react-router-dom";
import CardArchivos from "../components/CardArchivos";
import CardAddFolder from "../components/CardAddFolder";
import CardFile from "../components/CardFile";
import CardAddArchivo from "../components/CardAddArchivo";
import React from "react";

function Seguimiento() {
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
        Seguimiento
      </h1>

      <Grid2 container spacing={3} justifyContent="left" paddingLeft={20}>
        <Link to="/archivosSeg/2024" style={{ textDecoration: "none", color: "inherit" }}>
          <CardArchivos nombreCarpeta="2024" />
        </Link>
        <Link to="/archivosSeg/2023" style={{ textDecoration: "none", color: "inherit" }}>
          <CardArchivos nombreCarpeta="2023" />
        </Link>
        <CardAddFolder />
      </Grid2>

      <Grid2 container spacing={3} justifyContent="left" paddingLeft={20} paddingTop={5}>
        <Grid2 item xs={12} sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
          <CardFile nombreCarpeta="Minuta" />
          <CardAddArchivo />
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default Seguimiento;
