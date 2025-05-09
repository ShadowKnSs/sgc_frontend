import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogActions, TextField, Grid, Box } from "@mui/material";
import DialogActionButtons from "../DialogActionButtons";
import DialogTitleCustom from "../TitleDialog";

const RetroalimentacionContent = ({ formData, setFormData }) => (
  <Box component="form" sx={{ mt: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="Felicitaciones"
          type="number"
          fullWidth
          value={formData.felicitaciones || ""}
          onChange={(e) => setFormData({ ...formData, felicitaciones: e.target.value })}
          margin="dense"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Quejas"
          type="number"
          fullWidth
          value={formData.quejas || ""}
          onChange={(e) => setFormData({ ...formData, quejas: e.target.value })}
          margin="dense"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Sugerencias"
          type="number"
          fullWidth
          value={formData.sugerencias || ""}
          onChange={(e) => setFormData({ ...formData, sugerencias: e.target.value })}
          margin="dense"
        />
      </Grid>
    </Grid>
  </Box>
);

const ResultModalRetroalimentacion = ({ open, onClose, onSave, indicator, savedResult = {} }) => {
  const [formData, setFormData] = useState({
    felicitaciones: "",
    quejas: "",
    sugerencias: "",
  });

  useEffect(() => {
    if (open) {
      console.log("📌 Datos recibidos en modal Retroalimentación:", savedResult);

      if (!savedResult || Object.keys(savedResult).length === 0) {
        console.warn("⚠️ No se encontraron datos en savedResult.");
        return;
      }

      const resultado = savedResult || {};

      setFormData({
        felicitaciones: resultado.cantidadFelicitacion?.toString() ?? "",
        quejas: resultado.cantidadQueja?.toString() ?? "",
        sugerencias: resultado.cantidadSugerencia?.toString() ?? "",
      });
    }
  }, [open, savedResult]);



  const handleSave = () => {
    const resultData = {
      cantidadFelicitacion: Number(formData.felicitaciones),
      cantidadSugerencia: Number(formData.sugerencias),
      cantidadQueja: Number(formData.quejas),
    };

    console.log("📌 Payload que se enviará:", resultData);
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
        <RetroalimentacionContent formData={formData} setFormData={setFormData} />
      </DialogContent>
      <DialogActions>
        <DialogActionButtons onCancel={onClose} onSave={handleSave} saveText="Guardar" cancelText="Cancelar" saveColor="terciary.main"
          cancelColor="primary.main" />
      </DialogActions>
    </Dialog>
  );
};

export default ResultModalRetroalimentacion;
