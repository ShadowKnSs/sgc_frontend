// src/views/GraficasPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import PlanControlBarChart from '../components/Graficas/GraficaPlanControl';
import GraficaEncuesta from '../components/Graficas/GraficaEncuesta';
import GraficaRetroalimentacion from '../components/Graficas/GraficaRetroalimentacion';

// Función para normalizar cadenas
const GraficasPage = () => {
  const [encuestaId, setEncuestaId] = useState(null);
  const [retroMapped, setRetroMapped] = useState([]);
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

        // Filtrar indicadores de retroalimentación
        const retroIndicators = indicators.filter(ind =>
          ind.origenIndicador?.toLowerCase().trim() === "retroalimentacion"
        );
        console.log("Retro indicadores sin mapear:", retroIndicators);

        // Mapear cada indicador de retro a un objeto con su id y label, normalizando el nombre
        const mapped = retroIndicators.map(ind => ({
          id: ind.idIndicadorConsolidado,
          // Normalizamos para poder comparar y ordenarlos según el nombre real
          normalizedName: ind.nombreIndicador,
          label: ind.nombreIndicador,
        }));

        // Si se desea un orden fijo, por ejemplo: virtual, fisico, encuesta, se puede definir:
        const order = ["Retro Buzon Virtual", "Retro Buzon Fisico", "Retro Encuesta"];
        mapped.sort((a, b) => order.indexOf(a.normalizedName) - order.indexOf(b.normalizedName));

        console.log("Retro indicadores mapeados y ordenados:", mapped);
        setRetroMapped(mapped);
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

  // Extraer IDs a partir del array ordenado (asumiendo que debe haber tres)
  const retroVirtualId = retroMapped.find(item => item.normalizedName === "Retro Buzon Virtual")?.id || null;
  const retroFisicaId = retroMapped.find(item => item.normalizedName === "Retro Buzon Fisico")?.id || null;
  const retroEncuestaId = retroMapped.find(item => item.normalizedName === "Retro Encuesta")?.id || null;
  console.log("Retro Virtual ID:", retroVirtualId);
  console.log("Retro Física ID:", retroFisicaId);
  console.log("Retro Encuesta ID:", retroEncuestaId);

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
        {retroVirtualId  && retroEncuestaId ? (
          <GraficaRetroalimentacion
            retroVirtualId={retroVirtualId}
            retroFisicaId={retroFisicaId}
            retroEncuestaId={retroEncuestaId}
          />
        ) : (
          <Alert severity="info">
            No se encontraron todos los indicadores de retroalimentación.
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default GraficasPage;
