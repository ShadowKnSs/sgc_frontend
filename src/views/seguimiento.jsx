import { Box, Grid2, Card, CardActionArea, CardContent, Typography, Dialog, DialogTitle, TextField, Button } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CardArchivos from "../components/CardArchivos";
import CardAddFolder from "../components/CardAddFolder";
import CardFile from "../components/CardFile";
import React, { useState } from "react";

const CardAddArchivo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card 
        sx={{ 
          width: 200, 
          height: 200, 
          textAlign: "center", 
          border: "2px dashed #004A98", 
          alignContent: "center",
          cursor: "pointer"
        }}
        onClick={() => setOpen(true)}
      >
        <CardActionArea>
          <CardContent>
            <AddBoxIcon sx={{ fontSize: 50, color: "#004A98" }} />
            <Typography variant="body2">Nuevo Archivo</Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: "center" }}>Seleccionar Archivo</DialogTitle>
        <CardContent>
          <Typography variant="body2" sx={{ textAlign: "center", marginBottom: 2 }}>
            Aquí irá el contenido para seleccionar un archivo.
          </Typography>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={() => setOpen(false)} sx={{ borderColor: "#004A98", color: "#004A98" }}>
              Cancelar
            </Button>
            <Button variant="contained" sx={{ backgroundColor: "#F9B800", "&:hover": { backgroundColor: "#2dc1df" } }}>
              Subir
            </Button>
          </div>
        </CardContent>
      </Dialog>
    </>
  );
};

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