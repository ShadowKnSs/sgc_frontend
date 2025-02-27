// src/components/Forms/AddIndicatorForm.jsx
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import GenericModal from '../Modals/GenericModal';

const AddIndicatorFormContent = ({ formData, setFormData }) => {
  return (
    <Box component="form" sx={{ mt: 2 }}>
      {/* Selección del Tipo de Indicador */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="tipo-indicador-label">Tipo de Indicador</InputLabel>
        <Select
          labelId="tipo-indicador-label"
          value={formData.tipo || ''}
          label="Tipo de Indicador"
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
        >
          <MenuItem value="Encuesta">Encuesta</MenuItem>
          <MenuItem value="EvaluaProveedores">Evaluacion</MenuItem>
          <MenuItem value="Retroalimentacion">Retroalimentacion</MenuItem>
        </Select>
      </FormControl>

      {/* Si es Retroalimentacion, se muestra el campo para seleccionar el método */}
      {formData.tipo === 'Retroalimentacion' && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="metodo-label">Método</InputLabel>
          <Select
            labelId="metodo-label"
            value={formData.metodo || ''}
            label="Método"
            onChange={(e) => setFormData({ ...formData, metodo: e.target.value })}
          >
            <MenuItem value="Encuesta de Satisfacción">Encuesta de Satisfacción</MenuItem>
            <MenuItem value="Buzón Virtual">Buzón Virtual</MenuItem>
            <MenuItem value="Buzón Físico">Buzón Físico</MenuItem>
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

const AddIndicatorForm = ({ open, onClose, onSave }) => {
  const title = "Agregar Indicador";
  // Agregamos periodicidad por defecto (Semestral)
  const initialState = { tipo: '', metodo: '', periodicidad: 'Semestral' };

  const handleSave = (data) => {
    // Aseguramos que data.tipo tenga un valor
    let indicadorNombre = "";
    if (data.tipo === "Encuesta") {
      indicadorNombre = "Encuesta de Satisfacción";
    } else if (data.tipo === "EvaluaProveedores") {
      indicadorNombre = "Evaluación de Proveedores";
    } else if (data.tipo === "Retroalimentacion") {
      indicadorNombre = `Retro ${data.metodo || "Sin Método"}`;
    } else {
      indicadorNombre = "Indicador sin nombre";
    }

    const payload = {
      nombreIndicador: indicadorNombre,
      origenIndicador: data.tipo, // Se enviará el tipo seleccionado
      periodicidad: data.periodicidad, // Por ejemplo, "Semestral"
      descripcionIndicador: "", // Puedes agregar descripción si lo requieres
      meta: "" // O meta, si lo necesitas
    };

    console.log("Payload para crear indicador:", payload);
    onSave(payload);
  };

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title={title}
      initialState={initialState}
      saveColor="terciary.main"
      cancelColor="primary.main"
    >
      <AddIndicatorFormContent />
    </GenericModal>
  );
};

export default AddIndicatorForm;
