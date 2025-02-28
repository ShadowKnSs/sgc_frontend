import React, { useState } from "react";
import { Box, Fab, Stack, Card, CardContent, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { Add, Close, ExpandMore, ExpandLess } from "@mui/icons-material";
import { MenuItem } from "@mui/material";

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
  },
  {
      id: 3,
      actividadControl: "Revisión de Trabajo de Titulación",
      procedimiento: "Evaluación por comisión de expertos",
      criterioAceptacion: "Cumple con criterios de investigación",
      caracteristicasVerificar: "Estructura, análisis, aportes científicos",
      frecuencia: "Trimestral",
      identificacionSalida: "Acta de revisión",
      registroNoConforme: "Correcciones antes de defensa",
      responsableLiberacion: "Departamento de Investigación",
      tratamiento: "Solicitud de ajustes a tutor"
  },
  {
      id: 4,
      actividadControl: "Control de Asistencia Docente",
      procedimiento: "Verificación en plataforma institucional",
      criterioAceptacion: "80% de cumplimiento en sesiones",
      caracteristicasVerificar: "Registros de clases dictadas",
      frecuencia: "Diario",
      identificacionSalida: "Reporte de cumplimiento",
      registroNoConforme: "Advertencia y seguimiento",
      responsableLiberacion: "Dirección Académica",
      tratamiento: "Plan de recuperación de clases"
  },
  {
      id: 5,
      actividadControl: "Evaluación de Satisfacción Estudiantil",
      procedimiento: "Encuestas digitales al finalizar cada curso",
      criterioAceptacion: "Satisfacción mayor al 75%",
      caracteristicasVerificar: "Docencia, materiales, recursos",
      frecuencia: "Semestral",
      identificacionSalida: "Informe de resultados",
      registroNoConforme: "Planes de mejora institucional",
      responsableLiberacion: "Unidad de Aseguramiento de la Calidad",
      tratamiento: "Capacitaciones y mejoras estratégicas"
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
        <Box sx={{ p: 4, display: "flex", minHeight: "100vh", flexDirection: "column" , paddingTop: 8}}>
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

            <Box sx={{ position: "absolute", top: 210, right: 30, zIndex: 10, paddingRight: 5, paddingTop: 3}}>
                <Button 
                variant="contained" 
                sx={{ width: 140, height: 40, borderRadius: 2, backgroundColor: "secondary.main", color: "#fff", "&:hover": { backgroundColor: "primary.main" }}} 
                onClick={handleToggleAll} 
                startIcon={allExpanded ? <ExpandLess /> : <ExpandMore />}
                >
                {allExpanded ? "Cerrar" : "Desplegar"}
                </Button>
            </Box>

            <Box sx={{ position: "fixed", bottom: 16, right: 30 }}>
                <Fab 
                color="primary" 
                sx={{ width: 56, height: 56, borderRadius: "50%", paddingRight: 5, backgroundColor: "secondary.main", "&:hover": { backgroundColor: "primary.main" } }} 
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
                          {/* Primera fila */}
                          <Box>
                              <Typography sx={{ fontWeight: "bold" }}>Actividad de Control:</Typography>
                              <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }} />
                          </Box>
                          <Box>
                              <Typography sx={{ fontWeight: "bold" }}>Procedimiento:</Typography>
                              <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }} />
                          </Box>

                          {/* Segunda fila */}
                          <Box>
                              <Typography sx={{ fontWeight: "bold" }}>Criterio de Aceptación:</Typography>
                              <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }} />
                          </Box>
                          <Box>
                              <Typography sx={{ fontWeight: "bold" }}>Características a Verificar:</Typography>
                              <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }} />
                          </Box>

                          {/* Tercera fila */}
                          <Box>
                              <Typography sx={{ fontWeight: "bold" }}>Frecuencia:</Typography>
                              <TextField
                                  fullWidth
                                  select  // Convierte el TextField en un Select
                                  name="frecuencia"
                                  variant="filled"
                                  sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }}
                              >
                                  <MenuItem value="Diario">Diario</MenuItem>
                                  <MenuItem value="Semanal">Semanal</MenuItem>
                                  <MenuItem value="Mensual">Mensual</MenuItem>
                              </TextField>
                              </Box>
                          <Box>
                              <Typography sx={{ fontWeight: "bold" }}>Identificación de Salida:</Typography>
                              <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }} />
                          </Box>

                          {/* Cuarta fila */}
                          <Box>
                              <Typography sx={{ fontWeight: "bold" }}>Registro de Salidas:</Typography>
                              <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }} />
                          </Box>
                          <Box>
                              <Typography sx={{ fontWeight: "bold" }}>Responsable de Liberación:</Typography>
                              <TextField
                                  fullWidth
                                  select  // Convierte el TextField en un Select
                                  name="responsableLiberacion"
                                  variant="filled"
                                  sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }}
                              >
                                  <MenuItem value="Supervisor">Supervisor</MenuItem>
                                  <MenuItem value="Lider de Proceso">Líder de Proceso</MenuItem>
                                  <MenuItem value="Auditor">Auditor</MenuItem>
                              </TextField>
                          </Box>

                          {/* Quinta fila (Tratamiento - una sola celda) */}
                          <Box sx={{ gridColumn: "span 2" }}>
                              <Typography sx={{ fontWeight: "bold" }}>Tratamiento:</Typography>
                              <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }} />
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
