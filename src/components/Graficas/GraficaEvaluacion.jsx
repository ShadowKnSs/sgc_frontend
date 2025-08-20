import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import axios from "axios";
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

const GraficaEvaluacionProveedoresStacked = ({ idProceso, anio, onImageReady }) => {
  const chartRef = useRef(null);
  const yaGenerada = useRef(false);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renderAttempts, setRenderAttempts] = useState(0);

  // Obtener datos desde la API
  useEffect(() => {
    if (!idProceso || !anio) {
      setError("Faltan parámetros necesarios (idProceso o anio)");
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:8000/api/indicadores/evaluacion-proveedores/${idProceso}/${anio}`)
      .then(response => {
        const data = response.data || [];

        if (data.length === 0) {
          setError("No hay datos de evaluación de proveedores disponibles");
          setLoading(false);
          return;
        }

        // Tomar el primer indicador (asumimos que solo hay uno)
        const indicador = data[0];

        const formattedData = {
          labels: ["Ene-Jun", "Jul-Dic"],
          datasets: [
            {
              label: "Confiable",
              data: [
                Number(indicador.resultadoConfiableSem1) || 0,
                Number(indicador.resultadoConfiableSem2) || 0
              ],
              backgroundColor: "#4CAF50",
              borderColor: "#388E3C",
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: "Condicionado",
              data: [
                Number(indicador.resultadoCondicionadoSem1) || 0,
                Number(indicador.resultadoCondicionadoSem2) || 0
              ],
              backgroundColor: "#FFC107",
              borderColor: "#FFA000",
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: "No Confiable",
              data: [
                Number(indicador.resultadoNoConfiableSem1) || 0,
                Number(indicador.resultadoNoConfiableSem2) || 0
              ],
              backgroundColor: "#F44336",
              borderColor: "#D32F2F",
              borderWidth: 1,
              borderRadius: 4,
            }
          ]
        };

        setChartData(formattedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Error al cargar evaluación de proveedores:", err);
        setError("Error al cargar datos de evaluación de proveedores.");
        setLoading(false);
      });
  }, [idProceso, anio]);

  // Función para generar la imagen
  const generateImage = useCallback(() => {
    if (yaGenerada.current) return;

    const chart = chartRef.current;
    if (!chart) {
      console.warn("Chart instance not available");
      if (renderAttempts < 5) {
        setTimeout(generateImage, 300);
        setRenderAttempts(prev => prev + 1);
      }
      return;
    }

    try {
      // Forzar una actualización del gráfico
      chart.update();

      // Pequeña pausa para permitir que el gráfico se renderice
      setTimeout(() => {
        try {
          const base64 = chart.toBase64Image("image/png", 1.0);

          if (base64 && base64.startsWith("data:image/png;base64,")) {
            onImageReady(base64); yaGenerada.current = true;
            console.log("✅ Imagen de evaluación de proveedores generada correctamente");
          } else {
            console.error("❌ Base64 inválido generado");
            // Reintentar después de un breve tiempo si no hemos excedido los intentos
            if (renderAttempts < 5) {
              setTimeout(generateImage, 300);
              setRenderAttempts(prev => prev + 1);
            }
          }
        } catch (error) {
          console.error("❌ Error al generar imagen:", error);
          // Reintentar después de un breve tiempo si no hemos excedido los intentos
          if (renderAttempts < 5) {
            setTimeout(generateImage, 300);
            setRenderAttempts(prev => prev + 1);
          }
        }
      }, 100);
    } catch (error) {
      console.error("❌ Error al actualizar el gráfico:", error);
      // Reintentar después de un breve tiempo si no hemos excedido los intentos
      if (renderAttempts < 5) {
        setTimeout(generateImage, 300);
        setRenderAttempts(prev => prev + 1);
      }
    }
  }, [onImageReady, renderAttempts]);

  // Generar imagen cuando los datos estén disponibles
  useEffect(() => {
    if (chartData && !yaGenerada.current) {
      // Esperar un poco más para asegurar que el gráfico esté completamente renderizado
      const timer = setTimeout(generateImage, 1000);
      return () => clearTimeout(timer);
    }
  }, [chartData, generateImage]);

  const options = useMemo(() => ({
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
      duration: 0 // Desactivar animaciones para renderizado más rápido
    }
  }), []);

  if (loading) return <CircularProgress />;

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Alert severity="info">{error}</Alert>
      </Box>
    );
  }

  if (!chartData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Alert severity="info">No hay datos disponibles para mostrar la gráfica.</Alert>
      </Box>
    );
  }

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
          ref={chartRef}
          data={chartData}
          options={options}
        />
      </Box>
    </Box>
  );
};

export default GraficaEvaluacionProveedoresStacked;