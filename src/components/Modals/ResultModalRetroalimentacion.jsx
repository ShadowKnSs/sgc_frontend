// src/components/ModuloIndicadores/ResultModalRetroalimentacion.jsx
import React from 'react';
import { TextField, Grid, Box } from '@mui/material';
import GenericModal from './GenericModal';

const RetroalimentacionContent = ({ formData, setFormData }) => (
  <Box component="form" sx={{ mt: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="Felicitaciones"
          type="number"
          fullWidth
          value={formData.felicitaciones || ''}
          onChange={(e) =>
            setFormData({ ...formData, felicitaciones: e.target.value })
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Quejas"
          type="number"
          fullWidth
          value={formData.quejas || ''}
          onChange={(e) =>
            setFormData({ ...formData, quejas: e.target.value })
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Sugerencias"
          type="number"
          fullWidth
          value={formData.sugerencias || ''}
          onChange={(e) =>
            setFormData({ ...formData, sugerencias: e.target.value })
          }
        />
      </Grid>
    </Grid>
  </Box>
);

const ResultModalRetroalimentacion = ({ open, onClose, onSave, indicator }) => {
  const title = `Registrar Retroalimentación para: ${indicator?.name || ''}`;
  const initialState = { felicitaciones: '', quejas: '', sugerencias: '' };

  const handleSave = (data) => {
    const resultData = {
      felicitaciones: Number(data.felicitaciones),
      quejas: Number(data.quejas),
      sugerencias: Number(data.sugerencias),
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
      <RetroalimentacionContent />
    </GenericModal>
  );
};

export default ResultModalRetroalimentacion;
