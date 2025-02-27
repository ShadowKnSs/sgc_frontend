// src/components/Modals/ResultModalSemestralDual.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab, Box, Grid, Typography } from '@mui/material';
import DialogActionButtons from '../DialogActionButtons';

const ResultModalSemestralDual = ({ open, onClose, onSave, indicator, fields, savedResult }) => {
  const [tab, setTab] = useState(0); // 0: Ene-Jun, 1: Jul-Dic

  // Calcula el estado por defecto a partir de los campos
  const defaultState = useMemo(() => {
    const obj = {};
    fields.forEach(field => {
      obj[field.name] = "";
    });
    return obj;
  }, [fields]);

  // Estados para cada pestaña
  const [resultEneJun, setResultEneJun] = useState(defaultState);
  const [resultJulDic, setResultJulDic] = useState(defaultState);

  // Transforma savedResult en el formato esperado, de forma segura
  const transformedSavedResult = useMemo(() => {
    if (savedResult && typeof savedResult === 'object') {
      return {
        "Ene-Jun": {
          resultado: savedResult.resultadoSemestral1 != null 
            ? savedResult.resultadoSemestral1.toString() 
            : ""
        },
        "Jul-Dic": {
          resultado: savedResult.resultadoSemestral2 != null 
            ? savedResult.resultadoSemestral2.toString() 
            : ""
        }
      };
    }
    return { "Ene-Jun": defaultState, "Jul-Dic": defaultState };
  }, [savedResult, defaultState]);

  // Al abrir el modal, precargar los valores guardados o usar defaultState
  useEffect(() => {
    if (open && indicator) {
      setResultEneJun(transformedSavedResult["Ene-Jun"]);
      setResultJulDic(transformedSavedResult["Jul-Dic"]);
      setTab(0);
      console.log("ModalSemestralDual abierto para indicador", indicator.idIndicadorConsolidado, "transformedSavedResult:", transformedSavedResult);
    }
  }, [open, transformedSavedResult, indicator]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleFieldChange = (tabNumber, fieldName, value) => {
    if (tabNumber === 0) {
      setResultEneJun(prev => ({ ...prev, [fieldName]: value }));
    } else {
      setResultJulDic(prev => ({ ...prev, [fieldName]: value }));
    }
  };

  const handleSave = () => {
    // Construir el payload a enviar
    const payload = {
      periodicidad: indicator.periodicidad,
      result: {}
    };

    if (fields.length === 1) {
      payload.result["Ene-Jun"] = { resultado: resultEneJun[fields[0].name] };
      payload.result["Jul-Dic"] = { resultado: resultJulDic[fields[0].name] };
    } else {
      payload.result["Ene-Jun"] = { ...resultEneJun };
      payload.result["Jul-Dic"] = { ...resultJulDic };
    }

    console.log("Guardando resultado para indicador", indicator.idIndicadorConsolidado, "payload:", payload);
    onSave(indicator.idIndicadorConsolidado, payload);
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
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Ene-Jun" />
          <Tab label="Jul-Dic" />
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
                    value={resultEneJun[field.name] || ""}
                    onChange={e => handleFieldChange(0, field.name, e.target.value)}
                    margin="dense"
                  />
                </Grid>
              ))}
            </Grid>
          )}
          {tab === 1 && (
            <Grid container spacing={2}>
              {fields.map(field => (
                <Grid item xs={12} key={field.name}>
                  <TextField
                    fullWidth
                    label={field.label}
                    type="number"
                    value={resultJulDic[field.name] || ""}
                    onChange={e => handleFieldChange(1, field.name, e.target.value)}
                    margin="dense"
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
          saveColor="secondary.main"
          cancelColor="primary.main"
        />
      </DialogActions>
    </Dialog>
  );
};

export default ResultModalSemestralDual;
