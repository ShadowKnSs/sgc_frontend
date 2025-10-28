import { useState, useEffect } from "react";
import { 
  TextField, Box, Grid, IconButton, InputAdornment, Tooltip, 
  Typography, Stack, Alert, CircularProgress 
} from "@mui/material";
import { Edit, Person, CalendarMonth } from "@mui/icons-material";

const PTForm = ({ formData, handleChange, soloLectura, puedeEditar, rolActivo, showSnackbar }) => {
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
  const [error, setError] = useState("");

  //  Función para mostrar fecha en formato legible
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
      console.error("Error formateando fecha:", error);
      return fechaStr;
    }
  };

  const setField = (name, value) => {
    const safeValue = value === null || value === undefined ? "" : value;
    handleChange?.({ target: { name, value: safeValue } });
  };

  // ✅ Carga mejorada de datos
  useEffect(() => {
    try {
      if (formData && Object.keys(formData).length > 0) {
        setLoading(false);
        
        if (puedeEditar && !soloLectura) {
          if (norm(rolNombre) === "lider") {
            if ((!formData?.elaboradoPor || formData.elaboradoPor !== fullName) && fullName) {
              setField("elaboradoPor", fullName);
            }
            if (!formData?.fechaElaboracion) {
              setField("fechaElaboracion", fechaHoy);
            }
          }
          
          if (["coordinador", "supervisor"].includes(norm(rolNombre))) {
            if ((!formData?.revisadoPor || formData.revisadoPor !== fullName) && fullName) {
              setField("revisadoPor", fullName);
            }
            if (!formData?.fechaRevision) {
              setField("fechaRevision", fechaHoy);
            }
          }
        }
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error en useEffect de PTForm:", err);
      setError("Error al cargar los datos del formulario");
      if (showSnackbar) {
        showSnackbar("Error al cargar los datos del formulario", "error", "Error");
      }
      setLoading(false);
    }
  }, [formData, rolNombre, puedeEditar, soloLectura, fullName, fechaHoy, showSnackbar]);

  // ✅ Función para manejar cambios que asegura datos válidos
  const handleChangeValidado = (event) => {
    const { name, value } = event.target;
    
    let valorValidado = value;
    
    if (name === "fechaRevision" || name === "fechaElaboracion") {
      if (!value) {
        valorValidado = "";
      } else {
        const date = new Date(value);
        valorValidado = isNaN(date.getTime()) ? "" : value;
      }
    }
    
    if (name === "revisadoPor" || name === "elaboradoPor") {
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

  // ✅ Renderizado de estados
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px" width="100%">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando información...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, boxShadow: 3, borderRadius: 3, bgcolor: "background.paper", mb: 3, width: "75%", mx: "auto" }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            Error al cargar
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
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
            value={formData?.elaboradoPor || "No asignado"}
          />
          <InfoDisplay
            icon={<CalendarMonth sx={{ color: "#185FA4" }} />}
            label="Fecha de Elaboración"
            value={formatearFechaDisplay(formData?.fechaElaboracion) || "No asignada"}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <InfoDisplay
            icon={<Person sx={{ color: "#185FA4" }} />}
            label="Revisado por"
            value={formData?.revisadoPor || "No asignado"}
          />
          <InfoDisplay
            icon={<CalendarMonth sx={{ color: "#185FA4" }} />}
            label="Fecha de Revisión"
            value={formatearFechaDisplay(formData?.fechaRevision) || "No asignada"}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Objetivo"
            name="objetivo"
            value={formData?.objetivo || ""}
            onChange={handleChangeValidado}
            margin="normal"
            multiline
            inputProps={{ maxLength: 255 }}
            helperText={`${formData?.objetivo?.length || 0}/255 caracteres`}
            InputProps={{
              readOnly: !editable.objetivo || soloLectura || !puedeEditar,
              endAdornment: !editable.objetivo && puedeEditar && !soloLectura && (
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