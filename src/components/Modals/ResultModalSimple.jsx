// src/components/Modals/ResultModalSimple.jsx
import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Typography } from '@mui/material';
import DialogActionButtons from '../DialogActionButtons';

const ResultModalSimple = ({ open, onClose, onSave, indicator, savedResult }) => {
  const [result, setResult] = useState('');

  useEffect(() => {
    if (open && indicator) {
      // Para indicadores anuales se utiliza "resultadoSemestral1"
      if (indicator.periodicidad === "Anual" && savedResult && savedResult.resultadoSemestral1 !== null) {
        setResult(savedResult.resultadoSemestral1.toString());
      } else if (savedResult && savedResult.result !== undefined) {
        setResult(savedResult.result.toString());
      } else {
        setResult('');
      }
      console.log("Modal abierto, savedResult:", savedResult);
    }
  }, [open, savedResult, indicator]);

  const handleSave = () => {
    // Se prepara el payload a enviar; se usa el identificador idIndicadorConsolidado para el endpoint
    onSave(indicator.idIndicadorConsolidado, { result });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Registrar Resultado para: {indicator ? indicator.name : ''}
        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
          Origen: {indicator ? indicator.origenIndicador : 'Sin origen'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Resultado"
          fullWidth
          variant="outlined"
          value={result}
          onChange={(e) => setResult(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <DialogActionButtons 
          onCancel={onClose} 
          onSave={handleSave}
          saveText="Guardar"
          cancelText="Cancelar"
          saveColor="terciary.main"
          cancelColor="secondary.main"
        />
      </DialogActions>
    </Dialog>
  );
};

export default ResultModalSimple;
