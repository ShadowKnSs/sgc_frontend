import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Alert, CircularProgress, IconButton, Tooltip, Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import PlanControlBarChart from '../components/Graficas/GraficaPlanControl';
import GraficaEncuesta from '../components/Graficas/GraficaEncuesta';
import GraficaRetroalimentacion from '../components/Graficas/GraficaRetroalimentacion';
import GraficaMapaProceso from '../components/Graficas/GraficaIndMP';
import GraficaRiesgos from '../components/Graficas/GraficaRiesgos';
import GraficaEvaluacionProveedores from '../components/Graficas/GraficaEvaluacion';
import Title from '../components/Title';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const GraficasPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datosGraficas, setDatosGraficas] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const datosGraficasFromState = location.state?.datosGraficas;
  const idProceso = location.state?.idProceso;
  const anio = location.state?.anio;
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
    // Aquí puedes hacer algo con la imagen, como guardarla en un estado
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ position: 'relative', textAlign: 'center', mb: 3 }}>
        <Tooltip title="Volver a Indicadores">
          <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Title text="Vista Gráficas" />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom sx={{ color: "#185FA4" }}>Plan de Control</Typography>
          <PlanControlBarChart data={datosGraficas.planControl} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ color: "#185FA4" }} gutterBottom>Encuesta de Satisfacción</Typography>
          {datosGraficas.encuesta ? <GraficaEncuesta data={datosGraficas.encuesta} onImageReady={handleImageReady}
          /> : <Alert severity="info">No se encontró indicador de encuesta.</Alert>}
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
          {datosGraficas.evaluacion ? <GraficaEvaluacionProveedores idProceso={idProceso} anio={anio} /> : <Alert severity="info">No se encontró indicador de evaluación de proveedores.</Alert>}
        </Grid>
      </Grid>
    </Container>
  );
};

export default GraficasPage;
