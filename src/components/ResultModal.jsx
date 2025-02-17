import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import DialogActionButtons from './DialogActionButtons';

const ResultModal = ({ open, onClose, onSave, indicator }) => {
  const [result, setResult] = useState('');

  useEffect(() => {
    if (indicator) {
      setResult('');
    }
  }, [indicator]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Registrar Resultado para: {indicator ? indicator.name : ''}
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
          onSave={() => { onSave(indicator.id, result); onClose(); }}
          saveText="Guardar"
          cancelText="Cancelar"
          saveColor="#F9B800" // Ajusta según tu paleta
          cancelColor="#0056b3"
        />
      </DialogActions>
    </Dialog>
  );
};

export default ResultModal;
