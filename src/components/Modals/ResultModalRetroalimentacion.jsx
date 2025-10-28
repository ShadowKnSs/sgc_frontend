import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Box
} from "@mui/material";
import CustomButton from "../Button";
import DialogTitleCustom from "../TitleDialog";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

// Función para ajustar valores (no menores a 0)
const adjustValue = (value) => {
  if (value === '') return '';
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '';
  
  if (numValue < 0) return '0';
  return value;
};

const RetroalimentacionContent = ({ formData, setFormData }) => {
  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFieldBlur = (field, value) => {
    // Ajustar el valor cuando el campo pierde el foco
    const adjustedValue = adjustValue(value);
    setFormData({ ...formData, [field]: adjustedValue });
  };

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Felicitaciones"
            type="number"
            fullWidth
            value={formData.felicitaciones || ""}
            onChange={(e) => handleFieldChange('felicitaciones', e.target.value)}
            onBlur={(e) => handleFieldBlur('felicitaciones', e.target.value)}
            inputProps={{ 
              min: 0,
              step: 1
            }}
            error={formData.felicitaciones && parseFloat(formData.felicitaciones) < 0}
            helperText={
              formData.felicitaciones && parseFloat(formData.felicitaciones) < 0
                ? "El valor no puede ser negativo"
                : "Ingrese un valor mayor o igual a 0"
            }
            margin="dense"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Quejas"
            type="number"
            fullWidth
            value={formData.quejas || ""}
            onChange={(e) => handleFieldChange('quejas', e.target.value)}
            onBlur={(e) => handleFieldBlur('quejas', e.target.value)}
            inputProps={{ 
              min: 0,
              step: 1
            }}
            error={formData.quejas && parseFloat(formData.quejas) < 0}
            helperText={
              formData.quejas && parseFloat(formData.quejas) < 0
                ? "El valor no puede ser negativo"
                : "Ingrese un valor mayor o igual a 0"
            }
            margin="dense"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Sugerencias"
            type="number"
            fullWidth
            value={formData.sugerencias || ""}
            onChange={(e) => handleFieldChange('sugerencias', e.target.value)}
            onBlur={(e) => handleFieldBlur('sugerencias', e.target.value)}
            inputProps={{ 
              min: 0,
              step: 1
            }}
            error={formData.sugerencias && parseFloat(formData.sugerencias) < 0}
            helperText={
              formData.sugerencias && parseFloat(formData.sugerencias) < 0
                ? "El valor no puede ser negativo"
                : "Ingrese un valor mayor o igual a 0"
            }
            margin="dense"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const ResultModalRetroalimentacion = ({ open, onClose, onSave, indicator, savedResult = {}, anio }) => {
  const [formData, setFormData] = useState({
    felicitaciones: "",
    quejas: "",
    sugerencias: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      const resultado = savedResult || {};

      // Ajustar los valores iniciales al cargar
      setFormData({
        felicitaciones: adjustValue(resultado.cantidadFelicitacion?.toString() ?? ""),
        quejas: adjustValue(resultado.cantidadQueja?.toString() ?? ""),
        sugerencias: adjustValue(resultado.cantidadSugerencia?.toString() ?? ""),
      });
    }
  }, [open, savedResult]);

  const handleSave = () => {
    if (!indicator?.idIndicador) return;
    
    // Validar que no haya valores negativos antes de guardar
    const hasNegativeValues = 
      parseFloat(formData.felicitaciones) < 0 ||
      parseFloat(formData.quejas) < 0 ||
      parseFloat(formData.sugerencias) < 0;
    
    if (hasNegativeValues) {
      console.error("No se puede guardar con valores negativos");
      return;
    }

    setIsSaving(true);
    try {
      const resultData = {
        cantidadFelicitacion: Number(formData.felicitaciones) || 0,
        cantidadSugerencia: Number(formData.sugerencias) || 0,
        cantidadQueja: Number(formData.quejas) || 0,
      };

      onSave(indicator.idIndicador, { result: resultData });
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Verificar si hay valores inválidos para deshabilitar el botón
  const hasInvalidValues = 
    (formData.felicitaciones && parseFloat(formData.felicitaciones) < 0) ||
    (formData.quejas && parseFloat(formData.quejas) < 0) ||
    (formData.sugerencias && parseFloat(formData.sugerencias) < 0);

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
          <RetroalimentacionContent formData={formData} setFormData={setFormData} />
        </DialogContent>
        <DialogActions>
          <CustomButton type="cancelar" onClick={onClose} disabled={isSaving}>
            Cancelar
          </CustomButton>
          <CustomButton 
            type="guardar" 
            onClick={handleSave} 
            loading={isSaving}
            disabled={hasInvalidValues || isSaving}
          >
            Guardar
          </CustomButton>
        </DialogActions>
      </MotionBox>
    </Dialog>
  );
};

export default ResultModalRetroalimentacion;