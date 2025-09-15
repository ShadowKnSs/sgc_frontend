import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {Typography, Box } from "@mui/material";

const IndicadoresReport = ({ data }) => {
  // Filtrar indicadores sin valor
  const filteredData = data
    .map((item, index) => ({
      name: `Indicador ${index + 1}`,
      resultado:
        item.resultado !== null && item.resultado !== undefined
          ? item.resultado
          : null,
    }))
    .filter((item) => item.resultado !== null);

  const totalWidth = 800; // ancho fijo de la gráfica
  const barSize = Math.max(totalWidth / filteredData.length - 5, 5); // ajuste dinámico, mínimo 5px

  return (
    <Box sx={{ width: "100%", textAlign: "center", padding: "20px" }}>
      <ResponsiveContainer width={totalWidth} height={400}>
        <BarChart
          data={filteredData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
          <XAxis
            dataKey="name"
            stroke="#004A98"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={60}
          />
          <YAxis domain={[0, 100]} stroke="#004A98" />
          <Tooltip
            contentStyle={{ backgroundColor: "#E8E8E8", borderRadius: "5px" }}
            formatter={(value) => `${value.toFixed(2)}%`}
          />
          <Legend wrapperStyle={{ color: "#004A98", fontWeight: "bold" }} />
          <Bar
            dataKey="resultado"
            fill="#00B2E3"
            name="Resultado "
            barSize={barSize}
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default IndicadoresReport;
