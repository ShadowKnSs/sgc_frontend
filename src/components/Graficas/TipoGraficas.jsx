import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Bar, Pie, Radar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  
  ChartJS.register(
    CategoryScale,       // Escala de categorías (X)
    LinearScale,         // Escala lineal (Y)
    PointElement,        // Puntos en gráficos de línea
    LineElement,         // Líneas
    BarElement,          // Barras
    ArcElement,          // Elementos de gráficos de pastel
    RadialLinearScale,   // Escala para gráficos de radar
    Title,
    Tooltip,
    Legend
  );
  
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const IndicadorChart = ({options, data, type }) => {
//   const chartTypes = {
//     bar: Bar,
//     pie: Pie,
//     radar: Radar,
//   };

//   const ChartComponent = chartTypes[type];

return (
    <Box sx={{ maxWidth: '100%', overflowX: 'auto', mb: 4 }}>
      {type === 'line' && <Line data={data} options={options} />}
      {type === 'pie' && <Pie data={data} options={options} />}
      {/* Puedes agregar otros tipos de gráficas según sea necesario */}
    </Box>
  );
};


export default IndicadorChart;
