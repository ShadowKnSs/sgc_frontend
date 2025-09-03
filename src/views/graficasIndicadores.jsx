import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Alert, CircularProgress, Grid } from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';
import PlanControlBarChart from '../components/Graficas/GraficaPlanControl';
import GraficaEncuesta from '../components/Graficas/GraficaEncuesta';
import GraficaRetroalimentacion from '../components/Graficas/GraficaRetroalimentacion';
import GraficaMapaProceso from '../components/Graficas/GraficaIndMP';
import GraficaRiesgos from '../components/Graficas/GraficaRiesgos';
import GraficaEvaluacionProveedores from '../components/Graficas/GraficaEvaluacion';
import Title from '../components/Title';
import BreadcrumbNav from '../components/BreadcrumbNav';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InsightsIcon from '@mui/icons-material/Insights';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const GraficasPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datosGraficas, setDatosGraficas] = useState({});
  const { idRegistro: idRegistroParam } = useParams();
  const location = useLocation();
  const datosGraficasFromState = location.state?.datosGraficas;
  const idProceso = location.state?.idProceso;
  const anio = location.state?.anio;
  const idRegistro = location.state?.idRegistro || idRegistroParam;

  const breadcrumbItems = [
    { label: 'Estructura', to: idProceso ? `/estructura-procesos/${idProceso}` : '/procesos', icon: AccountTreeIcon },
    { label: 'Análisis de Datos', to: idRegistro ? `/analisis-datos/${idRegistro}` : '/analisis-datos', icon: AssessmentIcon },
    { label: 'Indicadores', to: (idProceso && anio) ? `/indicadores/${idProceso}/${anio}` : '/indicadores', icon: InsightsIcon },
    { label: 'Gráficas', to: location.pathname, icon: ShowChartIcon },
  ];

  useEffect(() => {
    if (!datosGraficasFromState) {
      setError("Datos no disponibles para mostrar gráficas.");
      setLoading(false);
      return;
    }
    setDatosGraficas(datosGraficasFromState);
    setLoading(false);
  }, [datosGraficasFromState]);

  const handleImageReady = (tipo, base64) => {
    console.log(`Imagen de ${tipo} lista:`, base64);
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ mt: 5 , position: 'relative'}}>
      <Box sx={{
        position: 'absolute',
        left: -130,
        top: -20, // Ajusta según sea necesario para la posición vertical
        width: '100%'
      }}>
        <BreadcrumbNav items={breadcrumbItems} />
      </Box>

      <Box sx={{ position: 'relative', textAlign: 'center', mb: 3 }}>
        <Title text="Vista Gráficas" />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom sx={{ color: "#185FA4" }}>Plan de Control</Typography>
          <PlanControlBarChart data={datosGraficas.planControl} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ color: "#185FA4" }} gutterBottom>Encuesta de Satisfacción</Typography>
          {datosGraficas.encuesta ? <GraficaEncuesta data={datosGraficas.encuesta} onImageReady={handleImageReady} /> : <Alert severity="info">No se encontró indicador de encuesta.</Alert>}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ color: "#185FA4" }} gutterBottom>Retroalimentación</Typography>
          {datosGraficas.retroalimentacion?.length > 0 ? <GraficaRetroalimentacion data={datosGraficas.retroalimentacion} /> : <Alert severity="info">No se encontraron indicadores de retroalimentación.</Alert>}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ color: "#185FA4" }} gutterBottom>Mapa de Proceso</Typography>
          <GraficaMapaProceso idProceso={idProceso} anio={anio} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ color: "#185FA4" }} gutterBottom>Gestión de Riesgos</Typography>
          <GraficaRiesgos data={datosGraficas.riesgos} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ color: "#185FA4" }} gutterBottom>Evaluación de Proveedores</Typography>
          {datosGraficas.evaluacion ? (
            <GraficaEvaluacionProveedores
              data={datosGraficas.evaluacion}
              onImageReady={handleImageReady}
            />
          ) : (
            <Alert severity="info">No se encontró indicador de evaluación de proveedores.</Alert>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default GraficasPage;