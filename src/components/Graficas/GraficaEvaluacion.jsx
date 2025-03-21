// src/components/Graficas/GraficaEvaluacionProveedoresStacked.jsx
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

const GraficaEvaluacionProveedoresStacked = ({ id }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`http://127.0.0.1:8000/api/evalua-proveedores/${id}/resultados`)
      .then(response => {
        // Se asume que la respuesta tiene la forma:
        // { evaluacion: { confiable: number, condicionado: number, noConfiable: number } }
        const data = response.data.evaluacion;
        console.log("Datos de evaluación de proveedores:", data);

        if (!data) {
          setError("No se encontraron datos de evaluación de proveedores.");
          setLoading(false);
          return;
        }

        // Si solo tenemos un registro anual, duplicamos el mismo valor para dos periodos (Ejemplo: Ene-Jun y Jul-Dic)
        const periodLabels = ["Ene-Jun"];
        const confiableData = [data.confiable];
        const condicionadoData = [data.condicionado];
        const noConfiableData = [data.noConfiable];

        const formattedData = {
          labels: periodLabels,
          datasets: [
            {
              label: "Confiable",
              data: confiableData,
              backgroundColor: "#72cff2"
            },
            {
              label: "Condicionado",
              data: condicionadoData,
              backgroundColor: "#78e6c8"
            },
            {
              label: "No Confiable",
              data: noConfiableData,
              backgroundColor: "#72f287"
            }
          ]
        };

        setChartData(formattedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar la evaluación de proveedores:", err);
        setError("Error al cargar la evaluación de proveedores.");
        setLoading(false);
      });
  }, [id]);

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
      title: { display: true, text: "Evaluación de Proveedores (Stacked)" }
    },
    scales: {
      x: {
        stacked: true,
        title: { display: true, text: "Periodo" }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: { display: true, text: "Valor" }
      }
    }
  };

  return (
    <Box sx={{ maxWidth: "70%", mx: "auto", mt: 4 }}>
      <Bar data={chartData} options={options} />
    </Box>
  );
};

export default GraficaEvaluacionProveedoresStacked;
