// src/components/ModuloIndicadores/ResultModalEncuesta.jsx
import React from 'react';
import { TextField, Grid, Box } from '@mui/material';
import GenericModal from './GenericModal';

const EncuestaContent = ({ formData, setFormData }) => (
  <Box component="form" sx={{ mt: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="No. de Encuestas"
          type="number"
          fullWidth
          value={formData.encuestas || ''}
          onChange={(e) => setFormData({ ...formData, encuestas: e.target.value })}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Respuestas Malas"
          type="number"
          fullWidth
          value={formData.malas || ''}
          onChange={(e) => setFormData({ ...formData, malas: e.target.value })}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Respuestas Regulares"
          type="number"
          fullWidth
          value={formData.regulares || ''}
          onChange={(e) => setFormData({ ...formData, regulares: e.target.value })}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Respuestas Buenas"
          type="number"
          fullWidth
          value={formData.buenas || ''}
          onChange={(e) => setFormData({ ...formData, buenas: e.target.value })}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Respuestas Excelentes"
          type="number"
          fullWidth
          value={formData.excelentes || ''}
          onChange={(e) => setFormData({ ...formData, excelentes: e.target.value })}
        />
      </Grid>
    </Grid>
  </Box>
);

const ResultModalEncuesta = ({ open, onClose, onSave, indicator }) => {
  const title = `Registrar Resultado de Encuesta para: ${indicator?.name || ''}`;
  const initialState = { encuestas: '', malas: '', regulares: '', buenas: '', excelentes: '' };

  const handleSave = (data) => {
    const resultData = {
      encuestas: Number(data.encuestas),
      malas: Number(data.malas),
      regulares: Number(data.regulares),
      buenas: Number(data.buenas),
      excelentes: Number(data.excelentes)
    };
    onSave(indicator.id, resultData);
  };

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title={title}
      initialState={initialState}
      saveColor="#F9B800"
      cancelColor="#0056b3"
    >
      <EncuestaContent />
    </GenericModal>
  );
};

export default ResultModalEncuesta;
