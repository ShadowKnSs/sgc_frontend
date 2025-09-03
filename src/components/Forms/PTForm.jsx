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
  const fullName = [
    usuario?.nombre,
    usuario?.apellidoPat,
    usuario?.apellidoMat
  ].filter(Boolean).join(" ") || "";

  const fechaHoy = new Date().toISOString().split("T")[0];
  const rolNombre = (typeof rolActivo === "string" ? rolActivo : rolActivo?.nombreRol) || "";

  // Función mejorada para normalizar y comparar roles
  const norm = (s) => s?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";

  const [editable, setEditable] = useState({
    responsable: false,
    objetivo: false,
  });

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
    try {
      const date = new Date(fechaStr);
      if (isNaN(date.getTime())) return fechaStr; // Si no es fecha válida, devolver original
      const dia = String(date.getDate()).padStart(2, "0");
      const mes = String(date.getMonth() + 1).padStart(2, "0");
      const anio = date.getFullYear();
      return `${dia}/${mes}/${anio}`;
    } catch (error) {
      return fechaStr;
    }
  };

  const setField = (name, value) =>
    handleChange?.({ target: { name, value } });

  useEffect(() => {
   

    // Solo establecer valores si el usuario tiene permiso para editar
    if (puedeEditar && !soloLectura) {
      // Si es Líder -> setear elaboradoPor y fechaElaboracion
      if (norm(rolNombre) === "lider") {
        if (!formData?.elaboradoPor || formData.elaboradoPor !== fullName) {
          console.log("Estableciendo elaboradoPor:", fullName);
          setField("elaboradoPor", fullName);
        }
        if (!formData?.fechaElaboracion) {
          console.log("Estableciendo fechaElaboracion:", fechaHoy);
          setField("fechaElaboracion", fechaHoy);
        }
      }

      // Si es Coordinador o Supervisor -> setear revisadoPor y fechaRevision
      if (["coordinador", "supervisor"].includes(norm(rolNombre))) {
        if (!formData?.revisadoPor || formData.revisadoPor !== fullName) {
          setField("revisadoPor", fullName);
        }
        if (!formData?.fechaRevision) {
          setField("fechaRevision", fechaHoy);
        }
      }
    }
  }, [rolNombre, formData, puedeEditar, soloLectura, fullName, fechaHoy]); // Agregar todas las dependencias necesarias

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
        <Grid item xs={12} md={6}>
          <InfoDisplay
            icon={<Person sx={{ color: "#185FA4" }} />}
            label="Elaboró"
            value={formData.elaboradoPor || "No asignado"}
          />
          <InfoDisplay
            icon={<CalendarMonth sx={{ color: "#185FA4" }} />}
            label="Fecha de Elaboración"
            value={formatearFecha(formData.fechaElaboracion) || "No asignada"}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <InfoDisplay
            icon={<Person sx={{ color: "#185FA4" }} />}
            label="Revisado por"
            value={formData.revisadoPor || "No asignado"}
          />
          <InfoDisplay
            icon={<CalendarMonth sx={{ color: "#185FA4" }} />}
            label="Fecha de Revisión"
            value={formatearFecha(formData.fechaRevision) || "No asignada"}
          />
        </Grid>

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