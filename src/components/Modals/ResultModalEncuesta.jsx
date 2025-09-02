import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Box,
  Typography
} from '@mui/material';
import CustomButton from "../Button";
import DialogTitleCustom from "../TitleDialog";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const EncuestaContent = ({ formData, setFormData, error, setError }) => {
  const validarSumaRespuestas = (nuevosDatos) => {
    const encuestas = Number(nuevosDatos.encuestas || 0);
    const malas = Number(nuevosDatos.malas || 0);
    const regulares = Number(nuevosDatos.regulares || 0);
    const buenas = Number(nuevosDatos.buenas || 0);
    const excelentes = Number(nuevosDatos.excelentes || 0);

    const sumaRespuestas = malas + regulares + buenas + excelentes;

    if (sumaRespuestas > encuestas) {
      setError(`La suma de las respuestas (${sumaRespuestas}) no puede exceder el total de encuestas (${encuestas})`);
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const handleChange = (campo, valor) => {
    // Convertir a número y evitar valores negativos
    const valorNumerico = Math.max(0, Number(valor) || 0);

    const nuevosDatos = {
      ...formData,
      [campo]: valorNumerico.toString()
    };

    setFormData(nuevosDatos);
    validarSumaRespuestas(nuevosDatos);
  };

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="No. de Encuestas"
            type="number"
            inputProps={{ min: 0 }}
            fullWidth
            value={formData.encuestas || ""}
            onChange={(e) => handleChange("encuestas", e.target.value)}
            margin="dense"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Respuestas Malas"
            type="number"
            inputProps={{ min: 0 }}
            fullWidth
            value={formData.malas || ""}
            onChange={(e) => handleChange("malas", e.target.value)}
            margin="dense"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Respuestas Regulares"
            type="number"
            inputProps={{ min: 0 }}
            fullWidth
            value={formData.regulares || ""}
            onChange={(e) => handleChange("regulares", e.target.value)}
            margin="dense"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Respuestas Buenas"
            type="number"
            inputProps={{ min: 0 }}
            fullWidth
            value={formData.buenas || ""}
            onChange={(e) => handleChange("buenas", e.target.value)}
            margin="dense"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Respuestas Excelentes"
            type="number"
            inputProps={{ min: 0 }}
            fullWidth
            value={formData.excelentes || ""}
            onChange={(e) => handleChange("excelentes", e.target.value)}
            margin="dense"
          />
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

const ResultModalEncuesta = ({ open, onClose, onSave, indicator, savedResult = {}, anio }) => {
  const [formData, setFormData] = useState({
    encuestas: "",
    malas: "",
    regulares: "",
    buenas: "",
    excelentes: ""
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    if (open) {
      const resultado = savedResult || {};
      setFormData({
        encuestas: resultado.noEncuestas?.toString() || "",
        malas: resultado.malo?.toString() || "",
        regulares: resultado.regular?.toString() || "",
        buenas: resultado.bueno?.toString() || "",
        excelentes: resultado.excelente?.toString() || ""
      });
      setError("");
    }
  }, [open, savedResult]);

  const handleSave = () => {
    if (!indicator?.idIndicador || error) return;
    try {
      const resultData = {
        noEncuestas: Number(formData.encuestas),
        malo: Number(formData.malas),
        regular: Number(formData.regulares),
        bueno: Number(formData.buenas),
        excelente: Number(formData.excelentes)
      };

      onSave(indicator.idIndicador, { result: resultData });
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }

  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <MotionBox
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.60 }}
      >
        <DialogTitleCustom
          title="Registrar Resultado"
          subtitle={`${indicator?.nombreIndicador || ''} - Origen: ${indicator?.origenIndicador || 'Sin origen'} - Año: ${anio}`}
        />
        <DialogContent>
          <EncuestaContent
            formData={formData}
            setFormData={setFormData}
            error={error}
            setError={setError}
          />
        </DialogContent>
        <DialogActions>
          <CustomButton type="cancelar" onClick={onClose} disabled={isSaving}>
            Cancelar
          </CustomButton>
          <CustomButton
            type="guardar"
            onClick={handleSave}
            loading={isSaving}
            disabled={!!error} // Mantener deshabilitado si hay error
          >
            Guardar
          </CustomButton>
        </DialogActions>
      </MotionBox>
    </Dialog>
  );
};

export default ResultModalEncuesta;