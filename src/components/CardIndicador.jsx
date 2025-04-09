// src/components/CardIndicador.jsx
import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

const IndicatorCard = ({ indicator, onEdit, onDelete, onRegisterResult, cardColor, soloLectura }) => {
  return (
    <Card
      sx={{
        backgroundColor: cardColor,
        borderRadius: '12px',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0px 4px 15px rgba(0, 123, 255, 0.6)',
        }
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
            paddingBottom: 2
          }}
        >
          <IconButton onClick={() => onRegisterResult(indicator.idIndicadorConsolidado)} sx={{ color: '#0275d8' }}>
            <PlaylistAddCheckIcon />
          </IconButton>
          <IconButton onClick={() => onEdit(indicator.idIndicadorConsolidado)} sx={{ color: '#f0ad4e' }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onDelete(indicator)} sx={{ color: '#d9534f' }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )}

    </Card>
  );
};

export default IndicatorCard;
