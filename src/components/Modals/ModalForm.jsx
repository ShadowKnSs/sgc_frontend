import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField } from "@mui/material";

const ModalForm = ({ showModal, setShowModal, additionalFormData, handleAdditionalChange, handleAddOrUpdateRecord, isAdditionalFormValid, editIndex }) => {
  return (
    <Dialog open={showModal} onClose={() => setShowModal(false)}>
      <DialogTitle>{editIndex !== null ? "Editar Registro" : "Agregar Registro"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {["numero", "fuente", "elementoEntrada", "descripcionActividad", "entregable", "responsable", "fechaInicio", "fechaTermino", "estado"].map((field, index) => (
            <Grid item xs={12} key={index}>
              <TextField
                label={field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                name={field}
                value={additionalFormData[field]}
                onChange={handleAdditionalChange}
                fullWidth
                margin="dense"
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowModal(false)} color="error">
          Cancelar
        </Button>
        <Button onClick={handleAddOrUpdateRecord} color="primary" disabled={!isAdditionalFormValid()}>
          {editIndex !== null ? "Actualizar" : "Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalForm;