// src/views/Graficas/GraficaGestionRiesgos.jsx
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Alert, Grid, Typography } from '@mui/material';
import axios from 'axios';
import CircularProgressIndicator from './CiruclarProgressIndicador';

const GraficaGestionRiesgos = () => {
  const [riesgoData, setRiesgoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Definir una paleta de 4 colores
  const colors = ['#F44336', '#FF9800', '#4caf50', '#2196F3'];

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/gestion-riesgos')
      .then(response => {
        // Se espera que response.data sea un array de registros de riesgo.
        // En tu ejemplo se recibe: [ [ {nombreIndicador, resultadoSemestral1, ...}, {...} ] ]
        const data = response.data[0];
        console.log("Datos de gestión de riesgos:", data);
        if (!data || data.length === 0) {
          setError("No se encontraron datos de gestión de riesgos.");
          setLoading(false);
          return;
        }
        setRiesgoData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar datos de gestión de riesgos:", err);
        setError("Error al cargar datos de gestión de riesgos.");
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
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom paddingBottom={5}>
        Gestión de Riesgos
      </Typography>
      <Grid container spacing={2}>
        {riesgoData.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <CircularProgressIndicator 
              label={item.nombreIndicador} 
              value={item.resultadoAnual || 0}
              color={colors[index % colors.length]}  // Asignación cíclica de colores
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GraficaGestionRiesgos;
