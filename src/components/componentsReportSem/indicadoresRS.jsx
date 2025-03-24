import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {Typography, Box } from "@mui/material";

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
    const COLORS = ["#004A98", "#F9B800"];

    return (
        <Box sx={{ width: "100%", textAlign: "center", padding: "20px" }}>
            {/* Gráfica de Barras */}
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                    <XAxis dataKey="name" stroke="#004A98" />
                    <YAxis domain={[0, 100]} stroke="#004A98" />
                    <Tooltip contentStyle={{ backgroundColor: "#E8E8E8", borderRadius: "5px" }} />
                    <Legend wrapperStyle={{ color: "#004A98", fontWeight: "bold" }} />
                    <Bar dataKey="resultado" fill="#00B2E3" name="Resultado" barSize={40} radius={[5, 5, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default IndicadoresReport;
