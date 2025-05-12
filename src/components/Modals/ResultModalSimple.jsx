import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, TextField, DialogActions } from '@mui/material';
import DialogActionButtons from '../DialogActionButtons';
import DialogTitleCustom from "../TitleDialog";
import InputAdornment from '@mui/material/InputAdornment';


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
      <DialogTitleCustom
        title={`Registrar Resultado`}
        subtitle={`${indicator?.nombreIndicador || indicator?.name || ''} - Origen: ${indicator?.origenIndicador || 'Sin origen'}`}
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
    </Dialog>
  );
};

export default ResultModalSimple;
