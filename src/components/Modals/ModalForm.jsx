import React, { useState, forwardRef, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  Grid,
  TextField,
  MenuItem,
  Snackbar,
  Slide,
  Alert,
  CircularProgress,
  Box,
  Typography
} from "@mui/material";
import DialogTitleCustom from "../TitleDialog";
import CustomButton from "../Button";

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
  autoNumero,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [fechaError, setFechaError] = useState("");
  const [errores, setErrores] = useState({});
  const fieldRefs = useRef({});

  const camposObligatorios = [
    "nombreFuente",
    "elementoEntrada",
    "descripcion",
    "entregable",
    "responsable",
    "fechaInicio",
    "fechaTermino",
  ];

  useEffect(() => {
    if (editIndex === null && !additionalFormData.numero && autoNumero) {
      handleAdditionalChange({ target: { name: "numero", value: autoNumero } });
      handleAdditionalChange({ target: { name: "estado", value: "En proceso" } });
    }
  }, [editIndex, additionalFormData, autoNumero, handleAdditionalChange]);

  useEffect(() => {
    const inicio = new Date(additionalFormData.fechaInicio);
    const termino = new Date(additionalFormData.fechaTermino);
    if (
      additionalFormData.fechaInicio &&
      additionalFormData.fechaTermino &&
      inicio > termino
    ) {
      setFechaError("La fecha de inicio no puede ser mayor a la de término.");
    } else {
      setFechaError("");
    }
  }, [additionalFormData.fechaInicio, additionalFormData.fechaTermino]);

  const validarCampos = () => {
    const nuevosErrores = {};

    camposObligatorios.forEach((campo) => {
      if (!additionalFormData[campo]?.trim?.()) {
        nuevosErrores[campo] = "Campo obligatorio";
      }
    });

    const inicio = new Date(additionalFormData.fechaInicio);
    const termino = new Date(additionalFormData.fechaTermino);
    if (
      additionalFormData.fechaInicio &&
      additionalFormData.fechaTermino &&
      inicio > termino
    ) {
      nuevosErrores.fechaInicio = "Fecha inválida";
      nuevosErrores.fechaTermino = "Fecha inválida";
    }

    setErrores(nuevosErrores);

    const camposConError = Object.keys(nuevosErrores);
    if (camposConError.length) {
      setSnackbarMessage("Completa los campos obligatorios.");
      setSnackbarOpen(true);

      const firstErrorField = camposConError[0];
      fieldRefs.current[firstErrorField]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return false;
    }

    return true;
  };

  const handleSaveClick = () => {
    if (!validarCampos()) return;
    setErrores({});

    // 🔄 Normalizar datos antes de enviar al backend
    const dataToSend = {
      ...additionalFormData,
      revisadoPor: additionalFormData.revisadoPor || "",
      fechaRevision: additionalFormData.fechaRevision
        ? new Date(additionalFormData.fechaRevision).toISOString().split("T")[0]
        : null,
    };

    handleAddOrUpdateRecord(dataToSend);
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const fields = [
    { key: "nombreFuente", label: "Nombre de la Fuente", type: "textarea", rows: 2, maxLength: 255 },
    { key: "elementoEntrada", label: "Elemento de Entrada", type: "textarea", rows: 5 },
    { key: "descripcion", label: "Descripción", type: "textarea", rows: 4 },
    { key: "entregable", label: "Entregable", type: "textarea", rows: 3 },
    { key: "responsable", label: "Responsable", type: "textarea", rows: 2, maxLength: 512 },
    { key: "fechaInicio", label: "Fecha de Inicio", type: "date" },
    { key: "fechaTermino", label: "Fecha de Término", type: "date" },
  ];

  const isLoading = !additionalFormData || !additionalFormData.numero;

  if (isLoading) {
    return (
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="sm"
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={250}
          flexDirection="column"
        >
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Cargando datos...
          </Typography>
        </Box>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitleCustom
          title={editIndex !== null ? "Editar Registro" : "Agregar Registro"}
          subtitle="Completa los datos de la fuente de información"
        />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Número de Actividad"
                name="numero"
                value={additionalFormData.numero || ""}
                fullWidth
                margin="dense"
                disabled
              />
            </Grid>

            {fields.map((field) => {
              const value = additionalFormData[field.key] || "";
              const isFecha = field.type === "date";
              const isTextarea = field.type === "textarea";

              return (
                <Grid item xs={12} key={field.key} ref={(el) => (fieldRefs.current[field.key] = el)}>
                  <TextField
                    label={field.label}
                    name={field.key}
                    type={isFecha ? "date" : "text"}
                    value={value}
                    onChange={handleAdditionalChange}
                    fullWidth
                    margin="dense"
                    InputLabelProps={isFecha ? { shrink: true } : {}}
                    multiline={isTextarea}
                    rows={field.rows || 1}
                    inputProps={field.maxLength && !isFecha ? { maxLength: field.maxLength } : {}}
                    error={Boolean(errores[field.key])}
                    helperText={
                      errores[field.key]
                        ? errores[field.key]
                        : field.maxLength && !isFecha
                        ? `${value.length}/${field.maxLength}`
                        : isTextarea && !isFecha
                        ? `${value.length} caracteres`
                        : ""
                    }
                  />
                </Grid>
              );
            })}

            {editIndex !== null && (
              <Grid item xs={12}>
                <TextField
                  select
                  label="Estado"
                  name="estado"
                  value={additionalFormData.estado || "En proceso"}
                  onChange={handleAdditionalChange}
                  fullWidth
                  margin="dense"
                >
                  <MenuItem value="En proceso">En proceso</MenuItem>
                  <MenuItem value="Cerrado">Cerrado</MenuItem>
                </TextField>
              </Grid>
            )}

            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <CustomButton type="cancelar" onClick={() => setShowModal(false)}>
                Cancelar
              </CustomButton>
              <CustomButton type="guardar" onClick={handleSaveClick}>
                {editIndex !== null ? "Actualizar" : "Guardar"}
              </CustomButton>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
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
