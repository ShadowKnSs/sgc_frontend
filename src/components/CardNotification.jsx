import React from 'react';
import { Card, CardContent, IconButton, Typography, CardMedia, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const NotificationCard = ({ title, description, onClose }) => {
  return (
    <Card sx={{ display: 'flex', position: 'relative', padding: 2 }}>
      <CardMedia
        component="img"
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
        image="https://via.placeholder.com/60" // Asegúrate de usar el logo correcto aquí
        alt="Logo"
      />
      <Box sx={{ flex: 1, paddingLeft: 2 }}>
        <CardContent>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Box>
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
    </Card>
  );
};

export default NotificationCard;
