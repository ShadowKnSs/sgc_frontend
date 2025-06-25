import React from 'react';
import moment from 'moment';
import 'moment/locale/es';
import { Box, Button, Typography, ButtonGroup } from '@mui/material';
import { ArrowBack, ArrowForward, Today } from '@mui/icons-material';
import { Navigate } from 'react-big-calendar';

moment.locale('es');

export default function CustomCalendarToolbar({
  date,
  onNavigate,
  onView,
  view
}) {
  const formattedLabel = moment(date).format('MMMM YYYY');

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      {/* Navegación */}
      <Box>
        <Button
          size="small"
          startIcon={<ArrowBack />}
          onClick={() => onNavigate(Navigate.PREVIOUS)}
          sx={{ mr: 1 }}
        >
          Anterior
        </Button>
        <Button
          size="small"
          startIcon={<Today />}
          onClick={() => onNavigate(Navigate.TODAY)}
          sx={{ mx: 1 }}
        >
          Hoy
        </Button>
        <Button
          size="small"
          endIcon={<ArrowForward />}
          onClick={() => onNavigate(Navigate.NEXT)}
          sx={{ ml: 1 }}
        >
          Siguiente
        </Button>
      </Box>

      {/* Etiqueta del mes/año */}
      <Typography variant="h6" fontWeight="bold" color="#004A98" textTransform="capitalize">
        {formattedLabel}
      </Typography>

      {/* Cambio de vista */}
      <ButtonGroup variant="outlined" size="small">
        <Button
          onClick={() => onView('month')}
          variant={view === 'month' ? 'contained' : 'outlined'}
        >
          Mes
        </Button>
        <Button
          onClick={() => onView('week')}
          variant={view === 'week' ? 'contained' : 'outlined'}
        >
          Semana
        </Button>
        <Button
          onClick={() => onView('day')}
          variant={view === 'day' ? 'contained' : 'outlined'}
        >
          Día
        </Button>
      </ButtonGroup>
    </Box>
  );
}
