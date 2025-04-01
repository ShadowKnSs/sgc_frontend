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

const GraficaEvaluacionProveedoresStacked = ({ id, onImageReady }) => {
  const chartRef = useRef(null);
  const yaGenerada = useRef(false);

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    },
    animation: false // importante para que se renderice rápido antes de tomar imagen
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    axios.get(`http://127.0.0.1:8000/api/evalua-proveedores/${id}/resultados`)
      .then(response => {
        const result = response.data?.resultado;
        if (!result) {
          setError("No se encontraron datos de evaluación de proveedores.");
          setLoading(false);
          return;
        }

        const periodLabels = ["Ene-Jun", "Jul-Dic"];

        const formattedData = {
          labels: periodLabels,
          datasets: [
            {
              label: "Confiable",
              data: [result.resultadoConfiableSem1 ?? 0, result.resultadoConfiableSem2 ?? 0],
              backgroundColor: "#72cff2"
            },
            {
              label: "Condicionado",
              data: [result.resultadoCondicionadoSem1 ?? 0, result.resultadoCondicionadoSem2 ?? 0],
              backgroundColor: "#78e6c8"
            },
            {
              label: "No Confiable",
              data: [result.resultadoNoConfiableSem1 ?? 0, result.resultadoNoConfiableSem2 ?? 0],
              backgroundColor: "#f28772"
            }
          ]
        };

        setChartData(formattedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Error al cargar la evaluación de proveedores:", err);
        setError("Error al cargar la evaluación de proveedores.");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (chartRef.current && chartData && !yaGenerada.current) {
        try {
          const base64 = chartRef.current.toBase64Image("image/png", 1.0);
          console.log("📸 Imagen generada (Evaluación):", base64.substring(0, 60));
          if (onImageReady) {
            onImageReady(base64, "evaluacionProveedores");
          }
          yaGenerada.current = true;
        } catch (error) {
          console.error("⚠️ No se pudo generar imagen de evaluación:", error);
        }
      }
    }, 500); // pequeño delay para asegurar render completo

    return () => clearTimeout(timer);
  }, [chartData, onImageReady]);

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress /></Box>;
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

export default GraficaEvaluacionProveedoresStacked;
