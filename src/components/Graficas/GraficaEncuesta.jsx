import React, { useEffect, useRef, useState } from "react";
import { Box, Alert } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const GraficaEncuesta = ({ data = null, onImageReady }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!data || data.noEncuestas <= 0) return;

    const total = data.noEncuestas || 1;
    const valores = {
      malo: ((data.malo ?? 0) * 100 / total).toFixed(2),
      regular: ((data.regular ?? 0) * 100 / total).toFixed(2),
      buenoExcelente: (((data.bueno ?? 0) + (data.excelente ?? 0)) * 100 / total).toFixed(2)
    };

    setChartData({
      labels: ['Malo', 'Regular', 'Excelente/Bueno'],
      datasets: [{
        data: [valores.malo, valores.regular, valores.buenoExcelente],
        backgroundColor: ['#D32F2F', '#F9A825', '#1976D2'],
        borderWidth: 1
      }]
    });
  }, [data]);

  useEffect(() => {
    if (chartRef.current && chartData && typeof onImageReady === "function") {
      const base64 = chartRef.current.toBase64Image("image/png", 1.0);
      onImageReady(base64, "encuesta");
    }
  }, [chartData, onImageReady]);

  if (!data || !chartData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Alert severity="info">No hay datos de encuesta disponibles.</Alert>
      </Box>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}%`
        }
      }
    }
  };

  return (
    <Box sx={{ width: "100%", height: 350, mt: 4}}>
      <Pie ref={chartRef} data={chartData} options={options} />
    </Box>
  );
};

export default GraficaEncuesta;
