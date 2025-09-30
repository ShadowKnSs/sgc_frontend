// components/InformeAudVRA.jsx
import React, { useState } from "react";
import { Box, Grid, TextField, Typography, MenuItem } from "@mui/material";
import CustomButton from "./Button";
import FeedbackSnackbar from "./Feedback";

const InformeAudVRA = ({ verificaciones, setVerificaciones }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, type: "info", title: "", message: "" });

  const showSnackbar = (type, title, message) =>
    setSnackbar({ open: true, type, title, message });

  const handleChange = (index, campo, value) => {
    const nuevas = [...verificaciones];
    if(campo === "hallazgo") campo = "tipoHallazgo"; // <- clave
    nuevas[index][campo] = value;
    setVerificaciones(nuevas);

    setTouched(prev => ({ ...prev, [`${index}-${campo}`]: true }));
    setErrors(prev => ({
      ...prev,
      [`${index}-${campo}`]: value.trim() === "" ? "Campo obligatorio" : ""
    }));
  };

  const agregarVerificacion = () => {
    const ultima = verificaciones[verificaciones.length - 1];
    // Validar que todos los campos de la última verificación estén completos
    const campos = ["criterio", "reqAsociado", "observaciones", "evidencia", "tipoHallazgo"];
    const hayError = campos.some(c => !ultima[c]?.trim());

    if (hayError) {
      showSnackbar(
        "error",
        "Error de validación",
        "Debe completar todos los campos de la última verificación antes de agregar una nueva"
      );
      return;
    }

    setVerificaciones([
      ...verificaciones,
      { criterio: "", reqAsociado: "", observaciones: "", evidencia: "", tipoHallazgo: "" }
    ]);
  };

  const eliminarVerificacion = (index) => {
    if (verificaciones.length === 1) {
      showSnackbar("error", "Error", "Debe existir al menos una verificación");
      return;
    }
    setVerificaciones(verificaciones.filter((_, i) => i !== index));
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        <strong>Verificación de Ruta de Auditoría</strong>
      </Typography>

      {verificaciones.map((v, index) => {
        const campos = ["criterio", "reqAsociado", "observaciones", "evidencia", "tipoHallazgo"];
        const errores = {};
        campos.forEach(c => {
          errores[c] = touched[`${index}-${c}`] && !v[c]?.trim() ? "Campo obligatorio" : "";
        });

        return (
          <Box key={index} mt={2} p={2} sx={{ border: "1px solid #ccc", borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={3}
                  label="Criterio"
                  value={v.criterio}
                  onChange={(e) => handleChange(index, "criterio", e.target.value)}
                  error={Boolean(errores.criterio)}
                  helperText={errores.criterio}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={3}
                  label="Req. Asociado"
                  value={v.reqAsociado}
                  onChange={(e) => handleChange(index, "reqAsociado", e.target.value)}
                  error={Boolean(errores.reqAsociado)}
                  helperText={errores.reqAsociado}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={10}
                  label="Observaciones"
                  value={v.observaciones}
                  onChange={(e) => handleChange(index, "observaciones", e.target.value)}
                  error={Boolean(errores.observaciones)}
                  helperText={errores.observaciones}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={10}
                  label="Evidencia"
                  value={v.evidencia}
                  onChange={(e) => handleChange(index, "evidencia", e.target.value)}
                  error={Boolean(errores.evidencia)}
                  helperText={errores.evidencia}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  select
                  fullWidth
                  label="Tipo de Hallazgo"
                  value={v.tipoHallazgo}
                  onChange={(e) => handleChange(index, "tipoHallazgo", e.target.value)}
                  error={Boolean(errores.tipoHallazgo)}
                  helperText={errores.tipoHallazgo}
                >
                  <MenuItem value="NC">NC</MenuItem>
                  <MenuItem value="PM">PM</MenuItem>
                  <MenuItem value="NINGUNO">NINGUNO</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        );
      })}

      <Box display="flex" justifyContent="flex-end" mt={2}>
        {verificaciones.length > 1 && (
          <CustomButton type="cancelar" sx={{ mr: 1 }} onClick={() => eliminarVerificacion(verificaciones.length - 1)}>
            Eliminar
          </CustomButton>
        )}
        <CustomButton color="primary" onClick={agregarVerificacion}>
          Agregar
        </CustomButton>
      </Box>

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

export default InformeAudVRA;
