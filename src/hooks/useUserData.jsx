// hooks/useUserData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useUserData = (idUsuario) => {
  const [nombreCompleto, setNombreCompleto] = useState("");
  
  useEffect(() => {
    if (idUsuario) {
      axios.get(`http://localhost:8000/api/usuario/${idUsuario}`)
        .then(response => {
          setNombreCompleto(response.data.nombreCompleto);
        })
        .catch(error => {
          console.error("Error al obtener el nombre del usuario:", error);
        });
    }
  }, [idUsuario]);
  
  return nombreCompleto;
};

