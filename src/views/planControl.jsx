import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Fab,
  Stack,
  Card,
  CardContent,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import { Add, Close, ExpandMore, ExpandLess } from "@mui/icons-material";

// --------------------------------------------------
// 1) Componente principal
// --------------------------------------------------
function ProcessMapView({ idProceso, soloLectura }) {
  ;
  const [actividades, setActividades] = useState([]);
  const [errors, setErrors] = useState({});
  const [activeCards, setActiveCards] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  // Estado para la nueva actividad
  const [newActividad, setNewActividad] = useState({
    nombreActividad: "",
    procedimiento: "",
    criterioAceptacion: "",
    caracteristicasVerificar: "",
    frecuencia: "",
    identificacionSalida: "",
    registroSalida: "",
    responsable: "",
    tratamiento: "",
    año: new Date().getFullYear() 
  });

  // --------------------------------------------------
  // 1.1 Efecto para obtener datos (GET) según idProceso
  // --------------------------------------------------
  useEffect(() => {
    if (!idProceso) {
      console.log("[LOG] No se obtuvo idProceso, no se hace GET.");
      return;
    }
    console.log(`[LOG] useEffect -> solicitando actividades con idProceso=${idProceso}`);
    
    // Supongamos que tu backend soporta ?proceso=XX para filtrar
    axios
      .get(`http://localhost:8000/api/actividadcontrol/${idProceso}`)
      .then((response) => {
        console.log("[LOG] Respuesta GET /actividadcontrol:", response.data);
        setActividades(response.data);
      })
      .catch((error) => {
        console.error("[ERROR] al obtener datos de actividadcontrol:", error);
      });

    // Manejo del scroll para el botón flotante
    const handleScroll = () => {
      setIsFixed(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [idProceso]);

  // --------------------------------------------------
  // 2) Validación de campos
  // --------------------------------------------------
  const validateFields = () => {
    let tempErrors = {};

    if (!newActividad.nombreActividad.trim()) {
      tempErrors.nombreActividad = "Este campo es obligatorio";
    }
    if (!newActividad.procedimiento.trim()) {
      tempErrors.procedimiento = "Este campo es obligatorio";
    }
    if (!newActividad.criterioAceptacion.trim()) {
      tempErrors.criterioAceptacion = "Este campo es obligatorio";
    }
    if (!newActividad.caracteristicasVerificar.trim()) {
      tempErrors.caracteristicasVerificar = "Este campo es obligatorio";
    }
    if (!newActividad.frecuencia.trim()) {
      tempErrors.frecuencia = "Este campo es obligatorio";
    }
    if (!newActividad.identificacionSalida.trim()) {
      tempErrors.identificacionSalida = "Este campo es obligatorio";
    }
    if (!newActividad.registroSalida.trim()) {
      tempErrors.registroSalida = "Este campo es obligatorio";
    }
    if (!newActividad.responsable.trim()) {
      tempErrors.responsable = "Este campo es obligatorio";
    }
    if (!newActividad.tratamiento.trim()) {
      tempErrors.tratamiento = "Este campo es obligatorio";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // --------------------------------------------------
  // 3) Crear nueva actividad en la BD (POST)
  // --------------------------------------------------
  const handleAddActividad = () => {
    if (!validateFields()) {
      console.warn("[WARN] Validación falló:", errors);
      return;
    }
    if (!idProceso) {
      console.error("[ERROR] No hay idProceso disponible.");
      return;
    }

    // Importante: agregar el idProceso en el payload
    const payload = {
      ...newActividad,
      idProceso: idProceso,  // <-- lo agregamos
      año: newActividad.año
    };

    console.log("[LOG] Enviando nueva actividad al backend:", payload);

    axios
      .post("http://localhost:8000/api/actividadcontrol", payload)
      .then((response) => {
        console.log("[LOG] Respuesta POST /actividadcontrol:", response.data);

        // Insertamos la actividad creada al estado
        const actividadCreada = response.data; 
        setActividades((prev) => [...prev, actividadCreada]);

        // Cerrar formulario, limpiar
        setOpenForm(false);
        setNewActividad({
          nombreActividad: "",
          procedimiento: "",
          criterioAceptacion: "",
          caracteristicasVerificar: "",
          frecuencia: "",
          identificacionSalida: "",
          registroSalida: "",
          responsable: "",
          tratamiento: ""
        });
        setErrors({});
      })
      .catch((error) => {
        console.error("[ERROR] al crear actividadControl:", error.response?.data || error.message);
      });
  };

  // --------------------------------------------------
  // 4) Lógica de expandir/cerrar cards
  // --------------------------------------------------
  const handleSelectCard = (item) => {
    if (!activeCards.some((act) => act.idActividad === item.idActividad)) {
      setActiveCards([...activeCards, item]);
    }
  };

  const handleCloseCard = (item) => {
    setActiveCards(activeCards.filter((act) => act.idActividad !== item.idActividad));
  };

  const handleToggleAll = () => {
    if (allExpanded) {
      setActiveCards([]);
    } else {
      setActiveCards([...actividades]);
    }
    setAllExpanded(!allExpanded);
  };

  // --------------------------------------------------
  // Render principal
  // --------------------------------------------------
  return (
    <Box sx={{ p: 4, display: "flex", minHeight: "100vh", flexDirection: "column", paddingTop: 1 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#0056b3", mb: 2 }}>
        ACTIVIDADES
      </Typography>
      {/* Sección de Cards "expandidas" */}
      {activeCards.length > 0 && (
        <Box sx={{ flex: 4, pr: 2, display: "flex", justifyContent: "center" }}>
          <Stack spacing={2}>
            {activeCards.map((item) => (
              <UserCard
                key={item.idActividad}
                actividad={item}
                isActive
                onClose={handleCloseCard}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Sección de Cards "colapsadas" */}
      <Box
        sx={{
          flex: activeCards.length > 0 ? 1 : 5,
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "15px",
          padding: 2,
          marginBottom: "310px"
        }}
      >
        {actividades.length > 0 ? (
          actividades
            .filter((item) => !activeCards.some((act) => act.idActividad === item.idActividad))
            .map((item) => (
              <UserCard
                key={item.idActividad}
                actividad={item}
                onSelect={handleSelectCard}
                isSmall={activeCards.length > 0}
              />
            ))
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", color: "#666" }}>
            Cargando datos...
          </Typography>
        )}
      </Box>

      {/* Botón flotante para desplegar/cerrar */}
      <Box
        sx={{
          position: "fixed",
          top: isFixed ? 33 : 140,
          right: -30,
          zIndex: 50,
          paddingRight: 5,
          transition: "top 0.05s ease-in-out"
        }}
      >
        <Button
          variant="contained"
          sx={{
            width: 200,
            height: 40,
            borderRadius: 2,
            backgroundColor: "secondary.main",
            color: "#fff",
            "&:hover": { backgroundColor: "primary.main" }
          }}
          onClick={handleToggleAll}
          startIcon={allExpanded ? <ExpandLess /> : <ExpandMore />}
        >
          {allExpanded ? "Cerrar Todo" : "Desplegar Todo"}
        </Button>
      </Box>

      {!soloLectura && (
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 30,
            paddingRight: 5,
            paddingTop: 3
          }}
        >
          <Fab
            color="primary"
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "secondary.main",
              "&:hover": { backgroundColor: "primary.main" }
            }}
            onClick={() => setOpenForm(true)}
          >
            <Add />
          </Fab>
        </Box>
      )}

      {/* Diálogo para crear nueva actividad */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", color: "#0056b3" }}>
          Agregar Nuevo Plan de Control
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Actividad de Control"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={newActividad.nombreActividad}
            onChange={(e) =>
              setNewActividad({ ...newActividad, nombreActividad: e.target.value })
            }
            error={!!errors.nombreActividad}
            helperText={errors.nombreActividad}
          />

          <TextField
            label="Procedimiento"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={newActividad.procedimiento}
            onChange={(e) =>
              setNewActividad({ ...newActividad, procedimiento: e.target.value })
            }
            error={!!errors.procedimiento}
            helperText={errors.procedimiento}
          />

          <TextField
            label="Criterio de Aceptación"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={newActividad.criterioAceptacion}
            onChange={(e) =>
              setNewActividad({ ...newActividad, criterioAceptacion: e.target.value })
            }
            error={!!errors.criterioAceptacion}
            helperText={errors.criterioAceptacion}
          />

          <TextField
            label="Características a Verificar"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={newActividad.caracteristicasVerificar}
            onChange={(e) =>
              setNewActividad({ ...newActividad, caracteristicasVerificar: e.target.value })
            }
            error={!!errors.caracteristicasVerificar}
            helperText={errors.caracteristicasVerificar}
          />

          <TextField
            label="Frecuencia"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={newActividad.frecuencia}
            onChange={(e) => setNewActividad({ ...newActividad, frecuencia: e.target.value })}
            error={!!errors.frecuencia}
            helperText={errors.frecuencia}
          />

          <TextField
            label="Identificación de Salida"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={newActividad.identificacionSalida}
            onChange={(e) =>
              setNewActividad({ ...newActividad, identificacionSalida: e.target.value })
            }
            error={!!errors.identificacionSalida}
            helperText={errors.identificacionSalida}
          />

          <TextField
            label="Registro de Salidas"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={newActividad.registroSalida}
            onChange={(e) => setNewActividad({ ...newActividad, registroSalida: e.target.value })}
            error={!!errors.registroSalida}
            helperText={errors.registroSalida}
          />

          <TextField
            label="Responsable"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={newActividad.responsable}
            onChange={(e) => setNewActividad({ ...newActividad, responsable: e.target.value })}
            error={!!errors.responsable}
            helperText={errors.responsable}
          />

          <TextField
            label="Tratamiento"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={newActividad.tratamiento}
            onChange={(e) => setNewActividad({ ...newActividad, tratamiento: e.target.value })}
            error={!!errors.tratamiento}
            helperText={errors.tratamiento}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} sx={{ bgcolor: "#D3D3D3", color: "black" }}>
            Cancelar
          </Button>
          <Button onClick={handleAddActividad} sx={{ bgcolor: "#F9B800", color: "black" }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// --------------------------------------------------
// 2) Card que muestra la actividad
// --------------------------------------------------
function UserCard({ actividad, onSelect, onClose, isActive, isSmall }) {
  return (
    <Card
      sx={{
        width: isActive ? "85vw" : isSmall ? 180 : 240,
        minWidth: isActive ? "1000px" : "none",
        height: isActive ? "auto" : 150,
        padding: 2,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        boxShadow: 3,
        cursor: isActive ? "default" : "pointer",
        "&:hover": { boxShadow: isActive ? 3 : 6 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative"
      }}
      onClick={!isActive ? () => onSelect?.(actividad) : undefined}
    >
      {isActive ? (
        <>
          <IconButton
            onClick={() => onClose?.(actividad)}
            sx={{ color: "red", position: "absolute", top: "5px", right: "5px", zIndex: 10 }}
          >
            <Close />
          </IconButton>

          <CardContent>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "10px",
                justifyContent: "center"
              }}
            >
              {[
                { title: "Actividad de Control", value: actividad.nombreActividad },
                { title: "Procedimiento", value: actividad.procedimiento },
                { title: "Criterio de Aceptación", value: actividad.criterioAceptacion },
                { title: "Características a Verificar", value: actividad.caracteristicasVerificar },
                { title: "Frecuencia", value: actividad.frecuencia },
                { title: "Identificación de Salida", value: actividad.identificacionSalida },
                { title: "Registro de Salidas", value: actividad.registroSalida },
                { title: "Responsable", value: actividad.responsable },
                { title: "Tratamiento", value: actividad.tratamiento }
              ].map((field, index) => (
                <TableContainer
                  key={index}
                  component={Paper}
                  sx={{
                    width: "100%",
                    minWidth: "180px",
                    boxShadow: 1
                  }}
                >
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                            backgroundColor: "#e0e0e0",
                            borderBottom: "2px solid #004A98"
                          }}
                        >
                          {field.title}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                          {field.value ?? "N/A"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              ))}
            </Box>
          </CardContent>
        </>
      ) : (
        <Typography variant="h6" fontWeight="bold" color="#004A98">
          {actividad.nombreActividad || `Actividad ${actividad.idActividad}`}
        </Typography>
      )}
    </Card>
  );
}

export default ProcessMapView;
