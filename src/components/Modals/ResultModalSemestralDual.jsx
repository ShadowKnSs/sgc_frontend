import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogActions, TextField, Tabs, Tab, Box, Grid } from '@mui/material';
import DialogActionButtons from '../DialogActionButtons';
import DialogTitleCustom from "../TitleDialog";
import InputAdornment from '@mui/material/InputAdornment';


const ResultModalSemestralDual = ({ open, onClose, onSave, indicator, fields, savedResult = {} }) => {
  const [tab, setTab] = useState(0); // 0: Ene-Jun, 1: Jul-Dic

  // Estado por defecto usando los nombres de los campos
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

  // Precargar valores guardados al abrir el modal
  useEffect(() => {
    if (open && indicator) {
      console.log("📌 Modal Semestral abierto. Datos actuales:", savedResult);

      if (indicator.periodicidad === "Semestral" && fields.length > 0) {
        setResultEneJun(prevState => ({
          ...prevState,
          [fields[0].name]: savedResult?.resultadoSemestral1 != null
            ? savedResult.resultadoSemestral1.toString()
            : prevState[fields[0].name]
        }));

        setResultJulDic(prevState => ({
          ...prevState,
          [fields[0].name]: savedResult?.resultadoSemestral2 != null
            ? savedResult.resultadoSemestral2.toString()
            : prevState[fields[0].name]
        }));
      } else if (indicator.periodicidad === "Anual") {
        setResultEneJun(prevState => ({
          ...prevState,
          [fields[0].name]: savedResult?.resultadoAnual != null
            ? savedResult.resultadoAnual.toString()
            : prevState[fields[0].name]
        }));
      }

      setTab(0);
    }
  }, [open, savedResult, indicator, fields]);

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
    if (!indicator?.idIndicador) {
      console.error("❌ Error: No se pudo identificar el indicador.");
      return;
    }

    const payload = {
      periodicidad: indicator.periodicidad,
      result: {},
    };

    if (indicator.periodicidad === "Anual") {
      // payload.result.resultadoAnual = resultEneJun[fields[0].name];
      payload.result.resultadoAnual = parseFloat(resultEneJun[fields[0].name]);
    } else {
      // payload.result.resultadoSemestral1 = resultEneJun[fields[0].name];
      // payload.result.resultadoSemestral2 = resultJulDic[fields[0].name];
      payload.result.resultadoSemestral1 = parseFloat(resultEneJun[fields[0].name]);
      payload.result.resultadoSemestral2 = parseFloat(resultJulDic[fields[0].name]);
    }

    console.log("📌 Payload enviado al backend:", JSON.stringify(payload, null, 2));
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
                    onChange={(e) => {
                      const val = e.target.value;
                      handleFieldChange(0, field.name, val);
                    }}
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
                    onChange={(e) => {
                      const val = e.target.value;
                      handleFieldChange(0, field.name, val);
                    }}
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
    </Dialog>
  );
};

export default ResultModalSemestralDual;
