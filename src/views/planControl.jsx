import React, { useState, useEffect } from "react";
import { Box, Fab, Stack, Card, CardContent, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { Add, Close, ExpandMore, ExpandLess } from "@mui/icons-material";

const initialUsers = [
  {
      id: 1,
      actividadControl: "Evaluación de Syllabus",
      procedimiento: "Revisión semestral de contenido",
      criterioAceptacion: "Alineado con estándares académicos",
      caracteristicasVerificar: "Objetivos, bibliografía, métodos de evaluación",
      frecuencia: "Semestral",
      identificacionSalida: "Informe de cumplimiento",
      registroNoConforme: "Observaciones en acta de mejora",
      responsableLiberacion: "Comité Académico",
      tratamiento: "Ajustes y validación con docentes"
  },
  {
      id: 2,
      actividadControl: "Supervisión de Clases",
      procedimiento: "Visitas aleatorias a sesiones en curso",
      criterioAceptacion: "Uso de metodologías activas",
      caracteristicasVerificar: "Participación estudiantil, recursos usados",
      frecuencia: "Mensual",
      identificacionSalida: "Reporte de supervisión",
      registroNoConforme: "Revisión en reunión de calidad",
      responsableLiberacion: "Coordinación Académica",
      tratamiento: "Retroalimentación y plan de mejora"
  }
];

function ProcessMapView() {
    const [users, setUsers] = useState(initialUsers);
    const [errors, setErrors] = useState({});
    const [activeCards, setActiveCards] = useState([]);
    const [allExpanded, setAllExpanded] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [isFixed, setIsFixed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
          if (window.scrollY > 100) {
            setIsFixed(true);
          } else {
            setIsFixed(false);
          }
        };
      
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const [newUser, setNewUser] = useState({
        actividadControl: "",
        procedimiento: "",
        criterioAceptacion: "",
        caracteristicasVerificar: "",
        frecuencia: "",
        identificacionSalida: "",
        registroNoConforme: "",
        responsableLiberacion: "",
        tratamiento: ""
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

    const validateFields = () => {
        let tempErrors = {};
        if (!newUser.actividadControl.trim()) tempErrors.actividadControl = "Este campo es obligatorio";
        if (!newUser.procedimiento.trim()) tempErrors.procedimiento = "Este campo es obligatorio";
        if (!newUser.criterioAceptacion.trim()) tempErrors.criterioAceptacion = "Este campo es obligatorio";
        if (!newUser.caracteristicasVerificar.trim()) tempErrors.caracteristicasVerificar = "Este campo es obligatorio";
        if (!newUser.frecuencia.trim()) tempErrors.frecuencia = "Este campo es obligatorio";
        if (!newUser.identificacionSalida.trim()) tempErrors.identificacionSalida = "Este campo es obligatorio";
        if (!newUser.registroNoConforme.trim()) tempErrors.registroNoConforme = "Este campo es obligatorio";
        if (!newUser.responsableLiberacion.trim()) tempErrors.responsableLiberacion = "Este campo es obligatorio";
        if (!newUser.tratamiento.trim()) tempErrors.tratamiento = "Este campo es obligatorio";
    
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };    

    const handleAddUser = () => {
        if (validateFields()) {
            setUsers([...users, { id: users.length + 1, ...newUser }]);
            setOpenForm(false);
            setNewUser({
                actividadControl: "",
                procedimiento: "",
                criterioAceptacion: "",
                caracteristicasVerificar: "",
                frecuencia: "",
                identificacionSalida: "",
                registroNoConforme: "",
                responsableLiberacion: "",
                tratamiento: ""
            });
            setErrors({});
        }
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
                    .filter((user) => !activeCards.some(u => u.id === user.id))
                    .map((user) => (
                        <UserCard key={user.id} user={user} onSelect={handleSelectCard} isSmall={activeCards.length > 0} />
                    ))}
            </Box>

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

            <Box sx={{ position: "fixed", bottom: 16, right: 30, paddingRight: 5, paddingTop: 3 }}>
                <Fab
                    color="primary"
                    sx={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "secondary.main", "&:hover": { backgroundColor: "primary.main" } }}
                    onClick={() => setOpenForm(true)}
                >
                    <Add />
                </Fab>
            </Box>

            {openForm && (
                <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: "bold", color: "#0056b3" }}>Agregar Nuevo Plan de Control</DialogTitle>
                    <DialogContent>
                    <TextField
                        label="Actividad de Control"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={newUser.actividadControl}
                        onChange={(e) => setNewUser({ ...newUser, actividadControl: e.target.value })}
                        error={!!errors.actividadControl}
                        helperText={errors.actividadControl}
                    />

                    <TextField
                        label="Procedimiento"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={newUser.procedimiento}
                        onChange={(e) => setNewUser({ ...newUser, procedimiento: e.target.value })}
                        error={!!errors.procedimiento}
                        helperText={errors.procedimiento}
                    />

                    <TextField
                        label="Criterio de Aceptación"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={newUser.criterioAceptacion}
                        onChange={(e) => setNewUser({ ...newUser, criterioAceptacion: e.target.value })}
                        error={!!errors.criterioAceptacion}
                        helperText={errors.criterioAceptacion}
                    />

                    <TextField
                        label="Características a Verificar"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={newUser.caracteristicasVerificar}
                        onChange={(e) => setNewUser({ ...newUser, caracteristicasVerificar: e.target.value })}
                        error={!!errors.caracteristicasVerificar}
                        helperText={errors.caracteristicasVerificar}
                    />

                    <TextField
                        label="Frecuencia"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={newUser.frecuencia}
                        onChange={(e) => setNewUser({ ...newUser, frecuencia: e.target.value })}
                        error={!!errors.frecuencia}
                        helperText={errors.frecuencia}
                    />

                    <TextField
                        label="Identificación de Salida"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={newUser.identificacionSalida}
                        onChange={(e) => setNewUser({ ...newUser, identificacionSalida: e.target.value })}
                        error={!!errors.identificacionSalida}
                        helperText={errors.identificacionSalida}
                    />

                    <TextField
                        label="Registro de Salidas"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={newUser.registroNoConforme}
                        onChange={(e) => setNewUser({ ...newUser, registroNoConforme: e.target.value })}
                        error={!!errors.registroNoConforme}
                        helperText={errors.registroNoConforme}
                    />

                    <TextField
                        label="Responsable de Liberación"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={newUser.responsableLiberacion}
                        onChange={(e) => setNewUser({ ...newUser, responsableLiberacion: e.target.value })}
                        error={!!errors.responsableLiberacion}
                        helperText={errors.responsableLiberacion}
                    />

                    <TextField
                        label="Tratamiento"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={newUser.tratamiento}
                        onChange={(e) => setNewUser({ ...newUser, tratamiento: e.target.value })}
                        error={!!errors.tratamiento}
                        helperText={errors.tratamiento}
                    />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenForm(false)} sx={{ bgcolor: "#D3D3D3", color: "black" }}>Cancelar</Button>
                        <Button onClick={handleAddUser} sx={{ bgcolor: "#F9B800", color: "black" }}>Guardar</Button>
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
                              justifyContent: "center" 
                          }}
                      >
                          {[
                              { title: "Actividad de Control", value: user.actividadControl },
                              { title: "Procedimiento", value: user.procedimiento },
                              { title: "Criterio de Aceptación", value: user.criterioAceptacion },
                              { title: "Características a Verificar", value: user.caracteristicasVerificar },
                              { title: "Frecuencia", value: user.frecuencia },
                              { title: "Identificación de Salida", value: user.identificacionSalida },
                              { title: "Registro de Salidas", value: user.registroNoConforme },
                              { title: "Responsable de Liberación", value: user.responsableLiberacion },
                              { title: "Tratamiento", value: user.tratamiento },
                          ].map((field, index) => (
                              <TableContainer key={index} component={Paper} 
                                  sx={{ 
                                      width: "100%", 
                                      minWidth: "180px",
                                      boxShadow: 1 
                                  }}
                              >
                                  <Table>
                                      <TableBody>
                                          <TableRow>
                                              <TableCell sx={{ 
                                                  fontWeight: "bold", 
                                                  textAlign: "center", 
                                                  backgroundColor: "#e0e0e0", 
                                                  borderBottom: "2px solid #004A98" 
                                              }}>
                                                  {field.title}
                                              </TableCell>
                                          </TableRow>
                                          <TableRow>
                                              <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                                                  {field.value}
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
                  {user.actividadControl || `Plan de Control ${user.id}`} 
              </Typography>
              
          )}
      </Card>
  );
}

export default ProcessMapView;