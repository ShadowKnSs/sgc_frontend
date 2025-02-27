// src/components/Modals/ResultModal.jsx
import React, { useEffect, useState } from 'react';
import { Typography, TextField } from '@mui/material';
import GenericModal from '../GenericModal';

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

const ResultModal = ({ open, onClose, onSave, indicator, savedResult }) => {
  const [localState, setLocalState] = useState({ result: '' });

  useEffect(() => {
    if (open && indicator) {
      // Si el indicador es anual, se utiliza el campo "resultadoSemestral1"
      if (indicator.periodicidad === "Anual") {
        setLocalState({
          result:
            savedResult && savedResult.resultadoSemestral1 !== undefined
              ? savedResult.resultadoSemestral1.toString()
              : ''
        });
      } else {
        // Para otros casos (p.ej., si usas el modal simple para indicadores no anuales)
        setLocalState(
          savedResult && savedResult.result !== undefined
            ? { result: savedResult.result.toString() }
            : { result: '' }
        );
      }
      console.log("ResultModal opened. savedResult:", savedResult);
    }
  }, [open, savedResult, indicator]);

  const title = (
    <>
      Registrar Resultado para: {indicator?.nombreIndicador || ''}
      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
        Origen: {indicator?.origenIndicador || 'Sin origen'}
      </Typography>
    </>
  );

  const handleSave = (data) => {
    // Se usa el idIndicadorConsolidado para construir el endpoint
    onSave(indicator.idIndicadorConsolidado, data.result);
  };

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title={title}
      initialState={localState}
      saveColor="terciary.main"
      cancelColor="primary.main"
    >
      <ResultModalContent />
    </GenericModal>
  );
};

export default ResultModal;
