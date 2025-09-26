// components/reportes/ReportProgressDialog.jsx
import { useEffect, useRef, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  LinearProgress, Box, Typography
} from "@mui/material";
import CustomButton from "../Button";
import FeedbackSnackbar from "../Feedback";
import axios from "axios";

// Render offscreen con Chart.js
import { Chart } from "chart.js/auto";

const API = "http://localhost:8000/api";

// Paleta de colores
const COLOR_PALETTE = [
  "#1565C0", // azul oscuro
  "#42A5F5", // azul claro
  "#26A69A", // verde agua
  "#66BB6A", // verde claro
  "#81C784", // verde pastel
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function downloadBlobAsFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---- Helpers de gráficos ----
async function saveGraphBase64(dataUrl, name) {
  if (!dataUrl) return;
  await axios.post(`${API}/graficas/guardar`, {
    imagenBase64: dataUrl,
    nombre: name,
  });
}

/**
 * Renderiza un gráfico offscreen y devuelve base64 PNG.
 * Permite inyectar plugins custom.
 */
async function renderChartBase64(
  type,
  { labels, datasets, options = {}, plugins = [] },
  w = 900,
  h = 420
) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  const chart = new Chart(ctx, {
    type,
    data: { labels, datasets },
    options: { responsive: false, animation: false, ...options },
    plugins,
  });

  await sleep(20);
  const base64 = canvas.toDataURL("image/png", 1.0);
  chart.destroy();
  canvas.remove();
  return base64;
}

// Plugin simple para dibujar % en gráficos de pastel
const percentLabelsPlugin = {
  id: "percentLabels",
  afterDatasetsDraw(chart, args, pluginOpts) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    const ds = chart.data.datasets[0];
    if (!meta || !ds) return;

    ctx.save();
    ctx.font = `${(pluginOpts?.fontSize ?? 12)}px sans-serif`;
    ctx.fillStyle = pluginOpts?.color ?? "#111";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    meta.data.forEach((arc, i) => {
      const val = Number(ds.data?.[i] ?? 0);
      if (!isFinite(val) || val <= 0) return;
      const { x, y } = arc.tooltipPosition();
      const label = `${val.toFixed(1)}%`;
      ctx.fillText(label, x, y);
    });

    ctx.restore();
  },
};

