// src/components/Graficas/GraficaMapaProceso.jsx
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar los componentes necesarios para ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficaMapaProceso = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ajusta la URL al endpoint real de tu backend para mapa de proceso
    axios.get('http://127.0.0.1:8000/api/mapa-proceso')
      .then(response => {
        // Supongamos que el backend retorna un array con un solo elemento, similar a plan de control:
        // [ { nombreIndicador, resultadoSemestral1, resultadoSemestral2, ... } ]
        const resultados = response.data[0];
        console.log("Datos de mapa de proceso:", resultados);
        
        // Extraer etiquetas y datos
        const labels = resultados.map(item => item.nombreIndicador);
        const dataSem1 = resultados.map(item => item.resultadoSemestral1);
        const dataSem2 = resultados.map(item => item.resultadoSemestral2);

        const formattedData = {
          labels,
          datasets: [
            {
              label: 'Ene-Jun',
              data: dataSem1,
              backgroundColor: '#F9B800'
            },
            {
              label: 'Jul-Dic',
              data: dataSem2,
              backgroundColor: '#00B2E3'
            }
          ]
        };

        setChartData(formattedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar los datos de mapa de proceso:', err);
        setError("Error al cargar datos de mapa de proceso.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Mapa de Proceso' }
    },
    scales: {
      x: { title: { display: true, text: 'Indicador' } },
      y: { title: { display: true, text: 'Resultado' } }
    },
    interaction: { mode: 'index', intersect: false },
    animation: { duration: 1000, easing: 'easeInOutQuart' }
  };

  return (
    <Box sx={{ maxWidth: '70%', mx: 'auto', mt: 4 }}>
      <Bar data={chartData} options={options} />
    </Box>
  );
};

export default GraficaMapaProceso;
