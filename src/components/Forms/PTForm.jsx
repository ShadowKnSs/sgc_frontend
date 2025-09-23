import { useEffect, useState } from "react";
import { TextField, Box, Grid, IconButton, InputAdornment, Tooltip, Typography, Stack, CircularProgress } from "@mui/material";
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

  const norm = (s) => s?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";

  const [editable, setEditable] = useState({ responsable: false, objetivo: false });
  const [loading, setLoading] = useState(true);

  // 🔹 Función para formatear fecha en formato YYYY-MM-DD (ISO) para el backend
  const formatearFechaParaBackend = (fechaStr) => {
    if (!fechaStr) return null;
    try {
      const date = new Date(fechaStr);
      if (isNaN(date.getTime())) return null;
      return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    } catch (error) {
      return null;
    }
  };

  // 🔹 Función para mostrar fecha en formato legible
  const formatearFechaDisplay = (fechaStr) => {
    if (!fechaStr) return "";
    try {
      const date = new Date(fechaStr);
      if (isNaN(date.getTime())) return fechaStr;
      const dia = String(date.getDate()).padStart(2, "0");
      const mes = String(date.getMonth() + 1).padStart(2, "0");
      const anio = date.getFullYear();
      return `${dia}/${mes}/${anio}`;
    } catch (error) {
      return fechaStr;
    }
  };

  const setField = (name, value) => {
    // 🔹 Asegurar que nunca enviamos null/undefined al backend
    const safeValue = value === null || value === undefined ? "" : value;
    handleChange?.({ target: { name, value: safeValue } });
  };

  // 🔹 Detectar si los datos están listos
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      setLoading(false);
      
      if (puedeEditar && !soloLectura) {
        if (norm(rolNombre) === "lider") {
          // 🔹 Solo setear si el nombre completo es válido
          if ((!formData?.elaboradoPor || formData.elaboradoPor !== fullName) && fullName) {
            setField("elaboradoPor", fullName);
          }
          // 🔹 Asegurar fecha válida
          if (!formData?.fechaElaboracion) {
            setField("fechaElaboracion", fechaHoy);
          }
        }
        
        if (["coordinador", "supervisor"].includes(norm(rolNombre))) {
          // 🔹 Solo setear si el nombre completo es válido
          if ((!formData?.revisadoPor || formData.revisadoPor !== fullName) && fullName) {
            setField("revisadoPor", fullName);
          }
          // 🔹 Asegurar fecha válida
          if (!formData?.fechaRevision) {
            setField("fechaRevision", fechaHoy);
          }
        }
      }
    } else {
      setLoading(true);
    }
  }, [formData, rolNombre, puedeEditar, soloLectura, fullName, fechaHoy]);

  // 🔹 Función para manejar cambios que asegura datos válidos
  const handleChangeValidado = (event) => {
    const { name, value } = event.target;
    
    // Validaciones específicas por campo
    let valorValidado = value;
    
    if (name === "fechaRevision" || name === "fechaElaboracion") {
      // Para campos de fecha, asegurar formato válido o string vacío
      if (!value) {
        valorValidado = "";
      } else {
        const date = new Date(value);
        valorValidado = isNaN(date.getTime()) ? "" : value;
      }
    }
    
    if (name === "revisadoPor" || name === "elaboradoPor") {
      // Para campos de texto, asegurar string no null
      valorValidado = value === null ? "" : value;
    }
    
    handleChange?.({ target: { name, value: valorValidado } });
  };

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh" width="100%">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando información...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, boxShadow: 3, borderRadius: 3, bgcolor: "background.paper", mb: 3, width: "75%", mx: "auto" }}>
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
            value={formatearFechaDisplay(formData.fechaElaboracion) || "No asignada"}
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
            value={formatearFechaDisplay(formData.fechaRevision) || "No asignada"}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Objetivo"
            name="objetivo"
            value={formData.objetivo || ""}
            onChange={handleChangeValidado} // 🔹 Usar el manejador validado
            margin="normal"
            multiline
            inputProps={{ maxLength: 255 }}
            helperText={`${formData.objetivo?.length || 0}/255 caracteres`}
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