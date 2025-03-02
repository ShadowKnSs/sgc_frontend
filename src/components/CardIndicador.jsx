// src/components/IndicatorCard.jsx
import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HowToRegIcon from '@mui/icons-material/HowToReg'; // Icono para registrar (usuario)

const IndicatorCard = ({ 
  indicator, 
  userType, 
  onEdit, 
  onDelete, 
  onCardClick,
  cardColor
}) => {
  return (
    <Card 
      onClick={userType !== 'admin' ? () => onCardClick(indicator) : undefined} 
      sx={{
        backgroundColor: cardColor || '#f5f5f5',
        width: '100%',
        height: 120,
        borderRadius: 5,
        transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s, color 0.3s',
        cursor: userType !== 'admin' ? 'pointer' : 'default',
        m: 1,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '&:hover': userType === 'admin'
          ? {
            transform: 'scale(1.03)',
            boxShadow: 6,
            background: '#69cfe3',
            color: 'white',
          }
          : {
              
            transform: 'scale(1.03)',
            boxShadow: 6,
          },
      }}
    >
      {/* Contenedor superior: nombre e origen, alineados a la derecha */}
      <CardContent 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'flex-start',   
          p: 0, 
          m: 0, 
          width: '100%' 
        }}
      >
        <Typography variant="h6" sx={{ textAlign: 'left', width: '100%' }}>
          {indicator.name}
        </Typography>
        <Typography variant="subtitle2" sx={{ textAlign: 'left', width: '100%' }}>
          {indicator.origenIndicador}
        </Typography>
      </CardContent>

      {/* Contenedor inferior: iconos de acción, alineados a la derecha */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        {userType === 'admin' ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={(e) => { e.stopPropagation(); onEdit(indicator.idIndicadorConsolidado); }}
              sx={{ color: 'royalblue' }}
            >
              <EditIcon fontSize="medium" />
            </IconButton>
            <IconButton 
              onClick={(e) => { e.stopPropagation(); onDelete(indicator); }}
              sx={{ color: 'gold' }}
            >
              <DeleteIcon fontSize="medium" />
            </IconButton>
          </Box>
        ) : (
          <IconButton 
            onClick={() => onCardClick(indicator)}
            sx={{ color: 'primary.main' }}
          >
            <HowToRegIcon fontSize="medium" />
          </IconButton>
        )}
      </Box>
    </Card>
  );
};

export default IndicatorCard;
