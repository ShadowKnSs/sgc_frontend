import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Box
} from "@mui/material";
import DialogActionButtons from "../DialogActionButtons";
import DialogTitleCustom from "../TitleDialog";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

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

const ResultModalRetroalimentacion = ({ open, onClose, onSave, indicator, savedResult = {}, anio }) => {
  const [formData, setFormData] = useState({
    felicitaciones: "",
    quejas: "",
    sugerencias: "",
  });

  useEffect(() => {
    if (open) {
      const resultado = savedResult || {};

      setFormData({
        felicitaciones: resultado.cantidadFelicitacion?.toString() ?? "",
        quejas: resultado.cantidadQueja?.toString() ?? "",
        sugerencias: resultado.cantidadSugerencia?.toString() ?? "",
      });
    }
  }, [open, savedResult]);

  const handleSave = () => {
    if (!indicator?.idIndicador) return;

    const resultData = {
      cantidadFelicitacion: Number(formData.felicitaciones),
      cantidadSugerencia: Number(formData.sugerencias),
      cantidadQueja: Number(formData.quejas),
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

export default ResultModalRetroalimentacion;
