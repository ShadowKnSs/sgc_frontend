import React from "react";
import {
  Box,
  Modal,
  IconButton,
  TextField,
  Grid
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomButton from "../Button";
import TitleDialog from "../TitleDialog";

const RiesgoModal = ({
  open,
  onClose,
  isEditing,
  currentSection,
  onAnterior,
  onSiguiente,
  onGuardar,
  nuevoRiesgo,
  onChange,
  sections
}) => {
  const field = (label, name, options = {}) => (
    <TextField
      fullWidth
      variant="outlined"
      label={label}
      name={name}
      value={options.value ?? nuevoRiesgo[name] ?? ""}
      onChange={onChange}
      disabled={options.disabled}
      multiline={options.multiline}
      minRows={options.minRows || 1}
      type={options.type || "text"}
      InputLabelProps={options.InputLabelProps}
      sx={{ mb: 2 }}
    />
  );

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <>
            {field("Fuente", "fuente")}
            {field("Tipo de Riesgo", "tipoRiesgo")}
            {field("Descripción", "descripcion", { multiline: true, minRows: 3 })}
          </>
        );
      case 1:
        return (
          <>
            {field("Consecuencias", "consecuencias")}
            {field("Severidad", "valorSeveridad", { type: "number" })}
            {field("Ocurrencia", "valorOcurrencia", { type: "number" })}
            {field("NRP", "valorNRP", {
              type: "number",
              disabled: true,
              value: nuevoRiesgo.valorOcurrencia * nuevoRiesgo.valorSeveridad || ""
            })}
          </>
        );
      case 2:
        return (
          <>
            {field("Actividades", "actividades", {
              multiline: true,
              minRows: 3,
              disabled: true,
              variant: "filled",
              sx: { backgroundColor: "#f5f5f5" }
            })}

            {field("Acción de Mejora", "accionMejora", {
              disabled: true,
              variant: "filled",
              sx: { backgroundColor: "#f5f5f5" }
            })}

            {field("Fecha de Implementación", "fechaImp", {
              type: "date",
              InputLabelProps: { shrink: true }
            })}

            {field("Fecha de Evaluación", "fechaEva", {
              type: "date",
              InputLabelProps: { shrink: true }
            })}

            {field("Responsable", "responsable", {
              disabled: true,
              variant: "filled",
              sx: { backgroundColor: "#f5f5f5" }
            })}
          </>
        );

      case 3:
        const valorNRP = nuevoRiesgo.valorOcurrencia * nuevoRiesgo.valorSeveridad || 0;
        const reevaluacionNRP = nuevoRiesgo.reevaluacionOcurrencia * nuevoRiesgo.reevaluacionSeveridad || 0;
        const efectividad = reevaluacionNRP < valorNRP ? "Mejoró" : "No mejoró";

        return (
          <>
            {field("Reevaluación Severidad", "reevaluacionSeveridad", { type: "number" })}
            {field("Reevaluación Ocurrencia", "reevaluacionOcurrencia", { type: "number" })}
            {field("Reevaluación NRP", "reevaluacionNRP", {
              type: "number",
              disabled: true,
              value: reevaluacionNRP
            })}
            {field("Reevaluación Efectividad", "reevaluacionEfectividad", {
              disabled: true,
              value: efectividad
            })}
            {field("Análisis de Efectividad", "analisisEfectividad")}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 640,
          bgcolor: "#fff",
          boxShadow: 6,
          p: 4,
          borderRadius: 3,
          outline: "none",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "#999",
            "&:hover": { color: "#333" }
          }}
        >
          <CloseIcon />
        </IconButton>

        <TitleDialog
          title={isEditing ? "Editar Riesgo" : "Nuevo Riesgo"}
          subtitle={sections[currentSection]}
        />

        <Box mt={2}>
          {renderSection()}
        </Box>

        <Grid container spacing={2} justifyContent="space-between" mt={3}>
          {currentSection > 0 && (
            <Grid item>
              <CustomButton type="cancelar" onClick={onAnterior}>
                Anterior
              </CustomButton>
            </Grid>
          )}
          <Grid item ml="auto">
            {currentSection < 3 ? (
              <CustomButton type="aceptar" onClick={onSiguiente}>
                Siguiente
              </CustomButton>
            ) : (
              <CustomButton type="guardar" onClick={onGuardar}>
                {isEditing ? "Actualizar" : "Guardar"}
              </CustomButton>
            )}
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default RiesgoModal;
