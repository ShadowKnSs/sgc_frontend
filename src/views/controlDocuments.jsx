import React, { useState } from "react";
import {
  Box, Fab, Stack, Card, CardContent, Typography, IconButton, 
  Table, TableBody, TableCell, TableContainer, TableRow, Paper, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, FormGroup, FormControlLabel, Checkbox
} from "@mui/material";
import { Add, Close, ExpandMore, ExpandLess } from "@mui/icons-material";

const initialUsers = [
  {
    id: 1,
    nombreDocumento: "Manual de Calidad",
    tipo: "Interno",
    fechaRevision: "2024-03-15",
    responsable: "Líder de Proceso",
    medioAlmacenamiento: "Digital",
    lugarAlmacenamiento: "Servidor Interno",
    numeroCopias: "5",
    tipoAlmacenamiento: "Ambos",
    disposicion: "Conservación Permanente",
    usuarios: ["Alumnos", "Personal Administrativo"]
  },
  {
    id: 2,
    nombreDocumento: "Normas ISO",
    tipo: "Externo",
    fechaRevision: "2024-02-10",
    responsable: "Auditor",
    medioAlmacenamiento: "Físico",
    lugarAlmacenamiento: "Archivo Central",
    numeroCopias: "3",
    tipoAlmacenamiento: "Físico",
    disposicion: "Eliminación tras 5 años",
    usuarios: ["Coordinadores", "Personal Administrativo"]
  }
];

