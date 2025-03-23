import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import {
  Chart as ChartJS,
  registerables
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(...registerables);

const PlanControlBarChart = ({ onImageReady }) => {
  const chartRef = useRef(null);
  const yaGenerada = useRef(false);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Indicadores de Plan de Control' }
    },
    animation: {
      onComplete: function(context) {
        // context.chart es la instancia real de Chart.js
        const chart = context.chart;
        if (!yaGenerada.current && onImageReady) {
          const base64 = chart.toBase64Image();
          console.log("📸 Imagen generada PlanControl (longitud):", base64.length);
          onImageReady(base64, "planControl");
          yaGenerada.current = true;
        }
      }
    }
  };

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/plan-control')
      .then(response => {
        const resultados = response.data[0];
        const labels = resultados.map(item => item.nombreIndicador);
        const dataSem1 = resultados.map(item => item.resultadoSemestral1);
        const dataSem2 = resultados.map(item => item.resultadoSemestral2);

        const formattedData = {
          labels,
          datasets: [
            { label: 'Ene-Jun', data: dataSem1, backgroundColor: '#F9B800' },
            { label: 'Jul-Dic', data: dataSem2, backgroundColor: '#00B2E3' }
          ]
        };

        setChartData(formattedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error al cargar los datos:', err);
        setError("Error al cargar datos de plan de control.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

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

export default PlanControlBarChart;
