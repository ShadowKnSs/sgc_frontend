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
import DialogActionButtons from '../DialogActionButtons';
import DialogTitleCustom from "../TitleDialog";
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ResultModalSemestralDual = ({ open, onClose, onSave, indicator, fields, savedResult = {}, anio }) => {
  const [tab, setTab] = useState(0);

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
          [fields[0].name]: savedResult?.resultadoSemestral1?.toString() ?? ""
        });
        setResultJulDic({
          [fields[0].name]: savedResult?.resultadoSemestral2?.toString() ?? ""
        });
      } else if (indicator.periodicidad === "Anual") {
        setResultEneJun(prev => ({
          ...prev,
          [fields[0].name]: savedResult?.resultadoAnual?.toString() ?? ""
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

  const handleSave = () => {
    if (!indicator?.idIndicador) return;

    const payload = {
      periodicidad: indicator.periodicidad,
      result: {},
    };

    if (indicator.periodicidad === "Anual") {
      payload.result.resultadoAnual = parseFloat(resultEneJun[fields[0].name]);
    } else {
      payload.result.resultadoSemestral1 = parseFloat(resultEneJun[fields[0].name]);
      payload.result.resultadoSemestral2 = parseFloat(resultJulDic[fields[0].name]);
    }

    onSave(indicator.idIndicador, payload);
    onClose();
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
                    <TextField
                      fullWidth
                      label={field.label}
                      type="number"
                      value={resultEneJun[field.name] ?? ""}
                      onChange={(e) => handleFieldChange(0, field.name, e.target.value)}
                      margin="dense"
                      InputProps={{
                        endAdornment: field.percent ? <InputAdornment position="end">%</InputAdornment> : null
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
            {tab === 1 && indicator.periodicidad === "Semestral" && (
              <Grid container spacing={2}>
                {fields.map(field => (
                  <Grid item xs={12} key={field.name}>
                    <TextField
                      fullWidth
                      label={field.label}
                      type="number"
                      value={resultJulDic[field.name] ?? ""}
                      onChange={(e) => handleFieldChange(1, field.name, e.target.value)}
                      margin="dense"
                      InputProps={{
                        endAdornment: field.percent ? <InputAdornment position="end">%</InputAdornment> : null
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
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

export default ResultModalSemestralDual;
