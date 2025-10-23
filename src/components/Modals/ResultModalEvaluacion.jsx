import React, { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogActions,
  TextField, Tabs, Tab, Box, Grid
} from "@mui/material";
import CustomButton from "../Button";
import DialogTitleCustom from "../TitleDialog";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const EvaluaContent = ({ formData, setFormData, activeTab }) => {
  const handleNumberChange = (campo, valor) => {
    // Forzar a número, sin negativos ni >100
    const num = Math.max(0, Math.min(100, Number(valor) || 0));
    setFormData({ ...formData, [campo]: num.toString() });
  };

  const renderField = (label, name, value) => (
    <Grid item xs={12}>
      <TextField
        label={label}
        type="number"
        inputProps={{
          min: 0,
          max: 100,
          step: 1
        }}
        fullWidth
        value={value || ""}
        onChange={(e) => handleNumberChange(name, e.target.value)}
        margin="dense"
      />
    </Grid>
  );

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {activeTab === 0 && (
          <>
            {renderField("Confiable (Ene-Jun)", "confiableSem1", formData.confiableSem1)}
            {renderField("Condicionado (Ene-Jun)", "condicionadoSem1", formData.condicionadoSem1)}
            {renderField("No Confiable (Ene-Jun)", "noConfiableSem1", formData.noConfiableSem1)}
          </>
        )}
        {activeTab === 1 && (
          <>
            {renderField("Confiable (Jul-Dic)", "confiableSem2", formData.confiableSem2)}
            {renderField("Condicionado (Jul-Dic)", "condicionadoSem2", formData.condicionadoSem2)}
            {renderField("No Confiable (Jul-Dic)", "noConfiableSem2", formData.noConfiableSem2)}
          </>
        )}
      </Grid>
    </Box>
  );
};

const ResultModalEvaluaProveedores = ({ open, onClose, onSave, indicator, savedResult = {}, anio }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    confiableSem1: "", confiableSem2: "",
    condicionadoSem1: "", condicionadoSem2: "",
    noConfiableSem1: "", noConfiableSem2: "",
  });

  useEffect(() => {
    if (open) {
      const resultado = savedResult || {};
      setFormData({
        confiableSem1: resultado.resultadoConfiableSem1?.toString() || "",
        confiableSem2: resultado.resultadoConfiableSem2?.toString() || "",
        condicionadoSem1: resultado.resultadoCondicionadoSem1?.toString() || "",
        condicionadoSem2: resultado.resultadoCondicionadoSem2?.toString() || "",
        noConfiableSem1: resultado.resultadoNoConfiableSem1?.toString() || "",
        noConfiableSem2: resultado.resultadoNoConfiableSem2?.toString() || "",
      });
    }
  }, [open, savedResult]);

  const toNumberOrNull = (val) => val === "" ? null : Number(val);

  const handleSave = () => {
    if (!indicator?.idIndicador) return;
    try {
      const resultData = {
        confiableSem1: toNumberOrNull(formData.confiableSem1),
        confiableSem2: toNumberOrNull(formData.confiableSem2),
        condicionadoSem1: toNumberOrNull(formData.condicionadoSem1),
        condicionadoSem2: toNumberOrNull(formData.condicionadoSem2),
        noConfiableSem1: toNumberOrNull(formData.noConfiableSem1),
        noConfiableSem2: toNumberOrNull(formData.noConfiableSem2)
      };

      onSave(indicator.idIndicador, { result: resultData });
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
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
        transition={{ duration: 0.25 }}
      >
        <DialogTitleCustom
          title="Registrar Resultado"
          subtitle={`${indicator?.nombreIndicador || ""} - Origen: ${indicator?.origenIndicador || "Sin origen"} - Año: ${anio}`}
        />
        <DialogContent>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} centered>
            <Tab label="Ene-Jun" />
            <Tab label="Jul-Dic" />
          </Tabs>
          <EvaluaContent
            formData={formData}
            setFormData={setFormData}
            activeTab={activeTab}
          />
        </DialogContent>
        <DialogActions>
          <CustomButton type="cancelar" onClick={onClose} disabled={isSaving}>
            Cancelar
          </CustomButton>
          <CustomButton type="guardar" onClick={handleSave} loading={isSaving}>
            Guardar
          </CustomButton>
        </DialogActions>
      </MotionBox>
    </Dialog>
  );
};

export default ResultModalEvaluaProveedores;
