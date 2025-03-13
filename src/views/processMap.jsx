import React, { useState } from "react";
import { Box, Fab, Stack, Card, CardContent, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select } from "@mui/material";
import { Add, Close, ExpandMore, ExpandLess } from "@mui/icons-material";

const initialUsers = [
    { id: 1, docRelacionados: "Doc A", fuenteEntrada: "Fuente X", materialEntrada: "Material 1", requisitoEntrada: "Requisito A", salidas: "Salida A", receptores: "Receptor 1" },
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
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, p: 2, mb: 4 }}>
                <Box>
                    <Typography sx={{ fontWeight: "bold" }}>Documentos Relacionados:</Typography>
                    <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }} />
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: "bold" }}>Fuentes de Entrada:</Typography>
                    <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }} />
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: "bold" }}>Material de Entrada:</Typography>
                    <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }} />
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: "bold" }}>Requisitos de Entrada:</Typography>
                    <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }} />
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: "bold" }}>Salidas:</Typography>
                    <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }} />
                </Box>
            <Box>
        <Typography sx={{ fontWeight: "bold" }}>Receptores:</Typography>
        <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }} />
    </Box>
</Box>

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
            </Box>

            {openForm && (
                <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="lg" fullWidth>
                    <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>Agregar Nuevo Indicador</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, p: 2 }}>
                            {/* Primera fila */}
                            <Box>
                                <Typography sx={{ fontWeight: "bold" }}>Descripcion:</Typography>
                                <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: "bold" }}>Formula:</Typography>
                                <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }} />
                            </Box>
                            {/* Segunda fila */}
                            <Box>
                                <Typography sx={{ fontWeight: "bold" }}>Periodo</Typography>
                                <Select fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: 1 }}>
                                    <MenuItem value="2023">Mensual</MenuItem>
                                    <MenuItem value="2024">Trimestral</MenuItem>
                                    <MenuItem value="2025">Anual</MenuItem>
                                </Select>
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
