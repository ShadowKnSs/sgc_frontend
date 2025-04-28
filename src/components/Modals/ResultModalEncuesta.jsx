import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogActions, TextField, Grid, Box,} from '@mui/material';
import DialogActionButtons from '../DialogActionButtons';
import DialogTitleCustom from "../TitleDialog";

const EncuestaContent = ({ formData, setFormData }) => (
  <Box component="form" sx={{ mt: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="No. de Encuestas"
          type="number"
          fullWidth
          value={formData.encuestas || ""}
          onChange={(e) => setFormData({ ...formData, encuestas: e.target.value })}
          margin="dense"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Respuestas Malas"
          type="number"
          fullWidth
          value={formData.malas || ""}
          onChange={(e) => setFormData({ ...formData, malas: e.target.value })}
          margin="dense"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Respuestas Regulares"
          type="number"
          fullWidth
          value={formData.regulares || ""}
          onChange={(e) => setFormData({ ...formData, regulares: e.target.value })}
          margin="dense"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Respuestas Buenas"
          type="number"
          fullWidth
          value={formData.buenas || ""}
          onChange={(e) => setFormData({ ...formData, buenas: e.target.value })}
          margin="dense"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Respuestas Excelentes"
          type="number"
          fullWidth
          value={formData.excelentes || ""}
          onChange={(e) => setFormData({ ...formData, excelentes: e.target.value })}
          margin="dense"
        />
      </Grid>
    </Grid>
  </Box>
);

const ResultModalEncuesta = ({ open, onClose, onSave, indicator, savedResult = {} }) => {
  const [formData, setFormData] = useState({
    encuestas: "",
    malas: "",
    regulares: "",
    buenas: "",
    excelentes: ""
  });

  useEffect(() => {
    if (open) {
      console.log("📌 Modal Encuesta abierto, savedResult:", savedResult);

      const resultado = savedResult.encuesta || {}; // 🔥 Extraemos correctamente los datos anidados

      setFormData({
        encuestas: resultado.noEncuestas?.toString() || "",
        malas: resultado.malo?.toString() || "",
        regulares: resultado.regular?.toString() || "",
        buenas: resultado.bueno?.toString() || "",
        excelentes: resultado.excelente?.toString() || ""
      });
    }
  }, [open, savedResult]);

  const handleSave = () => {
    if (!indicator || !indicator.idIndicador) {
      console.error("❌ Error: No se encontró idIndicador para registrar el resultado.");
      return;
    }

    const resultData = {
      noEncuestas: Number(formData.encuestas),
      malo: Number(formData.malas),
      regular: Number(formData.regulares),
      bueno: Number(formData.buenas),
      excelente: Number(formData.excelentes)
    };

    console.log("📌 Guardando resultado Encuesta para indicador", indicator.idIndicador, "Payload:", resultData);

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
        <EncuestaContent formData={formData} setFormData={setFormData} />
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

export default ResultModalEncuesta;
