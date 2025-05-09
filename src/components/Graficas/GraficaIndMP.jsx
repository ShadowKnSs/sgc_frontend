import React, { useEffect, useRef, useState } from 'react';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficaMapaProceso = ({ idProceso, onImageReady }) => {
  const chartRef = useRef(null);
  const yaGenerada = useRef(false);

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("El id desde Mapa Proces es", idProceso);
  useEffect(() => {
    if (!idProceso) return;

    axios.get(`http://127.0.0.1:8000/api/mapa-proceso`, {
      params: { idProceso }
    })
      .then(response => {
        console.log("📊 API MapaProceso:", response.data);
        const resultados = response.data || [];
        const labels = resultados.map(item =>
          item.nombreIndicador.length > 50
            ? item.nombreIndicador.slice(0, 47) + "..."
            : item.nombreIndicador
        );
        
        const dataSem1 = resultados.map(item =>
          Number.isFinite(item.resultadoSemestral1) ? item.resultadoSemestral1 : 0
        );
        
        const dataSem2 = resultados.map(item =>
          Number.isFinite(item.resultadoSemestral2) ? item.resultadoSemestral2 : 0
        );        

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
        console.error('❌ Error al cargar los datos de mapa de proceso:', err);
        setError("Error al cargar datos de mapa de proceso.");
        setLoading(false);
      });
  }, [idProceso]);

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
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
      onComplete: () => {
        if (
          chartRef.current &&
          chartRef.current.toBase64Image &&
          !yaGenerada.current
        ) {
          const base64 = chartRef.current.toBase64Image('image/png', 1.0);
          if (base64 && typeof onImageReady === "function") {
            onImageReady(base64, "mapaProceso");
            yaGenerada.current = true;
          }
          
        }
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="info">{error}</Alert>;
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

export default GraficaMapaProceso;
