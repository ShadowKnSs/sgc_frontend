import React, { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficaEvaluacionProveedoresStacked = ({ data = null, onImageReady }) => {
  const chartRef = useRef(null);
  const yaGenerada = useRef(false);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    const formattedData = {
      labels: ["Ene-Jun", "Jul-Dic"],
      datasets: [
        {
          label: "Confiable",
          data: [data.resultadoConfiableSem1 ?? 0, data.resultadoConfiableSem2 ?? 0],
          backgroundColor: "#72cff2"
        },
        {
          label: "Condicionado",
          data: [data.resultadoCondicionadoSem1 ?? 0, data.resultadoCondicionadoSem2 ?? 0],
          backgroundColor: "#78e6c8"
        },
        {
          label: "No Confiable",
          data: [data.resultadoNoConfiableSem1 ?? 0, data.resultadoNoConfiableSem2 ?? 0],
          backgroundColor: "#f28772"
        }
      ]
    };

    setChartData(formattedData);
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (chartRef.current && chartData && !yaGenerada.current) {
        try {
          const base64 = chartRef.current.toBase64Image("image/png", 1.0);
          if (base64 && typeof onImageReady === "function") {
            onImageReady(base64, "evaluacionProveedores");
            yaGenerada.current = true;
          }
        } catch (error) {
          console.error("⚠️ No se pudo generar imagen de evaluación:", error);
        }
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [chartData, onImageReady]);

  if (!data || Object.keys(data).length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Alert severity="info">No hay datos de Evaluación de Proveedores disponibles.</Alert>
      </Box>
    );
  }

  if (!chartData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Evaluación de Proveedores (Stacked)",
        font: { size: 18 }
      },
      tooltip: {
        callbacks: {
          label: context => `${context.dataset.label}: ${context.raw}%`
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        title: { display: true, text: "Periodo" }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: { display: true, text: "Porcentaje" },
        ticks: { callback: value => `${value}%` }
      }
    },
    animation: false
  };

  return (
    <Box sx={{ maxWidth: "70%", mx: "auto", mt: 4, height: 300 }}>
      <Bar
        ref={(ref) => { chartRef.current = ref; }}
        data={chartData}
        options={options}
      />
    </Box>
  );
};

export default GraficaEvaluacionProveedoresStacked;
