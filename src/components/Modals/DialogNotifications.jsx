import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationCard from '../CardNotification';
import axios from 'axios';

const DialogNotifications = ({ open, onClose, userId }) => {
  const [notifications, setNotifications] = useState([]);

  // Función para obtener las notificaciones
  const fetchNotifications = async () => {
    try {
      // Llamada al backend para obtener las notificaciones para el usuario
      const response = await axios.get(`/api/notifications/${userId}`);
      setNotifications(response.data); // Guardamos las notificaciones en el estado
    } catch (error) {
      console.error('Error al obtener las notificaciones:', error);
    }
  };

  // Cargar notificaciones cuando se abra el diálogo
  useEffect(() => {
    if (open) {
      fetchNotifications(); // Hacer la petición al abrir el diálogo
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Notificaciones
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {/* Mapear las notificaciones y crear un componente para cada una */}
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <NotificationCard
                key={index}
                title={notification.title}
                description={notification.description}
                onClose={onClose}
              />
            ))
          ) : (
            <p>No hay notificaciones.</p>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <button onClick={onClose}>Cerrar</button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogNotifications;
