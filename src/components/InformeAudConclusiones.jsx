import React, { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import CustomButton from "./Button";
import FeedbackSnackbar from "./Feedback";

const InformeAudConclusiones = ({ conclusiones, setConclusiones }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, type: "info", title: "", message: "" });

  const showSnackbar = (type, title, message) =>
    setSnackbar({ open: true, type, title, message });

  const handleChange = (index, campo, value) => {
    const nuevas = [...conclusiones];
    nuevas[index][campo] = value;
    setConclusiones(nuevas);

    setTouched(prev => ({ ...prev, [`${index}-${campo}`]: true }));
    setErrors(prev => ({
      ...prev,
      [`${index}-${campo}`]: value.trim() === "" ? "Campo obligatorio" : ""
    }));
  };

  const agregarConclusion = () => {
    const ultima = conclusiones[conclusiones.length - 1];
    if (!ultima.nombre?.trim() || !ultima.observaciones?.trim()) {
      showSnackbar("error", "Error de validación", "Debe completar todos los campos de la última conclusión antes de agregar una nueva");
      return;
    }
    setConclusiones([...conclusiones, { nombre: "", observaciones: "" }]);
  };

  const eliminarConclusion = (index) => {
    if (conclusiones.length === 1) {
      showSnackbar("error", "Error", "Debe existir al menos una conclusión");
      return;
    }
    setConclusiones(conclusiones.filter((_, i) => i !== index));
  };

  return (
    <Box mt={3}>
      <Typography variant="body1" gutterBottom>
        <strong>Conclusiones Generales:</strong>
      </Typography>

      {conclusiones.map((c, index) => {
        const errores = {
          nombre: touched[`${index}-nombre`] && !c.nombre?.trim() ? "Campo obligatorio" : "",
          observaciones: touched[`${index}-observaciones`] && !c.observaciones?.trim() ? "Campo obligatorio" : "",
        };

        return (
          <Box key={index} mt={2} p={2} sx={{ border: "1px solid #ccc", borderRadius: "8px" }}>
            <TextField
              fullWidth
              multiline
              minRows={1}
              maxRows={10}
              label="Nombre de la conclusión"
              variant="outlined"
              size="small"
              value={c.nombre}
              onChange={(e) => handleChange(index, "nombre", e.target.value)}
              error={Boolean(errores.nombre)}
              helperText={errores.nombre}
            />

            <TextField
              fullWidth
              multiline
              minRows={1}
              maxRows={10}
              label="Observaciones"
              variant="outlined"
              size="small"
              sx={{ mt: 2 }}
              value={c.observaciones}
              onChange={(e) => handleChange(index, "observaciones", e.target.value)}
              error={Boolean(errores.observaciones)}
              helperText={errores.observaciones}
            />

            {index === conclusiones.length - 1 && (
              <Box display="flex" justifyContent="flex-end" mt={1}>
                {conclusiones.length > 1 && (
                  <CustomButton type="cancelar" sx={{ ml: 1 }} onClick={() => eliminarConclusion(index)}>
                    Eliminar
                  </CustomButton>
                )}
                <CustomButton color="primary" onClick={agregarConclusion} sx={{ ml: 1 }}>
                  Agregar
                </CustomButton>
              </Box>
            )}
          </Box>
        );
      })}

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

export default InformeAudConclusiones;
