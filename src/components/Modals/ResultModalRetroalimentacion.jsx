// src/components/Modals/ResultModalRetroalimentacion.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Box, Typography } from '@mui/material';
import DialogActionButtons from '../DialogActionButtons';

const RetroalimentacionContent = ({ formData, setFormData }) => (
  <Box component="form" sx={{ mt: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="Felicitaciones"
          type="number"
          fullWidth
          value={formData.felicitaciones || ""}
          onChange={(e) => setFormData({ ...formData, felicitaciones: e.target.value })}
          margin="dense"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Quejas"
          type="number"
          fullWidth
          value={formData.quejas || ""}
          onChange={(e) => setFormData({ ...formData, quejas: e.target.value })}
          margin="dense"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Sugerencias"
          type="number"
          fullWidth
          value={formData.sugerencias || ""}
          onChange={(e) => setFormData({ ...formData, sugerencias: e.target.value })}
          margin="dense"
        />
      </Grid>
    </Grid>
  </Box>
);

const ResultModalRetroalimentacion = ({ open, onClose, onSave, indicator, savedResult }) => {
  const [formData, setFormData] = useState({
    felicitaciones: "",
    quejas: "",
    sugerencias: ""
  });

  useEffect(() => {
    if (open && savedResult) {
      setFormData({
        felicitaciones:
        savedResult.cantidadFelicitacion && savedResult.cantidadFelicitacion > 0
          ? savedResult.cantidadFelicitacion.toString()
          : "",
      quejas:
        savedResult.cantidadQueja && savedResult.cantidadQueja > 0
          ? savedResult.cantidadQueja.toString()
          : "",
      sugerencias:
        savedResult.cantidadSugerencia && savedResult.cantidadSugerencia > 0
          ? savedResult.cantidadSugerencia.toString()
          : "",
      });
    }
  }, [open, savedResult]);
  const handleSave = () => {
    const resultData = {
      cantidadFelicitacion: Number(formData.felicitaciones),
      cantidadSugerencia: Number(formData.sugerencias),
      cantidadQueja: Number(formData.quejas),
    };
    console.log("Payload que se enviará:", resultData);
    onSave(indicator.idIndicadorConsolidado, { result: resultData });
    
  };

  const title = (
    <>
      Registrar Retroalimentación para: {indicator ? indicator.name : ''}
      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
        Origen: {indicator ? indicator.origenIndicador : 'Sin origen'}
      </Typography>
    </>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <RetroalimentacionContent formData={formData} setFormData={setFormData} />
      </DialogContent>
      <DialogActions>
        <DialogActionButtons
          onCancel={onClose}
          onSave={handleSave}
          saveText="Guardar"
          cancelText="Cancelar"
          saveColor="terciary.main"
          cancelColor="primary.main"
        />
      </DialogActions>
    </Dialog>
  );
};

export default ResultModalRetroalimentacion;
