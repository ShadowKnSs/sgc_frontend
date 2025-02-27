// src/components/Modals/ResultModalEvaluaProveedores.jsx
import React, { useState, useEffect } from 'react';
import { Box, DialogTitle, DialogContent, DialogActions, TextField, Grid, Typography } from '@mui/material';
import GenericModal from './GenericModal';
import DialogActionButtons from '../DialogActionButtons';

const EvaluaContent = ({ formData, setFormData }) => (
  <Box component="form" sx={{ mt: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="Confiable"
          type="number"
          fullWidth
          value={formData.confiable || ''}
          onChange={e => setFormData({ ...formData, confiable: e.target.value })}
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

  const initialState = {
    confiable: '',
    condicionado: '',
    noConfiable: ''
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (open) {
      setFormData({
        confiable: (savedResult && savedResult.confiable != null) ? savedResult.confiable.toString() : '',
        condicionado: (savedResult && savedResult.condicionado != null) ? savedResult.condicionado.toString() : '',
        noConfiable: (savedResult && savedResult.noConfiable != null) ? savedResult.noConfiable.toString() : ''
      });
    }
  }, [open, savedResult]);

  const handleSave = () => {
    const payload = {
      periodicidad: indicator.periodicidad,
      result: { ...formData }
    };
    console.log("Guardando evaluación de proveedores para indicador", indicator.idIndicadorConsolidado, payload);
    onSave(indicator.idIndicadorConsolidado, payload);
    onClose();
  };

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title={title}
      initialState={formData}
      saveColor="secondary.main"
      cancelColor="primary.main"
    >
      <EvaluaContent />
    </GenericModal>
  );
};

export default ResultModalEvaluaProveedores;
