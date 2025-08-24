/**
 * Vista: ProcessMapView
 * Descripción:
 * Esta vista presenta la estructura detallada de un proceso específico, incluyendo:
 * 1. Información general del proceso (objetivo, alcance, norma, etc.).
 * 2. Información general del Mapa de Procesos editable.
 * 3. Indicadores registrados para el mapa del proceso, con capacidad para visualizar, crear, editar o eliminar.
 *
 * Funcionalidades:
 * - Listar indicadores (`indmapaproceso`) por `idProceso`.
 * - Cargar información detallada del proceso y su mapa (`mapaproceso`).
 * - Agregar nuevo indicador con validación.
 * - Editar y guardar información general del mapa de procesos.
 * - Editar o eliminar indicadores individuales mediante diálogo y confirmación.
 * - Expandir/cerrar indicadores individualmente o en lote.
 * - Vista adaptativa con tarjetas (`UserCard`) que cambian entre colapsadas y expandibles.
 *
 * Componentes clave:
 * - `UserCard`: tarjeta para cada indicador (versión expandida y compacta).
 * - `MensajeAlert`, `ConfirmDeleteDialog`: alertas y confirmaciones.
 * - `Title`, `Fab`, `Dialog`, `TextField`: elementos visuales para interacción.
 *
 * Endpoints API usados:
 * - `GET /api/indmapaproceso?proceso={id}` → indicadores del mapa.
 * - `GET /api/procesos/{id}` → datos del proceso.
 * - `GET /api/mapaproceso/{id}` → datos del mapa de proceso.
 * - `POST /api/indmapaproceso` → crear nuevo indicador.
 * - `PUT /api/indmapaproceso/{id}` → actualizar indicador.
 * - `DELETE /api/indmapaproceso/{id}` → eliminar indicador.
 * - `POST /api/mapaproceso` o `PUT /api/mapaproceso/{id}` → guardar mapa de proceso.
 *
 * Props:
 * - `idProceso`: ID del proceso actual.
 * - `soloLectura`: determina si el usuario puede editar o solo visualizar.
 *
 * Nota:
 * Este componente está diseñado para roles con permisos de edición. Si `soloLectura` está activado,
 * los botones de edición/creación quedan ocultos o inactivos.
 */

import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import axios from "axios";
import {
  Box, Fab, Stack, Card, CardContent, Typography, IconButton,
  Table, TableBody, TableCell, TableContainer, TableRow, Paper,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid
} from "@mui/material";
import { Add, Close, ExpandMore, ExpandLess, Edit, Delete, } from "@mui/icons-material";
import MensajeAlert from "../components/MensajeAlert";
import AssignmentIcon from '@mui/icons-material/Assignment';
import FlagIcon from '@mui/icons-material/Flag';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GavelIcon from '@mui/icons-material/Gavel';
import TimerIcon from '@mui/icons-material/Timer';
import VerifiedIcon from '@mui/icons-material/Verified';
import DescriptionIcon from '@mui/icons-material/Description';
import SourceIcon from '@mui/icons-material/Source';
import InventoryIcon from '@mui/icons-material/Inventory';
import OutboxIcon from '@mui/icons-material/Outbox';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';

