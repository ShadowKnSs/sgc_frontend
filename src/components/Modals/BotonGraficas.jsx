import React from 'react';
import { Fab, Tooltip, Box } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';

const IrGraficasBoton = ({ idRegistro, datosGraficas, idProceso, anio, loading = false }) => {
  const navigate = useNavigate();
  const hasAnyData = (dg) => {
    if (!dg) return false;
    const {
      planControl = [],
      mapaProceso = [],
      riesgos = [],
      encuesta = null,
      evaluacion = null,
      retroalimentacion = [],
    } = dg;
    return (
      planControl.length > 0 ||
      mapaProceso.length > 0 ||
      riesgos.length > 0 ||
      retroalimentacion.length > 0 ||
      !!encuesta ||
      !!evaluacion
    );
  };

  const ready = !loading && !!idRegistro && hasAnyData(datosGraficas);

  const handleClick = () => {
    if (!ready) return;

    navigate(`/graficas/${idRegistro}`, {
      state: { datosGraficas, idProceso, anio: Number(anio) }
    });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip title={ready ? "Ver gráficas" : "Cargando indicadores…"} placement="left" arrow>
        <Fab
          onClick={handleClick}
          disabled={!ready}

          sx={{
            backgroundColor: '#2dc1df',
            color: 'white',
            '&:hover': { backgroundColor: '#0056b3' },
            boxShadow: 3,
            ...( !ready && { cursor: 'not-allowed' } )
          }}
          aria-disabled={!ready}
        >
          <BarChartIcon fontSize="large" />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default IrGraficasBoton;
