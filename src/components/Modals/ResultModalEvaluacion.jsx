import React, { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogActions,
  TextField, Tabs, Tab, Box, Grid
} from "@mui/material";
import DialogActionButtons from "../DialogActionButtons";
import DialogTitleCustom from "../TitleDialog";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const EvaluaContent = ({ formData, setFormData, activeTab }) => (
  <Box component="form" sx={{ mt: 2 }}>
    <Grid container spacing={2}>
      {activeTab === 0 && (
        <>
          <Grid item xs={12}>
            <TextField
              label="Confiable (Ene-Jun)"
              type="number"
              fullWidth
              value={formData.confiableSem1 || ""}
              onChange={(e) => setFormData({ ...formData, confiableSem1: e.target.value })}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Condicionado (Ene-Jun)"
              type="number"
              fullWidth
              value={formData.condicionadoSem1 || ""}
              onChange={(e) => setFormData({ ...formData, condicionadoSem1: e.target.value })}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="No Confiable (Ene-Jun)"
              type="number"
              fullWidth
              value={formData.noConfiableSem1 || ""}
              onChange={(e) => setFormData({ ...formData, noConfiableSem1: e.target.value })}
              margin="dense"
            />
          </Grid>
        </>
      )}
      {activeTab === 1 && (
        <>
          <Grid item xs={12}>
            <TextField
              label="Confiable (Jul-Dic)"
              type="number"
              fullWidth
              value={formData.confiableSem2 || ""}
              onChange={(e) => setFormData({ ...formData, confiableSem2: e.target.value })}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Condicionado (Jul-Dic)"
              type="number"
              fullWidth
              value={formData.condicionadoSem2 || ""}
              onChange={(e) => setFormData({ ...formData, condicionadoSem2: e.target.value })}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="No Confiable (Jul-Dic)"
              type="number"
              fullWidth
              value={formData.noConfiableSem2 || ""}
              onChange={(e) => setFormData({ ...formData, noConfiableSem2: e.target.value })}
              margin="dense"
            />
          </Grid>
        </>
      )}
    </Grid>
  </Box>
);

const ResultModalEvaluaProveedores = ({ open, onClose, onSave, indicator, savedResult = {}, anio }) => {
  const [activeTab, setActiveTab] = useState(0);

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
          subtitle={`${indicator?.nombreIndicador || ''} - Origen: ${indicator?.origenIndicador || 'Sin origen'} - Año: ${anio}`}
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

export default ResultModalEvaluaProveedores;