function ProcessMapView() {
  const [users, setUsers] = useState(initialUsers);
  const [activeCards, setActiveCards] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const [newUser, setNewUser] = useState({
    nombreDocumento: "",
    tipo: "",
    fechaRevision: "",
    responsable: "",
    medioAlmacenamiento: "",
    lugarAlmacenamiento: "",
    numeroCopias: "",
    tipoAlmacenamiento: "",
    disposicion: "",
    usuarios: []
  });

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

  const handleAddUser = () => {
    setUsers([...users, { id: users.length + 1, ...newUser }]);
    setOpenForm(false);
    setNewUser({
      nombreDocumento: "",
      tipo: "",
      fechaRevision: "",
      responsable: "",
      medioAlmacenamiento: "",
      lugarAlmacenamiento: "",
      numeroCopias: "",
      tipoAlmacenamiento: "",
      disposicion: "",
      usuarios: []
    });
  };  

  return (
    <Box sx={{ p: 4, display: "flex", minHeight: "100vh", flexDirection: "column", paddingTop: 8 }}>
      
      {activeCards.length > 0 && (
        <Box sx={{ flex: 4, pr: 2, display: "flex", justifyContent: "center" }}>
          <Stack spacing={2}>
            {activeCards.map((user) => (
              <UserCard key={user.id} user={user} isActive onClose={handleCloseCard} />
            ))}
          </Stack>
        </Box>
      )}

      <Box sx={{ flex: activeCards.length > 0 ? 1 : 5, display: "flex", flexWrap: "wrap", flexDirection: "row", justifyContent: "center", alignItems: "flex-start", gap: "15px", padding: 2, marginBottom: "310px" }}>
        {users.filter((user) => !activeCards.some(u => u.id === user.id)).map((user) => (
          <UserCard key={user.id} user={user} onSelect={handleSelectCard} isSmall={activeCards.length > 0} />
        ))}
      </Box>

      <Box sx={{ position: "absolute", top: 210, right: 30, zIndex: 10, paddingRight: 5, paddingTop: 3 }}>
        <Button 
          variant="contained" 
          sx={{ width: 140, height: 40, borderRadius: 2, backgroundColor: "secondary.main", color: "#fff", "&:hover": { backgroundColor: "primary.main" }}} 
          onClick={handleToggleAll} 
          startIcon={allExpanded ? <ExpandLess /> : <ExpandMore />}
        >
          {allExpanded ? "Cerrar" : "Desplegar"}
        </Button>
      </Box>

      <Box sx={{ position: "fixed", bottom: 16, right: 30, paddingRight: 5, paddingTop: 3 }}>
        <Fab 
          color="primary" 
          sx={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "secondary.main", "&:hover": { backgroundColor: "primary.main" } }} 
          onClick={() => setOpenForm(true)}
        >
          <Add />
        </Fab>
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
                />
                <TextField
                  label="Tipo"
                  fullWidth
                  select
                  variant="outlined"
                  value={newUser.tipo}
                  onChange={(e) => setNewUser({ ...newUser, tipo: e.target.value })}
                >
                  <MenuItem value="Interno">Interno</MenuItem>
                  <MenuItem value="Externo">Externo</MenuItem>
                </TextField>
                <TextField
                  label="Fecha de Revisión"
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  value={newUser.fechaRevision}
                  onChange={(e) => setNewUser({ ...newUser, fechaRevision: e.target.value })}
                />
                <TextField
                  label="Responsable"
                  fullWidth
                  select
                  variant="outlined"
                  value={newUser.responsable}
                  onChange={(e) => setNewUser({ ...newUser, responsable: e.target.value })}
                >
                  <MenuItem value="Auditor">Auditor</MenuItem>
                  <MenuItem value="Líder de Proceso">Líder de Proceso</MenuItem>
                  <MenuItem value="Supervisor">Supervisor</MenuItem>
                </TextField>
                <TextField
                  label="Medio de Almacenamiento"
                  fullWidth
                  variant="outlined"
                  value={newUser.medioAlmacenamiento}
                  onChange={(e) => setNewUser({ ...newUser, medioAlmacenamiento: e.target.value })}
                />
                <TextField
                  label="Lugar de Almacenamiento"
                  fullWidth
                  variant="outlined"
                  value={newUser.lugarAlmacenamiento}
                  onChange={(e) => setNewUser({ ...newUser, lugarAlmacenamiento: e.target.value })}
                />
                <TextField
                  label="Número de Copias"
                  fullWidth
                  variant="outlined"
                  value={newUser.numeroCopias}
                  onChange={(e) => setNewUser({ ...newUser, numeroCopias: e.target.value })}
                />
                <TextField
                  label="Tipo de Almacenamiento"
                  fullWidth
                  select
                  variant="outlined"
                  value={newUser.tipoAlmacenamiento}
                  onChange={(e) => setNewUser({ ...newUser, tipoAlmacenamiento: e.target.value })}
                >
                  <MenuItem value="Físico">Físico</MenuItem>
                  <MenuItem value="Digital">Digital</MenuItem>
                  <MenuItem value="Ambos">Ambos</MenuItem>
                </TextField>
                <TextField
                  label="Disposición"
                  fullWidth
                  variant="outlined"
                  value={newUser.disposicion}
                  onChange={(e) => setNewUser({ ...newUser, disposicion: e.target.value })}
                />
                <Box>
                  <Typography sx={{ fontWeight: "bold" }}>Usuarios:</Typography>
                  <FormGroup row>
                    {["Alumnos", "Personal Administrativo", "Funcionariado", "Coordinadores"].map(user => (
                      <FormControlLabel
                        key={user}
                        control={
                          <Checkbox
                            checked={newUser.usuarios.includes(user)}
                            onChange={(e) => {
                              setNewUser((prev) => ({
                                ...prev,
                                usuarios: e.target.checked
                                  ? [...prev.usuarios, user]
                                  : prev.usuarios.filter(u => u !== user)
                              }));
                            }}
                          />
                        }
                        label={user}
                      />
                    ))}
                  </FormGroup>
                </Box>
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
      </Box>
    </Box>
  );
}

function UserCard({ user, onSelect, onClose, isActive }) {
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
          <IconButton
            onClick={() => onClose(user)}
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
                justifyContent: "center",
              }}
            >
              {[
                { title: "Nombre del Documento", value: user.nombreDocumento || "Sin especificar" },
                { title: "Tipo", value: user.tipo || "Sin especificar" },
                { title: "Fecha de Revisión", value: user.fechaRevision || "Sin especificar" },
                { title: "Responsable", value: user.responsable || "Sin especificar" },
                { title: "Medio de Almacenamiento", value: user.medioAlmacenamiento || "Sin especificar" },
                { title: "Lugar de Almacenamiento", value: user.lugarAlmacenamiento || "Sin especificar" },
                { title: "Número de Copias", value: user.numeroCopias || "Sin especificar" },
                { title: "Tipo de Almacenamiento", value: user.tipoAlmacenamiento || "Sin especificar" },
                { title: "Disposición", value: user.disposicion || "Sin especificar" },
                { title: "Usuarios", value: Array.isArray(user.usuarios) ? user.usuarios.join(", ") : "Sin especificar" },
              ].map((field, index) => (
                <TableContainer key={index} component={Paper} sx={{ width: "100%", minWidth: "180px", boxShadow: 1 }}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                            backgroundColor: "#e0e0e0",
                            borderBottom: "2px solid #004A98",
                          }}
                        >
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
