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
import CustomButton from "../components/Button";

/* --------------------- Hook de datos mejorado --------------------- */
const useCaratulaData = (idProceso, showSnackbar) => {
  const [caratulaId, setCaratulaId] = useState(null);
  const [personas, setPersonas] = useState([
    { nombre: "", cargo: "", fijo: "Responsable", editando: false },
    { nombre: "", cargo: "", fijo: "Revisó", editando: false },
    { nombre: "", cargo: "", fijo: "Aprobó", editando: false },
  ]);
  const [loading, setLoading] = useState(true);
  const [existe, setExiste] = useState(false);
  const [version, setVersion] = useState("1.0");
  const [macroproceso, setMacroproceso] = useState("");
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [resCaratula, resProceso] = await Promise.all([
        axios.get(`http://localhost:8000/api/caratulas/proceso/${idProceso}`),
        axios.get(`http://localhost:8000/api/procesos/${idProceso}`)
      ]);

      const dataCaratula = resCaratula.data;
      const proceso = resProceso.data.proceso || resProceso.data;

      // Verificar si hay datos de carátula
      if (dataCaratula?.idCaratula) {
        setExiste(true);
        setCaratulaId(dataCaratula.idCaratula);
        setVersion(dataCaratula.version || "1.0");
        setPersonas([
          {
            nombre: dataCaratula.responsableNombre || "",
            cargo: dataCaratula.responsableCargo || "",
            fijo: "Responsable",
            editando: false
          },
          {
            nombre: dataCaratula.revisoNombre || "",
            cargo: dataCaratula.revisoCargo || "",
            fijo: "Revisó",
            editando: false
          },
          {
            nombre: dataCaratula.aproboNombre || "",
            cargo: dataCaratula.aproboCargo || "",
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

        // Mostrar mensaje de que no hay registros
        if (showSnackbar) {
          showSnackbar("No se encontró una carátula existente. Puede crear una nueva.", "info", "Información");
        }
      }

      setMacroproceso(proceso.macroproceso?.tipoMacroproceso || "");

    } catch (error) {
      console.error("Error cargando carátula:", error);

      // Manejo específico de errores
      let errorMessage = "Error al cargar la carátula";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "No se encontró el proceso solicitado";
        } else if (error.response.status >= 500) {
          errorMessage = "Error del servidor al cargar la carátula";
        }
      } else if (error.request) {
        errorMessage = "Error de conexión. Verifique su internet";
      }

      setError(errorMessage);

      // Mostrar snackbar de error
      if (showSnackbar) {
        showSnackbar(errorMessage, "error", "Error");
      }

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
  }, [idProceso, showSnackbar]);

  useEffect(() => {
    cargar();
  }, [cargar]);

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
    setVersion,
    macroproceso,
    setMacroproceso,
    error
  };
};

