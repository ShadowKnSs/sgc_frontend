import React from "react";
import { TextField, Button, Box, Grid } from "@mui/material";

const PTForm = ({ formData, handleChange, handleSave, handleClear, isFormValid }) => {
  return (
    <Box sx={{ p: 2, boxShadow: 3, borderRadius: 2, bgcolor: "background.paper", mb: 2, width: "70%" }}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField label="Responsable" name="responsable" value={formData.responsable} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Fecha de Elaboración" name="fechaElaboracion" type="date" value={formData.fechaElaboracion} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Objetivo" name="objetivo" value={formData.objetivo} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Revisado por" name="revisadoPor" value={formData.revisadoPor} onChange={handleChange} fullWidth margin="normal" />
        </Grid>
      </Grid>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={!isFormValid()}>
          Guardar
        </Button>
        <Button variant="contained" color="error" onClick={handleClear}>
          Borrar
        </Button>
      </Box>
    </Box>
  );
};

export default PTForm;