import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";

// Función para definir el color del estado
const getEstadoColor = (estado) => {
    if (estado.toLowerCase() === "en proceso") return "#FFEB3B"; // Amarillo
    if (estado.toLowerCase() === "cerrado") return "#4CAF50"; // Verde
    return "transparent"; // Por si acaso hay otro estado
};

const AccionesMejora = ({ data }) => {
    return (
        <Box sx={{ width: "100%", textAlign: "center" }}>
            {/* Título */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Acciones de Mejora - Plan de Trabajo
            </Typography>

            {/* Tabla */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>No.</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Proceso</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Entidad</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Fuente</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Entregable</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Responsable</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.NombreProceso}</TableCell>
                                <TableCell>{item.Entidad}</TableCell>
                                <TableCell>{item.fuente}</TableCell>
                                <TableCell>{item.entregable}</TableCell>
                                <TableCell>{item.responsable}</TableCell>
                                <TableCell sx={{ backgroundColor: getEstadoColor(item.estado), color: "white", fontWeight: "bold", textAlign: "center" }}>
                                    {item.estado}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AccionesMejora;
