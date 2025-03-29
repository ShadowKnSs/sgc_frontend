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
  const [error, setError] = useState(null);

  useEffect(() => {
    if (idProceso) {
      axios
        .get(`http://localhost:8000/api/indicadoresconsolidados/${idProceso}`)
        .then((res) => {
          setIndicadores(res.data.indicadores || []);
          console.log("Datos de indicadores:", res.data.indicadores);
        })
        .catch((err) => {
          console.error("❌ Error al cargar indicadores:", err);
          setError("No se pudo cargar los indicadores.");
        });
    }
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
        <Alert severity="error">{error}</Alert>
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
        <Alert severity="error">No se encontraron indicadores registrados.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <TablaPlanControl idProceso={idProceso} anio={anio} />
      {/* Gráfica Plan de Control */}
      <PlanControlBarChart
        onImageReady={(imgBase64) => onImagenGenerada("planControl", imgBase64)}
        idProceso={idProceso}
      />

      <TablaSatisfaccion idProceso={idProceso} anio={anio} />
      {/* Gráfica Encuesta de Satisfacción */}
      {getIndicador("Encuesta") && (
        <GraficaEncuesta
          id={getIndicador("Encuesta").idIndicador}
          onImageReady={(imgBase64) => onImagenGenerada("encuesta", imgBase64)}
        />
      )}

      {getRetroList().length > 0 && (
        <GraficaRetroalimentacion
          retroList={getRetroList()}
          onImageReady={(img) => onImagenGenerada("retroalimentacion", img)}
        />
      )}

      <TablaMapaProceso idProceso={idProceso} anio={anio} />
      <GraficaMapaProceso
        onImageReady={(img) => onImagenGenerada("mapaProceso", img)}
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
