import React, { useState } from "react";
import {
  Box, Fab, Stack, Card, CardContent, Typography, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Table, TableBody, TableCell, TableContainer, TableRow, Paper
} from "@mui/material";
import { Add, Close, ExpandMore, ExpandLess } from "@mui/icons-material";

const initialUsers = [
  {
    id: 1,
    fechaInicio: "2024-02-01",
    codigoPlan: "PLAN-001",
    origenConformidad: "Interno",
    equipoMejora: "Equipo A",
    requisito: "Norma ISO 9001",
    incumplimiento: "Falta de evidencia en auditoría",
    evidencia: "Reporte de auditoría",
    revision: "2024-03-15",
    causa: "Falta de capacitación"
  },
  {
    id: 2,
    fechaInicio: "2024-03-05",
    codigoPlan: "PLAN-002",
    origenConformidad: "Externo",
    equipoMejora: "Equipo B",
    requisito: "Reglamento interno",
    incumplimiento: "No cumplimiento de procedimiento",
    evidencia: "Registro de control",
    revision: "2024-04-10",
    causa: "Desactualización de procesos"
  }
];

function ProcessMapView() {
  const [users, setUsers] = useState(initialUsers);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeCards, setActiveCards] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);

  const handleAddUser = () => {
    setUsers([...users, { id: users.length + 1, ...formData }]);
    setOpenForm(false);
    setFormData({});
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

      <Box sx={{ position: "absolute", top: 210, right: 30, zIndex: 10 }}>
        <Button 
          variant="contained" 
          sx={{ width: 140, height: 40, borderRadius: 2, backgroundColor: "#0056B3", color: "#fff", "&:hover": { backgroundColor: "#003366" }}} 
          onClick={handleToggleAll} 
          startIcon={allExpanded ? <ExpandLess /> : <ExpandMore />}
        >
          {allExpanded ? "Cerrar" : "Desplegar"}
        </Button>
      </Box>

      <Box sx={{ position: "fixed", bottom: 16, right: 30 }}>
        <Fab 
          color="primary" 
          sx={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#0056B3", "&:hover": { backgroundColor: "#003366" } }} 
          onClick={() => setOpenForm(true)}
        >
          <Add />
        </Fab>
      </Box>

      {openForm && (
        <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="lg" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>Agregar Nuevo Registro</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, p: 2 }}>
              
              {[ 
                { label: "Fecha de Inicio", name: "fechaInicio", type: "date" },
                { label: "Código del Plan", name: "codigoPlan" },
                { label: "Origen Conformidad", name: "origenConformidad" },
                { label: "Equipo de Mejora", name: "equipoMejora" },
                { label: "Requisito", name: "requisito" },
                { label: "Incumplimiento", name: "incumplimiento" },
                { label: "Evidencia", name: "evidencia" },
                { label: "Fecha de Revisión", name: "revision", type: "date" },
                { label: "Causa", name: "causa" },
              ].map((field, index) => (
                <Box key={index}>
                  <Typography sx={{ fontWeight: "bold" }}>{field.label}:</Typography>
                  <TextField 
                    fullWidth 
                    type={field.type || "text"} 
                    name={field.name} 
                    value={formData[field.name] || ""}
                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    variant="filled" 
                    sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }} 
                  />
                </Box>
              ))}
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
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", justifyContent: "center" }}>
                {Object.entries(user)
                    .filter(([key]) => key !== "id") // 🔹 Remueve el ID de la visualización
                    .map(([key, value]) => (
                    <TableContainer key={key} component={Paper} sx={{ width: "100%", minWidth: "180px", boxShadow: 1 }}>
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
                                {key}
                            </TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell sx={{ textAlign: "center", padding: "8px" }}>{value}</TableCell>
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
            {user.codigoPlan}
            </Typography>
        )}
        </Card>
    );
}
  
export default ProcessMapView;
