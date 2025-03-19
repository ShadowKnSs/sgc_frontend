import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const RiesgosChart = ({ data }) => {
    // Modificamos los datos para agrupar por riesgo
    const formattedData = data.map((item, index) => ({
        name: `Riesgo ${index + 1}`,
        severidad: item.valorSeveridad,
        ocurrencia: item.valorOcurrencia,
        nrp: item.valorNRP,
    }));

    return (
        <div style={{ width: "100%", textAlign: "center" }}>
            {/* Título */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Gráfica de Barras de Riesgos
            </Typography>

            {/* Gráfica */}
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="severidad" fill="#8884d8" name="Severidad" />
                    <Bar dataKey="ocurrencia" fill="#82ca9d" name="Ocurrencia" />
                    <Bar dataKey="nrp" fill="#ffc658" name="NRP" />
                </BarChart>
            </ResponsiveContainer>

            {/* Tabla */}
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>Riesgo</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Proceso</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Entidad</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Fuente</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>Riesgo {index + 1}</TableCell>
                                <TableCell>{item.NombreProceso}</TableCell>
                                <TableCell>{item.Entidad}</TableCell>
                                <TableCell>{item.fuente}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default RiesgosChart;
