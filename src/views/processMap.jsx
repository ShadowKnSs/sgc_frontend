import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
    Box, Fab, Stack, Card, CardContent, Typography, IconButton, 
    Table, TableBody, TableCell, TableContainer, TableRow, Paper, 
    Button, Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, MenuItem, Grid, Divider
  } from "@mui/material";  
import { Add, Close, ExpandMore, ExpandLess, Edit, Delete } from "@mui/icons-material";

const initialUsers = [];

function ProcessMapView() {
    const [users, setUsers] = useState(initialUsers);
    const [errors, setErrors] = useState({});
    const [activeCards, setActiveCards] = useState([]);
    const [allExpanded, setAllExpanded] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isFixed, setIsFixed] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [editFormOpen, setEditFormOpen] = useState(false);
    
    const newIdIndicador = users.length > 0 ? Math.max(...users.map(u => u.idIndicador)) + 1 : 1;

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

    useEffect(() => {
        // Obtener datos del proceso
        axios.get("http://localhost:8000/api/procesos")
            .then(response => {
                console.log("Datos recibidos (procesos):", response.data);
                
                if (response.data.procesos && response.data.procesos.length > 0) {
                    setProceso(response.data.procesos[0]);  // Tomamos el primer proceso
                } else {
                    console.error("No se encontraron procesos en la respuesta de la API.");
                }
            })
            .catch(error => {
                console.error("Error al obtener los datos del proceso:", error);
            });

        axios.get("http://localhost:8000/api/indmapaproceso")
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => console.error("Error al cargar indicadores:", error));
    
        // Obtener datos del mapa de procesos
        axios.get("http://localhost:8000/api/mapaproceso")
            .then(response => {
                console.log("Datos recibidos (mapaProceso):", response.data);
                
                if (response.data.length > 0) {
                    setMapaProceso(response.data[0]); // Tomamos el primer registro
                } else {
                    console.error("No se encontraron datos de mapa de procesos.");
                }
            })
            .then(response => {
                if (response && response.data) {
                    const data = Array.isArray(response.data) ? response.data : [response.data]; // Convertir en array si es un objeto
                    setUsers(data);
                    console.log("Usuarios cargados:", data);
                } else {
                    console.error("No se encontraron indicadores.");
                }
            })            
            .catch(error => {
                console.error("Error al obtener los datos del mapa de procesos:", error);
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
    }, []);

    const handleEditToggle = () => setEditMode(!editMode);

    const [newUser, setNewUser] = useState({
        descripcion: "",
        formula: "",
        periodo: "",
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
        if (!newUser.descripcion.trim()) tempErrors.descripcion = "Este campo es obligatorio";
        if (!newUser.formula.trim()) tempErrors.formula = "Este campo es obligatorio";
        if (!newUser.periodo.trim()) tempErrors.periodo = "Debe seleccionar un período";
    
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };    

    const handleAddUser = () => {
        if (validateFields()) {
            axios.post("http://localhost:8000/api/indmapaproceso", {
                idMapaProceso: mapaProceso.idMapaProceso, 
                idIndicador: newIdIndicador,
                idResponsable: 1, // Ajusta esto con el id correcto
                descripcion: newUser.descripcion, 
                formula: newUser.formula, 
                periodoMed: newUser.periodo 
            })
            .then(response => {
                setUsers([...users, response.data]); // Agrega el nuevo indicador a la lista
                setOpenForm(false); // Cierra el formulario
                setNewUser({ descripcion: "", formula: "", periodo: "" }); // Resetea los valores
                setErrors({});
            })
            .catch(error => console.error("Error al agregar indicador:", error));
        }
    };              
    
    const handleSaveChanges = () => {
        if (!mapaProceso.idMapaProceso) {
            console.error("Error: No hay un idMapaProceso disponible para actualizar.");
            return;
        }
    
        axios.put(`http://localhost:8000/api/mapaproceso/${mapaProceso.idMapaProceso}`, mapaProceso)
            .then(response => {
                console.log("Mapa de procesos actualizado correctamente:", response.data);
                setEditMode(false); // Salir del modo edición después de guardar
            })
            .catch(error => {
                console.error("Error al actualizar el mapa de procesos:", error);
            });
    };      

    const handleDeleteUser = (idIndicador) => {
        axios.delete(`http://localhost:8000/api/indmapaproceso/${idIndicador}`)
            .then(() => {
                setUsers(users.filter(user => user.idIndicador !== idIndicador));
            })
            .catch(error => console.error("Error al eliminar el indicador:", error));
    };
    
    const handleEditUser = (user) => {
        setEditUser(user);
        setEditFormOpen(true);
    };

    const handleSaveEditUser = () => {
        if (!editUser) return;
    
        axios.put(`http://localhost:8000/api/indmapaproceso/${editUser.idIndicador}`, {
            idMapaProceso: mapaProceso.idMapaProceso,
            idIndicador: editUser.idIndicador,
            descripcion: editUser.descripcion,
            formula: editUser.formula,
            periodoMed: editUser.periodo
        })
        .then(response => {
            setUsers(users.map(user => user.idIndicador === editUser.idIndicador ? response.data : user));
            setEditFormOpen(false);
            setEditUser(null);
        })
        .catch(error => console.error("Error al actualizar indicador:", error));
    };

    return (
        <Box sx={{ p: 4, display: "flex", minHeight: "100vh", flexDirection: "column" }}>
            <Box sx={{ mb: 4, p: 3, backgroundColor: "#ffffff", borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="#003366" mb={2}>
                    Información del Proceso
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography fontWeight="bold" color="#333">Objetivo:</Typography>
                        <Typography color="#666">{proceso.objetivo || "Cargando..."}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography fontWeight="bold" color="#333">Alcance:</Typography>
                        <Typography color="#666">{proceso.alcance || "Cargando..."}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography fontWeight="bold" color="#333">Año de Certificación:</Typography>
                        <Typography color="#666">{proceso.anioCertificado || "Cargando..."}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography fontWeight="bold" color="#333">Norma:</Typography>
                        <Typography color="#666">{proceso.norma || "Cargando..."}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography fontWeight="bold" color="#333">Duración del Certificado:</Typography>
                        <Typography color="#666">{proceso.duracionCetificado || "Cargando..."}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography fontWeight="bold" color="#333">Estado:</Typography>
                        <Typography color="#666">{proceso.estado || "Cargando..."}</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ mb: 3, p: 3, backgroundColor: "#f5f5f5", borderRadius: 2, boxShadow: 2, position: "relative" }}>
            <Box sx={{ position: "absolute", top: 12, right: 12 }}>
            <Button 
                startIcon={<Edit />} 
                sx={{ color: "#0056b3", fontWeight: "bold" }} 
                onClick={editMode ? handleSaveChanges : handleEditToggle}
            >
                {editMode ? "GUARDAR" : "EDITAR"}
            </Button>
            </Box>
                <Typography variant="h6" fontWeight="bold" color="#004A98" mb={2}>
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
                            <Typography fontWeight="bold" color="#333">{item.label}:</Typography>

                            {editMode ? (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    minRows={1}
                                    maxRows={6}
                                    sx={{
                                        wordBreak: "break-word",
                                        backgroundColor: "#f8f9fa",
                                        borderRadius: 1
                                    }}
                                    value={mapaProceso[item.key] || ""}
                                    onChange={(e) => setMapaProceso({ ...mapaProceso, [item.key]: e.target.value })}
                                />
                            ) : (
                                <Typography 
                                    color="#666"
                                    sx={{
                                        wordBreak: "break-word",
                                        whiteSpace: "pre-wrap",
                                        backgroundColor: "#f8f9fa",
                                        p: 1,
                                        borderRadius: 1
                                    }}
                                >
                                    {mapaProceso[item.key] ? mapaProceso[item.key] : "No disponible"}
                                </Typography>
                            )}
                        </Grid>
                    ))}
                </Grid>
            </Box>
            {activeCards.length > 0 && (
                <Box sx={{ flex: 4, pr: 2, display: "flex", justifyContent: "center" }}>
                    <Stack spacing={2}>
                    {activeCards.map((user) => (
                        <UserCard 
                            key={user.id} 
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
                        <UserCard 
                            key={user.id} 
                            user={user} 
                            onSelect={handleSelectCard} 
                            onDelete={handleDeleteUser}
                            onEdit={handleEditUser}
                            isSmall={activeCards.length > 0} 
                        />
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

            <Box sx={{ position: "fixed", bottom: 16, right: 30, paddingRight: 5 }}>
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
                    Agregar Nuevo Indicador
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
                        <TextField
                            label="Descripción"
                            fullWidth
                            variant="outlined"
                            sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
                            value={newUser.descripcion}
                            onChange={(e) => setNewUser({ ...newUser, descripcion: e.target.value })}
                            error={!!errors.descripcion}
                            helperText={errors.descripcion}
                        />
            
                        <TextField
                            label="Fórmula"
                            fullWidth
                            variant="outlined"
                            sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
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
                            sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
                            value={newUser.periodo}
                            onChange={(e) => setNewUser({ ...newUser, periodo: e.target.value })}
                            error={!!errors.periodo}
                            helperText={errors.periodo}
                        >
                            <MenuItem value="Mensual">Mensual</MenuItem>
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
            
                )}
            </Box>
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
                            sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
                            value={editUser?.descripcion || ""}
                            onChange={(e) => setEditUser({ ...editUser, descripcion: e.target.value })}
                        />
                        <TextField
                            label="Fórmula"
                            fullWidth
                            variant="outlined"
                            sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
                            value={editUser?.formula || ""}
                            onChange={(e) => setEditUser({ ...editUser, formula: e.target.value })}
                        />
                        <TextField
                            label="Período"
                            fullWidth
                            select
                            variant="outlined"
                            sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
                            value={editUser?.periodo || ""}
                            onChange={(e) => setEditUser({ ...editUser, periodo: e.target.value })}
                        >
                            <MenuItem value="Mensual">Mensual</MenuItem>
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

function UserCard({ user, onSelect, onClose, isActive, onDelete, onEdit }) {
    return (
        <Card
            sx={{
                width: isActive ? "50vw" : 180,
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

                    {onEdit && (
                        <IconButton
                            onClick={() => onEdit(user)}
                            sx={{ color: "blue", position: "absolute", top: "5px", right: "80px", zIndex: 10 }}
                        >
                            <Edit />
                        </IconButton>
                    )}

                    {onDelete && (
                        <IconButton
                            onClick={() => onDelete(user.idIndicador)}
                            sx={{ color: "red", position: "absolute", top: "5px", right: "40px", zIndex: 10 }}
                        >
                            <Delete />  {/* 👈 Cambia Close por Delete */}
                        </IconButton>
                    )}

                    <CardContent>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center" }}>
                            {[
                                { title: "Descripcion", value: user.descripcion },
                                { title: "Formula", value: user.formula },
                                { title: "Periodo", value: user.periodoMed },
                            ].map((field, index) => (
                                <TableContainer key={index} component={Paper} sx={{ width: "28%", minWidth: "180px", boxShadow: 1 }}>
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
                    Indicador
                </Typography>
            )}
        </Card>
    );
}

export default ProcessMapView;
