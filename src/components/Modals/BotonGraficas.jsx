// src/components/GoToChartsButton.js
import React from 'react';
import { Fab } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';

const IrGraficasBoton = () => {
  const navigate = useNavigate();

  return (
    <Fab 
      onClick={() => navigate('/graficas')}
      sx={{
        position: 'fixed',
        bottom: 30,
        right: 50,
        backgroundColor: '#2dc1df', // Ajusta según tu paleta de colores
        color: 'white',
        '&:hover': {
          backgroundColor: '#0056b3',
        },
        zIndex: 1100, // Para que esté sobre otros elementos
      }}
    >
      <BarChartIcon fontSize="large" />
    </Fab>
  );
};

export default IrGraficasBoton;
