import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const IndicatorCard = ({ 
  indicator, 
  userType, 
  onEdit, 
  onDelete, 
  onCardClick,
  isResultRegistered 
}) => {
  return (
    <Card 
      onClick={userType !== 'admin' ? () => onCardClick(indicator) : undefined} 
      sx={{
        // Si el usuario no es admin y se registró el resultado, fondo verde; de lo contrario, gris claro.
        backgroundColor: userType !== 'admin' && isResultRegistered ? 'lightgreen' : '#f5f5f5',
        width: 350,
        borderRadius: 8,
        transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 6,
        },
        cursor: userType !== 'admin' ? 'pointer' : 'default',
        m: 1,
      }}
    >
      <CardContent>
        <Typography variant="h6">
          {indicator.name}
        </Typography>
        {userType === 'admin' && (
          <div>
            <IconButton 
              onClick={(e) => { e.stopPropagation(); onEdit(indicator.id); }}
              sx={{ color: 'royalblue' }}
            >
              <EditIcon fontSize="large" />
            </IconButton>
            <IconButton 
              onClick={(e) => { e.stopPropagation(); onDelete(indicator); }}
              sx={{ color: 'gold' }}
            >
              <DeleteIcon fontSize="large" />
            </IconButton>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IndicatorCard;
