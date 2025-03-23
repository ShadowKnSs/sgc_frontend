import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const GraficaEncuesta = ({ id, onImageReady }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    axios.get(`http://127.0.0.1:8000/api/encuesta/${id}/resultados`)
      .then(response => {
        const data = response.data.encuesta;
        const total = data.noEncuestas;
        const sumaEB = data.bueno + data.excelente;
        const maloPct = total > 0 ? (data.malo * 100 / total).toFixed(2) : 0;
        const regularPct = total > 0 ? (data.regular * 100 / total).toFixed(2) : 0;
        const excelenteBuenoPct = total > 0 ? (sumaEB * 100 / total).toFixed(2) : 0;

        const formattedData = {
          labels: ['Malo', 'Regular', 'Excelente/Bueno'],
          datasets: [
            {
              data: [maloPct, regularPct, excelenteBuenoPct],
              backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB']
            }
          ]
        };

        setChartData(formattedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error al cargar los datos de la encuesta:', err);
        setError('Error al cargar los datos de la encuesta.');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (chartRef.current && chartRef.current.toBase64Image) {
      const base64 = chartRef.current.toBase64Image("image/png", 1.0);
  
      if (base64) {
        console.log("🖼️ Imagen generada (encuesta):", base64.substring(0, 100)); // solo muestra un fragmento
        if (onImageReady) {
          onImageReady(base64, "encuesta");
        }
      } else {
        console.warn("⚠️ La imagen generada está vacía o no es válida");
      }
    }
  }, [chartData]);
  

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Encuesta de Satisfacción' }
    }
  };

  return (
    <Box sx={{ maxWidth: '50%', mx: 'auto', mt: 4 }}>
      <Pie
        ref={(ref) => {
          chartRef.current = ref;
        }}
        data={chartData}
        options={options}
      />
    </Box>
  );
};

export default GraficaEncuesta;
