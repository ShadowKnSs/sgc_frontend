import React, { useEffect, useState } from 'react';
import PlanControlBarChart from '../Graficas/GraficaPlanControl';
import GraficaEncuesta from '../Graficas/GraficaEncuesta';
import GraficaRetroalimentacion from '../Graficas/GraficaRetroalimentacion';
import GraficaMapaProceso from '../Graficas/GraficaIndMP';
import GraficaRiesgos from '../Graficas/GraficaRiesgosReporte';
import GraficaEvaluacion from '../Graficas/GraficaEvaluacion';
import axios from 'axios';


const DRPAnalisisDatos = ({ idRegistro, onImagenGenerada }) => {
  const [indicadores, setIndicadores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/indicadoresconsolidados`, { params: { idRegistro } })
      .then(res => {
        setIndicadores(res.data.indicadores || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Error al cargar indicadores:", err);
        setLoading(false);
      });
  }, [idRegistro]);

  if (loading) return null;

  const getIndicador = (origen) => indicadores.find(i => i.origenIndicador === origen);
  const getRetroList = () => indicadores.filter(i => i.origenIndicador === "Retroalimentacion");

  return (
    <>
      {/* Aquí irán las tablas del análisis de datos */}

      {/* Gráfica Plan de Control */}
      <PlanControlBarChart
        onImageReady={(imgBase64) => onImagenGenerada("planControl", imgBase64)}
      />

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
          onImageReady={(img) => onImagenGenerada('retroalimentacion', img)}
        />
      )}

      <GraficaMapaProceso
        onImageReady={(img) => onImagenGenerada("mapaProceso", img)}
      />
      
      <GraficaRiesgos
        onImageReady={(img) => onImagenGenerada("riesgos", img)}
      />

      {/* Gráfica Encuesta de Satisfacción */}
      {getIndicador("EvaluaProveedores") && (
        <GraficaEvaluacion
          id={getIndicador("EvaluaProveedores").idIndicador}
          onImageReady={(imgBase64) => onImagenGenerada("evaluacionProveedores", imgBase64)}
        />
      )}
    </>
  );
};

export default DRPAnalisisDatos;
