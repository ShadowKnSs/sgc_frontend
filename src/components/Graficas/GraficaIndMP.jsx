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

const GraficaMapaProceso = ({ data = [], onImageReady }) => {
  const chartRef = useRef(null);
  const yaGenerada = useRef(false);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const labels = data.map(item =>
      item.nombreIndicador.length > 50
        ? item.nombreIndicador.slice(0, 47) + "..."
        : item.nombreIndicador
    );

    const dataSem1 = data.map(item =>
      Number.isFinite(item.resultadoSemestral1) ? item.resultadoSemestral1 : 0
    );
    const dataSem2 = data.map(item =>
      Number.isFinite(item.resultadoSemestral2) ? item.resultadoSemestral2 : 0
    );

    setChartData({
      labels,
      datasets: [
        {
          label: "Ene-Jun",
          data: dataSem1,
          backgroundColor: "#F9B800"
        },
        {
          label: "Jul-Dic",
          data: dataSem2,
          backgroundColor: "#00B2E3"
        }
      ]
    });
  }, [data]);

  useEffect(() => {
    if (chartRef.current && chartRef.current.toBase64Image && chartData && !yaGenerada.current) {
      const base64 = chartRef.current.toBase64Image("image/png", 1.0);
      if (base64 && typeof onImageReady === "function") {
        onImageReady(base64, "mapaProceso");
        yaGenerada.current = true;
      }
    }
  }, [chartData, onImageReady]);

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Alert severity="info">No hay datos de Mapa de Proceso disponibles.</Alert>
      </Box>
    );
  }

  if (!chartData) return null;

  const usarEjeHorizontal = data.length > 6;

  const options = {
    responsive: true,
    indexAxis: usarEjeHorizontal ? "y" : "x",
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Mapa de Proceso" },
      tooltip: {
        callbacks: {
          title: context => data[context[0].dataIndex]?.nombreIndicador ?? ""
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: !usarEjeHorizontal, text: usarEjeHorizontal ? "" : "Indicador" },
        ticks: {
          autoSkip: false,
          maxRotation: 30,
          minRotation: 30
        }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: usarEjeHorizontal ? "Indicador" : "Resultado" }
      }
    },
    animation: false
  };

 return (
  <Box sx={{ width: "100%", height: 350, mt: 4 }}>
    <Bar
      ref={(ref) => {
        chartRef.current = ref;
      }}
      data={chartData}
      options={{
        ...options,
        maintainAspectRatio: false
      }}
    />
  </Box>
);

};

export default GraficaMapaProceso;
