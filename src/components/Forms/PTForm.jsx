import React, { useEffect } from "react";
import { TextField, Box, Grid } from "@mui/material";

const PTForm = ({ formData, handleChange, soloLectura, puedeEditar }) => {

  // Si no se asigna la fecha de elaboración, podemos asignarla aquí o en el componente padre.
  // En este ejemplo se asume que el componente padre ya se encarga de asignar la fecha.
  return (
    <Box
      sx={{
        p: 2,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
        mb: 2,
        width: "70%"
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={6}>

          <TextField
            fullWidth
            label="Responsable"
            name="responsable"
            value={formData.responsable}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Fecha de Elaboración"
            name="fechaElaboracion"
            type="date"
            value={formData.fechaElaboracion}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Objetivo"
            name="objetivo"
            value={formData.objetivo}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Revisado por"
            name="revisadoPor"
            value={formData.revisadoPor}
            onChange={handleChange}
            margin="normal"
          />

          {(formData.fechaRevision || soloLectura) && (
            <TextField
              fullWidth
              label="Fecha de Revisión"
              name="fechaRevision"
              type="date"
              value={formData.fechaRevision}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: !puedeEditar }}
            />
          )}

          {(formData.elaboradoPor || soloLectura) && (
            <TextField
              fullWidth
              label="Elaborado por"
              name="elaboradoPor"
              value={formData.elaboradoPor}
              onChange={handleChange}
              margin="normal"
              InputProps={{ readOnly: !puedeEditar }}
            />
          )}

        </Grid>
      </Grid>
    </Box>
  );
};

export default PTForm;
