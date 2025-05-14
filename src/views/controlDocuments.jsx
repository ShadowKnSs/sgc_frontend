import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Fab, Stack, Card, CardContent, Typography, IconButton,
  Table, TableBody, TableCell, TableContainer, TableRow, Paper,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, FormGroup, FormControlLabel, Checkbox
} from "@mui/material";
import { Add, Close, ExpandMore, ExpandLess, Edit, Delete } from "@mui/icons-material";
import MensajeAlert from "../components/MensajeAlert";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";

const initialNewUserState = {
  nombreDocumento: "",
  codigoDocumento: "",
  tipoDocumento: "",
  fechaRevision: "",
  fechaVersion: null,
  noRevision: 0,
  noCopias: 0,
  tiempoRetencion: 0,
  lugarAlmacenamiento: "",
  medioAlmacenamiento: "",
  disposicion: "",
  usuarios: []
};

function ProcessMapView({ soloLectura, idProceso }) {
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [activeCards, setActiveCards] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [alerta, setAlerta] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [docAEliminar, setDocAEliminar] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/documentos?proceso=${idProceso}`)
    .then((resp) => {
      setUsers(resp.data);
    })
    .catch((error) => {
      console.error("Error al obtener documentos:", error);
    });
    const handleScroll = () => {
    if (window.scrollY > 100) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [idProceso]);

  const [newUser, setNewUser] = useState(initialNewUserState);

  const handleSelectCard = (user) => {
    if (!activeCards.some(u => u.idDocumento === user.idDocumento)) {
      setActiveCards([...activeCards, user]);
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }, 100);
    }
  };

  const handleCloseCard = (user) => {
    setActiveCards(activeCards.filter((u) => u.idDocumento !== user.idDocumento));
  };

  const handleToggleAll = () => {
    if (allExpanded) {
      setActiveCards([]);
    } else {
      setActiveCards([...users]);
    }
    setAllExpanded(!allExpanded);
  };

  const confirmarEliminacion = () => {
    axios.delete(`http://localhost:8000/api/documentos/${docAEliminar.idDocumento}`)
      .then(() => {
        setUsers(prev => prev.filter(u => u.idDocumento !== docAEliminar.idDocumento));
        setAlerta({ tipo: "success", texto: "Documento eliminado correctamente" });
      })
      .catch(() => {
        setAlerta({ tipo: "error", texto: "Error al eliminar el documento" });
      })
      .finally(() => {
        setConfirmDialogOpen(false);
        setDocAEliminar(null);
      });
  };  

  const validateFields = () => {
    let tempErrors = {};

    if (!newUser.nombreDocumento?.trim()) tempErrors.nombreDocumento = "Este campo es obligatorio";
    if (!newUser.tipoDocumento) tempErrors.tipoDocumento = "Debe seleccionar un tipo de documento";
    if (!newUser.fechaRevision) tempErrors.fechaRevision = "Debe seleccionar una fecha";
    if (newUser.tipoDocumento === "externo" && !newUser.fechaVersion) {
      tempErrors.fechaVersion = "Debe seleccionar una fecha";
    }
    if (!newUser.lugarAlmacenamiento?.trim()) tempErrors.lugarAlmacenamiento = "Este campo es obligatorio";
    if (!newUser.medioAlmacenamiento) tempErrors.medioAlmacenamiento = "Debe seleccionar un medio de almacenamiento";
    if (!newUser.disposicion?.trim()) tempErrors.disposicion = "Este campo es obligatorio";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleAddUser = () => {
    if (!validateFields()) return;
  
    const payload = { 
      ...newUser, 
      idProceso,
      responsable: newUser.usuarios.join(", "),
    };    
  console.log("Payload:", payload)
    axios.post("http://localhost:8000/api/documentos", payload)
      .then((res) => {
        setUsers(prev => [...prev, res.data]);
        setOpenForm(false);
        setNewUser(initialNewUserState);  // como antes
      })
    .catch((error) => {
      console.error("Error al crear documento:", error.response?.data);
    });
  };
  
  const handleEditDocument = (doc) => {
    setEditDoc({
      ...doc,
      usuarios: doc.responsable ? doc.responsable.split(',').map(r => r.trim()) : []
    });
    setEditDialogOpen(true);
  };
  
  const handleSaveEditDocument = () => {
    if (!editDoc) return;
  
    const payload = {
      ...editDoc,
      responsable: editDoc.usuarios?.join(", ") || ""
    };
    delete payload.usuarios;
  
    axios.put(`http://localhost:8000/api/documentos/${editDoc.idDocumento}`, payload)
      .then((res) => {
        setUsers((prev) =>
          prev.map((u) => u.idDocumento === res.data.idDocumento ? res.data : u)
        );
        setEditDoc(null);
        setEditDialogOpen(false);
        setActiveCards([]);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setAlerta({ tipo: "success", texto: "Documento editado exitosamente" });
      })
      .catch(() => {
        setAlerta({ tipo: "error", texto: "Error al editar el documento" });
      });
  };  

  const handleDeleteDocument = (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este documento?");
    if (!confirmar) return;
  
    axios.delete(`http://localhost:8000/api/documentos/${id}`)
      .then(() => {
        setUsers(prev => prev.filter(u => u.idDocumento !== id));
        alert("Documento eliminado correctamente.");
      })
      .catch(console.error);
  };
  
  return (
    <Box sx={{ p: 4, display: "flex", minHeight: "100vh", flexDirection: "column", paddingTop: 1 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#0056b3", mb: 2 }}>
        DOCUMENTOS
      </Typography>
      {alerta && (
        <MensajeAlert
          tipo={alerta.tipo}
          texto={alerta.texto}
          onClose={() => setAlerta(null)}
        />
      )}
      {activeCards.length > 0 && (
        <Box sx={{ flex: 4, pr: 2, display: "flex", justifyContent: "center" }}>
          <Stack spacing={2}>
          {activeCards.map((user) => (
            <UserCard
              key={user.idDocumento}
              user={user}
              isActive
              onClose={handleCloseCard}
              onEdit={handleEditDocument}
              onDelete={() => {
                setDocAEliminar(user);
                setConfirmDialogOpen(true);
              }}
              soloLectura={soloLectura}
            />
          ))}
          </Stack>
        </Box>
      )}

      <Box sx={{ flex: activeCards.length > 0 ? 1 : 5, display: "flex", flexWrap: "wrap", flexDirection: "row", justifyContent: "center", alignItems: "flex-start", gap: "15px", padding: 2, marginBottom: "310px" }}>
        {users.filter((user) => !activeCards.some(u => u.idDocumento === user.idDocumento)).map((user) => (
          <UserCard
            key={user.idDocumento}
            user={user}
            onSelect={handleSelectCard}
            onEdit={handleEditDocument}
            onDelete={() => {
              setDocAEliminar(user);
              setConfirmDialogOpen(true);
            }}
            isSmall={activeCards.length > 0}
            soloLectura={soloLectura}
          />
        ))}
      </Box>

      <Box
        sx={{
          position: "fixed",
          top: isFixed ? 33 : 140,
          right: -30,
          zIndex: 50,
          paddingRight: 5,
          transition: "top 0.1s ease-in-out"
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

      <Box sx={{ position: "fixed", bottom: 16, right: 30, paddingRight: 5, paddingTop: 3 }}>
        {!soloLectura && (
          <Box sx={{ position: "fixed", bottom: 16, right: 30, paddingRight: 5, paddingTop: 3 }}>
            <Fab
              color="primary"
              sx={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "secondary.main", "&:hover": { backgroundColor: "primary.main" } }}
              onClick={() => setOpenForm(true)}
            >
              <Add />
            </Fab>
          </Box>
        )}
        {openForm && (
          <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold", color: "#0056b3" }}>
              Agregar Nuevo Documento
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
                <TextField
                  label="Nombre del Documento"
                  fullWidth
                  variant="outlined"
                  value={newUser.nombreDocumento}
                  onChange={(e) => setNewUser({ ...newUser, nombreDocumento: e.target.value })}
                  error={!!errors.nombreDocumento}
                  helperText={errors.nombreDocumento}
                />

                <TextField
                  label="Tipo de Documento"
                  fullWidth
                  select
                  variant="outlined"
                  value={newUser.tipoDocumento}
                  onChange={(e) => {
                    const tipo = e.target.value;
                    setNewUser({
                      ...newUser,
                      tipoDocumento: tipo,
                      fechaVersion: tipo === "externo" ? newUser.fechaVersion : null
                    });
                  }}
                  error={!!errors.tipoDocumento}
                  helperText={errors.tipoDocumento}
                >
                  <MenuItem value="interno">INT</MenuItem>
                  <MenuItem value="externo">EXT</MenuItem>
                </TextField>

                {newUser.tipoDocumento === "externo" && (
                  <TextField
                    label="Fecha de Última Versión"
                    fullWidth
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    value={newUser.fechaVersion}
                    onChange={(e) => setNewUser({ ...newUser, fechaVersion: e.target.value })}
                    error={!!errors.fechaVersion}
                    helperText={errors.fechaVersion}
                  />
                )}

                <TextField
                  label="Revisión (Aplica para Documentos Internos)"
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  value={newUser.fechaRevision}
                  onChange={(e) => setNewUser({ ...newUser, fechaRevision: e.target.value })}
                  error={!!errors.fechaRevision}
                  helperText={errors.fechaRevision}
                />

                <TextField
                  label="Responsable"
                  fullWidth
                  variant="outlined"
                  value={newUser.responsable}
                  onChange={(e) => setNewUser({ ...newUser, responsable: e.target.value })}
                  error={!!errors.responsable}
                  helperText={errors.responsable}
                />

                <Box>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>Usuarios:</Typography>
                  <FormGroup row>
                    {[
                      "ALUMNOS",
                      "PERSONAL ADMINISTRATIVO",
                      "FUNCIONARIADO",
                      "FUNCIONARIOS",
                      "COORDINADORES DE SERVICIO SOCIAL"
                    ].map((usuario) => (
                      <FormControlLabel
                        key={usuario}
                        control={
                          <Checkbox
                            checked={newUser.usuarios.includes(usuario)}
                            onChange={(e) => {
                              const updated = e.target.checked
                                ? [...newUser.usuarios, usuario]
                                : newUser.usuarios.filter((u) => u !== usuario);
                              setNewUser({ ...newUser, usuarios: updated });
                            }}
                          />
                        }
                        label={usuario}
                      />
                    ))}
                  </FormGroup>
                </Box>

                <TextField
                  label="No. Copias"
                  fullWidth
                  type="number"
                  variant="outlined"
                  value={newUser.noCopias}
                  onChange={(e) => setNewUser({ ...newUser, noCopias: parseInt(e.target.value) || 0 })}
                  error={!!errors.noCopias}
                  helperText={errors.noCopias}
                  inputProps={{ min: 0 }}
                />

                <TextField
                  label="Medio de Almacenamiento"
                  fullWidth
                  select
                  variant="outlined"
                  value={newUser.medioAlmacenamiento}
                  onChange={(e) => setNewUser({ ...newUser, medioAlmacenamiento: e.target.value })}
                  error={!!errors.medioAlmacenamiento}
                  helperText={errors.medioAlmacenamiento}
                >
                  <MenuItem value="Físico">Físico</MenuItem>
                  <MenuItem value="Digital">Digital</MenuItem>
                  <MenuItem value="Ambos">Ambos</MenuItem>
                </TextField>

                <TextField
                  label="Tiempo de Retención"
                  fullWidth
                  type="number"
                  variant="outlined"
                  value={newUser.tiempoRetencion}
                  onChange={(e) => setNewUser({ ...newUser, tiempoRetencion: parseInt(e.target.value) || 0 })}
                  error={!!errors.tiempoRetencion}
                  helperText={errors.tiempoRetencion}
                  inputProps={{ min: 0 }}
                />

                <TextField
                  label="Lugar de Almacenamiento"
                  fullWidth
                  variant="outlined"
                  value={newUser.lugarAlmacenamiento}
                  onChange={(e) => setNewUser({ ...newUser, lugarAlmacenamiento: e.target.value })}
                  error={!!errors.lugarAlmacenamiento}
                  helperText={errors.lugarAlmacenamiento}
                />

                <TextField
                  label="Disposición después del Periodo de Retención"
                  fullWidth
                  variant="outlined"
                  value={newUser.disposicion}
                  onChange={(e) => setNewUser({ ...newUser, disposicion: e.target.value })}
                  error={!!errors.disposicion}
                  helperText={errors.disposicion}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", padding: 2 }}>
              <Button
                onClick={() => setOpenForm(false)}
                variant="outlined"
                sx={{
                  borderColor: "#d32f2f",
                  color: "#d32f2f",
                  "&:hover": { backgroundColor: "#ffebee", borderColor: "#d32f2f" },
                }}
              >
                CANCELAR
              </Button>
              <Button
                onClick={handleAddUser}
                variant="contained"
                sx={{ backgroundColor: "#F9B800", color: "#000", "&:hover": { backgroundColor: "#c79100" } }}
              >
                GUARDAR
              </Button>
            </DialogActions>
          </Dialog>
        )}
        {editDialogOpen && (
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold", color: "#0056b3" }}>
            Editar Documento
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
              <TextField
                label="Nombre del Documento"
                fullWidth
                variant="outlined"
                value={editDoc?.nombreDocumento || ""}
                onChange={(e) => setEditDoc({ ...editDoc, nombreDocumento: e.target.value })}
              />

              <TextField
                label="Código del Documento"
                fullWidth
                variant="outlined"
                value={editDoc?.codigoDocumento || ""}
                onChange={(e) => setEditDoc({ ...editDoc, codigoDocumento: e.target.value })}
              />

              <TextField
                label="Tipo de Documento"
                fullWidth
                select
                variant="outlined"
                value={editDoc?.tipoDocumento || ""}
                onChange={(e) => {
                  const tipo = e.target.value;
                  setEditDoc({
                    ...editDoc,
                    tipoDocumento: tipo,
                    fechaVersion: tipo === "externo" ? editDoc.fechaVersion : null
                  });
                }}
              >
                <MenuItem value="interno">INT</MenuItem>
                <MenuItem value="externo">EXT</MenuItem>
              </TextField>

              {editDoc?.tipoDocumento === "externo" && (
                <TextField
                  label="Fecha de Última Versión"
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  value={editDoc.fechaVersion || ""}
                  onChange={(e) => setEditDoc({ ...editDoc, fechaVersion: e.target.value })}
                />
              )}

              <TextField
                label="Revisión (Aplica para Documentos Internos)"
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={editDoc?.fechaRevision || ""}
                onChange={(e) => setEditDoc({ ...editDoc, fechaRevision: e.target.value })}
              />

              <Box>
                <Typography sx={{ fontWeight: "bold", mb: 1 }}>Usuarios:</Typography>
                <FormGroup row>
                  {[
                    "ALUMNOS",
                    "PERSONAL ADMINISTRATIVO",
                    "FUNCIONARIADO",
                    "FUNCIONARIOS",
                    "COORDINADORES DE SERVICIO SOCIAL"
                  ].map((usuario) => (
                    <FormControlLabel
                      key={usuario}
                      control={
                        <Checkbox
                          checked={editDoc.usuarios?.includes(usuario)}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...editDoc.usuarios, usuario]
                              : editDoc.usuarios.filter((u) => u !== usuario);
                            setEditDoc({ ...editDoc, usuarios: updated });
                          }}
                        />
                      }
                      label={usuario}
                    />
                  ))}
                </FormGroup>
              </Box>

              <TextField
                label="No. Copias"
                fullWidth
                type="number"
                variant="outlined"
                value={editDoc?.noCopias || 0}
                onChange={(e) => setEditDoc({ ...editDoc, noCopias: parseInt(e.target.value) || 0 })}
              />

              <TextField
                label="Medio de Almacenamiento"
                fullWidth
                select
                variant="outlined"
                value={editDoc?.medioAlmacenamiento || ""}
                onChange={(e) => setEditDoc({ ...editDoc, medioAlmacenamiento: e.target.value })}
              >
                <MenuItem value="Físico">Físico</MenuItem>
                <MenuItem value="Digital">Digital</MenuItem>
                <MenuItem value="Ambos">Ambos</MenuItem>
              </TextField>

              <TextField
                label="Tiempo de Retención"
                fullWidth
                type="number"
                variant="outlined"
                value={editDoc?.tiempoRetencion || 0}
                onChange={(e) => setEditDoc({ ...editDoc, tiempoRetencion: parseInt(e.target.value) || 0 })}
              />

              <TextField
                label="Lugar de Almacenamiento"
                fullWidth
                variant="outlined"
                value={editDoc?.lugarAlmacenamiento || ""}
                onChange={(e) => setEditDoc({ ...editDoc, lugarAlmacenamiento: e.target.value })}
              />

              <TextField
                label="Disposición después del Periodo de Retención"
                fullWidth
                variant="outlined"
                value={editDoc?.disposicion || ""}
                onChange={(e) => setEditDoc({ ...editDoc, disposicion: e.target.value })}
              />
            </Box>
          </DialogContent>
    <DialogActions sx={{ justifyContent: "center", padding: 2 }}>
      <Button
        onClick={() => setEditDialogOpen(false)}
        variant="outlined"
        sx={{
          borderColor: "#d32f2f",
          color: "#d32f2f",
          "&:hover": { backgroundColor: "#ffebee", borderColor: "#d32f2f" },
        }}
      >
        CANCELAR
      </Button>
      <Button
        onClick={handleSaveEditDocument}
        variant="contained"
        sx={{ backgroundColor: "#F9B800", color: "#000", "&:hover": { backgroundColor: "#c79100" } }}
      >
        GUARDAR CAMBIOS
      </Button>
    </DialogActions>
  </Dialog>
)}
      </Box>
      <ConfirmDeleteDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmarEliminacion}
        itemName={docAEliminar?.nombreDocumento || "este documento"}
      />
    </Box>
    
  );
}