/* --------------------- Tarjeta Persona --------------------- */
/* --------------------- Tarjeta Persona --------------------- */
const PersonaCard = ({ persona, index, onEdit, onChange, puedeEditar, roleColor }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const fallbackRoleColor = roleColor || theme.palette.primary?.main || "#1976d2";

  // Función para limitar el número de caracteres
  const handleInputChange = (index, field, value) => {
    if (value.length <= 125) {
      onChange(index, field, value);
    }
  };

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
        "&:hover": {
          boxShadow: puedeEditar ? 4 : 2,
          transform: persona.editando ? "none" : (puedeEditar ? "translateY(-4px)" : "none")
        }
      }}
    >
      <CardContent sx={{
        p: isMobile ? 2 : 2.5,
        textAlign: "center",
        height: "100%",
        overflow: "visible",
        opacity: puedeEditar ? 1 : 0.8
      }}>
        <Chip
          label={persona.fijo}
          size="small"
          sx={{
            mb: 2,
            backgroundColor: fallbackRoleColor,
            color: "white",
            fontWeight: "bold",
            opacity: 1
          }}
        />

        {persona.editando ? (
          <Box sx={{ animation: "fadeIn 0.3s ease" }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={persona.nombre}
              onChange={(e) => handleInputChange(index, "nombre", e.target.value)}
              label="Nombre completo"
              placeholder="Ej: María González Pérez"
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 125 }} // ✅ Limita la entrada a 125 caracteres
              error={persona.nombre.length > 125}
              helperText={
                <Box sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.75rem",
                  mt: 0.5
                }}>
                  <span style={{
                    color: persona.nombre.length > 125 ? "#d32f2f" : "transparent",
                    fontSize: "0.7rem"
                  }}>
                    {persona.nombre.length > 125 ? "Máximo 125 caracteres" : "."}
                  </span>
                  <span style={{
                    color: persona.nombre.length > 125 ? "#d32f2f" : "#666",
                    fontSize: "0.7rem"
                  }}>
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
              onChange={(e) => handleInputChange(index, "cargo", e.target.value)}
              label="Cargo o puesto"
              placeholder="Ej: Gerente de Proyectos"
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 125 }} // ✅ Limita la entrada a 125 caracteres
              error={persona.cargo.length > 125}
              helperText={
                <Box sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.75rem",
                  mt: 0.5
                }}>
                  <span style={{
                    color: persona.cargo.length > 125 ? "#d32f2f" : "transparent",
                    fontSize: "0.7rem"
                  }}>
                    {persona.cargo.length > 125 ? "Máximo 125 caracteres" : "."}
                  </span>
                  <span style={{
                    color: persona.cargo.length > 125 ? "#d32f2f" : "#666",
                    fontSize: "0.7rem"
                  }}>
                    {persona.cargo.length}/125
                  </span>
                </Box>
              }
            />
          </Box>
        ) : (
          // ... el resto del código permanece igual
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
                sx={{
                  minHeight: "64px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  wordBreak: "break-word"
                }}
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
                  overflow: "hidden",
                  wordBreak: "break-word"
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
                    "&:hover": {
                      backgroundColor: fallbackRoleColor,
                      color: "white"
                    }
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

/* --------------------- Vista Carátula Mejorada --------------------- */
const Caratula = ({ puedeEditar, showSnackbar }) => {
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
    setVersion,
    macroproceso,
    error
  } = useCaratulaData(idProceso, showSnackbar);

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
    if (showSnackbar) {
      showSnackbar("Cambios cancelados", "info", "Cancelado");
    }
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
      if (!persona.nombre.trim()) return false;
      if (!persona.cargo.trim()) return false;
      if (persona.nombre.length > 125) return false;
      if (persona.cargo.length > 125) return false;
    }
    return true;
  };

  const obtenerMensajeError = () => {
    for (const persona of personas) {
      if (!persona.nombre.trim()) return `Falta el nombre de ${persona.fijo}`;
      if (!persona.cargo.trim()) return `Falta el cargo de ${persona.fijo}`;
      if (persona.nombre.length > 125) return `Nombre de ${persona.fijo} excede 125 caracteres`;
      if (persona.cargo.length > 125) return `Cargo de ${persona.fijo} excede 125 caracteres`;
    }
    return null;
  };

  const handleSave = async () => {
    const errorMensaje = obtenerMensajeError();
    if (errorMensaje) {
      if (showSnackbar) {
        showSnackbar(errorMensaje, "error", "Error de validación");
      }
      return;
    }

    setGuardando(true);

    const payload = {
      idProceso,
      version: version,
      responsable_nombre: personas[0].nombre.trim(),
      responsable_cargo: personas[0].cargo.trim(),
      reviso_nombre: personas[1].nombre.trim(),
      reviso_cargo: personas[1].cargo.trim(),
      aprobo_nombre: personas[2].nombre.trim(),
      aprobo_cargo: personas[2].cargo.trim(),
    };

    try {
      let nuevaVersion = version;

      if (!existe) {
        const res = await axios.post("http://localhost:8000/api/caratula", payload);
        setCaratulaId(res.data?.idCaratula || null);
        setExiste(true);
        setVersion(res.data?.version || "1.0");

        if (showSnackbar) {
          showSnackbar(`Carátula creada exitosamente - Versión ${res.data?.version || "1.0"}`, "success", "Éxito");
        }
      } else {
        const parts = (version || "1.0").split(".");
        const major = parseInt(parts[0] || "1", 10);
        const minor = parseInt(parts[1] || "0", 10) + 1;
        nuevaVersion = `${major}.${minor}`;
        payload.version = nuevaVersion;

        await axios.put(`http://localhost:8000/api/caratulas/${caratulaId}`, payload);
        setVersion(nuevaVersion);

        if (showSnackbar) {
          showSnackbar(`Carátula actualizada a versión ${nuevaVersion}`, "success", "Actualizado");
        }
      }

      setPersonas((prev) => prev.map((p) => ({ ...p, editando: false })));

    } catch (error) {

      let errorMessage = "Error al guardar la carátula";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "No se encontró el recurso solicitado";
        } else if (error.response.status >= 500) {
          errorMessage = "Error del servidor al guardar";
        }
      } else if (error.request) {
        errorMessage = "Error de conexión al guardar";
      }

      if (showSnackbar) {
        showSnackbar(errorMessage, "error", "Error al guardar");
      }
    } finally {
      setGuardando(false);
    }
  };

  const enEdicion = personas.some((p) => p.editando);

  // Estados de carga y error
  if (loading) {
    return (
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        flexDirection: "column",
        gap: 2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Cargando carátula...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        flexDirection: "column",
        p: 3
      }}>
        <Alert severity="error" sx={{ mb: 2, maxWidth: 500 }}>
          {error}
        </Alert>
        <CustomButton
          type="guardar"
          onClick={cargar}
          variant="outlined"
        >
          Reintentar
        </CustomButton>
      </Box>
    );
  }

  // Verificar si no hay datos después de cargar
  const todasVacias = personas.every(p => !p.nombre.trim() && !p.cargo.trim());

  if (!existe && todasVacias && !loading) {
    return (
      <Fade in={true} timeout={800}>
        <Box sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 2
        }}>
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
            <Box sx={{
              position: "relative",
              height: "120px",
              width: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <img
                src={UASLPLogo}
                alt="UASLP Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </Box>

            <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Manual Operativo
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {macroproceso || "Sin macroproceso asignado"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ width: "100%", mb: 4 }} />

          {/* Mensaje de no datos */}
          <Alert
            severity="info"
            sx={{
              mb: 4,
              width: isMobile ? "100%" : "80%",
              textAlign: "center"
            }}
          >
            <Typography variant="h6" gutterBottom>
              No hay carátula registrada
            </Typography>
            <Typography variant="body2">
              {puedeEditar
                ? "Puede crear una nueva carátula haciendo clic en el ícono de edición de cada tarjeta."
                : "No tiene permisos para crear una carátula. Contacte al administrador."
              }
            </Typography>
          </Alert>

          {/* Tarjetas vacías */}
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
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 2
      }}>
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
          <Box sx={{
            position: "relative",
            height: "120px",
            width: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <img
              src={UASLPLogo}
              alt="UASLP Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain"
              }}
            />
          </Box>

          <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Manual Operativo
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {macroproceso || "Sin macroproceso asignado"}
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
          <Box sx={{
            mt: 4,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center"
          }}>
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