import React, { useState, useEffect, useCallback } from "react";
import {
  Box, TextField, Typography, Grid, Card, CardContent,
  CircularProgress, Tooltip, IconButton, Avatar, Chip,
  useTheme, useMediaQuery, Fade, Alert, Divider
} from "@mui/material";
import { Edit, Person } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import axios from "axios";
import UASLPLogo from "../assests/UASLP_SICAL_Logo.png";
import FeedbackSnackbar from "../components/Feedback";
import CustomButton from "../components/Button";

/* --------------------- Hook de datos --------------------- */
const useCaratulaData = (idProceso) => {
  const [caratulaId, setCaratulaId] = useState(null);
  const [personas, setPersonas] = useState([
    { nombre: "", cargo: "", fijo: "Responsable", editando: false },
    { nombre: "", cargo: "", fijo: "Revisó", editando: false },
    { nombre: "", cargo: "", fijo: "Aprobó", editando: false },
  ]);
  const [loading, setLoading] = useState(true);
  const [existe, setExiste] = useState(false);
  const [version, setVersion] = useState("1.0");

  const cargar = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/caratulas/proceso/${idProceso}`);
      const data = res.data;

      if (data?.idCaratula) {
        setExiste(true);
        setCaratulaId(data.idCaratula);
        setVersion(data.version || "1.0");
        setPersonas([
          {
            nombre: data.responsableNombre || "",
            cargo: data.responsableCargo || "",
            fijo: "Responsable",
            editando: false
          },
          {
            nombre: data.revisoNombre || "",
            cargo: data.revisoCargo || "",
            fijo: "Revisó",
            editando: false
          },
          {
            nombre: data.aproboNombre || "",
            cargo: data.aproboCargo || "",
            fijo: "Aprobó",
            editando: false
          },
        ]);
      } else {
        setExiste(false);
        setVersion("1.0");
        setPersonas([
          { nombre: "", cargo: "", fijo: "Responsable", editando: false },
          { nombre: "", cargo: "", fijo: "Revisó", editando: false },
          { nombre: "", cargo: "", fijo: "Aprobó", editando: false },
        ]);
      }
    } catch (error) {
      console.error("Error cargando carátula:", error);
      setExiste(false);
      setVersion("1.0");
      setPersonas([
        { nombre: "", cargo: "", fijo: "Responsable", editando: false },
        { nombre: "", cargo: "", fijo: "Revisó", editando: false },
        { nombre: "", cargo: "", fijo: "Aprobó", editando: false },
      ]);
    } finally {
      setLoading(false);
    }
  }, [idProceso]);

  useEffect(() => { cargar(); }, [cargar]);

  return {
    caratulaId,
    personas,
    setPersonas,
    loading,
    existe,
    setExiste,
    setCaratulaId,
    cargar,
    version,
    setVersion
  };
};

/* --------------------- Tarjeta Persona --------------------- */
const PersonaCard = ({ persona, index, onEdit, onChange, puedeEditar, roleColor }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const fallbackRoleColor = roleColor || theme.palette.primary?.main || "#1976d2";

  return (
    <Card
      elevation={2}
      sx={{
        minWidth: isMobile ? 240 : 280,
        height: "100%",
        mx: "auto",
        mb: 2,
        transition: "all 0.3s ease",
        border: persona.editando ? `2px solid ${fallbackRoleColor}` : "1px solid #e0e0e0",
        "&:hover": { boxShadow: 4, transform: persona.editando ? "none" : "translateY(-4px)" }
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 2.5, textAlign: "center", height: "100%", overflow: "visible" }}>
        <Chip
          label={persona.fijo}
          size="small"
          sx={{ mb: 2, backgroundColor: fallbackRoleColor, color: "white", fontWeight: "bold" }}
        />

        {persona.editando ? (
          <Box sx={{ animation: "fadeIn 0.3s ease" }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={persona.nombre}
              onChange={(e) => onChange(index, "nombre", e.target.value)}
              label="Nombre completo"
              placeholder="Ej: María González Pérez"
              sx={{ mb: 2 }}
              error={persona.nombre.length > 125}
              helperText={
                <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                  <span>{persona.nombre.length > 125 ? "Máximo 125 caracteres" : ""}</span>
                  <span style={{ color: persona.nombre.length > 125 ? "#d32f2f" : "#666" }}>
                    {persona.nombre.length}/125
                  </span>
                </Box>
              }
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={persona.cargo}
              onChange={(e) => onChange(index, "cargo", e.target.value)}
              label="Cargo o puesto"
              placeholder="Ej: Gerente de Proyectos"
              sx={{ mb: 2 }}
              error={persona.cargo.length > 125}
              helperText={
                <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                  <span>{persona.cargo.length > 125 ? "Máximo 125 caracteres" : ""}</span>
                  <span style={{ color: persona.cargo.length > 125 ? "#d32f2f" : "#666" }}>
                    {persona.cargo.length}/125
                  </span>
                </Box>
              }
            />
          </Box>
        ) : (
          <Box
            sx={{
              animation: "fadeIn 0.3s ease",
              display: "flex",
              flexDirection: "column",
              minHeight: 260,
              justifyContent: "space-between"
            }}
          >
            <Box>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  mx: "auto",
                  mb: 2,
                  bgcolor: fallbackRoleColor,
                  fontSize: "1.5rem",
                  fontWeight: "bold"
                }}
              >
                {persona.nombre ? persona.nombre.charAt(0).toUpperCase() : <Person />}
              </Avatar>

              <Typography
                variant="h6"
                fontWeight="600"
                gutterBottom
                sx={{ minHeight: "64px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {persona.nombre || "Sin asignar"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  minHeight: "40px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}
              >
                {persona.cargo || "Sin cargo asignado"}
              </Typography>
            </Box>

            {Boolean(puedeEditar) && !persona.editando && (
              <Tooltip title="Editar información">
                <IconButton
                  onClick={() => onEdit(index)}
                  color="primary"
                  sx={{
                    alignSelf: "center",
                    border: `1px solid ${fallbackRoleColor}`,
                    "&:hover": { backgroundColor: fallbackRoleColor, color: "white" }
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

/* --------------------- Vista Carátula --------------------- */
const Caratula = ({ puedeEditar }) => {
  const { idProceso } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    caratulaId,
    personas,
    setPersonas,
    loading,
    existe,
    setExiste,
    setCaratulaId,
    cargar,
    version,
    setVersion
  } = useCaratulaData(idProceso);

  const [alerta, setAlerta] = useState({ open: false, tipo: "", texto: "" });
  const [guardando, setGuardando] = useState(false);

  // Colores por rol con fallback
  const roleColors = {
    Responsable: theme.palette.primary?.main || "#1976d2",
    "Revisó": theme.palette.secondary?.main || "#9c27b0",
    "Aprobó": theme.palette.success?.main || "#2e7d32"
  };

  const setEditandoSoloUno = (indexTarget) => {
    setPersonas((prev) => prev.map((p, i) => ({ ...p, editando: i === indexTarget })));
  };

  const handleEdit = (index) => {
    if (!puedeEditar) return;
    setEditandoSoloUno(index);
  };

  const handleCancel = () => {
    cargar(); // Reset datos originales
  };

  const handleChange = (index, field, value) => {
    setPersonas((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const validarCampos = () => {
    for (const persona of personas) {
      if (persona.nombre.length > 125 || persona.cargo.length > 125) return false;
    }
    // Al menos el responsable con nombre
    if (!personas[0].nombre.trim()) return false;
    return true;
  };

  const handleSave = async () => {
    if (!validarCampos()) {
      setAlerta({
        open: true,
        tipo: "error",
        texto: "Verifique: Responsable con nombre y campos ≤ 125 caracteres."
      });
      return;
    }

    setGuardando(true);

    const payload = {
      idProceso,
      responsable_nombre: personas[0].nombre.trim(),
      responsable_cargo: personas[0].cargo.trim(),
      reviso_nombre: personas[1].nombre.trim(),
      reviso_cargo: personas[1].cargo.trim(),
      aprobo_nombre: personas[2].nombre.trim(),
      aprobo_cargo: personas[2].cargo.trim(),
      version: existe ? version : "1.0"
    };

    try {
      let nuevaVersion = version;

      if (!existe) {
        const res = await axios.post("http://localhost:8000/api/caratula", payload);
        setCaratulaId(res.data?.idCaratula || null);
        setExiste(true);
      } else {
        // Autoincremento menor de versión
        const parts = (version || "1.0").split(".");
        const major = parseInt(parts[0] || "1", 10);
        const minor = parseInt(parts[1] || "0", 10) + 1;
        nuevaVersion = `${major}.${minor}`;
        payload.version = nuevaVersion;

        await axios.put(`http://localhost:8000/api/caratulas/${caratulaId}`, payload);
        setVersion(nuevaVersion);
      }

      setAlerta({
        open: true,
        tipo: "success",
        texto: `Carátula ${existe ? "actualizada" : "guardada"} correctamente. Versión ${existe ? nuevaVersion : "1.0"}`
      });

      // Salir de modo edición
      setPersonas((prev) => prev.map((p) => ({ ...p, editando: false })));
    } catch (e) {
      console.error("Error guardando carátula", e);
      setAlerta({ open: true, tipo: "error", texto: "Error al guardar. Intente nuevamente." });
    } finally {
      setGuardando(false);
    }
  };

  const enEdicion = personas.some((p) => p.editando);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh", flexDirection: "column", gap: 2 }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">Cargando carátula...</Typography>
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", py: 2 }}>
        <FeedbackSnackbar
          open={alerta.open}
          onClose={() => setAlerta({ ...alerta, open: false })}
          type={alerta.tipo}
          message={alerta.texto}
        />

        {/* Header con logo y título */}
        <Box sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
          width: "100%",
          gap: isMobile ? 2 : 4
        }}>
          <Box sx={{ position: "relative", height: "120px", width: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={UASLPLogo} alt="UASLP Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </Box>

          <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Manual Operativo
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sistema Integral de Calidad
            </Typography>
            {existe && (
              <Chip
                label={`Versión ${version}`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        </Box>

        <Divider sx={{ width: "100%", mb: 4 }} />

        {/* Mensaje contextual de edición */}
        {Boolean(puedeEditar) && (
          <Alert severity="info" sx={{ mb: 3, width: isMobile ? "100%" : "80%" }}>
            {enEdicion
              ? "Modo edición: Actualice la información y guarde los cambios."
              : "Haga clic en el ícono de edición para modificar la información."}
          </Alert>
        )}

        {/* Tarjetas */}
        <Grid container spacing={2} justifyContent="center" sx={{ width: "100%" }}>
          {personas.map((persona, index) => (
            <Grid item key={index} xs={12} sm={6} lg={4}>
              <PersonaCard
                persona={persona}
                index={index}
                onEdit={handleEdit}
                onChange={handleChange}
                puedeEditar={Boolean(puedeEditar)}
                roleColor={roleColors[persona.fijo]}
              />
            </Grid>
          ))}
        </Grid>

        {/* Acciones */}
        {Boolean(puedeEditar) && enEdicion && (
          <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
            <CustomButton
              type="cancelar"
              onClick={handleCancel}
              disabled={guardando}
              variant="outlined"
            >
              Cancelar
            </CustomButton>
            <CustomButton
              type="guardar"
              onClick={handleSave}
              loading={guardando}
              disabled={!validarCampos() || guardando}
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </CustomButton>
          </Box>
        )}

        {!Boolean(puedeEditar) && (
          <Alert severity="info" sx={{ mt: 3, width: isMobile ? "100%" : "80%" }}>
            Usted tiene permisos de solo lectura para esta carátula.
          </Alert>
        )}
      </Box>
    </Fade>
  );
};

export default Caratula;
