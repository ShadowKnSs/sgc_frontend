// src/components/Graficas/GraficaRetroalimentacion.jsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Alert } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficaRetroalimentacion = ({ data = [], onImageReady }) => {
  const chartRef = useRef(null);
  const yaGenerada = useRef(false);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const labels = data.map(item => item.nombreIndicador);
    const datasetFelicitaciones = data.map(item => item.cantidadFelicitacion ?? item.felicitaciones ?? 0);
    const datasetSugerencias = data.map(item => item.cantidadSugerencia ?? item.sugerencias ?? 0);
    const datasetQuejas = data.map(item => item.cantidadQueja ?? item.quejas ?? 0);

    setChartData({
      labels,
      datasets: [
        {
          label: "Felicitaciones",
          data: datasetFelicitaciones,
          backgroundColor: "#66BB6A"
        },
        {
          label: "Sugerencias",
          data: datasetSugerencias,
          backgroundColor: "#FFA726"
        },
        {
          label: "Quejas",
          data: datasetQuejas,
          backgroundColor: "#EF5350"
        }
      ]
    });
  }, [data]);

  useEffect(() => {
    if (chartRef.current && chartData && !yaGenerada.current) {
      const timer = setTimeout(() => {
        if (chartRef.current) {
          const base64 = chartRef.current.toBase64Image("image/png", 1.0);
          if (base64 && typeof onImageReady === "function") {
            onImageReady(base64);
            yaGenerada.current = true;
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [chartData, onImageReady]);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Alert severity="info">No hay datos de retroalimentación disponibles.</Alert>
      </Box>
    );
  }

  if (!chartData) return null;

  const options = {
    responsive: true,
    indexAxis: "y",
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Retroalimentación" },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.raw}`
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: "Cantidad" }
      },
      y: {
        title: { display: true, text: "Indicador" }
      }
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", mt: 4 }}>
      <Bar ref={chartRef} data={chartData} options={options} />
    </Box>
  );
};

export default GraficaRetroalimentacion;