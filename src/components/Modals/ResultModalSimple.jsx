import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Typography } from '@mui/material';
import DialogActionButtons from '../DialogActionButtons';

const ResultModalSimple = ({ open, onClose, onSave, indicator, savedResult }) => {
  const [result, setResult] = useState('');

  useEffect(() => {
    if (open && indicator) {
      console.log("📌 Modal abierto, savedResult:", savedResult);

      // Determinar el campo correcto según periodicidad
      if (indicator.periodicidad === "Anual") {
        setResult(savedResult?.resultadoAnual?.toString() || "");
      } else if (indicator.periodicidad === "Semestral") {
        setResult(savedResult?.resultadoSemestral1?.toString() || "");
      } else {
        setResult(savedResult?.result?.toString() || "");
      }
    }
  }, [open, savedResult, indicator]);

  const handleSave = () => {
    if (!indicator || !indicator.idIndicador) {
      console.error("❌ Error: No se encontró idIndicador para registrar el resultado.");
      return;
    }

    // Construir el payload
    const payload = {
      periodicidad: indicator.periodicidad,
      result: indicator.periodicidad === "Anual"
        ? { resultadoAnual: result }
        : { resultadoSemestral1: result }
    };

    console.log("📌 Guardando resultado para indicador", indicator.idIndicador, "Payload:", payload);
    onSave(indicator.idIndicador, payload);
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
          cancelColor="primary.main"
        />
      </DialogActions>
    </Dialog>
  );
};

export default ResultModalSimple;
