import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Fab, Stack, Card, CardContent, Typography, IconButton,
  Table, TableBody, TableCell, TableContainer, TableRow, Paper,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid
} from "@mui/material";
import { Add, Close, ExpandMore, ExpandLess, Edit, Delete } from "@mui/icons-material";

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

  // Este es tu form local para crear un nuevo "indicador"
  const [newUser, setNewUser] = useState({
    descripcion: "",
    formula: "",
    periodo: "",
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
    axios.get("http://localhost:8000/api/procesos")
      .then((response) => {
        // Ajusta la respuesta según tu backend
        if (response.data.procesos && response.data.procesos.length > 0) {
          setProceso(response.data.procesos[0]);
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
      idProceso: idProceso,  // para que el back cree el IndMapaProceso con su idProceso
      descripcion: newUser.descripcion,
      formula: newUser.formula,
      periodoMed: newUser.periodo,
      // si quieres "responsable", "meta", etc., inclúyelos
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
  const handleSaveChanges = () => {
    if (!mapaProceso.idMapaProceso || soloLectura) {
      console.error("No hay un idMapaProceso para actualizar");
      return;
    }
    axios.put(`http://localhost:8000/api/mapaproceso/${mapaProceso.idMapaProceso}`, mapaProceso)
      .then((resp) => {
        console.log("MapaProceso actualizado:", resp.data);
        setEditMode(false);
      })
      .catch((error) => console.error("Error al actualizar mapaProceso:", error));
  };

  /**
   * 7) Eliminar un registro de indmapaproceso
   */
  const handleDeleteUser = (idIndicador) => {
    axios.delete(`http://localhost:8000/api/indmapaproceso/${idIndicador}`)
      .then(() => {
        setUsers((prev) => prev.filter((u) => u.idIndicador !== idIndicador));
      })
      .catch((error) => console.error("Error al eliminar el indicador:", error));
  };

  /**
   * 8) Editar un registro (indicador)
   */

  const handleEditUser = (user) => {
    setEditUser(user);
    setEditFormOpen(true);
  };
  const handleSaveEditUser = () => {
    if (!editUser) return;

    axios.put(`http://localhost:8000/api/indmapaproceso/${editUser.idIndicador}`, {
      idProceso: idProceso,
      descripcion: editUser.descripcion,
      formula: editUser.formula,
      periodoMed: editUser.periodo,
    })
      .then((resp) => {
        // Actualizamos la lista local
        setUsers((prev) => prev.map(u => u.idIndicador === editUser.idIndicador ? resp.data : u));
        setEditFormOpen(false);
        setEditUser(null);
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

      {/* EJEMPLO: Sección con datos del Proceso */}
      <Box sx={{ mb: 4, p: 3, backgroundColor: "#ffffff", borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="#003366" mb={2}>
          Información del Proceso
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" color="#333">Objetivo:</Typography>
            <Typography color="#666">{proceso.objetivo || "Cargando..."}</Typography>
          </Grid>
          {/* ... repite para alcance, anioCertificado, etc. */}
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

        <Typography variant="h6" fontWeight="bold" color="#004A98" mb={2}>
          Información General del Mapa de Procesos
        </Typography>

        <Grid container spacing={2}>
          {/* EJEMPLO: mapeamos tus campos del mapaProceso */}
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
              <Typography fontWeight="bold" color="#333">{item.label}:</Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  multiline
                  minRows={1}
                  maxRows={6}
                  value={mapaProceso[item.key] || ""}
                  onChange={(e) => setMapaProceso({
                    ...mapaProceso,
                    [item.key]: e.target.value
                  })}
                />
              ) : (
                <Typography color="#666">
                  {mapaProceso[item.key] || "No disponible"}
                </Typography>
              )}
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Tarjetas expandidas */}
      {activeCards.length > 0 && (
        <Box sx={{ flex: 4, pr: 2, display: "flex", justifyContent: "center" }}>
          <Stack spacing={2}>
            {activeCards.map((user) => (
              <UserCard
                key={user.idIndicador}
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
          .filter((user) => !activeCards.some(u => u.idIndicador === user.idIndicador))
          .map((user) => (
            <UserCard
              key={user.idIndicador}
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
          top: isFixed ? 5 : 202,
          right: 30,
          zIndex: 50,
          paddingRight: 5,
          transition: "top 0.1s ease-in-out"
        }}
      >
        <Button
          variant="contained"
          sx={{
            width: 140,
            height: 40,
            borderRadius: 2,
            backgroundColor: "secondary.main",
            color: "#fff",
            "&:hover": { backgroundColor: "primary.main" }
          }}
          onClick={handleToggleAll}
          startIcon={allExpanded ? <ExpandLess /> : <ExpandMore />}
        >
          {allExpanded ? "Cerrar" : "Desplegar"}
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
        </Fab> )}
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
              variant="outlined"
              value={newUser.descripcion}
              onChange={(e) => setNewUser({ ...newUser, descripcion: e.target.value })}
              error={!!errors.descripcion}
              helperText={errors.descripcion}
            />
            <TextField
              label="Fórmula"
              fullWidth
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
          <IconButton
            onClick={() => onClose?.(user)}
            sx={{ color: "red", position: "absolute", top: "5px", right: "5px", zIndex: 10 }}
          >
            <Close />
          </IconButton>

          {onEdit && !soloLectura &&(
            <IconButton
              onClick={() => onEdit(user)}
              sx={{ color: "blue", position: "absolute", top: "5px", right: "80px", zIndex: 10 }}
            >
              <Edit />
            </IconButton>
          )}

          {onDelete && !soloLectura &&(
            <IconButton
              onClick={() => onDelete(user.idIndicador)}
              sx={{ color: "red", position: "absolute", top: "5px", right: "40px", zIndex: 10 }}
            >
              <Delete />
            </IconButton>
          )}

          <CardContent>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center" }}>
              {[
                { title: "Descripción", value: user.descripcion },
                { title: "Fórmula", value: user.formula },
                { title: "Periodo", value: user.periodoMed },
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
        <Typography variant="h6" fontWeight="bold" color="#004A98">
          Indicador
        </Typography>
      )}
    </Card>
  );
}

export default ProcessMapView;
