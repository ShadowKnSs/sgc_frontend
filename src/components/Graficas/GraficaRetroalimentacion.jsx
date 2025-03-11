// src/components/Graficas/GraficaRetroalimentacionConjunta.jsx
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficaRetroalimentacionConjunta = ({ retroList }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // if (!retroVirtualId || !retroFisicaId || !retroEncuestaId) {
    //   console.warn("Faltan IDs de retroalimentación:", { retroVirtualId, retroFisicaId, retroEncuestaId });
    //   return;
    // }

    if (!retroList || retroList.length === 0) {
      console.warn("No se encontraron indicadores de retroalimentación en retroList:", retroList);
      setError("No se encontraron indicadores de retroalimentación.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log("Realizando peticiones para cada indicador de retroalimentación...");
        // Para cada indicador de retro en el array, hacemos la petición al endpoint de retroalimentación
        const requests = retroList.map(ind =>
          axios.get(`http://127.0.0.1:8000/api/retroalimentacion/${ind.idIndicadorConsolidado}/resultados`)
        );
        const responses = await Promise.all(requests);
        const retroDataArray = responses.map(res => res.data.retroalimentacion);
        console.log("Datos de retroalimentación obtenidos:", retroDataArray);

        // Construir labels dinámicamente a partir del array retroList (usando el nombre original)
        const labels = retroList.map(ind => ind.nombreIndicador);

        // Construir datasets para cada categoría:
        const datasetFelicitaciones = retroDataArray.map(data => data.cantidadFelicitacion);
        const datasetSugerencias = retroDataArray.map(data => data.cantidadSugerencia);
        const datasetQuejas = retroDataArray.map(data => data.cantidadQueja);

        const formattedData = {
          labels,
          datasets: [
            {
              label: "Felicitaciones",
              data: datasetFelicitaciones,
              backgroundColor: "#4caf50"
            },
            {
              label: "Sugerencias",
              data: datasetSugerencias,
              backgroundColor: "#ff9800"
            },
            {
              label: "Quejas",
              data: datasetQuejas,
              backgroundColor: "#f44336"
            }
          ]
        };

        console.log("Datos formateados para la gráfica:", formattedData);
        setChartData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching retroalimentación conjunta:", err);
        setError("Error al cargar los datos de retroalimentación.");
        setLoading(false);
      }
    };

    fetchData();
  }, [retroList]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
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
    }
  };

  return (
    <Box sx={{ maxWidth: "70%", mx: "auto", mt: 4 }}>
      <Bar data={chartData} options={options} />
    </Box>
  );
};

export default GraficaRetroalimentacionConjunta;