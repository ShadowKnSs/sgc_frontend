import React, { useRef, useEffect, useMemo, useState } from "react";
import { Box, Alert, Typography } from "@mui/material";
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

const GraficaEvaluacionProveedores = ({ data = null, onImageReady }) => {
  const chartRef = useRef(null);
  const yaGenerada = useRef(false);
  const [chartInstance, setChartInstance] = useState(null);

  const chartData = useMemo(() => {
    if (!data) return null;

    return {
      labels: ["Ene-Jun", "Jul-Dic"],
      datasets: [
        {
          label: "Confiable",
          data: [
            Number(data.resultadoConfiableSem1) || 0,
            Number(data.resultadoConfiableSem2) || 0
          ],
          backgroundColor: "#4CAF50",
          borderColor: "#388E3C",
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: "Condicionado",
          data: [
            Number(data.resultadoCondicionadoSem1) || 0,
            Number(data.resultadoCondicionadoSem2) || 0
          ],
          backgroundColor: "#FFC107",
          borderColor: "#FFA000",
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: "No Confiable",
          data: [
            Number(data.resultadoNoConfiableSem1) || 0,
            Number(data.resultadoNoConfiableSem2) || 0
          ],
          backgroundColor: "#F44336",
          borderColor: "#D32F2F",
          borderWidth: 1,
          borderRadius: 4,
        }
      ]
    };
  }, [data]);

  const onChartReady = (chart) => {
    setChartInstance(chart);
  };

  useEffect(() => {
    if (chartInstance && chartData && !yaGenerada.current) {
      const timer = setTimeout(() => {
        try {
          const base64 = chartInstance.toBase64Image("image/png", 1.0);
          
          if (base64 && base64.startsWith("data:image/png;base64,") && typeof onImageReady === "function") {
            onImageReady("evaluacionProveedores", base64);
            yaGenerada.current = true;
          }
        } catch (error) {
          console.error("Error al generar imagen:", error);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [chartInstance, chartData, onImageReady]);

  if (!data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Alert severity="info">No hay datos de Evaluación de Proveedores disponibles.</Alert>
      </Box>
    );
  }

  if (!chartData) return null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      title: {
        display: true,
        text: "Evaluación de Proveedores",
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: context => `${context.dataset.label}: ${context.raw}%`
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Periodo",
          font: {
            size: 12,
            weight: '500'
          }
        },
        ticks: {
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Porcentaje",
          font: {
            size: 12,
            weight: '500'
          }
        },
        ticks: {
          callback: value => `${value}%`,
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    animation: {
      duration: 0
    }
  };

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: 'primary.main' }}>
        Evaluación de Proveedores
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: 400,
          backgroundColor: '#fafafa',
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          padding: 2
        }}
      >
        <Bar
          ref={(chart) => {
            chartRef.current = chart;
            if (chart) onChartReady(chart);
          }}
          data={chartData}
          options={options}
        />
      </Box>
    </Box>
  );
};

export default GraficaEvaluacionProveedores;