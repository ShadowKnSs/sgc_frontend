// src/components/Graficas/GraficaEncuesta.jsx
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const GraficaEncuesta = ({ id }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
console.log("El id que recibo es:", id);
  useEffect(() => {
    if (!id) return; // Asegúrate de que id esté definido
    // Se construye la URL usando el id recibido por prop
    axios.get(`http://127.0.0.1:8000/api/encuesta/${id}/resultados`)
      .then(response => {
        const data = response.data.encuesta;
        

        // Suponemos que la respuesta es un objeto con { malo, regular, excelenteBueno }
        // Si los valores vienen como números absolutos, calculamos el porcentaje:
        const total = data.noEncuestas;
        const sumaEB = data.bueno + data.excelente;
        const maloPct = total > 0 ? (data.malo * 100 / total).toFixed(2) : 0;
        const regularPct = total > 0 ? (data.regular * 100 / total).toFixed(2) : 0;
        const excelenteBuenoPct = total > 0 ?  (sumaEB * 100 / total).toFixed(2) : 0;;
    
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
        console.error('Error al cargar los datos de la encuesta:', err);
        setError('Error al cargar los datos de la encuesta.');
        setLoading(false);
      });
  }, [id]);

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
      title: { display: true, text: 'Encuesta de Satisfacción' }
    }
  };

  return (
    <Box sx={{ maxWidth: '50%', mx: 'auto', mt: 4}}>
      <Pie data={chartData} options={options} />
    </Box>
  );
};

export default GraficaEncuesta;
