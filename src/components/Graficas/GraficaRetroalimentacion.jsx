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

const GraficaRetroalimentacionConjunta = ({ retroList, onImageReady }) => {
  const chartRef = useRef(null);
  const yaGenerada = useRef(false);

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!retroList || retroList.length === 0) {
      setError("No se encontraron indicadores de retroalimentación.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const requests = retroList.map(ind =>
          axios.get(`http://127.0.0.1:8000/api/retroalimentacion/${ind.idIndicador}/resultados`)
        );
        const responses = await Promise.all(requests);
        const retroDataArray = responses.map(res => res.data);

        const labels = retroList.map(ind => ind.nombreIndicador);
        const datasetFelicitaciones = retroDataArray.map(item => item.resultado.cantidadFelicitacion ?? 0);
        const datasetSugerencias = retroDataArray.map(item => item.resultado.cantidadSugerencia ?? 0);
        const datasetQuejas = retroDataArray.map(item => item.resultado.cantidadQueja ?? 0);

        const formattedData = {
          labels,
          datasets: [
            { label: "Felicitaciones", data: datasetFelicitaciones, backgroundColor: "#4caf50" },
            { label: "Sugerencias", data: datasetSugerencias, backgroundColor: "#ff9800" },
            { label: "Quejas", data: datasetQuejas, backgroundColor: "#f44336" }
          ]
        };

        setChartData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error al cargar datos:", err);
        setError("Error al cargar retroalimentación.");
        setLoading(false);
      }
    };

    fetchData();
  }, [retroList]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Retroalimentación" }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Cantidad" }
      },
      x: {
        title: { display: true, text: "Tipo de Retroalimentación" }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
      onComplete: () => {
        if (
          chartRef.current &&
          chartRef.current.toBase64Image &&
          !yaGenerada.current
        ) {
          const base64 = chartRef.current.toBase64Image("image/png", 1.0);
          if (base64) {
            console.log("🖼️ Imagen generada (retroalimentación - onComplete):", base64.substring(0, 100));
            if (onImageReady) onImageReady(base64, "retroalimentacion");
            yaGenerada.current = true;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="info">{error}</Alert>;
  }

  return (
    <Box sx={{ maxWidth: "70%", mx: "auto", mt: 4 }}>
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

export default GraficaRetroalimentacionConjunta;
