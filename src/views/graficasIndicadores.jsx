/**
 * Componente: GraficasPage
 * Ubicación: src/views/GraficasPage.jsx
 * 
 * Descripción:
 * Esta vista renderiza diferentes gráficas que representan los resultados de indicadores de desempeño
 * de un proceso para un `idRegistro` determinado. Incluye métricas de Plan de Control, Encuesta,
 * Retroalimentación, Mapa de Proceso, Riesgos y Evaluación de Proveedores.
 * 
 * Funcionalidades principales:
 * - Obtiene desde el backend los indicadores consolidados del registro actual.
 * - Extrae el `idProceso` relacionado al `idRegistro` para usarlo en las gráficas correspondientes.
 * - Filtra y organiza indicadores por su tipo (`origenIndicador`) para renderizar la gráfica adecuada.
 * - Muestra alertas informativas si no hay indicadores disponibles para cierta sección.

 * Estado:
 * - `loading`: controla el spinner de carga mientras se obtienen datos.
 * - `error`: muestra un mensaje de error si falla la carga de datos.
 * - `encuestaId`: guarda el ID del indicador de tipo "Encuesta".
 * - `evaluacionId`: guarda el ID del indicador de tipo "EvaluaProveedores".
 * - `retroList`: lista de indicadores de tipo "Retroalimentacion".
 * - `idProceso`: ID del proceso al que pertenece el registro (obtenido desde la API).

 * Hooks utilizados:
 * - `useLocation`: para acceder al estado enviado desde la navegación (`idRegistro`).
 * - `useEffect`: para cargar indicadores e información del proceso.

 * Componentes importados:
 * - `GraficaPlanControl`: Gráfica de barras del Plan de Control (`idProceso`).
 * - `GraficaEncuesta`: Gráfica específica para encuesta de satisfacción (`id`).
 * - `GraficaRetroalimentacion`: Gráfica de múltiples indicadores de retroalimentación (`retroList`).
 * - `GraficaMapaProceso`: Gráfica para indicadores de desempeño del proceso (`idProceso`).
 * - `GraficaRiesgos`: Gráfica para análisis de riesgos (`idRegistro`).
 * - `GraficaEvaluacionProveedores`: Gráfica específica para proveedores (`id`).
 * - `Title`: Título decorativo reutilizable.

 * Endpoints consumidos:
 * - GET `/api/indicadoresconsolidados?idRegistro=X` → obtiene indicadores filtrados por registro.
 * - GET `/api/registros/buscar-proceso/{idRegistro}` → obtiene `idProceso` correspondiente.

 * Posibles mejoras:
 * - Reintento automático si una petición falla.
 * - Separación de lógica de carga en hooks personalizados.
 * - Uso de `Promise.all` para paralelizar la carga de indicadores y `idProceso`.
 * - Agregar fallback visual si el gráfico falla.

 * Requiere que se le pase `idRegistro` por `location.state` desde la vista anterior.
 */

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import PlanControlBarChart from '../components/Graficas/GraficaPlanControl';
import GraficaEncuesta from '../components/Graficas/GraficaEncuesta';
import GraficaRetroalimentacion from '../components/Graficas/GraficaRetroalimentacion';
import GraficaMapaProceso from '../components/Graficas/GraficaIndMP';
import GraficaRiesgos from '../components/Graficas/GraficaRiesgos';
import GraficaEvaluacionProveedores from '../components/Graficas/GraficaEvaluacion';
import Title from '../components/Title';
const GraficasPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [encuestaId, setEncuestaId] = useState(null);
  const [evaluacionId, setEvaluacionId] = useState(null);
  const [retroList, setRetroList] = useState([]);
  const [idProceso, setIdProceso] = useState(null);

  const location = useLocation();
  const idRegistro = location.state?.idRegistro;

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

  useEffect(() => {
    if (!idRegistro) return;
  
    axios.get(`http://127.0.0.1:8000/api/registros/buscar-proceso/${idRegistro}`)
      .then(response => {
        const idProc = response.data.idProceso;
        console.log("📌 ID de Proceso obtenido:", idProc);
        setIdProceso(idProc);
      })
      .catch(error => {
        console.error("❌ Error al obtener el idProceso:", error);
        setError("Error al obtener idProceso.");
      });
  }, [idRegistro]);
  

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ mt: 4 }}>
      <Title text="Vista Gáficas"></Title>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom sx={{color: "#68A2C9"}}>Indicadores de Plan de Control</Typography>
        <PlanControlBarChart idProceso={idProceso} />
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" sx={{color: "#68A2C9"}} gutterBottom>Encuesta de Satisfacción</Typography>
        {encuestaId ? <GraficaEncuesta id={encuestaId} /> : <Alert severity="info">No se encontró indicador de encuesta.</Alert>}
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" sx={{color: "#68A2C9"}} gutterBottom>Retroalimentación</Typography>
        {retroList.length > 0 ? <GraficaRetroalimentacion retroList={retroList} /> : <Alert severity="info">No se encontraron indicadores de retroalimentación.</Alert>}
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" sx={{color: "#68A2C9"}} gutterBottom>Mapa de Proceso</Typography>
        <GraficaMapaProceso idProceso={idProceso} />
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" sx={{color: "#68A2C9"}} gutterBottom>Gestión de Riesgos</Typography>
        <GraficaRiesgos idRegistro={idRegistro} />
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" sx={{color: "#68A2C9"}} gutterBottom>Evaluación de Proveedores</Typography>
        {evaluacionId ? <GraficaEvaluacionProveedores id={evaluacionId} /> : <Alert severity="info">No se encontró indicador de evaluación de proveedores.</Alert>}
      </Box>
    </Container>
  );
};

export default GraficasPage;
