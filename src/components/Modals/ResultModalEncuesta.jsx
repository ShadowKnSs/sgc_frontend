// src/components/Modals/ResultModalEncuesta.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Box, Typography } from '@mui/material';
import DialogActionButtons from '../DialogActionButtons';

const EncuestaContent = ({ formData, setFormData }) => (
  <Box component="form" sx={{ mt: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="No. de Encuestas"
          type="number"
          fullWidth
          value={formData.encuestas || ""}
          onChange={(e) => setFormData({ ...formData, encuestas: e.target.value })}
          margin="dense"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Respuestas Malas"
          type="number"
          fullWidth
          value={formData.malas || ""}
          onChange={(e) => setFormData({ ...formData, malas: e.target.value })}
          margin="dense"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Respuestas Regulares"
          type="number"
          fullWidth
          value={formData.regulares || ""}
          onChange={(e) => setFormData({ ...formData, regulares: e.target.value })}
          margin="dense"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Respuestas Buenas"
          type="number"
          fullWidth
          value={formData.buenas || ""}
          onChange={(e) => setFormData({ ...formData, buenas: e.target.value })}
          margin="dense"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Respuestas Excelentes"
          type="number"
          fullWidth
          value={formData.excelentes || ""}
          onChange={(e) => setFormData({ ...formData, excelentes: e.target.value })}
          margin="dense"
        />
      </Grid>
    </Grid>
  </Box>
);

const ResultModalEncuesta = ({ open, onClose, onSave, indicator, savedResult }) => {
  const [formData, setFormData] = useState({
    encuestas: "",
    malas: "",
    regulares: "",
    buenas: "",
    excelentes: ""
  });

  useEffect(() => {
    if (open && savedResult) {
      setFormData({
        encuestas: savedResult.noEncuestas?.toString() ?? "",
        malas: savedResult.malo?.toString() ?? "",
        regulares: savedResult.regular?.toString() ?? "",
        buenas: savedResult.bueno?.toString() ?? "",
        excelentes: savedResult.excelente?.toString() ?? ""
      });
    }
  }, [open, savedResult]);

  const handleSave = () => {
    const resultData = {
      noEncuestas: Number(formData.encuestas),
      malo: Number(formData.malas),
      regular: Number(formData.regulares),
      bueno: Number(formData.buenas),
      excelente: Number(formData.excelentes)
    };
    onSave(indicator.idIndicadorConsolidado, { result: resultData });
    onClose();
  };

  const title = (
    <>
      Registrar Resultado de Encuesta para: {indicator ? indicator.name : ''}
      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
        Origen: {indicator ? indicator.origenIndicador : 'Sin origen'}
      </Typography>
    </>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <EncuestaContent formData={formData} setFormData={setFormData} />
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

export default ResultModalEncuesta;
