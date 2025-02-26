import React, { useState } from "react";
import { Box, Fab, Stack, Card, CardContent, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { Add, Close, ExpandMore, ExpandLess } from "@mui/icons-material";

const initialUsers = [
    { id: 1, docRelacionados: "Doc A", fuenteEntrada: "Fuente X", materialEntrada: "Material 1", requisitoEntrada: "Requisito A", salidas: "Salida A", receptores: "Receptor 1" },
    { id: 2, docRelacionados: "Doc B", fuenteEntrada: "Fuente Y", materialEntrada: "Material 2", requisitoEntrada: "Requisito B", salidas: "Salida B", receptores: "Receptor 2" },
    { id: 3, docRelacionados: "Doc C", fuenteEntrada: "Fuente Z", materialEntrada: "Material 3", requisitoEntrada: "Requisito C", salidas: "Salida C", receptores: "Receptor 3" },
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

            <Box sx={{ position: "fixed", bottom: 16, right: 50, display: "flex", gap: 2 }}>
                <Fab
                    color="primary"
                    sx={{ width: 56, height: 56, borderRadius: 2, backgroundColor: "#004A98" }}
                    onClick={() => setOpenForm(true)}
                >
                    <Add />
                </Fab>

                <Button
                    variant="contained"
                    sx={{
                        width: 180,
                        height: 56,
                        borderRadius: 2,
                        backgroundColor: "#004A98",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#003366" }
                    }}
                    onClick={handleToggleAll}
                    startIcon={allExpanded ? <ExpandLess /> : <ExpandMore />}
                >
                    {allExpanded ? "Cerrar Todo" : "Desplegar Todos"}
                </Button>
            </Box>

            {openForm && (
                <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>Agregar Nuevo Registro</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}>
                            {["Documentos Relacionados", "Fuentes de Entrada", "Material de Entrada", "Requisitos de Entrada", "Salidas", "Receptores"].map((key) => (
                                <Box key={key}>
                                    <Box sx={{ backgroundColor: "#e0e0e0", p: 1, borderRadius: 1 }}>
                                        <Typography sx={{ fontWeight: "bold" }}>
                                            {key.replace(/([A-Z])/g, " $1").trim()}:
                                        </Typography>
                                    </Box>
                                    <TextField fullWidth name={key} variant="outlined" />
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
                                { title: "Documento Relacionado", value: user.docRelacionados },
                                { title: "Fuente de Entrada", value: user.fuenteEntrada },
                                { title: "Material de Entrada", value: user.materialEntrada },
                                { title: "Requisito de Entrada", value: user.requisitoEntrada },
                                { title: "Salidas", value: user.salidas },
                                { title: "Receptores", value: user.receptores },
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
                    Mapa Proceso {user.id}
                </Typography>
            )}
        </Card>
    );
}

export default ProcessMapView;