function ProcessMapView({ idProceso, soloLectura }) {
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [activeCards, setActiveCards] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alerta, setAlerta] = useState({ tipo: "", texto: "" });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [indicadorAEliminar, setIndicadorAEliminar] = useState(null);

  const icons = {
    documentos: <DescriptionIcon sx={{ color: "#004A98", fontSize: 32 }} />,
    fuente: <SourceIcon sx={{ color: "#004A98", fontSize: 32 }} />,
    material: <InventoryIcon sx={{ color: "#004A98", fontSize: 32 }} />,
    requisitos: <AssignmentIcon sx={{ color: "#004A98", fontSize: 32 }} />,
    salidas: <OutboxIcon sx={{ color: "#004A98", fontSize: 32 }} />,
    receptores: <GroupsIcon sx={{ color: "#004A98", fontSize: 32 }} />,
    puestosInvolucrados: <GroupWorkIcon sx={{ color: "#004A98", fontSize: 32 }} />,
  };

  // Este es tu form local para crear un nuevo "indicador"
  const [newUser, setNewUser] = useState({
    descripcion: "",
    formula: "",
    periodo: "",
    responsable: "",
    meta: ""
  });

  // EJEMPLO: info de Proceso / Mapa de Proceso
  const [proceso, setProceso] = useState({
    objetivo: "",
    alcance: "",
    anioCertificado: "",
    norma: "",
    duracionCetificado: "",
    estado: ""
  });

  const [mapaProceso, setMapaProceso] = useState({
    documentos: "",
    fuente: "",
    material: "",
    requisitos: "",
    salidas: "",
    receptores: "",
    puestosInvolucrados: ""
  });

  /**
   * 1) Efecto para cargar "indmapaproceso" filtrado por idProceso
   */
  useEffect(() => {
    if (!idProceso) {
      console.log("No se recibió idProceso, no se listan indicadores de mapa de proceso");
      setLoading(false);
      return;
    }
    // Construimos la URL con ?proceso=XX
    const url = `http://localhost:8000/api/indmapaproceso?proceso=${idProceso}`;
    console.log("[LOG] GET ->", url);

    axios.get(url)
      .then((resp) => {
        console.log("[LOG] Respuesta GET indmapaproceso:", resp.data);
        setUsers(resp.data);
      })
      .catch((error) => {
        console.error("[ERROR] al obtener indmapaproceso:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [idProceso]);

  /**
   * 2) Efecto para cargar "proceso" y "mapaProceso" (ejemplo)
   */
  useEffect(() => {
    // Obtener datos del proceso (puedes filtrar con tu idProceso si quieres)
    axios.get(`http://localhost:8000/api/procesos/${idProceso}`)
      .then((response) => {
        if (response.data.proceso) {
          setProceso(response.data.proceso);
        }
      })
      .catch((error) => console.error("Error al obtener datos del proceso:", error));

    // Obtener datos del mapa de procesos
    axios.get(`http://localhost:8000/api/mapaproceso/${idProceso}`)
      .then((response) => {
        if (response.data) {
          setMapaProceso(response.data);
        }
      })
      .catch((error) => console.error("Error al obtener datos del mapa de procesos:", error));

    // Scroll
    const handleScroll = () => {
      if (window.scrollY > 100) setIsFixed(true);
      else setIsFixed(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * 3) Lógica de expandir/cerrar tarjetas
   */
  const handleSelectCard = (user) => {
    if (!activeCards.some(u => u.id === user.id)) {
      setActiveCards([...activeCards, user]);
    }
  };
  const handleCloseCard = (user) => {
    setActiveCards(activeCards.filter((u) => u.id !== user.id));
  };
  const handleToggleAll = () => {
    if (allExpanded) {
      setActiveCards([]);
    } else {
      setActiveCards([...users]);
    }
    setAllExpanded(!allExpanded);
  };

  /**
   * 4) Validación de campos para crear
   */
  const validateFields = () => {
    let tempErrors = {};
    if (!newUser.descripcion.trim()) tempErrors.descripcion = "Este campo es obligatorio";
    if (!newUser.formula.trim()) tempErrors.formula = "Este campo es obligatorio";
    if (!newUser.periodo.trim()) tempErrors.periodo = "Debe seleccionar un período";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  /**
   * 5) Crear nuevo "indicador" (POST)
   */
  const handleAddUser = () => {
    if (soloLectura || !validateFields()) return;

    // Asumimos que en IndMapaProceso se requiere idProceso:
    const payload = {
      idProceso: idProceso,
      descripcion: newUser.descripcion,
      formula: newUser.formula,
      periodoMed: newUser.periodo,
      responsable: newUser.responsable,
      meta: parseInt(newUser.meta) || null
    };

    axios.post("http://localhost:8000/api/indmapaproceso", payload)
      .then((response) => {
        console.log("[LOG] POST store indmapaproceso:", response.data);
        // Si el back te regresa "indMapaProceso" y "indicador", 
        // ajusta la forma de agregar a tu lista local.
        // Supongamos que con response.data.indMapaProceso
        const nuevo = response.data.indMapaProceso;
        setUsers((prev) => [...prev, nuevo]);
        setOpenForm(false);
        setNewUser({ descripcion: "", formula: "", periodo: "" });
        setErrors({});
      })
      .catch((error) => console.error("Error al agregar indicador (indmapaproceso):", error));
  };

  /**
   * 6) Editar "mapaProceso" (ejemplo) con un botón "EDITAR/GUARDAR"
   */
  const handleEditToggle = () => setEditMode(!editMode);

  const handleSaveChanges = async () => {
    try {
      if (soloLectura) return;

      const payload = {
        idProceso: idProceso,
        documentos: mapaProceso.documentos || "",
        fuente: mapaProceso.fuente || "",
        material: mapaProceso.material || "",
        requisitos: mapaProceso.requisitos || "",
        salidas: mapaProceso.salidas || "",
        receptores: mapaProceso.receptores || "",
        puestosInvolucrados: mapaProceso.puestosInvolucrados || ""
      };

      if (!mapaProceso.idMapaProceso) {
        // CREACIÓN
        const res = await axios.post("http://localhost:8000/api/mapaproceso", payload);
        setMapaProceso(res.data); // Guarda el nuevo idMapaProceso
        setAlerta({ tipo: "success", texto: "Mapa de proceso creado correctamente." });
      } else {
        // ACTUALIZACIÓN
        await axios.put(`http://localhost:8000/api/mapaproceso/${mapaProceso.idMapaProceso}`, payload);
        setAlerta({ tipo: "success", texto: "Cambios guardados correctamente." });
      }

      setEditMode(false);
      setTimeout(() => setAlerta({ tipo: "", texto: "" }), 4000);

    } catch (error) {
      console.error("Error al guardar:", error);
      setAlerta({ tipo: "error", texto: "Ocurrió un error al guardar el mapa de proceso." });
      setTimeout(() => setAlerta({ tipo: "", texto: "" }), 4000);
    }
  };

  /**
   * 7) Eliminar un registro de indmapaproceso
   */
  const handleDeleteUser = (indicador) => {
    setIndicadorAEliminar(indicador);
    setConfirmDialogOpen(true);
  };
  /**
   * 8) Editar un registro (indicador)
   */

  const confirmarEliminarIndicador = () => {
    if (!indicadorAEliminar) return;

    axios.delete(`http://localhost:8000/api/indmapaproceso/${indicadorAEliminar.idIndicador}`)
      .then(() => {
        setUsers((prev) => prev.filter((u) => u.idIndicador !== indicadorAEliminar.idIndicador));
        setAlerta({ tipo: "success", texto: "Indicador eliminado correctamente." });
      })
      .catch((error) => {
        console.error("Error al eliminar el indicador:", error);
        setAlerta({ tipo: "error", texto: "Error al eliminar el indicador." });
      })
      .finally(() => {
        setConfirmDialogOpen(false);
        setIndicadorAEliminar(null);
      });
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setEditFormOpen(true);
  };

  const handleSaveEditUser = () => {
    if (!editUser) return;
      axios.put(`http://localhost:8000/api/indmapaproceso/${editUser.idIndicadorMP}`, {
        idProceso: idProceso,
        descripcion: editUser.descripcion,
        formula: editUser.formula,
        periodoMed: editUser.periodo,
        responsable: editUser.responsable,
        meta: parseInt(editUser.meta) || null
      })
      .then((resp) => {
        setUsers((prev) =>
          prev.map((u) => u.idIndicadorMP === editUser.idIndicadorMP ? resp.data : u)
        );
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveCards([]); // Cierra todos los indicadores abiertos
        setEditFormOpen(false);
        setEditUser(null);
        setAlerta({ tipo: "success", texto: "Indicador actualizado correctamente." });
        setTimeout(() => setAlerta({ tipo: "", texto: "" }), 4000);
      })
      .catch((error) => console.error("Error al actualizar indicador:", error));
  };

  /**
   * Render principal
   */
  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Cargando datos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      {alerta.texto && (
        <MensajeAlert
          tipo={alerta.tipo}
          texto={alerta.texto}
          onClose={() => setAlerta({ tipo: "", texto: "" })}
        />
      )}
      {/* EJEMPLO: Sección con datos del Proceso */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" color="#003366" mb={2} textAlign="center">
          Información del Proceso
        </Typography>

        <Grid container spacing={2}>
          {[
            { label: "Objetivo", value: proceso.objetivo, icon: <FlagIcon /> },
            { label: "Alcance", value: proceso.alcance, icon: <TrackChangesIcon /> },
            { label: "Año de Certificado", value: proceso.anioCertificado, icon: <CalendarTodayIcon /> },
            { label: "Norma", value: proceso.norma, icon: <GavelIcon /> },
            { label: "Duración del Certificado", value: proceso.duracionCetificado, icon: <TimerIcon /> },
            { label: "Estado", value: proceso.estado, icon: <VerifiedIcon /> },
          ].map((item, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, boxShadow: 1 }}>
                <Box color="#004A98">{item.icon}</Box>
                <Box>
                  <Typography fontWeight="bold" color="#333">{item.label}:</Typography>
                  <Typography color="#666">{item.value || "Cargando..."}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* EJEMPLO: Mapa de procesos (editMode) */}
      <Box sx={{ mb: 3, p: 3, backgroundColor: "#f5f5f5", borderRadius: 2, boxShadow: 2, position: "relative" }}>
        <Box sx={{ position: "absolute", top: 12, right: 12 }}>
          {!soloLectura && (
            <Button
              startIcon={<Edit />}
              sx={{ color: "#0056b3", fontWeight: "bold" }}
              onClick={editMode ? handleSaveChanges : handleEditToggle}
            >
              {editMode ? "GUARDAR" : "EDITAR"}
            </Button>
          )}
        </Box>
        <Typography variant="h6" fontWeight="bold" color="#004A98" mb={2} textAlign="center">
          Información General del Mapa de Procesos
        </Typography>

        <Grid container spacing={2}>
          {[
            { label: "Documentos", key: "documentos" },
            { label: "Fuente", key: "fuente" },
            { label: "Material", key: "material" },
            { label: "Requisitos", key: "requisitos" },
            { label: "Salidas", key: "salidas" },
            { label: "Receptores", key: "receptores" },
            { label: "Puestos Involucrados", key: "puestosInvolucrados" }
          ].map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {icons[item.key]}
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight="bold" color="#333">{item.label}:</Typography>
                  {editMode ? (
                    <TextField
                      fullWidth
                      variant="outlined"
                      multiline
                      minRows={2}
                      sx={{ width: '100%' }}
                      value={mapaProceso[item.key] || ""}
                      onChange={(e) =>
                        setMapaProceso({
                          ...mapaProceso,
                          [item.key]: e.target.value
                        })
                      }
                    />
                  ) : (
                    <Typography color="#666">
                      {mapaProceso[item.key] || "No disponible"}
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Title text="Indicadores" />

      {/* Tarjetas expandidas */}
      {activeCards.length > 0 && (
        <Box sx={{ flex: 4, pr: 2, display: "flex", justifyContent: "center" }}>
          <Stack spacing={2}>
            {activeCards.map((user) => (
              <UserCard
                key={user.idIndicadorMP}
                user={user}
                isActive
                onClose={handleCloseCard}
                onDelete={handleDeleteUser}
                onEdit={handleEditUser}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Tarjetas "colapsadas" */}
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
          marginBottom: "310px",
        }}
      >
        {users
          .filter((user) => !activeCards.some(u => u.idIndicadorMP === user.idIndicadorMP))
          .map((user) => (
            <UserCard
              key={user.idIndicadorMP}
              user={user}
              onSelect={handleSelectCard}
              onDelete={handleDeleteUser}
              onEdit={handleEditUser}
              isSmall={activeCards.length > 0}
              soloLectura={soloLectura}  // Añade esta línea

            />
          ))}
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
            width: 150,
            height: 50,
            borderRadius: 2,
            backgroundColor: "secondary.main",
            color: "#fff",
            "&:hover": { backgroundColor: "primary.main" }
          }}
          onClick={handleToggleAll}
          startIcon={allExpanded ? <ExpandLess /> : <ExpandMore />}
        >
          {allExpanded ? "Cerrar Indicadores" : "Desplegar Indicadores"}
        </Button>
      </Box>

      {/* Botón flotante para abrir formulario de crear */}
      <Box sx={{ position: "fixed", bottom: 16, right: 30, paddingRight: 5 }}>
        {!soloLectura && (<Fab
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
        </Fab>)}
      </Box>

      {/* Diálogo para crear nuevo indicador */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", color: "#0056b3" }}>
          Agregar Nuevo Indicador
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
            <TextField
              label="Descripción"
              fullWidth
              multiline
              minRows={3}
              variant="outlined"
              value={newUser.descripcion}
              onChange={(e) => setNewUser({ ...newUser, descripcion: e.target.value })}
              error={!!errors.descripcion}
              helperText={errors.descripcion}
            />
            <TextField
              label="Fórmula"
              fullWidth
              multiline
              minRows={3}
              variant="outlined"
              value={newUser.formula}
              onChange={(e) => setNewUser({ ...newUser, formula: e.target.value })}
              error={!!errors.formula}
              helperText={errors.formula}
            />
            <TextField
              label="Período"
              fullWidth
              select
              variant="outlined"
              value={newUser.periodo}
              onChange={(e) => setNewUser({ ...newUser, periodo: e.target.value })}
              error={!!errors.periodo}
              helperText={errors.periodo}
            >
              <MenuItem value="Semestral">Semestral</MenuItem>
              <MenuItem value="Trimestral">Trimestral</MenuItem>
              <MenuItem value="Anual">Anual</MenuItem>
            </TextField>
            <TextField
              label="Responsable"
              fullWidth
              variant="outlined"
              value={newUser.responsable}
              onChange={(e) => setNewUser({ ...newUser, responsable: e.target.value })}
            />
            <TextField
              label="Meta (número)"
              type="number"
              fullWidth
              variant="outlined"
              value={newUser.meta}
              onChange={(e) => setNewUser({ ...newUser, meta: e.target.value })}
              inputProps={{ min: 1, max: 10 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", padding: 2 }}>
          <Button
            onClick={() => setOpenForm(false)}
            variant="contained"
            sx={{
              backgroundColor: "#D3D3D3",
              color: "black",
              "&:hover": { backgroundColor: "#B0B0B0" }
            }}
          >
            CANCELAR
          </Button>
          <Button
            onClick={handleAddUser}
            variant="contained"
            sx={{
              backgroundColor: "#F9B800",
              color: "black",
              "&:hover": { backgroundColor: "#E0A500" }
            }}
          >
            GUARDAR
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para editar un indicador existente */}
      <Dialog open={editFormOpen} onClose={() => setEditFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", color: "#0056b3" }}>
          Editar Indicador
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
            <TextField
              label="Descripción"
              fullWidth
              variant="outlined"
              value={editUser?.descripcion || ""}
              onChange={(e) => setEditUser({ ...editUser, descripcion: e.target.value })}
            />
            <TextField
              label="Fórmula"
              fullWidth
              variant="outlined"
              value={editUser?.formula || ""}
              onChange={(e) => setEditUser({ ...editUser, formula: e.target.value })}
            />
            <TextField
              label="Período"
              fullWidth
              select
              variant="outlined"
              value={editUser?.periodo || ""}
              onChange={(e) => setEditUser({ ...editUser, periodo: e.target.value })}
            >
              <MenuItem value="Semestral">Semestral</MenuItem>
              <MenuItem value="Trimestral">Trimestral</MenuItem>
              <MenuItem value="Anual">Anual</MenuItem>
            </TextField>
            <TextField
              label="Responsable"
              fullWidth
              variant="outlined"
              value={editUser?.responsable || ""}
              onChange={(e) => setEditUser({ ...editUser, responsable: e.target.value })}
            />
            <TextField
              label="Meta (número)"
              type="number"
              fullWidth
              inputProps={{ min: 1, max: 10 }}
              variant="outlined"
              value={editUser?.meta || ""}
              onChange={(e) => setEditUser({ ...editUser, meta: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", padding: 2 }}>
          <Button
            onClick={() => setEditFormOpen(false)}
            variant="contained"
            sx={{
              backgroundColor: "#D3D3D3",
              color: "black",
              "&:hover": { backgroundColor: "#B0B0B0" }
            }}
          >
            CANCELAR
          </Button>
          <Button
            onClick={handleSaveEditUser}
            variant="contained"
            sx={{
              backgroundColor: "#F9B800",
              color: "black",
              "&:hover": { backgroundColor: "#E0A500" }
            }}
          >
            GUARDAR
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDeleteDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmarEliminarIndicador}
        itemName={indicadorAEliminar?.descripcion || "este indicador"}
      />
    </Box>
  );
}
/**
 * Card para mostrar cada "indicador"
 */
function UserCard({ user, onSelect, onClose, isActive, onDelete, onEdit, isSmall, soloLectura }) {
  return (
    <Card
      sx={{
        width: isActive ? "50vw" : isSmall ? 180 : 240,
        minWidth: isActive ? "850px" : "none",
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
        position: "relative",
      }}
      onClick={!isActive ? () => onSelect?.(user) : undefined}
    >
      {isActive ? (
        <>
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 1,
              zIndex: 10,
            }}
          >
            <IconButton onClick={() => onClose?.(user)} sx={{ color: "red" }}>
              <Close />
            </IconButton>

            {onEdit && !soloLectura && (
              <IconButton onClick={() => onEdit(user)} sx={{ color: "blue" }}>
                <Edit />
              </IconButton>
            )}

            {onDelete && !soloLectura && (
              <IconButton onClick={() => onDelete(user.idIndicadorMP)} sx={{ color: "red" }}>
                <Delete />
              </IconButton>
            )}
          </Box>

          <CardContent>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center" }}>
              {[
                { title: "Descripción", value: user.descripcion },
                { title: "Fórmula", value: user.formula },
                { title: "Periodo", value: user.periodoMed },
                { title: "Responsable", value: user.responsable },
                { title: "Meta", value: user.meta },
              ].map((field, index) => (
                <TableContainer
                  key={index}
                  component={Paper}
                  sx={{ width: "28%", minWidth: "180px", boxShadow: 1 }}
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
                          {field.value || "N/A"}
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
        <Typography
          variant="body1"
          fontWeight="500"
          color="#004A98"
          sx={{
            textAlign: "center",
            paddingX: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3, // muestra máximo 3 líneas
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {user.descripcion || "Sin descripción"}
        </Typography>
      )}
    </Card>
  );
}

export default ProcessMapView;
