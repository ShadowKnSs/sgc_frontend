import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

const GraficaGestionRiesgos = ({ onImageReady, idRegistro }) => {
  const chartRef = useRef(null);
  const yaGenerada = useRef(false);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState([]);

  const colors = ['#1D2D5F', '#F65E5D', '#FFBC47', '#40CEE3', '#8E44AD', '#27AE60'];

  useEffect(() => {
    if (!idRegistro) {
      setError("No se proporcionó ID de registro");
      setLoading(false);
      return;
    }

    console.log('🔍 Cargando datos de gestión de riesgos para idRegistro:', idRegistro);
  
    axios.get(`http://127.0.0.1:8000/api/gestion-riesgos/${idRegistro}`)
      .then(response => {
        console.log('✅ Datos de gestión de riesgos recibidos:', response.data);
        
        const data = response.data || [];
        setRawData(data);

        if (data.length === 0) {
          setError("No hay datos de gestión de riesgos disponibles");
          setLoading(false);
          return;
        }

        const labels = data.map((_, index) => `${index + 1}`);
        
        const resultados = data.map(item => {
          // Validar que el resultado sea un número válido
          const resultado = parseFloat(item.resultadoAnual);
          return isNaN(resultado) ? 0 : resultado;
        });
        
        const backgroundColor = resultados.map((_, index) => colors[index % colors.length]);
        const borderColor = backgroundColor.map(color => color);

        const chartDataObj = {
          labels,
          datasets: [{
            label: 'Eficacia de Riesgos (%)',
            data: resultados,
            backgroundColor: backgroundColor.map(color => color + '80'), // Agregar transparencia
            borderColor: borderColor,
            borderWidth: 2,
            borderRadius: 4,
            borderSkipped: false,
          }]
        };

        console.log('📊 Chart data preparado:', chartDataObj);
        setChartData(chartDataObj);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Error al cargar gestión de riesgos:", err);
        setError(`Error al cargar datos: ${err.response?.data?.message || err.message}`);
        setLoading(false);
      });
  }, [idRegistro]);

  // *** CORRECCIÓN PRINCIPAL: Mejor manejo de la generación de imagen ***
  useEffect(() => {
    if (chartRef.current && chartData && !yaGenerada.current && !loading) {
      console.log('🎯 Iniciando proceso de generación de imagen para riesgos');
      
      const generateImage = () => {
        try {
          const chart = chartRef.current;
          console.log('Chart instance (riesgos):', chart);
          
          if (!chart) {
            console.warn('❌ No se encontró la instancia del chart de riesgos');
            return;
          }

          let base64Image = null;
          
          // Intento 1: Método directo de Chart.js
          if (typeof chart.toBase64Image === 'function') {
            base64Image = chart.toBase64Image('image/png', 1.0);
            console.log('✅ Imagen de riesgos generada con toBase64Image');
          }
          // Intento 2: Canvas directo
          else if (chart.canvas && typeof chart.canvas.toDataURL === 'function') {
            base64Image = chart.canvas.toDataURL('image/png');
            console.log('✅ Imagen de riesgos generada con canvas.toDataURL');
          }
          // Intento 3: Buscar canvas en DOM
          else {
            const canvasElements = document.querySelectorAll('canvas');
            for (let canvas of canvasElements) {
              try {
                base64Image = canvas.toDataURL('image/png');
                console.log('✅ Imagen de riesgos generada desde canvas del DOM');
                break;
              } catch (e) {
                console.warn('Canvas no válido:', e);
              }
            }
          }

          if (base64Image && base64Image.startsWith('data:image/png;base64,')) {
            console.log('✅ Imagen base64 generada correctamente para Gestión de Riesgos');
            console.log('📸 Imagen preview:', base64Image.substring(0, 60));
            
            if (typeof onImageReady === 'function') {
              // *** CORRECCIÓN: Orden correcto de parámetros ***
              onImageReady(base64Image); // Solo pasar la imagen, el tipo se maneja internamente
              yaGenerada.current = true;
              console.log('📤 Callback onImageReady ejecutado para riesgos');
            } else {
              console.warn('⚠️ onImageReady no es una función');
            }
          } else {
            console.error('❌ No se pudo generar imagen base64 válida para riesgos');
            console.log('Imagen recibida:', base64Image?.substring(0, 100));
          }
        } catch (error) {
          console.error('❌ Error generando imagen de riesgos:', error);
        }
      };

      // Usar múltiples intentos con diferentes delays
      const delays = [100, 300, 800, 1500];
      const timeouts = [];

      delays.forEach(delay => {
        const timeout = setTimeout(() => {
          if (!yaGenerada.current) {
            console.log(`🔄 Intento de generar imagen de riesgos (delay: ${delay}ms)`);
            requestAnimationFrame(generateImage);
          }
        }, delay);
        timeouts.push(timeout);
      });

      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
    }
  }, [chartData, onImageReady, loading]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
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
        text: 'Eficacia en la Gestión de Riesgos',
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
            const indicador = rawData[index];
            return `Indicador ${index + 1}: ${indicador?.nombreIndicador || 'Sin nombre'}`;
          },
          label: (context) => {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${value.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Número de Indicador',
          font: {
            size: 12,
            weight: '500'
          }
        },
        ticks: {
          font: {
            size: 10
          },
          maxRotation: 45,
          minRotation: 0
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        beginAtZero: true,
        max: 100, // Asumiendo que son porcentajes
        title: {
          display: true,
          text: 'Eficacia (%)',
          font: {
            size: 12,
            weight: '500'
          }
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value) {
            return value + '%';
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    animation: {
      onComplete: () => {
        console.log('🎬 Animación de chart de riesgos completada');
        // Trigger adicional para generar imagen después de la animación
        if (!yaGenerada.current && chartRef.current) {
          setTimeout(() => {
            if (!yaGenerada.current) {
              console.log('🔄 Intento adicional desde onComplete');
              const chart = chartRef.current;
              try {
                const base64 = chart.toBase64Image?.('image/png', 1.0) || 
                              chart.canvas?.toDataURL?.('image/png');
                if (base64 && typeof onImageReady === 'function') {
                  onImageReady(base64);
                  yaGenerada.current = true;
                  console.log('✅ Imagen generada desde onComplete');
                }
              } catch (error) {
                console.error('❌ Error en onComplete de riesgos:', error);
              }
            }
          }, 200);
        }
      },
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, minHeight: 200 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando datos de gestión de riesgos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="warning">{error}</Alert>
      </Box>
    );
  }

  if (!chartData || !chartData.datasets[0].data.length) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="info">No hay datos de gestión de riesgos para mostrar.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mb: 2, fontStyle: 'italic' }}
      >
        Los números en el eje corresponden a los indicadores de la tabla superior
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
      
      {/* Debug info - remover en producción */}
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Debug: {rawData.length} indicadores de riesgo, Imagen generada: {yaGenerada.current ? 'Sí' : 'No'}
      </Typography>
    </Box>
  );
};

export default GraficaGestionRiesgos;