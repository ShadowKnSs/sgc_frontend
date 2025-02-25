import { Box, Grid2 } from "@mui/material";
import CardArchivos from "../components/CardArchivos";
import CardAddFolder from "../components/CardAddFolder";
import CardAddArchivo from "../components/CardAddArchivo";
import CardFile from "../components/CardFile";
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
            <CardArchivos nombreCarpeta="2024"/>
            <CardArchivos nombreCarpeta="2023"/>
            <CardAddFolder />
        </Grid2>

        <Grid2 container spacing={3} justifyContent="left" paddingLeft={20} paddingTop={5}>
            <Grid2 item xs={12} sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
                <CardFile nombreCarpeta="Minuta"/>
                <CardAddArchivo />
            </Grid2>
        </Grid2>
    </Box>
  );
}

export default Seguimiento;