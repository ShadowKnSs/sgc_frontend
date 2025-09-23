import React from "react";
import {Tooltip,ResponsiveContainer, PieChart, Pie, Cell} from "recharts";
import {Typography, Box } from "@mui/material";

const IndicadoresPastel = ({ data }) => {
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
      {/* Gráfica de Pastel */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <ResponsiveContainer width={400} height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              labelLine={false}
              label={({ value }) => `${value.toFixed(2)}%`} // solo porcentaje
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value.toFixed(2)}%`, name]} />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Leyenda personalizada */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          marginTop: 2
        }}
      >
        {pieData.map((entry, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "4px",
                backgroundColor: COLORS[index]
              }}
            />
            <Typography variant="body2">{entry.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default IndicadoresPastel;