// Paso 0: generar/guardar todas las gráficas necesarias ANTES de pedir el PDF
async function preSaveGraphs(idProceso, anio, setProgress) {
  const pid = Number(idProceso);
  const year = Number(anio);

  // ---- 0.1 Plan de Control ----
  try {
    const { data } = await axios.get(`${API}/indicadores/actividad-control/${pid}/${year}`);
    const rows = Array.isArray(data) ? data : [];
    if (rows.length) {
      const labels = rows.map((_, i) => String(i + 1));
      const s1 = rows.map(r => Number(r.resultadoSemestral1 ?? 0));
      const s2 = rows.map(r => Number(r.resultadoSemestral2 ?? 0));

      const img = await renderChartBase64(
        "bar",
        {
          labels,
          datasets: [
            {
              label: "Ene–Jun",
              data: s1,
              backgroundColor: COLOR_PALETTE[0],
              borderColor: COLOR_PALETTE[0],
            },
            {
              label: "Jul–Dic",
              data: s2,
              backgroundColor: COLOR_PALETTE[1],
              borderColor: COLOR_PALETTE[1],
            },
          ],
          options: {
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Plan de Control – Resultados" }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: { callback: v => `${v}%` }
              }
            }
          }
        }
      );
      await saveGraphBase64(img, `planControl_${pid}_${year}`);
    }
  } catch { /* no bloquea */ }
  setProgress?.(18);

  // ---- 0.2 Mapa de Proceso ----
  try {
    const { data } = await axios.get(`${API}/indicadores/mapa-proceso/${pid}/${year}`);
    const rows = Array.isArray(data) ? data : [];
    if (rows.length) {
      const labels = rows.map((_, i) => String(i + 1));
      const s1 = rows.map(r => Number(r.resultadoSemestral1 ?? 0));
      const s2 = rows.map(r => Number(r.resultadoSemestral2 ?? 0));

      const img = await renderChartBase64(
        "bar",
        {
          labels,
          datasets: [
            {
              label: "Ene–Jun",
              data: s1,
              backgroundColor: COLOR_PALETTE[0],
              borderColor: COLOR_PALETTE[0],
            },
            {
              label: "Jul–Dic",
              data: s2,
              backgroundColor: COLOR_PALETTE[1],
              borderColor: COLOR_PALETTE[1],
            },
          ],
          options: {
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Mapa de Proceso – Resultados" }
            },
            scales: { y: { beginAtZero: true } }
          }
        },
        900,
        Math.max(340, labels.length * 36)
      );
      await saveGraphBase64(img, `mapaProceso_${pid}_${year}`);
    }
  } catch { }
  setProgress?.(28);

  // ---- 0.3 Satisfacción del Cliente: Encuesta + Retroalimentación ----
  try {
    const { data } = await axios.get(`${API}/indicadores/satisfaccion-cliente/${pid}/${year}`);
    const items = Array.isArray(data) ? data : [];
    if (items.length) {
      const encuesta = items.find(i => i.origen === "Encuesta");
      const retro = items.filter(i => i.origen === "Retroalimentacion");

      // Encuesta (pie) con % impresos en cada porción
      if (encuesta?.noEncuestas > 0) {
        const total = encuesta.noEncuestas || 1;
        const malo = ((encuesta.malo || 0) * 100) / total;
        const regular = ((encuesta.regular || 0) * 100) / total;
        const eb = encuesta.porcentajeEB ??
          (((encuesta.bueno || 0) + (encuesta.excelente || 0)) * 100) / total;

        const imgPie = await renderChartBase64(
          "pie",
          {
            labels: ["Malo", "Regular", "Excelente/Bueno"],
            datasets: [{
              data: [malo, regular, eb],
              backgroundColor: [COLOR_PALETTE[0], COLOR_PALETTE[1], COLOR_PALETTE[2]]
            }],
            options: {
              plugins: {
                legend: { position: "bottom" },
                title: { display: true, text: "Encuesta de Satisfacción (%)" },
                // opciones para nuestro plugin
                percentLabels: { color: "#111", fontSize: 12 }
              }
            },
            plugins: [percentLabelsPlugin]
          },
          560,
          360
        );
        await saveGraphBase64(imgPie, `encuesta_${pid}_${year}`);
      }

      // Retroalimentación: barras HORIZONTALES (no apiladas)
      if (retro.length) {
        const labels = retro.map(x => x.nombreIndicador);
        const F = retro.map(x => x.felicitaciones ?? x.cantidadFelicitacion ?? 0);
        const S = retro.map(x => x.sugerencias ?? x.cantidadSugerencia ?? 0);
        const Q = retro.map(x => x.quejas ?? x.cantidadQueja ?? 0);

        const imgRetro = await renderChartBase64(
          "bar",
          {
            labels,
            datasets: [
              {
                label: "Felicitaciones",
                data: F,
                backgroundColor: COLOR_PALETTE[3],
                borderColor: COLOR_PALETTE[3],
              },
              {
                label: "Sugerencias",
                data: S,
                backgroundColor: COLOR_PALETTE[1],
                borderColor: COLOR_PALETTE[1],
              },
              {
                label: "Quejas",
                data: Q,
                backgroundColor: COLOR_PALETTE[2],
                borderColor: COLOR_PALETTE[2],
              },
            ],
            options: {
              indexAxis: "y", // ← horizontal
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Retroalimentación (conteos)" }
              },
              scales: {
                x: { beginAtZero: true },
                y: { beginAtZero: true }
              }
            }
          },
          900,
          Math.max(320, labels.length * 34)
        );
        await saveGraphBase64(imgRetro, `retroalimentacion_${pid}_${year}`);
      }
    }
  } catch { }
  setProgress?.(40);

  // ---- 0.4 Eficacia de Riesgos ----
  try {
    const { data } = await axios.get(`${API}/indicadores/eficacia-riesgos/${pid}/${year}`);
    const rows = Array.isArray(data) ? data : [];
    if (rows.length) {
      const labels = rows.map((_, i) => String(i + 1));
      const vals = rows.map(r => Number(r.resultadoAnual ?? 0));

      const imgR = await renderChartBase64(
        "bar",
        {
          labels,
          datasets: [{
            label: "Eficacia (%)",
            data: vals,
            backgroundColor: COLOR_PALETTE[0],
            borderColor: COLOR_PALETTE[0],
          }],
          options: {
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Eficacia de Riesgos" }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: { callback: v => `${v}%` }
              }
            }
          }
        }
      );
      await saveGraphBase64(imgR, `riesgos_${pid}_${year}`);
    }
  } catch { }
  setProgress?.(50);

  // ---- 0.5 Evaluación de Proveedores (cada valor independiente) ----
  try {
    const { data } = await axios.get(`${API}/indicadores/evaluacion-proveedores/${pid}/${year}`);
    const rows = Array.isArray(data) ? data : [];
    if (rows.length) {
      const labels = [];
      const values = [];
      const colors = [];

      const add = (label, v, color) => {
        const n = Number(v);
        if (isFinite(n)) {
          labels.push(label);
          values.push(n);
          colors.push(color);
        }
      };

      // Un bar por valor; se clasifica por categoría y semestre
      rows.forEach((r, idx) => {
        const i = idx + 1; // para distinguir si hay múltiples indicadores
        add(`Confiable Ene–Jun ${i}`, r.resultadoConfiableSem1, COLOR_PALETTE[3]);
        add(`Confiable Jul–Dic ${i}`, r.resultadoConfiableSem2, COLOR_PALETTE[3]);
        add(`Condicionado Ene–Jun ${i}`, r.resultadoCondicionadoSem1, COLOR_PALETTE[1]);
        add(`Condicionado Jul–Dic ${i}`, r.resultadoCondicionadoSem2, COLOR_PALETTE[1]);
        add(`No Confiable Ene–Jun ${i}`, r.resultadoNoConfiableSem1, COLOR_PALETTE[2]);
        add(`No Confiable Jul–Dic ${i}`, r.resultadoNoConfiableSem2, COLOR_PALETTE[2]);
      });

      if (labels.length) {
        const imgEP = await renderChartBase64(
          "bar",
          {
            labels,
            datasets: [
              {
                label: "Porcentaje",
                data: values,
                backgroundColor: colors,
                borderColor: colors,
              },
            ],
            options: {
              plugins: {
                legend: { display: false },
                title: { display: true, text: "Evaluación de Proveedores (%)" }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: { callback: v => `${v}%` }
                }
              }
            }
          },
          Math.max(900, labels.length * 28),
          420
        );
        await saveGraphBase64(imgEP, `evaluacionProveedores_${pid}_${year}`);
      }
    }
  } catch { }
  setProgress?.(60);
}

