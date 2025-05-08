// src/components/CardIndicador.jsx
import React from 'react';
import { Card, CardContent, Typography, IconButton, Box, Tooltip } from '@mui/material';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { motion } from 'framer-motion';

const IndicatorCard = ({ indicator, onEdit, onRegisterResult, cardColor, soloLectura }) => {
  const handleCardClick = () => {
    if (!soloLectura) onRegisterResult(indicator);
  };

  return (
    <Card
      component={motion.div}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      sx={{
        backgroundColor: cardColor || '#fff',
        borderRadius: 2,
        boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: !soloLectura ? 'pointer' : 'default'
      }}
    >
      <CardContent>
        <Tooltip title={indicator.nombreIndicador}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '3em',
            }}
          >
            {indicator.nombreIndicador}
          </Typography>
        </Tooltip>

        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            minHeight: '1.5em',
          }}
        >
          {indicator.origenIndicador}
        </Typography>
      </CardContent>

      {!soloLectura && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pb: 2 }}>
          <Tooltip title="Registrar Resultado" arrow>
            <IconButton
              aria-label={`Registrar resultado para ${indicator.nombreIndicador}`}
              onClick={(e) => {
                e.stopPropagation(); // evita doble click
                onRegisterResult(indicator);
              }}
              sx={{ color: '#0275d8' }}
            >
              <PlaylistAddCheckIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Card>
  );
};

export default IndicatorCard;
