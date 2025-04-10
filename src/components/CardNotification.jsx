import React from 'react';
import { Card, CardContent, IconButton, Typography, CardMedia, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const NotificationCard = ({ title, description, onClose, notificationId, idUsuario }) => {
  const handleMarkAsRead = async () => {
    try {
      await fetch(`http://localhost:8000/api/notificaciones/marcar-leidas/${idUsuario}/${notificationId}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };
  return (
    <Card
      sx={{
        display: 'flex',
        position: 'relative',
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: 'background.paper',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          objectFit: 'cover',
          boxShadow: 2,
        }}
        image="https://estudiantes.uaslp.mx/induccion/Images/EMBLEMA.jpg"
        alt="Logo"
      />
      <Box sx={{ flex: 1, paddingLeft: 2 }}>
        <CardContent sx={{ paddingBottom: '16px !important' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            {title}
          </Typography>

          {/* Aquí se muestra la descripción con saltos de línea */}
          {description.map((line, index) => (
            <Typography key={index} variant="body2" color="text.secondary">
              <strong>{line.label}</strong> {line.value}
            </Typography>
          ))}
        </CardContent>
      </Box>

      <IconButton
        onClick={() => { handleMarkAsRead(); onClose(); }}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: 'text.secondary',
          '&:hover': {
            backgroundColor: 'transparent',
            color: 'error.main',
          },
        }}
      >
        <CloseIcon />
      </IconButton>
    </Card>
  );
};

export default NotificationCard;
