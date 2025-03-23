import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PlanControlBarChart from '../components/Graficas/GraficaPlanControl';
import GraficaEncuesta from '../components/Graficas/GraficaEncuesta';
import GraficaRetroalimentacion from '../components/Graficas/GraficaRetroalimentacion';
import GraficaMapaProceso from '../components/Graficas/GraficaIndMP';
import GraficaRiesgos from '../components/Graficas/GraficaRiesgos';
import GraficaEvaluacionProveedores from '../components/Graficas/GraficaEvaluacion';

const GraficasPage = () => {
  const { idRegistro } = useParams(); // 📌 Leer `idRegistro` desde la URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [encuestaId, setEncuestaId] = useState(null);
  const [evaluacionId, setEvaluacionId] = useState(null);
  const [retroList, setRetroList] = useState([]);

  useEffect(() => {
    if (!idRegistro) {
      setError("ID de registro no proporcionado.");
      setLoading(false);
      return;
    }

    console.log("📌 Cargando indicadores para idRegistro:", idRegistro);

    axios.get(`http://127.0.0.1:8000/api/indicadoresconsolidados`, {params: {idRegistro}})
      .then(response => {
        const indicators = response.data.indicadores || [];
        console.log("📌 Indicadores recibidos:", indicators);

        // Encuesta
        const encuestaIndicator = indicators.find(ind => ind.origenIndicador === "Encuesta");
        if (encuestaIndicator) setEncuestaId(encuestaIndicator.idIndicador);


        // Evaluación de Proveedores
        const evaluacionIndicator = indicators.find(ind => ind.origenIndicador === "EvaluaProveedores");
        if (evaluacionIndicator) setEvaluacionId(evaluacionIndicator.idIndicador);
        // Retroalimentación
        const retroIndicators = indicators.filter(ind => ind.origenIndicador === "Retroalimentacion");
        setRetroList(retroIndicators.sort((a, b) => a.idIndicador - b.idIndicador));
        console.log("Identificadores de Lista:", retroIndicators);
        setLoading(false);
      })
      .catch(error => {
        console.error("❌ Error al cargar indicadores:", error);
        setError("Error al cargar indicadores consolidados.");
        setLoading(false);
      });
  }, [idRegistro]);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: "'Roboto', sans-serif", color: "primary.main", fontWeight: "bold" }}>
        Vista de Gráficas
      </Typography>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>Indicadores de Plan de Control</Typography>
        <PlanControlBarChart idRegistro={idRegistro} />
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>Encuesta de Satisfacción</Typography>
        {encuestaId ? <GraficaEncuesta id={encuestaId} /> : <Alert severity="info">No se encontró indicador de encuesta.</Alert>}
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>Retroalimentación</Typography>
        {retroList.length > 0 ? <GraficaRetroalimentacion retroList={retroList} /> : <Alert severity="info">No se encontraron indicadores de retroalimentación.</Alert>}
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>Mapa de Proceso</Typography>
        <GraficaMapaProceso idRegistro={idRegistro} />
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>Gestión de Riesgos</Typography>
        <GraficaRiesgos idRegistro={idRegistro} />
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>Evaluación de Proveedores</Typography>
        {evaluacionId ? <GraficaEvaluacionProveedores id={evaluacionId} /> : <Alert severity="info">No se encontró indicador de evaluación de proveedores.</Alert>}
      </Box>
    </Container>
  );
};

export default GraficasPage;
