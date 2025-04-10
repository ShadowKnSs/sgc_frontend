import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle,DialogContent, DialogActions,Button,Typography,Box, Divider,} from '@mui/material';
import NotificationCard from '../CardNotification';
import axios from 'axios';

const DialogNotifications = ({ open, onClose, idUsuario }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!idUsuario) return;

      try {
        const response = await axios.get(`http://localhost:8000/api/notificaciones/${idUsuario}`);
        const notificacionesData = response.data.notificaciones || [];

        const mapped = notificacionesData.map((n) => {
          const data = n;

          return {
            id: n.id,
            title: getTitulo(data.tipoAuditoria, data.accion),
            description:
              data.tipoAuditoria === 'interna' && data.usuarios.length === 2
                ? [
                    { label: 'Proceso', value: data.nombreProceso },
                    { label: 'Auditor Líder', value: data.usuarios[0] },
                    { label: 'Fecha', value: data.fechaProgramada },
                    { label: 'Hora', value: data.horaProgramada },
                  ]
                : [
                    { label: 'Proceso', value: data.nombreProceso },
                    { label: 'Fecha', value: data.fechaProgramada },
                    { label: 'Hora', value: data.horaProgramada },
                  ],
          };
          
          // función que retorna el título correcto según la acción
          function getTitulo(tipo, accion) {
            if (accion === 'creado') return `Auditoría ${tipo} agendada`;
            if (accion === 'actualizado') return `Auditoría ${tipo} actualizada`;
            if (accion === 'eliminado') return `Auditoría ${tipo} eliminada`;
            return `Auditoría ${tipo}`; // fallback en caso de acción desconocida
          }
          
        });

        setNotifications(mapped);
      } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchNotifications();
    }
  }, [open, idUsuario]);

  const handleRemoveNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: '#004A98',
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Notificaciones
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          maxHeight: '70vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          backgroundColor: '#f5f5f5',
          px: 2,
          py: 1,
        }}
      >
        {loading ? (
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Cargando notificaciones...
          </Typography>
        ) : notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <Box key={notification.id} sx={{ mb: 2 }}>
              <NotificationCard
                idUsuario={idUsuario}
                notificationId={notification.id}
                title={notification.title}
                description={notification.description}
                onClose={() => handleRemoveNotification(notification.id)}
              />
              {index < notifications.length - 1 && (
                <Divider sx={{ my: 2, borderColor: 'rgba(0, 0, 0, 0.1)' }} />
              )}
            </Box>
          ))
        ) : (
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            No hay notificaciones.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', py: 2 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            backgroundColor: '#004A98',
            borderRadius: '30px',
            px: 4,
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#003671',
            },
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogNotifications;