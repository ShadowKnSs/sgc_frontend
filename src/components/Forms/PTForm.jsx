import React from "react";
import { TextField, Box, Grid } from "@mui/material";

const PTForm = () => {
  // Valores estáticos predeterminados para los campos
  const formData = {
    responsable: "Juan Pérez",
    fechaElaboracion: "2025-02-27",
    objetivo: "Mejorar la productividad en el departamento.",
    revisadoPor: "Ana Gómez",
  };

  return (
    <Box sx={{ p: 2, boxShadow: 3, borderRadius: 2, bgcolor: "background.paper", mb: 2, width: "70%" }}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            label="Responsable"
            name="responsable"
            value={formData.responsable}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,  
            }}
          />
          <TextField
            label="Fecha de Elaboración"
            name="fechaElaboracion"
            type="date"
            value={formData.fechaElaboracion}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: true, 
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Objetivo"
            name="objetivo"
            value={formData.objetivo}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Revisado por"
            name="revisadoPor"
            value={formData.revisadoPor}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,  
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PTForm;
