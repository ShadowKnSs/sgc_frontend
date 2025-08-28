import React, { useEffect, useRef, useState, useMemo } from "react";
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
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficaMapaProceso = ({ idProceso, anio, onImageReady }) => {
  const chartRef = useRef(null);
  const yaGenerada = useRef(false);
  const [chartData, setChartData] = useState(null);
  const [data, setData] = useState([]);
  const [chartInstance, setChartInstance] = useState(null);

  // 1) Traer datos desde el backend - ENDPOINT CORREGIDO
  useEffect(() => {
    if (!idProceso || !anio) return;
    
    axios
      .get(`http://localhost:8000/api/indicadores/mapa-proceso/${idProceso}/${anio}`)
      .then((res) => {
        setData(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error al obtener datos de mapa de proceso:", err);
        setData([]);
      });
  }, [idProceso, anio]);

  // Memoizar los datos procesados para mejor rendimiento
  const processedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return null;

    // Usar números como labels (1, 2, 3, etc.)
    const labels = data.map((_, index) => `${index + 1}`);

    const dataSem1 = data.map(item =>
      Number.isFinite(item.resultadoSemestral1) ? item.resultadoSemestral1 : 0
    );
    const dataSem2 = data.map(item =>
      Number.isFinite(item.resultadoSemestral2) ? item.resultadoSemestral2 : 0
    );

    return {
      labels,
      datasets: [
        {
          label: "Ene-Jun",
          data: dataSem1,
          backgroundColor: "#F9B800",
          borderColor: "#E6A600",
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: "Jul-Dic", 
          data: dataSem2,
          backgroundColor: "#00B2E3",
          borderColor: "#009CC7",
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        }
      ]
    };
  }, [data]);

  useEffect(() => {
    setChartData(processedData);
  }, [processedData]);

  // Configurar la instancia del gráfico cuando esté disponible
  const onChartReady = (chart) => {
    setChartInstance(chart);
  };

  // Generar imagen SOLO cuando el gráfico esté listo y los datos disponibles
  useEffect(() => {
    if (chartInstance && chartData && !yaGenerada.current) {
      const timer = setTimeout(() => {
        try {
          const base64 = chartInstance.toBase64Image("image/png", 1.0);
          
          if (base64 && base64.startsWith("data:image/png;base64,") && typeof onImageReady === "function") {
            onImageReady("mapaProceso", base64);
            yaGenerada.current = true;
          }
        } catch (error) {
          console.error("Error al generar imagen:", error);
        }
      }, 500); // Aumentar delay para asegurar renderizado completo
      
      return () => clearTimeout(timer);
    }
  }, [chartInstance, chartData, onImageReady]);

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Alert severity="info">No hay datos de Mapa de Proceso disponibles.</Alert>
      </Box>
    );
  }

  if (!chartData) return null;

  // Determinar orientación basada en cantidad de indicadores
  const usarEjeHorizontal = data.length > 8;
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: usarEjeHorizontal ? "y" : "x",
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
        text: "Resultados por Indicador",
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
          title: (context) => {
            const index = context[0].dataIndex;
            const indicador = data[index];
            return `Indicador ${index + 1}: ${indicador?.nombreIndicador || 'Sin nombre'}`;
          },
          label: (context) => {
            const value = context.parsed.y || context.parsed.x;
            return `${context.dataset.label}: ${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { 
          display: true, 
          text: usarEjeHorizontal ? "Resultado" : "Número de Indicador",
          font: {
            size: 12,
            weight: '500'
          }
        },
        ticks: {
          font: {
            size: 11
          },
          maxRotation: usarEjeHorizontal ? 0 : 0,
          minRotation: 0
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        beginAtZero: true,
        title: { 
          display: true, 
          text: usarEjeHorizontal ? "Número de Indicador" : "Resultado",
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
      }
    },
    animation: {
      duration: 0, // Desactivar animaciones para renderizado más rápido
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      {/* Nota explicativa */}
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mb: 2, fontStyle: 'italic' }}
      >
        Los números en el eje corresponden a los indicadores de la tabla superior
      </Typography>
      
      {/* Contenedor de la gráfica con altura dinámica */}
      <Box 
        sx={{ 
          width: "100%", 
          height: usarEjeHorizontal ? Math.max(350, data.length * 40) : 400,
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

export default GraficaMapaProceso;