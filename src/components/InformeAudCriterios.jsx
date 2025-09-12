import React, { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import CustomButton from "./Button";
import FeedbackSnackbar from "./Feedback";

const InformeAudCriterios = ({ criterios, setCriterios, label = "Criterios:" }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, type: "info", title: "", message: "" });

  const showSnackbar = (type, title, message) =>
    setSnackbar({ open: true, type, title, message });

  const handleChange = (index, value) => {
    const nuevosCriterios = [...criterios];
    nuevosCriterios[index] = value;
    setCriterios(nuevosCriterios);

    setTouched(prev => ({ ...prev, [index]: true }));
    setErrors(prev => ({
      ...prev,
      [index]: value.trim() === "" ? "Campo obligatorio" : ""
    }));
  };

  const agregarCriterio = () => {
    // Validar que todos los criterios existentes estén completos
    let hayError = false;
    criterios.forEach((c, i) => {
      if (!c.trim()) hayError = true;
    });
    if (hayError) {
      showSnackbar("error", "Error de validación", "Todos los criterios existentes deben estar completos antes de agregar uno nuevo");
      return;
    }
    setCriterios([...criterios, ""]);
  };

  const eliminarCriterio = (index) => {
    if (criterios.length === 1) {
      showSnackbar("error", "Error", "Debe existir al menos un criterio");
      return;
    }
    const nuevosCriterios = criterios.filter((_, i) => i !== index);
    setCriterios(nuevosCriterios);
  };

  return (
    <Box mt={3}>
      {label && (
        <Typography variant="body1" gutterBottom>
          <strong>{label}</strong>
        </Typography>
      )}
      {criterios.map((criterio, index) => (
        <Box key={index} mt={1}>
          <TextField
            fullWidth
            multiline
            minRows={1}
            maxRows={10}
            variant="outlined"
            value={criterio}
            onChange={(e) => handleChange(index, e.target.value)}
            error={Boolean(errors[index])}
            helperText={errors[index]}
          />

          {/* Botones solo debajo del último campo */}
          {index === criterios.length - 1 && (
            <Box display="flex" justifyContent="flex-end" mt={1}>
              <CustomButton color="primary" onClick={agregarCriterio}>
                Agregar
              </CustomButton>
              {criterios.length > 1 && (
                <CustomButton
                  type="cancelar"
                  sx={{ ml: 1 }}
                  onClick={() => eliminarCriterio(index)}
                >
                  Eliminar
                </CustomButton>
              )}
            </Box>
          )}
        </Box>
      ))}

      <FeedbackSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        type={snackbar.type}
        title={snackbar.title}
        message={snackbar.message}
      />
    </Box>
  );
};

export default InformeAudCriterios;
