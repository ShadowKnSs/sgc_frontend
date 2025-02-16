import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

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
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => { onSave(indicator.id, result); onClose(); }} color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResultModal;
