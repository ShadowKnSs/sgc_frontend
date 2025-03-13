import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton, Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import PlanCorrectivoForm from "./Forms/PlanCorrectivoForm";

function PlanCorrectivoContainer() {
    const [records, setRecords] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    // Para saber si se está editando (y pasar datos al formulario)
    const [editingRecord, setEditingRecord] = useState(null);
    // Estado de secuencia para generar el código
    const [sequence, setSequence] = useState(1);

    const handleSave = (data) => {
        if (editingRecord) {
            // Actualizar registro existente
            setRecords(records.map((r) => (r.id === editingRecord.id ? data : r)));
            setEditingRecord(null);
        } else {
            // Asignar un id y guardar nuevo registro
            data.id = records.length + 1;
            setRecords([...records, data]);
            setSequence(sequence + 1); // Incrementa para el siguiente registro
        }
        setShowForm(false);
    };

    const handleCardClick = (record) => {
        setSelectedRecord(record);
    };

    const handleCloseModal = () => {
        setSelectedRecord(null);
    };

    const handleDelete = (record) => {
        setRecords(records.filter((r) => r.id !== record.id));
        handleCloseModal();
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        setShowForm(true);
        handleCloseModal();
    };

    return (
        <Box sx={{ p: 4 }}>
            <Button sx={{ backgroundColor: 'secondary.main' }}
                variant="contained"
                onClick={() => {
                    setEditingRecord(null);
                    setShowForm(true);
                }}
                startIcon={<Add />}
            >
                Nuevo Plan de Acción
            </Button>
            {showForm && (
                <PlanCorrectivoForm
                    onSave={handleSave}
                    onCancel={() => setShowForm(false)}
                    initialData={editingRecord}
                    sequence={sequence}
                />
            )}
            <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", gap: 2 }}>
                {records.length === 0 ? (
                    <Typography variant="h6" color="textSecondary">
                        No hay registros. Cree un nuevo plan de acción.
                    </Typography>
                ) : (
                    records.map((record) => (
                        <Card
                            key={record.id}
                            sx={{
                                width: 200,
                                cursor: "pointer",
                                transition: "transform 0.3s ease",
                                "&:hover": { transform: "scale(1.05)" }
                            }}
                            onClick={() => handleCardClick(record)}
                        >
                            <CardContent>
                                <Typography variant="h6">{record.codigo}</Typography>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>
            <Dialog open={Boolean(selectedRecord)} onClose={handleCloseModal} fullWidth>
                <DialogTitle>
                    Detalles del Plan de Acción
                    <IconButton onClick={handleCloseModal} sx={{ position: "absolute", right: 8, top: 8 }}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedRecord && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                Datos del Proceso
                            </Typography>
                            {/* Primera fila: Entidad, No Conformidad y Código */}
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Typography variant="body2" sx={{ flex: 1 }}>
                                    <strong>Entidad:</strong> {selectedRecord.entidad}
                                </Typography>
                                <Typography variant="body2" sx={{ flex: 1 }}>
                                    <strong>No Conformidad:</strong> {selectedRecord.noConformidad ? "Sí" : "No"}
                                </Typography>
                                <Typography variant="body2" sx={{ flex: 1 }}>
                                    <strong>Código:</strong> {selectedRecord.codigo}
                                </Typography>
                            </Box>
                            {/* Segunda fila: Coordinador y Fecha de Inicio */}
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Typography variant="body2" sx={{ flex: 1 }}>
                                    <strong>Coordinador:</strong> {selectedRecord.coordinador}
                                </Typography>
                                <Typography variant="body2" sx={{ flex: 1 }}>
                                    <strong>Fecha de Inicio:</strong> {selectedRecord.fechaInicio}
                                </Typography>
                            </Box>
                            {/* Renglones separados para los demás campos */}
                            <Typography variant="body2">
                                <strong>Origen:</strong> {selectedRecord.origenNoConformidad}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Equipo de Mejora:</strong> {selectedRecord.equipoMejora}
                            </Typography>

                            {/* Resto de la información */}
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
                                Descripción de la No Conformidad
                            </Typography>
                            <Typography variant="body2">
                                <strong>Requisitos:</strong> {selectedRecord.requisitos}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Incumplimiento:</strong> {selectedRecord.incumplimiento}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Evidencia:</strong> {selectedRecord.evidencia}
                            </Typography>

                            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
                                Reacción para Controlar y Corregir
                            </Typography>
                            <TableContainer component={Paper} sx={{ mt: 1, mb: 2 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Actividad</TableCell>
                                            <TableCell>Responsable</TableCell>
                                            <TableCell>Fecha Programada</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedRecord.reaccion.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.actividad}</TableCell>
                                                <TableCell>{item.responsable}</TableCell>
                                                <TableCell>{item.fechaProgramada}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
                                Consecuencias Identificadas
                            </Typography>
                            <Typography variant="body2">
                                <strong>Evaluación:</strong> {selectedRecord.evaluacionAccion}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Causa Raíz:</strong> {selectedRecord.causaRaiz}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Similares:</strong> {selectedRecord.similares}
                            </Typography>

                            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
                                Plan de Acción
                            </Typography>
                            <TableContainer component={Paper} sx={{ mt: 1 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Actividad</TableCell>
                                            <TableCell>Responsable</TableCell>
                                            <TableCell>Fecha Programada</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedRecord.planAccion.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.actividad}</TableCell>
                                                <TableCell>{item.responsable}</TableCell>
                                                <TableCell>{item.fechaProgramada}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => handleEdit(selectedRecord)}>
                        Editar
                    </Button>
                    <Button color="error" onClick={() => handleDelete(selectedRecord)}>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default PlanCorrectivoContainer;
