import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Box
} from '@mui/material';
import CustomButton from "../Button";
import DialogTitleCustom from "../TitleDialog";
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ResultModalSimple = ({ open, onClose, onSave, indicator, savedResult, anio }) => {
  const [result, setResult] = useState('');
  const [saving, setSaving] = useState(false);

  // Función para ajustar el valor al rango 0-100
  const adjustValue = (value) => {
    if (value === '') return '';
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    
    if (numValue < 0) return '0';
    if (numValue > 100) return '100';
    return value;
  };

  useEffect(() => {
    if (open && indicator) {
      let initialValue = '';
      if (indicator.periodicidad === "Anual") {
        initialValue = savedResult?.resultadoAnual?.toString() || "";
      } else if (indicator.periodicidad === "Semestral") {
        initialValue = savedResult?.resultadoSemestral1?.toString() || "";
      } else {
        initialValue = savedResult?.result?.toString() || "";
      }
      
      // Ajustar el valor inicial al rango 0-100
      setResult(adjustValue(initialValue));
    }
  }, [open, savedResult, indicator]);

  const handleSave = () => {
    if (!indicator?.idIndicador) return;
    setSaving(true);
    try {
      // Asegurarnos de que el valor a guardar esté en el rango correcto
      const adjustedResult = adjustValue(result);
      
      const payload = {
        periodicidad: indicator.periodicidad,
        result: indicator.periodicidad === "Anual"
          ? { resultadoAnual: adjustedResult || "0" }
          : { resultadoSemestral1: adjustedResult || "0" }
      };

      onSave(indicator.idIndicador, payload);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleResultChange = (e) => {
    const value = e.target.value;
    setResult(value);
  };

  const handleBlur = () => {
    // Ajustar el valor cuando el campo pierde el foco
    setResult(adjustValue(result));
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
            inputProps={{ 
              min: 0, 
              max: 100,
              step: 1 // Permite decimales si es necesario
            }}
            fullWidth
            variant="outlined"
            value={result}
            onChange={handleResultChange}
            onBlur={handleBlur}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>
            }}
            error={result && (parseFloat(result) < 0 || parseFloat(result) > 100)}
            helperText={
              result && (parseFloat(result) < 0 || parseFloat(result) > 100)
                ? "El resultado debe estar entre 0 y 100"
                : "Ingrese un valor entre 0 y 100"
            }
          />
        </DialogContent>
        <DialogActions>
          <CustomButton type="cancelar" onClick={onClose} disabled={saving}>
            Cancelar
          </CustomButton>
          <CustomButton 
            type="guardar" 
            onClick={handleSave} 
            loading={saving}
            disabled={result && (parseFloat(result) < 0 || parseFloat(result) > 100)}
          >
            Guardar
          </CustomButton>
        </DialogActions>
      </MotionBox>
    </Dialog>
  );
};

export default ResultModalSimple;