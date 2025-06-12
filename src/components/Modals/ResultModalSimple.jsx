import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Box
} from '@mui/material';
import DialogActionButtons from '../DialogActionButtons';
import DialogTitleCustom from "../TitleDialog";
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ResultModalSimple = ({ open, onClose, onSave, indicator, savedResult, anio }) => {
  const [result, setResult] = useState('');

  useEffect(() => {
    if (open && indicator) {
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
    if (!indicator?.idIndicador) return;

    const payload = {
      periodicidad: indicator.periodicidad,
      result: indicator.periodicidad === "Anual"
        ? { resultadoAnual: result }
        : { resultadoSemestral1: result }
    };

    onSave(indicator.idIndicador, payload);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <MotionBox
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
      >
        <DialogTitleCustom
          title="Registrar Resultado"
          subtitle={`${indicator?.nombreIndicador || ''} - Origen: ${indicator?.origenIndicador || 'Sin origen'} - Año: ${anio}`}
        />
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Resultado"
            type="number"
            inputProps={{ min: 0, step: 1 }}
            fullWidth
            variant="outlined"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>
            }}
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
      </MotionBox>
    </Dialog>
  );
};

export default ResultModalSimple;
