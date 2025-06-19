import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  Slide
} from "@mui/material";
import DialogTitleCustom from "../TitleDialog";
import CustomButton from "../Button";

// Animación de entrada para el Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const IndicadorForm = ({
  open,
  onClose,
  onSave,
  formData,
  setFormData,
  errors = {},
  modo = "crear" // "crear" o "editar"
}) => {
  

  const handleSave = () => {
    onSave();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
      >
        {/* Título */}
        <DialogTitleCustom
          title={modo === "editar" ? "Editar Indicador" : "Agregar Nuevo Indicador"}
          subtitle="Complete todos los campos para continuar"
        />

        {/* Formulario */}
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
            <TextField
              label="Descripción"
              fullWidth
              multiline
              minRows={3}
              variant="outlined"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              error={!!errors.descripcion}
              helperText={errors.descripcion}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Fórmula"
              fullWidth
              multiline
              minRows={3}
              variant="outlined"
              value={formData.formula}
              onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
              error={!!errors.formula}
              helperText={errors.formula}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Período"
              fullWidth
              select
              variant="outlined"
              value={formData.periodo}
              onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
              error={!!errors.periodo}
              helperText={errors.periodo}
            >
              <MenuItem value="Semestral">Semestral</MenuItem>
              <MenuItem value="Trimestral">Trimestral</MenuItem>
              <MenuItem value="Anual">Anual</MenuItem>
            </TextField>
            <TextField
              label="Responsable"
              fullWidth
              variant="outlined"
              value={formData.responsable}
              onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Meta (número)"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.meta}
              onChange={(e) => setFormData({ ...formData, meta: e.target.value })}
              inputProps={{ min: 1, max: 10 }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>

        {/* Botones */}
        <DialogActions sx={{ justifyContent: "center", padding: 2 }}>
          <CustomButton type="cancelar" onClick={handleClose}>
            Cancelar
          </CustomButton>
          <CustomButton type="guardar" onClick={handleSave}>
            Guardar Indicador
          </CustomButton>
        </DialogActions>
      </Dialog>

    
    </>
  );
};

export default IndicadorForm;
