// src/components/Modals/BotonGraficas.jsx
import React from 'react';
import { Fab } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';

const IrGraficasBoton = ({ encuestaId, retroVirtualId, retroFisicaId, retroEncuestaId, evaluacionId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/graficas', { 
      state: { 
        encuestaId, 
        retroVirtualId, 
        retroFisicaId, 
        retroEncuestaId,
        evaluacionId
      } 
    });
    console.log("Los id virtual:", retroVirtualId);
    console.log("Los id fisica:", retroFisicaId);
    console.log("Los id enc:", retroEncuestaId);
    console.log("Los id evaluacion:", evaluacionId);
  };

  return (
    <Fab 
      onClick={handleClick}
      sx={{
        position: 'fixed',
        top: 150,
        right: 40,
        backgroundColor: '#2dc1df',
        color: 'white',
        '&:hover': { backgroundColor: '#0056b3' },
        zIndex: 1500,
      }}
    >
      <BarChartIcon fontSize="large" />
    </Fab>
  );
};

export default IrGraficasBoton;
