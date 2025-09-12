import React, { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import CustomButton from "./Button";
import FeedbackSnackbar from "./Feedback";

const InformeAudPlazos = ({ plazos, setPlazos, label = "Plazos y Consideraciones:" }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, type: "info", title: "", message: "" });
  const maxChars = 512;

  const showSnackbar = (type, title, message) =>
    setSnackbar({ open: true, type, title, message });

  const handleChange = (index, value) => {
    const nuevosPlazos = [...plazos];
    nuevosPlazos[index] = value;
    setPlazos(nuevosPlazos);

    setTouched(prev => ({ ...prev, [index]: true }));
    setErrors(prev => ({
      ...prev,
      [index]: value.trim() === "" ? "Campo obligatorio" : ""
    }));
  };

  const agregarPlazo = () => {
    let hayError = false;
    plazos.forEach((p, i) => {
      if (!p.trim()) hayError = true;
    });
    if (hayError) {
      showSnackbar("error", "Error de validación", "Todos los plazos existentes deben estar completos antes de agregar uno nuevo");
      return;
    }
    setPlazos([...plazos, ""]);
  };

  const eliminarPlazo = (index) => {
    if (plazos.length === 1) {
      showSnackbar("error", "Error", "Debe existir al menos un plazo");
      return;
    }
    const nuevosPlazos = plazos.filter((_, i) => i !== index);
    setPlazos(nuevosPlazos);
  };

  return (
    <Box mt={3}>
      {label && (
        <Typography variant="body1" gutterBottom>
          <strong>{label}</strong>
        </Typography>
      )}

      {plazos.map((plazo, index) => (
        <Box key={index} mt={1}>
          <TextField
            fullWidth
            multiline
            minRows={1}
            maxRows={10}
            variant="outlined"
            value={plazo}
            onChange={(e) => handleChange(index, e.target.value)}
            error={Boolean(errors[index])}
            helperText={errors[index] ? errors[index] : null}
            inputProps={{ maxLength: maxChars }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#fff",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: errors[index] ? "red" : "#ccc",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: errors[index] ? "red" : "#004A98",
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{ display: "block", textAlign: "right", color: "text.secondary", mt: 0.5 }}
          >
            {plazo.length}/{maxChars}
          </Typography>

          {/* Botones solo debajo del último */}
          {index === plazos.length - 1 && (
            <Box display="flex" justifyContent="flex-end" mt={1}>
              {plazos.length > 1 && (
                <CustomButton
                  type="cancelar"
                  sx={{ mr: 1 }}
                  onClick={() => eliminarPlazo(index)}
                >
                  Eliminar
                </CustomButton>
              )}
              <CustomButton color="primary" onClick={agregarPlazo}>
                Agregar
              </CustomButton>
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

export default InformeAudPlazos;
