// src/views/ChartPage.js
import React from 'react';
import { Container, Typography } from '@mui/material';

const ChartPage = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Gráficas de Indicadores
      </Typography>
      <Typography variant="body1" align="center">
        Aquí se mostrarán las gráficas de los resultados de los indicadores.
      </Typography>
    </Container>
  );
};

export default ChartPage;
