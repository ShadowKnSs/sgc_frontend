// src/components/Graficas/GraficaPlanControl.jsx
import React, { useMemo, useRef, useCallback } from "react";
import { Box, Alert } from "@mui/material";
import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(...registerables);

// --- default de orden estable (no crea objetos nuevos por render) ---
const DEFAULT_ORDENAR = { por: "index", dir: "asc" };

const ValueLabelsPlugin = {
  id: "valueLabels",
  afterDatasetsDraw(chart) {
    const { data } = chart;
  
    // datasets 0 (S1) y 1 (S2)
    [0, 1].forEach((dsIndex) => {
      const meta = chart.getDatasetMeta(dsIndex);
      if (!meta?.data) return;
      meta.data.forEach((bar, idx) => {
        const val = data.datasets[dsIndex].data[idx];
        if (val == null) return;
      });
    });
  },
};
ChartJS.register(ValueLabelsPlugin);

export default function PlanControlBarChart({
  data = [],
  onImageReady,
  ordenar, // { por: "index" | "s1" | "s2", dir: "asc" | "desc" }
  titulo = "Plan de Control – Resultados Semestrales",
  ariaLabel = "Gráfica de resultados semestrales del Plan de Control",
}) {
  const chartRef = useRef(null);
  const yaGenerada = useRef(false);

  const ord = useMemo(() => ordenar ?? DEFAULT_ORDENAR, [ordenar]);

  // preparar datos (sin meta)
  const chartData = useMemo(() => {
    if (!data.length) return null;

    const filas = data
      .map((row, idx) => ({ ...row, __idx: idx }))
      .sort((a, b) => {
        const { por, dir } = ord;
        const sign = dir === "desc" ? -1 : 1;
        if (por === "s1") {
          const x = a.resultadoSemestral1 ?? -Infinity;
          const y = b.resultadoSemestral1 ?? -Infinity;
          return x === y ? 0 : x > y ? sign : -sign;
        }
        if (por === "s2") {
          const x = a.resultadoSemestral2 ?? -Infinity;
          const y = b.resultadoSemestral2 ?? -Infinity;
          return x === y ? 0 : x > y ? sign : -sign;
        }
        // índice original = numeración
        return (a.__idx - b.__idx) * sign;
      });

    const labels = filas.map((_, i) => String(i + 1)); // 1..N
    const s1 = filas.map((it) => it.resultadoSemestral1 ?? null);
    const s2 = filas.map((it) => it.resultadoSemestral2 ?? null);

    return {
      labels,
      datasets: [
        {
          type: "bar",
          label: "Ene–Jun",
          data: s1,
          backgroundColor: "rgba(0, 102, 204, 0.85)", // azul
          borderColor: "rgba(0, 102, 204, 1)",
          borderWidth: 1,
          borderRadius: 5,
          maxBarThickness: 34,
        },
        {
          type: "bar",
          label: "Jul–Dic",
          data: s2,
          backgroundColor: "rgba(255, 171, 0, 0.85)", // amarillo
          borderColor: "rgba(255, 171, 0, 1)",
          borderWidth: 1,
          borderRadius: 5,
          maxBarThickness: 34,
        },
      ],
      _filas: filas, // para tooltips
    };
  }, [data, ord]);

  // exportar imagen una sola vez
  const handleImageReady = useCallback(() => {
    if (yaGenerada.current || !onImageReady || !chartRef.current) return;
    try {
      const base64 = chartRef.current.toBase64Image();
      onImageReady(base64, "planControl");
      yaGenerada.current = true;
    } catch (e) {
      console.warn("Error generating chart image:", e);
    }
  }, [onImageReady]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      // más margen arriba para que quepan las etiquetas
      layout: { padding: { top: 0, right: 20, bottom: 5, left: 20 } },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: 100,
          ticks: { callback: (v) => `${v}%`, font: { size: 11 } },
          grid: { color: "rgba(0,0,0,0.08)" },
        },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
      plugins: {
        legend: {
          position: "right",
          labels: { usePointStyle: true, pointStyle: "circle", padding: 16, font: { size: 12 } },
        },
        title: {
          display: !!titulo,
          text: titulo,
          font: { size: 16, weight: "600" },
          padding: { top: 0, bottom: 30 },
          color: "#2a4d69",
        },
        tooltip: {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          titleColor: "#2a4d69",
          bodyColor: "#4f4f4f",
          borderColor: "#cccccc",
          borderWidth: 1,
          callbacks: {
            title: (items) => `Indicador ${items[0].dataIndex + 1}`,
            label: (ctx) => {
              const label = ctx.dataset.label || "";
              const val = ctx.raw != null ? `${ctx.raw}%` : "—";
              return `${label}: ${val}`;
            },
            afterBody: (items) => {
              const idx = items[0]?.dataIndex;
              const row = chartData?._filas?.[idx];
              return row?.nombreIndicador ? [`${idx + 1}. ${row.nombreIndicador}`] : [];
            },
          },
        },
      },
      animation: { duration: 700, easing: "easeOutQuart", onComplete: handleImageReady },
      interaction: { mode: "index", intersect: false },
    }),
    [titulo, chartData, handleImageReady]
  );

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Alert severity="info" sx={{ width: "100%", maxWidth: 520 }}>
          No hay datos disponibles para graficar Plan de Control.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{ height: 480, minHeight: 400, width: "100%", p: 1, position: "relative" }}
      role="img"
      aria-label={ariaLabel}
    >
      <Bar ref={chartRef} data={chartData} options={options} />
    </Box>
  );
}
