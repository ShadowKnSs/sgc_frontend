import React, { useState, forwardRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  MenuItem,
  Snackbar,
  Slide,
  Alert
} from "@mui/material";
import DialogActionButtons from "../DialogActionButtons";

// Componente de transición para el Dialog
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalForm = ({
  showModal,
  setShowModal,
  additionalFormData,
  handleAdditionalChange,
  handleAddOrUpdateRecord,
  isAdditionalFormValid,
  editIndex,
  autoNumero // Se puede pasar desde el padre, por ejemplo, records.length+1
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Si se está creando un registro nuevo, y no existe numero en additionalFormData,
  // asignamos el valor de autoNumero.
  useEffect(() => {
    if (editIndex === null && !additionalFormData.numero && autoNumero) {
      handleAdditionalChange({
        target: { name: "numero", value: autoNumero }
      });
    }
    // Si se está editando, se supone que additionalFormData.numero ya viene establecido.
  }, [editIndex, additionalFormData, autoNumero, handleAdditionalChange]);

  // Campos de la tabla fuentept en el orden solicitado:
  // 1. Nombre de la Fuente  
  // 2. Elemento de entrada  
  // 3. Descripción  
  // 4. Entregable  
  // 5. Responsable  
  // 6. Fecha de Inicio  
  // 7. Fecha de Término  
  // 8. Estado (select: En proceso, Cerrado)
  const fields = [
    { key: "nombreFuente", label: "Nombre de la Fuente", type: "text" },
    { key: "elementoEntrada", label: "Elemento de Entrada", type: "text" },
    { key: "descripcion", label: "Descripción", type: "text" },
    { key: "entregable", label: "Entregable", type: "text" },
    { key: "responsable", label: "Responsable", type: "text" },
    { key: "fechaInicio", label: "Fecha de Inicio", type: "date" },
    { key: "fechaTermino", label: "Fecha de Término", type: "date" },
    { key: "estado", label: "Estado", type: "select", options: ["En proceso", "Cerrado"] }
  ];

  const handleSaveClick = () => {
    if (!isAdditionalFormValid()) {
      setSnackbarMessage("Por favor, complete todos los campos.");
      setSnackbarOpen(true);
      return;
    }
    handleAddOrUpdateRecord();
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editIndex !== null ? "Editar Registro" : "Agregar Registro"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Campo para número de actividad (solo lectura) */}
            <Grid item xs={12}>
              <TextField
                label="Número de Actividad"
                name="numero"
                value={additionalFormData.numero || ""}
                onChange={handleAdditionalChange}
                fullWidth
                margin="dense"
                disabled
              />
            </Grid>
            {fields.map((fieldObj, index) => {
              if (fieldObj.type === "date") {
                return (
                  <Grid item xs={12} key={index}>
                    <TextField
                      label={fieldObj.label}
                      name={fieldObj.key}
                      type="date"
                      value={additionalFormData[fieldObj.key] || ""}
                      onChange={handleAdditionalChange}
                      fullWidth
                      margin="dense"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                );
              }
              if (fieldObj.type === "select") {
                return (
                  <Grid item xs={12} key={index}>
                    <TextField
                      select
                      label={fieldObj.label}
                      name={fieldObj.key}
                      value={additionalFormData[fieldObj.key] || (editIndex === null ? "En proceso" : "")}
                      onChange={handleAdditionalChange}
                      fullWidth
                      margin="dense"
                    >
                      {fieldObj.options.map((option, idx) => (
                        <MenuItem key={idx} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                );
              }
              return (
                <Grid item xs={12} key={index}>
                  <TextField
                    label={fieldObj.label}
                    name={fieldObj.key}
                    value={additionalFormData[fieldObj.key] || ""}
                    onChange={handleAdditionalChange}
                    fullWidth
                    margin="dense"
                  />
                </Grid>
              );
            })}
            <Grid item xs={12}>
              <DialogActionButtons
                onCancel={() => setShowModal(false)}
                onSave={handleSaveClick}
                saveText={editIndex !== null ? "Actualizar" : "Guardar"}
                cancelText="Cancelar"
                saveColor="terciary.main"
                cancelColor="primary.main"
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModalForm;
