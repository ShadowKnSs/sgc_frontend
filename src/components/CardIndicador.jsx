// src/components/CardIndicador.jsx
import React from 'react';
import { Card, CardContent, Typography, IconButton, Box, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

const IndicatorCard = ({ indicator, onEdit, onRegisterResult, cardColor, soloLectura }) => {
  return (
    <Card
      sx={{
        backgroundColor: cardColor,
        borderRadius: '12px',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0px 4px 15px rgba(0, 123, 255, 0.6)',
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {indicator.nombreIndicador}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          {indicator.origenIndicador}
        </Typography>
      </CardContent>

      {/* Contenedor de Iconos en la parte inferior */}
      {!soloLectura && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: 2,
          }}
        >
          <Tooltip title="Registrar Resultado" arrow>
            <IconButton onClick={() => onRegisterResult(indicator)} sx={{ color: '#0275d8' }}>
              <PlaylistAddCheckIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Editar Indicador" arrow>
            <IconButton onClick={() => onEdit(indicator)} sx={{ color: '#f0ad4e' }}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Card>
  );
};

export default IndicatorCard;
