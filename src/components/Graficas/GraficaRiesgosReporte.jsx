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

  const colors = ['#40CEE3', '#8E44AD', '#27AE60'];

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

        const labels = data.map(item => item.nombreIndicador || 'Indicador sin nombre');
        
        const resultados = data.map(item => {
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
            backgroundColor: backgroundColor.map(color => color + '80'),
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

  // *** CORRECCIÓN PRINCIPAL: Generar imagen después de que la animación termine ***
  useEffect(() => {
    if (chartRef.current && chartData && !yaGenerada.current && !loading) {
      console.log('🎯 Iniciando proceso de generación de imagen para riesgos');
      
      // Función para generar la imagen
      const generateImage = () => {
        try {
          const chart = chartRef.current;
          
          if (!chart) {
            console.warn('❌ No se encontró la instancia del chart de riesgos');
            return;
          }

          // Desactivar animaciones temporalmente para capturar la imagen
          chart.options.animation = false;
          chart.update('none'); // Actualizar sin animación
          
          // Pequeña demora para asegurar que el gráfico se actualice
          setTimeout(() => {
            try {
              const base64Image = chart.toBase64Image('image/png', 1.0);
              
              if (base64Image && base64Image.startsWith('data:image/png;base64,')) {
                console.log('✅ Imagen base64 generada correctamente para Gestión de Riesgos');
                
                if (typeof onImageReady === 'function') {
                  onImageReady(base64Image);
                  yaGenerada.current = true;
                  console.log('📤 Callback onImageReady ejecutado para riesgos');
                  
                  // Restaurar animaciones para la visualización
                  chart.options.animation = {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                  };
                  chart.update();
                }
              } else {
                console.error('❌ No se pudo generar imagen base64 válida para riesgos');
              }
            } catch (error) {
              console.error('❌ Error generando imagen de riesgos:', error);
            }
          }, 100);
        } catch (error) {
          console.error('❌ Error en generateImage:', error);
        }
      };

      // Esperar a que la animación termine antes de generar la imagen
      setTimeout(generateImage, 1500);
    }
  }, [chartData, onImageReady, loading]);

  // Opciones del gráfico con animación
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
            return indicador?.nombreIndicador || `Indicador ${index + 1}`;
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
          text: 'Indicadores de Riesgo',
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
        max: 100,
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
      duration: 1000,
      easing: 'easeInOutQuart',
      onComplete: () => {
        console.log('🎬 Animación de chart de riesgos completada');
      }
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
        Eficacia en la gestión de riesgos por indicador
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
      
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        {rawData.length} indicadores de riesgo cargados
      </Typography>
    </Box>
  );
};

export default GraficaGestionRiesgos;