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

  // Nombre completo (si hay apellidos en el storage)
  const fullName = [
    usuario?.nombre,
    usuario?.apellidoPat,
    usuario?.apellidoMat
  ].filter(Boolean).join(" ") || "";

  const fechaHoy = new Date().toISOString().split("T")[0];

  // Soporte para rolActivo como string u objeto { nombreRol: "Líder" }
  const rolNombre = (typeof rolActivo === "string" ? rolActivo : rolActivo?.nombreRol) || "";

  // Normaliza acentos para comparar “Líder” == “Lider”
  const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const [editable, setEditable] = useState({
    responsable: false,
    objetivo: false,
  });

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
    const date = new Date(fechaStr);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
    // Si tu backend ya manda YYYY-MM-DD, esto funciona bien.
  };

  // Helper para llamar a tu handleChange con la misma forma que esperas
  const setField = (name, value) =>
    handleChange?.({ target: { name, value } });

  useEffect(() => {
    // Si es Líder -> setear elaboradoPor y fechaElaboracion por defecto
    if (norm(rolNombre) === "lider") {
      if (!formData?.fechaElaboracion) {
        setField("fechaElaboracion", fechaHoy);
      }
      if (!formData?.elaboradoPor) {
        setField("elaboradoPor", fullName);
      }
    }

    // Si es Coordinador o Supervisor -> setear revisadoPor y fechaRevision por defecto
    if (["coordinador", "supervisor"].includes(norm(rolNombre))) {
      if (!formData?.revisadoPor) {
        setField("revisadoPor", fullName);
      }
      if (!formData?.fechaRevision) {
        setField("fechaRevision", fechaHoy);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolNombre]); // no hace falta depender de formData/handleChange para evitar loops

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
          {/* 👇 Muestra explícitamente “Elaboró” */}
          <InfoDisplay
            icon={<Person sx={{ color: "#185FA4" }} />}
            label="Elaboró"
            value={formData.elaboradoPor}
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
            value={formData.objetivo || ""}
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