function UserCard({ user, onSelect, onClose, isActive, onEdit, onDelete, soloLectura }) {
  return (
    <Card
      sx={{
        width: isActive ? "85vw" : 180,
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
        position: "relative",
      }}
      onClick={!isActive ? () => onSelect(user) : undefined}
    >
      {isActive ? (
        <>
      {isActive && (
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

          {!soloLectura && (
            <>
              <IconButton onClick={() => onEdit?.(user)} sx={{ color: "blue" }}>
                <Edit />
              </IconButton>
              <IconButton onClick={onDelete} sx={{ color: "red" }}>
                <Delete />
              </IconButton>
            </>
          )}
        </Box>
      )}
          <CardContent>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              {[
                { title: "Nombre del Documento", value: user.nombreDocumento || "Sin especificar" },
                { title: "Código del Documento", value: user.codigoDocumento || "Sin especificar" },
                { title: "Tipo", value: user.tipoDocumento || "Sin especificar" },
                { title: "Fecha de Revisión", value: user.fechaRevision || "Sin especificar" },
                { title: "Fecha de Versión", value: user.fechaVersion || "Sin especificar" },
                { title: "Número de Revisiones", value: user.noRevision || "Sin especificar" },
                { title: "Número de Copias", value: user.noCopias || "Sin especificar" },
                { title: "Tiempo de Retención (años)", value: user.tiempoRetencion || "Sin especificar" },
                { title: "Lugar de Almacenamiento", value: user.lugarAlmacenamiento || "Sin especificar" },
                { title: "Medio de Almacenamiento", value: user.medioAlmacenamiento || "Sin especificar" },
                { title: "Disposición", value: user.disposicion || "Sin especificar" },
                { title: "Usuarios", value: user.responsable || "Sin especificar" }
              ].map((field, index) => (
                <TableContainer key={index} component={Paper} sx={{ width: "100%", minWidth: "180px", boxShadow: 1 }}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#e0e0e0", borderBottom: "2px solid #004A98" }}>
                          {field.title}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ textAlign: "center", padding: "8px" }}>{field.value}</TableCell>
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
          {user.nombreDocumento || `Documento ${user.id}`}
        </Typography>
      )}
    </Card>
  );
}

export default ProcessMapView;
