// src/components/PlanCorrectivoDetalleModal.jsx
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    Box,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Fade } from '@mui/material'; // Asegúrate de tenerlo importado

import TitleDialog from '../TitleDialog';
import CustomButton from "../Button"; // ajusta la ruta si es necesario


const PlanCorrectivoDetalleModal = ({
    open,
    record,
    onClose,
    onEdit,
    onDelete,
    soloLectura,
    puedeEditar
}) => {

    if (!record) return null;
    const renderActividades = (tipo) => (
        <TableContainer component={Paper} sx={{ mt: 1 }}>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'primary.main' }}>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actividad</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Responsable</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Programada</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(record.actividades.filter((a) => a.tipo === tipo) || []).map((item, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{ py: 1.5 }}>{item.descripcionAct || item.actividad}</TableCell>
                            <TableCell sx={{ py: 1.5 }}>{item.responsable}</TableCell>
                            <TableCell sx={{ py: 1.5 }}>
                                {item.fechaProgramada ? item.fechaProgramada.split(" ")[0] : ""}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <TitleDialog title="Detalles del Plan de Acción"></TitleDialog>
            <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
                <Close />
            </IconButton>

            <DialogContent>
                <Fade in={true} timeout={400}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* === SECCIÓN: Datos del Proceso === */}
                        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2, boxShadow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ width: 6, height: 24, bgcolor: 'primary.main', borderRadius: 2, mr: 1 }} />
                                <Typography variant="subtitle1" fontWeight="bold">Datos del Proceso</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1 }} flex={1}><strong>Entidad:</strong> {record.entidad}</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }} flex={1}><strong>No Conformidad:</strong> {record.noConformidad ? "Sí" : "No"}</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }} flex={1}><strong>Código:</strong> {record.codigo}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                                <Typography variant="body2" sx={{ mb: 1 }} flex={1}><strong>Coordinador:</strong> {record.coordinadorPlan}</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }} flex={1}><strong>Fecha de Inicio:</strong> {record.fechaInicio?.split(" ")[0]}</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ mb: 1 }} mt={1}><strong>Origen:</strong> {record.origenConformidad}</Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}><strong>Equipo de Mejora:</strong> {record.equipoMejora}</Typography>
                        </Box>

                        {/* === SECCIÓN: No Conformidad === */}
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, boxShadow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ width: 6, height: 24, bgcolor: 'primary.main', borderRadius: 2, mr: 1 }} />
                                <Typography variant="subtitle1" fontWeight="bold">Descripción de la No Conformidad</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ mb: 1 }}><strong>Requisito:</strong> {record.requisito}</Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}><strong>Incumplimiento:</strong> {record.incumplimiento}</Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}><strong>Evidencia:</strong> {record.evidencia}</Typography>
                        </Box>

                        {/* === SECCIÓN: Reacción === */}
                        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2, boxShadow: 1 }}>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ width: 6, height: 24, bgcolor: 'primary.main', borderRadius: 2, mr: 1 }} />
                                <Typography variant="subtitle1" fontWeight="bold"> Reacción para Controlar y Corregir</Typography>
                            </Box>
                            {renderActividades("reaccion")}
                        </Box>

                        {/* === SECCIÓN: Consecuencias === */}
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, boxShadow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ width: 6, height: 24, bgcolor: 'primary.main', borderRadius: 2, mr: 1 }} />
                                <Typography variant="subtitle1" fontWeight="bold"> Consecuencias Identificadas</Typography>
                            </Box>

                            <Typography variant="body2" sx={{ mb: 1 }}><strong>Revisión:</strong> {record.revisionAnalisis}</Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}><strong>Causa Raíz:</strong> {record.causaRaiz}</Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}><strong>Similares:</strong> {record.estadoSimilares}</Typography>
                        </Box>

                        {/* === SECCIÓN: Plan de Acción === */}
                        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2, boxShadow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ width: 6, height: 24, bgcolor: 'primary.main', borderRadius: 2, mr: 1 }} />
                                <Typography variant="subtitle1" fontWeight="bold"> Plan Acción</Typography>
                            </Box>
                            {renderActividades("planaccion")}
                        </Box>
                    </Box>
                </Fade>
            </DialogContent>
            <DialogActions>
                {!soloLectura && puedeEditar && (
                    <>
                        <CustomButton type="guardar" onClick={() => onEdit(record)}>
                            Editar
                        </CustomButton>
                        <CustomButton type="cancelar" onClick={() => onDelete(record)}>
                            Eliminar
                        </CustomButton>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default PlanCorrectivoDetalleModal;
