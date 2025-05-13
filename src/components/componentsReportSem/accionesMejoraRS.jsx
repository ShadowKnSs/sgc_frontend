import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";

// Función para definir el color del estado
const getEstadoColor = (estado) => {
    if (typeof estado !== 'string') return "transparent"; // Previene errores
    const estadoNormalizado = estado.toLowerCase();

    if (estadoNormalizado === "en proceso") return "#F9B800"; // Amarillo
    if (estadoNormalizado === "cerrado") return "#4CAF50";   // Verde
    return "transparent"; // Color por defecto
};

const AccionesMejora = ({ data }) => {
    return (
        <Box sx={{ width: "100%", textAlign: "center", padding: "20px" }}>
            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#004A98" }}>
                            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>No.</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Proceso</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Entidad</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Fuente</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Entregable</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Responsable</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index} sx={{ backgroundColor: index % 2 ? "#E8E8E8" : "white" }}>
                                <TableCell sx={{ fontWeight: "bold" }}>{index + 1}</TableCell>
                                <TableCell>{item.NombreProceso}</TableCell>
                                <TableCell>{item.Entidad}</TableCell>
                                <TableCell>{item.fuente}</TableCell>
                                <TableCell>{item.entregable}</TableCell>
                                <TableCell>{item.responsable}</TableCell>
                                <TableCell
                                    sx={{
                                        backgroundColor: getEstadoColor(item.estado),
                                        color: "white",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        borderRadius: "5px",
                                    }}
                                >
                                    {item.estado || "Sin estado"}
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
