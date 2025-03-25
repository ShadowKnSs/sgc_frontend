import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

const GraficaGestionRiesgos = ({ onImageReady, idRegistro }) => {
  const chartRef = useRef(null);
  const yaGenerada = useRef(false);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = ['#1D2D5F', '#F65E5D', '#FFBC47', '#40CEE3'];

  useEffect(() => {
    if (!idRegistro) return;
  
    axios.get(`http://127.0.0.1:8000/api/gestion-riesgos/${idRegistro}`)
      .then(response => {
        const data = response.data || [];
        const labels = data.map(item => item.nombreIndicador);
        const resultados = data.map(item => item.resultadoAnual ?? 0);
        const backgroundColor = resultados.map((_, index) => colors[index % colors.length]);
  
        const chart = {
          labels,
          datasets: [{
            label: 'Resultado Anual',
            data: resultados,
            backgroundColor
          }]
        };
  
        setChartData(chart);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Error al cargar gestión de riesgos:", err);
        setError("Error al cargar datos.");
        setLoading(false);
      });
  }, [idRegistro]);
  

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Gestión de Riesgos' }
    },
    animation: {
      onComplete: () => {
        if (chartRef.current && !yaGenerada.current) {
          const base64 = chartRef.current.toBase64Image("image/png", 1.0);
          console.log("📸 Imagen generada (riesgos):", base64.substring(0, 60));
          if (onImageReady) onImageReady(base64, "riesgos");
          yaGenerada.current = true;
        }
      }
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ maxWidth: '70%', mx: 'auto', mt: 4 }}>
      <Bar
        ref={(ref) => {
          chartRef.current = ref;
        }}
        data={chartData}
        options={options}
      />
    </Box>
  );
};

export default GraficaGestionRiesgos;
