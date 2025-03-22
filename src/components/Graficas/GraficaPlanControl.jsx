import React, { useEffect,  useRef, useState } from 'react';
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

// Registrar componentes necesarios para el gráfico de barras
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PlanControlBarChart = ({onImageReady}) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ajusta la URL al endpoint real de tu backend
    axios.get('http://127.0.0.1:8000/api/plan-control')
      .then(response => {
        // Dado que el backend retorna response()->json([$resultados]),
        // se extrae el primer elemento del array.
        const resultados = response.data[0];

        // Extraer etiquetas (nombre de cada indicador) y datos de cada semestral
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
        console.error('Error al cargar los datos:', err);
        setError("Error al cargar datos de plan de control.");
        setLoading(false);
      });
  }, []);

  // Cuando ya se haya renderizado, generar la imagen
  useEffect(() => {
    if (!loading && chartRef.current) {
      const chartInstance = chartRef.current;
      const imageBase64 = chartInstance.toBase64Image();
      console.log("📸 Imagen base64 generada:", imageBase64);
  
      if (onImageReady) {
        console.log("📤 Enviando imagen al padre");
        onImageReady(imageBase64); // ✅ Esto debe funcionar ahora
      }
    }
  }, [loading, chartData, onImageReady]);
  

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
      title: { display: true, text: 'Indicadores de Plan de Control' }
    },
    scales: {
      x: { title: { display: true, text: 'Indicador' } },
      y: { title: { display: true, text: 'Resultado' } }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <Box sx={{ maxWidth: '70%', mx: 'auto', mt: 4}}>
      <Bar data={chartData} options={options} />
    </Box>
  );
};

export default PlanControlBarChart;
