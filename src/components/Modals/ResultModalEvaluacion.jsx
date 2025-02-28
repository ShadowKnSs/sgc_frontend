// src/components/Modals/ResultModalEvaluaProveedores.jsx
import React from 'react';
import { Box, TextField, Grid, Typography } from '@mui/material';
import GenericModal from './GenericModal';

const EvaluaContent = ({ formData, setFormData }) => (
  <Box component="form" sx={{ mt: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="Confiable"
          type="number"
          fullWidth
          value={formData.confiable || ''}
          onChange={(e) => {console.log("Valor actualizado:", e.target.value);setFormData({ ...formData, confiable: e.target.value });}}
          margin="dense"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Condicionado"
          type="number"
          fullWidth
          value={formData.condicionado || ''}
          onChange={e => setFormData({ ...formData, condicionado: e.target.value })}
          margin="dense"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="No Confiable"
          type="number"
          fullWidth
          value={formData.noConfiable || ''}
          onChange={e => setFormData({ ...formData, noConfiable: e.target.value })}
          margin="dense"
        />
      </Grid>
    </Grid>
  </Box>
);

const ResultModalEvaluaProveedores = ({ open, onClose, onSave, indicator, savedResult }) => {
  const title = (
    <>
      Registrar Evaluación de Proveedores para: {indicator ? indicator.name : ''}
      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
        Origen: {indicator ? indicator.origenIndicador : 'Sin origen'}
      </Typography>
    </>
  );

  // Estado inicial a pasar al modal
  const initialState = {
    confiable: savedResult && savedResult.confiable != null ? savedResult.confiable.toString() : '',
    condicionado: savedResult && savedResult.condicionado != null ? savedResult.condicionado.toString() : '',
    noConfiable: savedResult && savedResult.noConfiable != null ? savedResult.noConfiable.toString() : ''
  };

  // Función para transformar valores vacíos en null y convertir a número si hay valor
  const transformValue = (val) => (val === '' ? null : Number(val));

  // handleSave ahora recibe "data" desde GenericModal, que ya es el estado actualizado
  const handleSave = (data) => {
    const payload = {
      periodicidad: indicator.periodicidad,
      result: {
        confiable: transformValue(data.confiable),
        condicionado: transformValue(data.condicionado),
        noConfiable: transformValue(data.noConfiable)
      }
    };
    console.log("Guardando evaluación de proveedores para indicador", indicator.idIndicadorConsolidado, "payload:", payload);
    onSave(indicator.idIndicadorConsolidado, payload);
    onClose();
  };

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title={title}
      initialState={initialState}
      saveColor="secondary.main"
      cancelColor="primary.main"
    >
      <EvaluaContent />
    </GenericModal>
  );
};

export default ResultModalEvaluaProveedores;

