import React from 'react';
import { Fab, Tooltip, Box } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';

const IrGraficasBoton = ({ idRegistro, datosGraficas }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/graficas/${idRegistro}`, {
      state: { datosGraficas }
    });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip title="Ver gráficas" placement="left" arrow>
        <Fab
          onClick={handleClick}
          sx={{
            backgroundColor: '#2dc1df',
            color: 'white',
            '&:hover': { backgroundColor: '#0056b3' },
            boxShadow: 3,
          }}
        >
          <BarChartIcon fontSize="large" />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default IrGraficasBoton;
