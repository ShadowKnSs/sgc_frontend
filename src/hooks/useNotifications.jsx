// hooks/useNotifications.js
import { useState, useEffect } from 'react';
import axios from 'axios';
export const useNotifications = (idUsuario, rolActivo) => {
  const [notificationCount, setNotificationCount] = useState(0);
  
  useEffect(() => {
    if (idUsuario && rolActivo?.nombreRol !== "Administrador") {
      axios.get(`http://localhost:8000/api/notificaciones/count/${idUsuario}`)
        .then(response => {
          setNotificationCount(response.data.notificacionesNoLeidas);
        })
        .catch(error => {
          console.error('Error al obtener el conteo de notificaciones:', error);
        });
    }
  }, [idUsuario, rolActivo]);
  
  return notificationCount;
};