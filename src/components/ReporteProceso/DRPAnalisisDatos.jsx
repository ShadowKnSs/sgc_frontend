import React, { useEffect, useState } from "react";
import PlanControlBarChart from "../Graficas/GraficaPlanControl";
import GraficaEncuesta from "../Graficas/GraficaEncuesta";
import GraficaRetroalimentacion from "../Graficas/GraficaRetroalimentacion";
import GraficaMapaProceso from "../Graficas/GraficaIndMP";
import GraficaRiesgos from "../Graficas/GraficaRiesgosReporte";
import GraficaEvaluacion from "../Graficas/GraficaEvaluacion";
import TablaPlanControl from "./TablaPlanControl";
import TablaSatisfaccion from "./TablaSatisfaccion";
import TablaMapaProceso from "./TablaMapaProceso";
import TablaEficaciaRiesgos from "./TablaEficaciaRiesgos";
import TablaEvaluacionProveedores from "./TablaEvaluacionProveedores";
import { Alert, Box, Typography } from "@mui/material";
import axios from "axios";

const DRPAnalisisDatos = ({ idProceso, anio, idRegistro, onImagenGenerada }) => {
  const [indicadores, setIndicadores] = useState([]);
  const [planControlData, setPlanControlData] = useState([]); // Obtención de los datos de indicadores de  planControl
  const [error, setError] = useState(null);

  useEffect(() => {
    if (idRegistro) {
      axios
        .get("http://localhost:8000/api/indicadoresconsolidados/detalles", {
          params: { idRegistro },
        })
        .then((res) => {
          setIndicadores(res.data.indicadores || []);
          console.log("Datos de indicadores:", res.data.indicadores);
        })
        .catch((err) => {
          console.error("❌ Error al cargar indicadores:", err);
          setError("No se pudo cargar los indicadores.");
        });
    }
  }, [idRegistro]);

  useEffect(() => {
    if (!idProceso) return;
    axios
      .get(`http://localhost:8000/api/plan-control/${idProceso}`)
      .then((res) => {
        setPlanControlData(res.data || []);
        console.log("PlanControlData:", res.data);
      })
      .catch((err) => {
        console.error("❌ Error al cargar resultados de Plan de Control:", err);
        // No rompas toda la vista por esto; la gráfica ya muestra alerta si viene vacío
      });
  }, [idProceso]);

  const getIndicador = (origen) =>
    indicadores.find((i) => i.origenIndicador === origen);
  const getRetroList = () =>
    indicadores.filter((i) => i.origenIndicador === "Retroalimentacion");

  if (error) {
    return (
      <Box
        sx={{
          mt: 2,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#fff",
          margin: 7,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}>
          Análisis de Datos
        </Typography>
        <Alert severity="info">{error}</Alert>
      </Box>
    );
  }

  if (!error && indicadores.length === 0) {
    return (
      <Box
        sx={{
          mt: 2,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#fff",
          margin: 7,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}>
          Análisis de Datos
        </Typography>
        <Alert severity="info">No se encontraron indicadores registrados.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <TablaPlanControl idProceso={idProceso} anio={anio} />
      {/* Gráfica Plan de Control */}
      <PlanControlBarChart
        data={planControlData}
        onImageReady={(imgBase64) => onImagenGenerada("planControl", imgBase64)}
      />

      <TablaSatisfaccion idProceso={idProceso} anio={anio} />
      {/* Gráfica Encuesta de Satisfacción */}
      {getIndicador("Encuesta") && (
        <GraficaEncuesta
          data={getIndicador("Encuesta")}
          onImageReady={(tipo, imgBase64) => onImagenGenerada(tipo, imgBase64)}
        />
      )}

      {getRetroList().length > 0 && (
        <GraficaRetroalimentacion
          data={getRetroList()}
          onImageReady={(img) => onImagenGenerada("retroalimentacion", img)}
        />
      )}

      <TablaMapaProceso idProceso={idProceso} anio={anio} />
      <GraficaMapaProceso
        onImageReady={(img) => onImagenGenerada("mapaProceso", img)}
        idProceso={idProceso}
      />

      <TablaEficaciaRiesgos idProceso={idProceso} anio={anio} />
      <GraficaRiesgos
        idRegistro={idRegistro}
        onImageReady={(img) => onImagenGenerada("riesgos", img)}
      />

      <TablaEvaluacionProveedores idProceso={idProceso} anio={anio} />
      {getIndicador("EvaluaProveedores") && (
        <GraficaEvaluacion
          id={getIndicador("EvaluaProveedores").idIndicador}
          onImageReady={(imgBase64) => onImagenGenerada("evaluacionProveedores", imgBase64)}
        />
      )}
    </Box>
  );
};

export default DRPAnalisisDatos;