// ---------------- Componente ----------------
export default function ReportProgressDialog({
  open, onClose,
  idProceso, anio,
  entidadNombre, procesoNombre,
  onDone, // ({idProceso, anio, entidad, proceso, fileName, storedUrl?})
}) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle|preparing|generating|downloading|done|error
  const [fb, setFb] = useState({ open: false, type: "info", title: "", message: "" });
  const abortRef = useRef(new AbortController());

  const showFb = (type, title, message) => setFb({ open: true, type, title, message });

  const run = async () => {
    try {
      // Paso 0: preparar/guardar gráficas
      setPhase("preparing");
      setProgress(10);
      await preSaveGraphs(idProceso, anio, setProgress);

      // Paso 1: generar PDF
      setPhase("generating");
      setProgress(72);
      (async () => {
        for (let p = 74; p <= 86 && phase !== "error" && phase !== "downloading"; p += 2) {
          setProgress(p);
          await sleep(110);
        }
      })();

      const url = `${API}/generar-reporte/${idProceso}/${anio}`;
      const res = await axios.get(url, {
        responseType: "blob",
        signal: abortRef.current.signal,
        validateStatus: s => (s >= 200 && s < 300) || s === 415 || s === 422 || s === 500
      });

      const cd = res.headers?.["content-disposition"] || "";
      // intenta extraer el nombre de archivo del header
      const m = cd.match(/filename\*?=(?:UTF-8'')?"?([^"]+)"?/i);
      const headerFile = m ? decodeURIComponent(m[1]) : null;

      // si el backend expuso la URL
      const headerUrl = res.headers?.["x-report-url"] || null;

      // origin del API (sin /api)
      const API_ORIGIN = API.replace(/\/api$/, "");

      // si hay headerUrl úsalo; si no, construye la URL con el filename
      let storedUrl = headerUrl;
      if (!storedUrl && headerFile) {
        storedUrl = `${API_ORIGIN}/storage/reportes/${headerFile}`;
      }

      const contentType = res.headers?.["content-type"] || "";
      const safeProceso = (procesoNombre || `${idProceso}`).toString().replace(/\s+/g, "_");
      const safeEntidad = (entidadNombre || "").toString().replace(/\s+/g, "_");
      const defaultName = `${safeEntidad ? safeEntidad + "_" : ""}${safeProceso}_${anio}.pdf`;

      if (contentType.includes("application/pdf")) {
        setPhase("downloading");
        setProgress(95);
        await downloadBlobAsFile(res.data, defaultName);
        setProgress(100);
        setPhase("done");
        showFb("success", "Reporte generado", "La descarga se inició correctamente.");
        onDone?.({ idProceso, anio, entidad: entidadNombre, proceso: procesoNombre, fileName: defaultName, storedUrl });
        return;
      }

      // fallback: JSON con {ruta, file}
      try {
        const json = await axios.get(url, {
          signal: abortRef.current.signal,
          headers: { Accept: "application/json" },
        }).then(r => r.data);

        if (json?.ruta) {
          setPhase("downloading");
          setProgress(95);
          const blob = await axios.get(json.ruta, { responseType: "blob" }).then(r => r.data);
          const name = json.file || defaultName;
          await downloadBlobAsFile(blob, name);
          setProgress(100);
          setPhase("done");
          showFb("success", "Reporte generado", "La descarga se inició correctamente.");
          onDone?.({ idProceso, anio, entidad: entidadNombre, proceso: procesoNombre, fileName: name, storedUrl: json.ruta });
          return;
        }
      } catch { /* sigue a error */ }

      setPhase("error");
      showFb("error", "No se pudo generar", "Respuesta inesperada del servidor.");

    } catch (e) {
      console.error(e);
      setPhase("error");
      const msg =
        e?.response?.data?.error ||
        (e?.message?.includes("Network") ? "No se pudo generar/descargar el PDF." : "No se pudo generar/descargar el PDF.");
      showFb("error", "Error", msg);
    }
  };

  useEffect(() => {
    if (open && idProceso && anio) {
      abortRef.current = new AbortController();
      setProgress(0);
      setFb(s => ({ ...s, open: false }));
      run();
    }
    return () => abortRef.current.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idProceso, anio]);

  const label =
    phase === "preparing" ? "Preparando gráficas…"
      : phase === "generating" ? "Generando reporte…"
        : phase === "downloading" ? "Descargando archivo…"
          : phase === "done" ? "Listo"
            : phase === "error" ? "Ocurrió un error"
              : "Iniciando…";

  const closable = phase === "done" || phase === "error";

  return (
    <>
      <Dialog open={open} onClose={closable ? onClose : undefined} maxWidth="sm" fullWidth>
        <DialogTitle>Generando reporte</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>{label}</Typography>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption" sx={{ mt: 1, display: "block" }}>{progress}%</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          {closable && <CustomButton onClick={onClose}>Cerrar</CustomButton>}
        </DialogActions>
      </Dialog>
      <FeedbackSnackbar
        open={fb.open}
        type={fb.type}
        title={fb.title}
        message={fb.message}
        onClose={() => setFb(s => ({ ...s, open: false }))}
      />
    </>
  );
}
