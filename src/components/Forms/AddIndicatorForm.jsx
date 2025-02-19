// src/components/AddIndicatorForm.jsx
import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, 
         FormControlLabel, RadioGroup, Radio, Typography, Box } from '@mui/material';
import GenericModal from '../Modals/GenericModal';

const AddIndicatorFormContent = ({ formData, setFormData }) => (
  <Box component="form" sx={{ mt: 2 }}>
    <FormControl fullWidth margin="normal">
      <InputLabel id="tipo-indicador-label">Tipo de Indicador</InputLabel>
      <Select
        labelId="tipo-indicador-label"
        value={formData.tipo || ''}
        label="Tipo de Indicador"
        onChange={(e) =>
          setFormData({ ...formData, tipo: e.target.value })
        }
      >
        <MenuItem value="Plan de control">Plan de control</MenuItem>
        <MenuItem value="Encuesta de Satisfacción">Encuesta de Satisfacción</MenuItem>
        <MenuItem value="Retroalimentación">Retroalimentación</MenuItem>
        <MenuItem value="Mapa de proceso">Mapa de proceso</MenuItem>
        <MenuItem value="Gestión de Riesgos">Gestión de Riesgos</MenuItem>
        <MenuItem value="Evaluación de proveedores">Evaluación de proveedores</MenuItem>
      </Select>
    </FormControl>

    <TextField
      margin="normal"
      label="Nombre / Descripción"
      fullWidth
      value={formData.nombre || ''}
      onChange={(e) =>
        setFormData({ ...formData, nombre: e.target.value })
      }
    />

    <FormControl component="fieldset" margin="normal">
      <Typography variant="subtitle1">Periodo de Evaluación</Typography>
      <RadioGroup
        row
        value={formData.periodo || 'Semestral'}
        onChange={(e) =>
          setFormData({ ...formData, periodo: e.target.value })
        }
      >
        <FormControlLabel value="Semestral" control={<Radio />} label="Semestral" />
        <FormControlLabel value="Anual" control={<Radio />} label="Anual" />
      </RadioGroup>
    </FormControl>

    <TextField
      margin="normal"
      label="Meta"
      fullWidth
      value={formData.meta || ''}
      onChange={(e) =>
        setFormData({ ...formData, meta: e.target.value })
      }
    />
  </Box>
);

const AddIndicatorForm = ({ open, onClose, onSave }) => {
  const title = "Agregar Indicador";
  const initialState = { tipo: '', nombre: '', periodo: 'Semestral', meta: '' };

  const handleSave = (data) => {
    onSave(data);
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
      <AddIndicatorFormContent />
    </GenericModal>
  );
};

export default AddIndicatorForm;
