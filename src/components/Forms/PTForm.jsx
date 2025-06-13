import React, { useEffect, useState } from "react";
import {
  TextField,
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Tooltip,
  Typography,
  Stack
} from "@mui/material";
import { Edit, Person, CalendarMonth } from "@mui/icons-material";

const PTForm = ({ formData, handleChange, soloLectura, puedeEditar, rolActivo }) => {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const userName = usuario?.nombre || "";
  const fechaHoy = new Date().toISOString().split("T")[0];

  const [editable, setEditable] = useState({
    responsable: false,
    objetivo: false,
  });

  // Función para formatear fecha del backend a DD/MM/YYYY
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
    const date = new Date(fechaStr);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  useEffect(() => {
    if (rolActivo === "Lider") {
      if (!formData.fechaElaboracion) {
        handleChange({ target: { name: "fechaElaboracion", value: fechaHoy } });
      }
      if (!formData.elaboradoPor) {
        handleChange({ target: { name: "elaboradoPor", value: userName } });
      }
    }

    if (rolActivo === "Coordinador" || rolActivo === "Supervisor") {
      if (!formData.revisadoPor) {
        handleChange({ target: { name: "revisadoPor", value: userName } });
      }
      if (!formData.fechaRevision) {
        handleChange({ target: { name: "fechaRevision", value: fechaHoy } });
      }
    }
  }, [rolActivo, handleChange]);

  const enableEdit = (campo) => {
    if (!soloLectura && puedeEditar) {
      setEditable((prev) => ({ ...prev, [campo]: true }));
    }
  };

  const InfoDisplay = ({ icon, label, value }) => (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
      {icon}
      <Typography variant="body1">
        <strong>{label}:</strong> {value || "No disponible"}
      </Typography>
    </Stack>
  );

  return (
    <Box
      sx={{
        p: 3,
        boxShadow: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
        mb: 3,
        width: "75%",
        mx: "auto",
      }}
    >
      <Grid container spacing={3}>
        {/* === Columna izquierda === */}
        <Grid item xs={12} md={6}>
          <InfoDisplay
            icon={<Person sx={{ color: "#185FA4" }} />}
            label="Responsable"
            value={formData.responsable}
          />

          <InfoDisplay
            icon={<CalendarMonth sx={{ color: "#185FA4" }} />}
            label="Fecha de Elaboración"
            value={formatearFecha(formData.fechaElaboracion)}
          />
        </Grid>

        {/* === Columna derecha === */}
        <Grid item xs={12} md={6}>
          <InfoDisplay
            icon={<Person sx={{ color: "#185FA4" }} />}
            label="Revisado por"
            value={formData.revisadoPor}
          />

          <InfoDisplay
            icon={<CalendarMonth sx={{ color: "#185FA4" }} />}
            label="Fecha de Revisión"
            value={formatearFecha(formData.fechaRevision)}
          />
        </Grid>

        {/* === Objetivo, centrado en 2 columnas === */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Objetivo"
            name="objetivo"
            value={formData.objetivo}
            onChange={handleChange}
            margin="normal"
            multiline
            InputProps={{
              readOnly: !editable.objetivo || soloLectura || !puedeEditar,
              endAdornment: !editable.objetivo && puedeEditar && (
                <InputAdornment position="end">
                  <Tooltip title="Editar">
                    <IconButton onClick={() => enableEdit("objetivo")} sx={{ color: "#68A2C9" }}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PTForm;
