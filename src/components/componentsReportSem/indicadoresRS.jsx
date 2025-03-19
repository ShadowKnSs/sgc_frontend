import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";

// Función para formatear las etiquetas de la gráfica de pastel
const renderLabel = ({ name, value }) => `${name}: ${value.toFixed(2)}%`;

const IndicadoresReport = ({ data }) => {
    // Formateamos los datos para la gráfica de barras
    const formattedData = data.map((item, index) => ({
        name: `Indicador ${index + 1}`,
        resultado: item.resultado
    }));

    // Cálculo del porcentaje de cumplimiento e incumplimiento
    const totalPosible = data.length * 100; // Máximo posible (100 por cada indicador)
    const totalObtenido = data.reduce((sum, item) => sum + item.resultado, 0);
    const cumplimiento = (totalObtenido / totalPosible) * 100;
    const incumplimiento = 100 - cumplimiento;

    // Datos para la gráfica de pastel
    const pieData = [
        { name: "Cumplimiento", value: cumplimiento },
        { name: "Incumplimiento", value: incumplimiento }
    ];
    const COLORS = ["#4CAF50", "#F44336"]; // Verde para cumplimiento, rojo para incumplimiento

    return (
        <Box sx={{ width: "100%", textAlign: "center" }}>
            {/* Título */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Resultados de Indicadores
            </Typography>

            {/* Gráfica de Barras */}
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="resultado" fill="#8884d8" name="Resultado" />
                </BarChart>
            </ResponsiveContainer>

            {/* Tabla */}
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>Indicador</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Proceso</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Entidad</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Nombre Indicador</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Origen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>Indicador {index + 1}</TableCell>
                                <TableCell>{item.NombreProceso}</TableCell>
                                <TableCell>{item.Entidad}</TableCell>
                                <TableCell>{item.nombreIndicador}</TableCell>
                                <TableCell>{item.origenIndicador}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Gráfica de Pastel */}
            <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: "bold" }}>
                Porcentaje de Cumplimiento e Incumplimiento Semestral
            </Typography>
            <ResponsiveContainer width="50%" height={300}>
                <PieChart>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={renderLabel} // Agrega las etiquetas
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default IndicadoresReport;
