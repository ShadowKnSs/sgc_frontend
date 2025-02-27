import React, { useState } from "react";
import {
  Box, Fab, Stack, Card, CardContent, Typography, IconButton, 
  Table, TableBody, TableCell, TableContainer, TableRow, Paper, 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, 
  MenuItem, FormGroup, FormControlLabel, Checkbox
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
  const [openForm, setOpenForm] = useState(false);
  const [activeCards, setActiveCards] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);

  const handleAddUser = (newUser) => {
    setUsers([...users, { id: users.length + 1, ...newUser }]);
    setOpenForm(false);
  };

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

  return (
    <Box sx={{ p: 4, display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      
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

      <Box sx={{ position: "fixed", bottom: 16, right: 50, display: "flex", gap: 2 }}>
        <Fab color="primary" sx={{ width: 56, height: 56, borderRadius: 2, backgroundColor: "#004A98" }} onClick={() => setOpenForm(true)}>
          <Add />
        </Fab>

        <Button variant="contained" sx={{ width: 180, height: 56, borderRadius: 2, backgroundColor: "#004A98", color: "#fff", "&:hover": { backgroundColor: "#003366" }}} onClick={handleToggleAll} startIcon={allExpanded ? <ExpandLess /> : <ExpandMore />}>
          {allExpanded ? "Cerrar Todo" : "Desplegar Todos"}
        </Button>
      </Box>

      {openForm && (
        <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="lg" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>Agregar Nuevo Registro</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, p: 2 }}>
              
              {[
                { label: "Nombre del Documento", name: "nombreDocumento" },
                { label: "Tipo", name: "tipo", options: ["Interno", "Externo"] },
                { label: "Fecha de Revisión", name: "fechaRevision", type: "date" },
                { label: "Responsable", name: "responsable", options: ["Auditor", "Líder de Proceso", "Supervisor"] },
                { label: "Medio de Almacenamiento", name: "medioAlmacenamiento" },
                { label: "Lugar de Almacenamiento", name: "lugarAlmacenamiento" },
                { label: "Número de Copias", name: "numeroCopias" },
                { label: "Tipo de Almacenamiento", name: "tipoAlmacenamiento", options: ["Físico", "Digital", "Ambos"] },
                { label: "Disposición", name: "disposicion" },
              ].map((field, index) => (
                <Box key={index}>
                  <Typography sx={{ fontWeight: "bold" }}>{field.label}:</Typography>
                  {field.options ? (
                    <TextField fullWidth select name={field.name} variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }}>
                      {field.options.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                    </TextField>
                  ) : (
                    <TextField fullWidth type={field.type || "text"} name={field.name} variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }} />
                  )}
                </Box>
              ))}

              {/* Checkboxes de Usuarios */}
              <Box sx={{ gridColumn: "span 2" }}>
                <Typography sx={{ fontWeight: "bold" }}>Usuarios:</Typography>
                <FormGroup row>
                  {["Alumnos", "Personal Administrativo", "Funcionariado", "Coordinadores"].map(user => (
                    <FormControlLabel key={user} control={<Checkbox />} label={user} />
                  ))}
                </FormGroup>
              </Box>

            </Box>
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center", padding: 2 }}>
            <Button onClick={() => setOpenForm(false)} variant="outlined" color="error">
              Cancelar
            </Button>
            <Button onClick={handleAddUser} variant="contained" color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      )}
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
