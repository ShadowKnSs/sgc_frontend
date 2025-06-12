import React, { useEffect, useRef, useState } from "react";
import { Box, Alert } from "@mui/material";
import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(...registerables);

const PlanControlBarChart = ({ data = [], onImageReady }) => {
  const chartRef = useRef(null);
  const yaGenerada = useRef(false);
  const [chartData, setChartData] = useState(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%`
        }
      },
      title: { display: false }
    },
    animation: {
      duration: 600,
      easing: 'easeOutQuart',
      onComplete: (ctx) => {
        const chart = ctx.chart;
        if (!yaGenerada.current && onImageReady && chartRef.current) {
          const base64 = chartRef.current.toBase64Image();
          onImageReady(base64, "planControl");
          yaGenerada.current = true;
        }
      }
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      const labels = data.map(item => item.nombreIndicador);
      const dataSem1 = data.map(item => item.resultadoSemestral1 ?? 0);
      const dataSem2 = data.map(item => item.resultadoSemestral2 ?? 0);

      setChartData({
        labels,
        datasets: [
          {
            label: "Ene-Jun",
            data: dataSem1,
            backgroundColor: "rgba(249, 184, 0, 0.85)",
            borderRadius: 5
          },
          {
            label: "Jul-Dic",
            data: dataSem2,
            backgroundColor: "rgba(0, 178, 227, 0.85)",
            borderRadius: 5
          }
        ]
      });
    }
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Alert severity="info">
          No hay datos disponibles para graficar Plan de Control.
        </Alert>
      </Box>
    );
  }

  if (!chartData) return null;

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Bar ref={chartRef} data={chartData} options={options} />
    </Box>
  );
};

export default PlanControlBarChart;
