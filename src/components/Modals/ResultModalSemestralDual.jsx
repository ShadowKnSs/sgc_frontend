import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Box,
  Grid,
  InputAdornment
} from '@mui/material';
import CustomButton from '../Button'; 
import DialogTitleCustom from "../TitleDialog";
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

// Función para ajustar valores entre 0 y 100
const adjustPercentValue = (value) => {
  if (value === '') return '';
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '';
  
  if (numValue < 0) return '0';
  if (numValue > 100) return '100';
  return value;
};

const ResultModalSemestralDual = ({ open, onClose, onSave, indicator, fields, savedResult = {}, anio }) => {
  const [tab, setTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const defaultState = useMemo(() => {
    const obj = {};
    fields.forEach(field => {
      obj[field.name] = "";
    });
    return obj;
  }, [fields]);

  const [resultEneJun, setResultEneJun] = useState(defaultState);
  const [resultJulDic, setResultJulDic] = useState(defaultState);

  useEffect(() => {
    if (open && indicator) {
      if (indicator.periodicidad === "Semestral" && fields.length > 0) {
        setResultEneJun({
          [fields[0].name]: adjustPercentValue(savedResult?.resultadoSemestral1?.toString() ?? "")
        });
        setResultJulDic({
          [fields[0].name]: adjustPercentValue(savedResult?.resultadoSemestral2?.toString() ?? "")
        });
      } else if (indicator.periodicidad === "Anual") {
        setResultEneJun(prev => ({
          ...prev,
          [fields[0].name]: adjustPercentValue(savedResult?.resultadoAnual?.toString() ?? "")
        }));
      }

      setTab(0);
    }
  }, [open, savedResult, indicator, fields]);

  const handleTabChange = (_, newValue) => setTab(newValue);

  const handleFieldChange = (tabNumber, fieldName, value) => {
    if (tabNumber === 0) {
      setResultEneJun(prev => ({ ...prev, [fieldName]: value }));
    } else {
      setResultJulDic(prev => ({ ...prev, [fieldName]: value }));
    }
  };

  const handleFieldBlur = (tabNumber, fieldName, value) => {
    // Ajustar el valor cuando el campo pierde el foco (solo para campos de porcentaje)
    const field = fields.find(f => f.name === fieldName);
    if (field?.percent) {
      const adjustedValue = adjustPercentValue(value);
      if (tabNumber === 0) {
        setResultEneJun(prev => ({ ...prev, [fieldName]: adjustedValue }));
      } else {
        setResultJulDic(prev => ({ ...prev, [fieldName]: adjustedValue }));
      }
    }
  };

  const handleSave = () => {
    if (!indicator?.idIndicador) return;
    
    // Ajustar valores antes de guardar
    const adjustedEneJun = { ...resultEneJun };
    const adjustedJulDic = { ...resultJulDic };
    
    fields.forEach(field => {
      if (field.percent) {
        adjustedEneJun[field.name] = adjustPercentValue(resultEneJun[field.name]);
        adjustedJulDic[field.name] = adjustPercentValue(resultJulDic[field.name]);
      }
    });

    setIsSaving(true);
    try {
      const payload = {
        periodicidad: indicator.periodicidad,
        result: {},
      };

      if (indicator.periodicidad === "Anual") {
        payload.result.resultadoAnual = parseFloat(adjustedEneJun[fields[0].name]) || 0;
      } else {
        payload.result.resultadoSemestral1 = parseFloat(adjustedEneJun[fields[0].name]) || 0;
        payload.result.resultadoSemestral2 = parseFloat(adjustedJulDic[fields[0].name]) || 0;
      }

      onSave(indicator.idIndicador, payload);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Verificar si hay valores inválidos para deshabilitar el botón
  const hasInvalidValues = () => {
    const checkTab = (tabData) => {
      return fields.some(field => {
        if (field.percent && tabData[field.name]) {
          const value = parseFloat(tabData[field.name]);
          return value < 0 || value > 100;
        }
        return false;
      });
    };

    return checkTab(resultEneJun) || 
           (indicator.periodicidad === "Semestral" && checkTab(resultJulDic));
  };

  // Función para renderizar campo de texto con validación
  const renderTextField = (tabNumber, field, value, onChangeHandler) => {
    const isPercentField = field.percent;
    const currentValue = value ?? "";
    const hasError = isPercentField && currentValue && 
                    (parseFloat(currentValue) < 0 || parseFloat(currentValue) > 100);

    return (
      <TextField
        fullWidth
        label={field.label}
        type="number"
        value={currentValue}
        onChange={(e) => onChangeHandler(tabNumber, field.name, e.target.value)}
        onBlur={(e) => handleFieldBlur(tabNumber, field.name, e.target.value)}
        margin="dense"
        inputProps={{ 
          min: isPercentField ? 0 : undefined,
          max: isPercentField ? 100 : undefined,
          step: isPercentField ? 0.01 : 1
        }}
        error={hasError}
        helperText={
          hasError 
            ? "El valor debe estar entre 0 y 100" 
            : isPercentField 
            ? "Ingrese un valor entre 0 y 100" 
            : ""
        }
        InputProps={{
          endAdornment: isPercentField ? 
            <InputAdornment position="end">%</InputAdornment> : null
        }}
      />
    );
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
          <Tabs value={tab} onChange={handleTabChange} centered>
            <Tab label="Ene-Jun" />
            <Tab label="Jul-Dic" disabled={indicator.periodicidad === "Anual"} />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {tab === 0 && (
              <Grid container spacing={2}>
                {fields.map(field => (
                  <Grid item xs={12} key={field.name}>
                    {renderTextField(0, field, resultEneJun[field.name], handleFieldChange)}
                  </Grid>
                ))}
              </Grid>
            )}
            {tab === 1 && indicator.periodicidad === "Semestral" && (
              <Grid container spacing={2}>
                {fields.map(field => (
                  <Grid item xs={12} key={field.name}>
                    {renderTextField(1, field, resultJulDic[field.name], handleFieldChange)}
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <CustomButton
            type="cancelar"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </CustomButton>
          <CustomButton
            type="guardar"
            onClick={handleSave}
            loading={isSaving}
            disabled={hasInvalidValues() || isSaving}
          >
            Guardar
          </CustomButton>
        </DialogActions>
      </MotionBox>
    </Dialog>
  );
};

export default ResultModalSemestralDual;