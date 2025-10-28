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
  const toNum = (v) => Number(v || 0);

  const validarSumaRespuestas = (nuevosDatos) => {
    const encuestas = toNum(nuevosDatos.encuestas);
    const malas = toNum(nuevosDatos.malas);
    const regulares = toNum(nuevosDatos.regulares);
    const buenas = toNum(nuevosDatos.buenas);
    const excelentes = toNum(nuevosDatos.excelentes);

    const sumaRespuestas = malas + regulares + buenas + excelentes;

    if (sumaRespuestas > encuestas) {
      setError(`La suma de las respuestas (${sumaRespuestas}) no puede exceder el total de encuestas (${encuestas}).`);
      return false;
    } else if (encuestas < 0 || malas < 0 || regulares < 0 || buenas < 0 || excelentes < 0) {
      setError("Los valores no pueden ser negativos.");
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const handleChange = (campo, valor) => {
    // 1) Evitar negativos y normalizar a entero
    const valorNumerico = Math.max(0, parseInt(valor, 10) || 0);

    // Borrador con el nuevo valor
    const draft = { ...formData, [campo]: String(valorNumerico) };

    // 2) Si se edita una categoría, capar al restante disponible (encuestas - otras)
    if (campo !== "encuestas") {
      const encuestas = toNum(draft.encuestas);
      const malas = toNum(campo === "malas" ? valorNumerico : draft.malas);
      const regulares = toNum(campo === "regulares" ? valorNumerico : draft.regulares);
      const buenas = toNum(campo === "buenas" ? valorNumerico : draft.buenas);
      const excelentes = toNum(campo === "excelentes" ? valorNumerico : draft.excelentes);

      // Suma de las otras tres categorías (excluyendo la actual)
      const otras =
        (campo === "malas" ? 0 : malas) +
        (campo === "regulares" ? 0 : regulares) +
        (campo === "buenas" ? 0 : buenas) +
        (campo === "excelentes" ? 0 : excelentes);

      const restante = Math.max(0, encuestas - otras);
      const capped = Math.min(valorNumerico, restante);

      draft[campo] = String(capped);
    }

    setFormData(draft);
    validarSumaRespuestas(draft);
  };


  return (
    <Box component="form" sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="No. de Encuestas"
            type="number"
            inputProps={{
              min: 0,
              max: 999999,
              step: 1
            }}
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
            inputProps={{
              min: 0,
              max: Number(formData.encuestas || 0),
              step: 1
            }}
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
            inputProps={{
              min: 0,
              max: Number(formData.encuestas || 0),
              step: 1
            }}
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
            inputProps={{
              min: 0,
              max: Number(formData.encuestas || 0),
              step: 1
            }}
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
            inputProps={{
              min: 0,
              max: Number(formData.encuestas || 0),
              step: 1
            }}
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

    setIsSaving(true);
    try {
      const resultData = {
        noEncuestas: Number(formData.encuestas || 0),
        malo: Number(formData.malas || 0),
        regular: Number(formData.regulares || 0),
        bueno: Number(formData.buenas || 0),
        excelente: Number(formData.excelentes || 0)
      };
      onSave(indicator.idIndicador, { result: resultData });
      onClose();
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
            disabled={
              !!error ||
              formData.encuestas === "" // evitar guardar sin total
            }
          >
            Guardar
          </CustomButton>
        </DialogActions>
      </MotionBox>
    </Dialog>
  );
};

export default ResultModalEncuesta;
