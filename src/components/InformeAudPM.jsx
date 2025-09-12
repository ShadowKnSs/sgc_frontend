import React, { useState } from "react";
import { Box, Grid, TextField, Typography } from "@mui/material";
import CustomButton from "./Button";
import FeedbackSnackbar from "./Feedback";

const InformeAudPM = ({ puntosMejora, setPuntosMejora }) => {
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, type: "info", title: "", message: "" });
  const maxChars = 512;

  const showSnackbar = (type, title, message) =>
    setSnackbar({ open: true, type, title, message });

  const handleChange = (index, campo, value) => {
    const nuevos = [...puntosMejora];
    nuevos[index][campo] = value;
    setPuntosMejora(nuevos);

    setErrors(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [campo]: value.trim() === "" ? "Campo obligatorio" : ""
      }
    }));
  };

  const agregarPuntoMejora = () => {
    const ultimo = puntosMejora[puntosMejora.length - 1];
    if (!ultimo.reqISO || !ultimo.descripcion || !ultimo.evidencia) {
      showSnackbar("error", "Error de validación", "Todos los campos del punto de mejora deben estar completos antes de agregar uno nuevo");
      return;
    }
    setPuntosMejora([...puntosMejora, { reqISO: "", descripcion: "", evidencia: "" }]);
  };

  const eliminarPuntoMejora = (index) => {
    if (puntosMejora.length === 1) {
      showSnackbar("error", "Error", "Debe existir al menos un punto de mejora");
      return;
    }
    setPuntosMejora(puntosMejora.filter((_, i) => i !== index));
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        <strong>Puntos de Mejora Detectados</strong>
      </Typography>

      <Box width="100%" mt={2}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Typography variant="body1" sx={{ fontSize: "0.875rem", whiteSpace: "nowrap", textAlign: "center" }}>
              <strong>Req. ISO 9001:2015</strong>
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="body1" sx={{ fontSize: "0.875rem", whiteSpace: "nowrap", textAlign: "center" }}>
              <strong>Descripción del Punto de Mejora</strong>
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="body1" sx={{ fontSize: "0.875rem", whiteSpace: "nowrap", textAlign: "center" }}>
              <strong>Evidencia Objetiva</strong>
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {puntosMejora.map((punto, index) => (
        <Box key={index} width="100%" mt={2}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <TextField
                fullWidth
                size="small"
                label="Req. ISO"
                value={punto.reqISO}
                onChange={(e) => handleChange(index, "reqISO", e.target.value)}
                error={Boolean(errors[index]?.reqISO)}
                helperText={errors[index]?.reqISO || ""}
                inputProps={{ maxLength: maxChars }}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                size="small"
                label="Descripción"
                multiline
                value={punto.descripcion}
                onChange={(e) => handleChange(index, "descripcion", e.target.value)}
                error={Boolean(errors[index]?.descripcion)}
                inputProps={{ maxLength: maxChars }}
              />
              <Typography variant="caption" sx={{ display: "block", textAlign: "right", color: "text.secondary", mt: 0.5 }}>
                {punto.descripcion?.length || 0}/{maxChars}
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                size="small"
                label="Evidencia"
                multiline
                value={punto.evidencia}
                onChange={(e) => handleChange(index, "evidencia", e.target.value)}
                error={Boolean(errors[index]?.evidencia)}
                inputProps={{ maxLength: maxChars }}
              />
              <Typography variant="caption" sx={{ display: "block", textAlign: "right", color: "text.secondary", mt: 0.5 }}>
                {punto.evidencia?.length || 0}/{maxChars}
              </Typography>
            </Grid>
          </Grid>

          {/* Botones solo debajo del último */}
          {index === puntosMejora.length - 1 && (
            <Box display="flex" justifyContent="flex-end" mt={1}>
              {puntosMejora.length > 1 && (
                <CustomButton type="cancelar" sx={{ mr: 1 }} onClick={() => eliminarPuntoMejora(index)}>
                  Eliminar
                </CustomButton>
              )}
              <CustomButton color="primary" onClick={agregarPuntoMejora}>
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

export default InformeAudPM;
