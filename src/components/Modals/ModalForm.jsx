import React from "react";
import { Dialog, DialogTitle, DialogContent, Grid, TextField } from "@mui/material";
import DialogActionButtons from "../DialogActionButtons";

const ModalForm = ({
  showModal,
  setShowModal,
  additionalFormData,
  handleAdditionalChange,
  handleAddOrUpdateRecord,
  isAdditionalFormValid,
  editIndex
}) => {
  return (
    <Dialog open={showModal} onClose={() => setShowModal(false)}>
      <DialogTitle>
        {editIndex !== null ? "Editar Registro" : "Agregar Registro"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {[
            "numero",
            "fuente",
            "elementoEntrada",
            "descripcionActividad",
            "entregable",
            "responsable",
            "fechaInicio",
            "fechaTermino",
            "estado"
          ].map((field, index) => (
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
          <Grid item xs={12}>
            <DialogActionButtons
              onCancel={() => setShowModal(false)}
              onSave={handleAddOrUpdateRecord}
              saveText={editIndex !== null ? "Actualizar" : "Guardar"}
              cancelText="Cancelar"
              saveColor="terciary.main"
              cancelColor="primary.main"
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ModalForm;
