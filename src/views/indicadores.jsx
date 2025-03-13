// src/components/IndicatorCard.jsx
import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
        height: 220, // mayor altura
        borderRadius: 8,
        transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: 6,
        },
        cursor: userType !== 'admin' ? 'pointer' : 'default',
        m: 1,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6">
          {indicator.name}
        </Typography>
      </CardContent>
      {userType === 'admin' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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
      )}
    </Card>
  );
};

export default IndicatorCard;
