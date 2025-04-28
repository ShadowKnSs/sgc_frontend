import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab, Box, Grid, Typography } from "@mui/material";
import DialogActionButtons from "../DialogActionButtons";
import DialogTitleCustom from "../TitleDialog";

const EvaluaContent = ({ formData, setFormData, activeTab }) => (
  <Box component="form" sx={{ mt: 2 }}>
    <Grid container spacing={2}>
      {/* 📌 Pestaña de Ene-Jun */}
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

      {/* 📌 Pestaña de Jul-Dic */}
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

const ResultModalEvaluaProveedores = ({ open, onClose, onSave, indicator, savedResult = {} }) => {
  const [activeTab, setActiveTab] = useState(0); // 📌 Controla la pestaña activa

  const [formData, setFormData] = useState({
    confiableSem1: savedResult?.confiableSem1 ?? "",
    confiableSem2: savedResult?.confiableSem2 ?? "",
    condicionadoSem1: savedResult?.condicionadoSem1 ?? "",
    condicionadoSem2: savedResult?.condicionadoSem2 ?? "",
    noConfiableSem1: savedResult?.noConfiableSem1 ?? "",
    noConfiableSem2: savedResult?.noConfiableSem2 ?? "",
  });

  useEffect(() => {
    if (open) {
      console.log("📌 Modal Evaluación de Proveedores abierto, savedResult:", savedResult);

      const resultado = savedResult.resultado || {}; // Asegurar que extraemos los valores correctos

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




  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSave = () => {
    const resultData = {
      confiableSem1: Number(formData.confiableSem1),
      confiableSem2: Number(formData.confiableSem2),
      condicionadoSem1: Number(formData.condicionadoSem1),
      condicionadoSem2: Number(formData.condicionadoSem2),
      noConfiableSem1: Number(formData.noConfiableSem1),
      noConfiableSem2: Number(formData.noConfiableSem2),
    };

    console.log("📌 Payload enviado al backend:", resultData);

    if (!indicator || !indicator.idIndicador) {
      console.error("❌ Error: idIndicador está indefinido.");
      return;
    }

    onSave(indicator.idIndicador, { result: resultData });
    onClose();
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitleCustom
        title={`Registrar Resultado`}
        subtitle={`${indicator?.nombreIndicador || indicator?.name || ''} - Origen: ${indicator?.origenIndicador || 'Sin origen'}`}
      />
      <DialogContent>
        {/* 📌 Tabs para cambiar entre semestres */}
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Ene-Jun" />
          <Tab label="Jul-Dic" />
        </Tabs>

        {/* 📌 Contenido dinámico de cada pestaña */}
        <EvaluaContent formData={formData} setFormData={setFormData} activeTab={activeTab} />
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

export default ResultModalEvaluaProveedores;
