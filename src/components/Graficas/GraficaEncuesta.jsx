import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Alert } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const GraficaEncuesta = ({ data = null, onImageReady }) => {
  const chartRef = useRef(null);
  const imagenEnviada = useRef(false);
  const [chartRendered, setChartRendered] = useState(false);

  // 1) Prepara datos de manera MEMOIZADA
  const chartData = useMemo(() => {
    if (!data || !data.noEncuestas || data.noEncuestas <= 0) return null;

    const total = data.noEncuestas || 1;
    const malo = Number(((data.malo ?? 0) * 100) / total).toFixed(2);
    const regular = Number(((data.regular ?? 0) * 100) / total).toFixed(2);
    const buenoExcelente = Number((((data.bueno ?? 0) + (data.excelente ?? 0)) * 100) / total).toFixed(2);

    return {
      labels: ["Malo", "Regular", "Excelente/Bueno"],
      datasets: [
        {
          data: [malo, regular, buenoExcelente],
          backgroundColor: ["#D32F2F", "#F9A825", "#1976D2"],
          borderWidth: 1,
        },
      ],
    };
  }, [data]);

  // 2) Options MEMOIZADAS (objeto estable)
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0, // Desactivar animaciones para renderizado inmediato
        onComplete: () => {
          // Marcar que el gráfico se ha renderizado completamente
          setChartRendered(true);
        }
      },
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
          },
        },
        datalabels: {
          color: "#fff",
          formatter: (value) => `${value}%`,
          font: { weight: "bold", size: 14 },
        },
      },
    }),
    []
  );

  // 3) Exportar la imagen SOLO cuando el gráfico esté completamente renderizado
  useEffect(() => {
    if (chartRef.current && chartData && chartRendered && !imagenEnviada.current) {
      try {
        // Pequeño delay para asegurar que el renderizado esté completo
        setTimeout(() => {
          const base64 = chartRef.current.toBase64Image("image/png", 1.0);
          
          // Validar que el base64 sea válido
          if (base64 && base64.startsWith('data:image/png;base64,')) {
            onImageReady("encuesta", base64);
            imagenEnviada.current = true;
          } else {
            console.error("Base64 inválido generado por el gráfico");
          }
        }, 100);
      } catch (error) {
        console.error("Error al generar la imagen:", error);
      }
    }
  }, [chartData, chartRendered, onImageReady]);

  if (!chartData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Alert severity="info">No hay datos de encuesta disponibles.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: 350, mt: 4 }}>
      <Pie ref={chartRef} data={chartData} options={options} />
    </Box>
  );
};

export default GraficaEncuesta;