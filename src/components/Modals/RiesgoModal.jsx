import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  IconButton,
  TextField,
  Grid,
  FormHelperText,
  Typography
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
  sections,
  errors = {}
}) => {
  const [characterCount, setCharacterCount] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Inicializar contador de caracteres
    const initialCounts = {};
    Object.keys(nuevoRiesgo).forEach(key => {
      if (typeof nuevoRiesgo[key] === 'string') {
        initialCounts[key] = nuevoRiesgo[key].length;
      }
    });
    setCharacterCount(initialCounts);
  }, [nuevoRiesgo]);


  const handleGuardarClick = async () => {
    try {
      setSaving(true);
      await onGuardar(); // tu función ya existente (puede ser async)
    } finally {
      setSaving(false);
    }
  };
  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    // Actualizar contador de caracteres
    setCharacterCount(prev => ({
      ...prev,
      [name]: value.length
    }));

    // Propagamos el cambio
    onChange(e);
  };

  const field = (label, name, options = {}) => {
    const maxLength = options.maxLength || 255;
    const isError = errors[name] && errors[name] !== "";
    const currentCount = characterCount[name] || 0;

    return (
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          label={label}
          name={name}
          value={options.value ?? nuevoRiesgo[name] ?? ""}
          onChange={handleFieldChange}
          disabled={options.disabled}
          multiline={options.multiline}
          minRows={options.minRows || 1}
          type={options.type || "text"}
          InputLabelProps={options.InputLabelProps}
          error={isError}
          helperText={isError ? errors[name] : ""}
          inputProps={{
            maxLength: maxLength,
            ...options.inputProps
          }}
        />
        {options.multiline && (
          <FormHelperText sx={{ textAlign: 'right' }}>
            {currentCount}/{maxLength} caracteres
          </FormHelperText>
        )}
      </Box>
    );
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <>
            {field("Fuente", "fuente", {
              maxLength: 100,
              helperText: "Origen del riesgo (proceso, actividad, etc.)"
            })}
            {field("Tipo de Riesgo", "tipoRiesgo", {
              maxLength: 100,
              helperText: "Clasificación del riesgo"
            })}
            {field("Descripción", "descripcion", {
              multiline: true,
              minRows: 3,
              maxLength: 500,
              helperText: "Describa detalladamente el riesgo identificado"
            })}
          </>
        );
      case 1:
        return (
          <>
            {field("Consecuencias", "consecuencias", {
              maxLength: 255,
              helperText: "Impacto potencial del riesgo"
            })}
            {field("Severidad (1-100)", "valorSeveridad", {
              type: "number",
              inputProps: { min: 1, max: 100 },
              helperText: "Evalúe la severidad del impacto (1=mínimo, 100=máximo)"
            })}
            {field("Ocurrencia (1-100)", "valorOcurrencia", {
              type: "number",
              inputProps: { min: 1, max: 100 },
              helperText: "Probabilidad de ocurrencia (1=baja, 100=alta)"
            })}
            {field("NRP", "valorNRP", {
              type: "number",
              disabled: true,
              value: (nuevoRiesgo.valorOcurrencia || 0) * (nuevoRiesgo.valorSeveridad || 0),
              helperText: "Nivel de Riesgo Prioritario (Severidad × Ocurrencia)"
            })}
          </>
        );
      default:
        return null;
    }
  };

  // Para creación nueva, solo mostramos las primeras 2 secciones
  const showNavigation = !isEditing || currentSection < 2;
  const canProceed = currentSection === 0 ?
    (nuevoRiesgo.tipoRiesgo && nuevoRiesgo.descripcion) :
    (nuevoRiesgo.valorSeveridad && nuevoRiesgo.valorOcurrencia);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 640,
          maxHeight: "90vh",
          overflowY: "auto",
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
            {currentSection < 1 ? (
              <CustomButton
                type="aceptar"
                onClick={onSiguiente}
                disabled={!canProceed}
              >
                Siguiente
              </CustomButton>
            ) : (
              <CustomButton
                type="guardar"
                onClick={handleGuardarClick}
                disabled={!canProceed}
                loading={saving}
              >
                {isEditing ? "Actualizar" : "Guardar"}
              </CustomButton>

            )}
          </Grid>
        </Grid>

        {!isEditing && (
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
            Nota: Los campos de Tratamiento y Evaluación se completarán automáticamente
            desde el Plan de Trabajo después de guardar este riesgo.
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default RiesgoModal;