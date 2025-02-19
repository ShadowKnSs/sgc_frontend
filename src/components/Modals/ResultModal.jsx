// src/components/ResultModal.jsx
import React from 'react';
import { TextField } from '@mui/material';
import GenericModal from './GenericModal';

const ResultModalContent = ({ formData, setFormData }) => (
  <TextField
    autoFocus
    margin="dense"
    label="Resultado"
    fullWidth
    variant="outlined"
    value={formData.result || ''}
    onChange={(e) => setFormData({ ...formData, result: e.target.value })}
  />
);

const ResultModal = ({ open, onClose, onSave, indicator }) => {
  const title = `Registrar Resultado para: ${indicator?.name || ''}`;
  const initialState = { result: '' };

  const handleSave = (data) => {
    // Se envía el resultado usando el id del indicador
    onSave(indicator.id, data.result);
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
      <ResultModalContent />
    </GenericModal>
  );
};

export default ResultModal;
