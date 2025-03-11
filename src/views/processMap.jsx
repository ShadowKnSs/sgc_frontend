import React, { useState } from "react";
import { 
    Box, Fab, Stack, Card, CardContent, Typography, IconButton, 
    Table, TableBody, TableCell, TableContainer, TableRow, Paper, 
    Button, Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, MenuItem 
  } from "@mui/material";  
import { Add, Close, ExpandMore, ExpandLess } from "@mui/icons-material";

const initialUsers = [
    { id: 1, docRelacionados: "Doc A", fuenteEntrada: "Fuente X", materialEntrada: "Material 1", requisitoEntrada: "Requisito A", salidas: "Salida A", receptores: "Receptor 1" },
];

function ProcessMapView() {
    const [users, setUsers] = useState(initialUsers);
    const [activeCards, setActiveCards] = useState([]);
    const [allExpanded, setAllExpanded] = useState(false);
    const [openForm, setOpenForm] = useState(false);

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

    const handleAddUser = () => {
        setUsers([...users, { id: users.length + 1, ...newUser }]);
        setOpenForm(false);
        setNewUser({
            descripcion: "",
            formula: "",
            periodo: "",
        });
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

            <Box sx={{ position: "absolute", top: 210, right: 30, zIndex: 10 , paddingRight: 5, paddingTop: 2}}>
                <Button 
                variant="contained" 
                sx={{ width: 140, height: 40, borderRadius: 2, backgroundColor: "secondary.main", color: "#fff", "&:hover": { backgroundColor: "primary.main" }}} 
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
                />
                <TextField
                    label="Fórmula"
                    fullWidth
                    variant="outlined"
                    sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
                    value={newUser.formula}
                    onChange={(e) => setNewUser({ ...newUser, formula: e.target.value })}
                />
                <TextField
                    label="Período"
                    fullWidth
                    select
                    variant="outlined"
                    sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
                    value={newUser.periodo}
                    onChange={(e) => setNewUser({ ...newUser, periodo: e.target.value })}
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

                    <CardContent>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center" }}>
                            {[
                                { title: "Descripcion", value: user.Descripcion },
                                { title: "Formula", value: user.Formula },
                                { title: "Periodo", value: user.Periodo },
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
