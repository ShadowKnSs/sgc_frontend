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

const GraficaRetroalimentacionConjunta = ({ retroVirtualId, retroFisicaId, retroEncuestaId }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // if (!retroVirtualId || !retroFisicaId || !retroEncuestaId) {
    //   console.warn("Faltan IDs de retroalimentación:", { retroVirtualId, retroFisicaId, retroEncuestaId });
    //   return;
    // }

    const fetchData = async () => {
      try {
        console.log("Realizando peticiones para retroalimentación conjunta...");
        const [virtualRes, encuestaRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/retroalimentacion/${retroVirtualId}/resultados`),
          //axios.get(`http://127.0.0.1:8000/api/retroalimentacion/${retroFisicaId}/resultados`),
          axios.get(`http://127.0.0.1:8000/api/retroalimentacion/${retroEncuestaId}/resultados`)
        ]);

        console.log("Respuesta Virtual:", virtualRes.data);
        //console.log("Respuesta Física:", fisicaRes.data);
        console.log("Respuesta Encuesta:", encuestaRes.data);

        const virtualData = virtualRes.data.retroalimentacion;
        //const fisicaData = fisicaRes.data.retroalimentacion;
        const encuestaData = encuestaRes.data.retroalimentacion;

        const labels = ["Retro Virtual", "Retro Física", "Retro Encuesta"];
        const datasetFelicitaciones = [
          virtualData.cantidadFelicitacion,
          //fisicaData.cantidadFelicitacion,
          encuestaData.cantidadFelicitacion
        ];
        const datasetSugerencias = [
          virtualData.cantidadSugerencia,
          //fisicaData.cantidadSugerencia,
          encuestaData.cantidadSugerencia
        ];
        const datasetQuejas = [
          virtualData.cantidadQueja,
          //fisicaData.cantidadQueja,
          encuestaData.cantidadQueja
        ];

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
  }, [retroVirtualId, retroFisicaId, retroEncuestaId]);

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
      title: { display: true, text: "Retroalimentación Conjunta" }
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
