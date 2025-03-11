// src/views/GraficasPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import PlanControlBarChart from '../components/Graficas/GraficaPlanControl';
import GraficaEncuesta from '../components/Graficas/GraficaEncuesta';
import GraficaRetroalimentacion from '../components/Graficas/GraficaRetroalimentacion';
import GraficaMapaProceso from '../components/Graficas/GraficaIndMP';
import GraficaRiesgos from '../components/Graficas/GraficaRiesgos';
import GraficaEvaluacionProveedores from '../components/Graficas/GraficaEvaluacion';



// Función para normalizar cadenas
const GraficasPage = () => {
  const [encuestaId, setEncuestaId] = useState(null);
  const [evaluacionId, setEvaluacionId] = useState(null);
  const [retroList, setRetroList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/indicadoresconsolidados")
      .then(response => {
        const indicators = response.data.indicadores || [];
        console.log("Indicadores consolidados:", indicators);

        // Indicador de Encuesta
        const encuestaIndicator = indicators.find(ind =>
          ind.origenIndicador?.toLowerCase().trim() === "encuesta"
        );
        if (encuestaIndicator) {
          setEncuestaId(encuestaIndicator.idIndicadorConsolidado);
          console.log("Encuesta Indicator:", encuestaIndicator);
        } else {
          setError("No se encontró indicador de encuesta.");
        }

        // Indicador de Evaluación de Proveedores
        const evaluacionIndicator = indicators.find(ind =>
          ind.origenIndicador?.toLowerCase().trim() === "evaluaproveedores"
        );
        if (evaluacionIndicator) {
          setEvaluacionId(evaluacionIndicator.idIndicadorConsolidado);
          console.log("Evaluación Indicator:", evaluacionIndicator);
        } else {
          setError("No se encontró indicador de evaluación de proveedores.");
        }

        const retroIndicators = indicators.filter(ind =>
          ind.origenIndicador?.toLowerCase().trim() === "retroalimentacion"
        );
        console.log("Retro indicadores sin ordenar:", retroIndicators);

        // Ordenarlos dinámicamente (por ejemplo, por idIndicadorConsolidado)
        const ordered = retroIndicators.sort((a, b) => a.idIndicadorConsolidado - b.idIndicadorConsolidado);
        console.log("Retro indicadores ordenados:", ordered);
        setRetroList(ordered);

        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching indicadores:", error);
        setError("Error al cargar indicadores consolidados.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: "'Roboto', sans-serif", color: "primary.main", fontWeight: "bold" }}>
        Vista de Gráficas
      </Typography>

      {/* Gráfica de Plan de Control */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Indicadores de Plan de Control
        </Typography>
        <PlanControlBarChart />
      </Box>

      {/* Gráfica de Encuesta de Satisfacción */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Encuesta de Satisfacción
        </Typography>
        {encuestaId ? (
          <GraficaEncuesta id={encuestaId} />
        ) : (
          <Alert severity="info">No se encontró indicador de encuesta.</Alert>
        )}
      </Box>

      {/* Gráfica única para Retroalimentación Conjunta */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Retroalimentación
        </Typography>
        {retroList && retroList.length > 0 ? (
          <GraficaRetroalimentacion
            retroList={retroList}
          />
        ) : (
          <Alert severity="info">
            No se encontraron todos los indicadores de retroalimentación.
          </Alert>
        )}
      </Box>

      {/* Gráfica de Mapa de Proceso */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Mapa de Proceso
        </Typography>
        <GraficaMapaProceso />
      </Box>

      {/* Gráfica de Gestion de Riesgos */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Gestion de Riesgos
        </Typography>
        <GraficaRiesgos />
      </Box>

      {/* Gráfica de Evaluación de Proveedores */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Evaluación de Proveedores
        </Typography>
        {evaluacionId ? (
          <GraficaEvaluacionProveedores id={evaluacionId} />
        ) : (
          <Alert severity="info">No se encontró indicador de evaluación de proveedores.</Alert>
        )}
      </Box>
    </Container>
  );
};

export default GraficasPage;