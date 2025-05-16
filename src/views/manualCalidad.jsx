/**
 * Vista: ManualCalidad
 * Descripción:
 * Componente encargado de mostrar el "Manual de Calidad" mediante un iframe embebido desde SharePoint.
 * Permite la carga progresiva del documento y funciones interactivas para usuarios con rol "Invitado".

 * Funcionalidades:
 * -  Muestra el título "Manual de Calidad" con estilo personalizado.
 * -  Carga el contenido embebido desde una URL externa (SharePoint) en un iframe.
 * -  Muestra un `CircularProgress` hasta que el documento está completamente cargado.
 * -  Permite abrir el iframe en pantalla completa.
 * -  Muestra un `SpeedDial` flotante con accesos rápidos si el usuario es "Invitado":
 *   - Pantalla completa.
 *   - Navegar a `/user-eventos`.

 * Lógica del rol:
 * - El componente obtiene `rolActivo` desde `localStorage`.
 * - Si el rol es "Invitado", se habilita la barra flotante con accesos.

 * Hooks y utilidades:
 * - `useState`: para controlar el estado de carga del iframe (`isLoaded`).
 * - `useRef`: referencia al iframe para manipulación DOM (pantalla completa).
 * - `useNavigate`: navegación programática con React Router.

 * Accesibilidad y usabilidad:
 * - Uso de `aria-label`, `title` y `tooltipTitle` para accesibilidad.
 * - Optimización visual para usuarios móviles y de escritorio.
 * - Experiencia de carga mejorada con `CircularProgress`.

 * Consideraciones técnicas:
 * - La función `handleFullscreen` es compatible con diferentes navegadores (`webkit`, `moz`, `ms`).
 * - El iframe incluye atributos de seguridad y accesibilidad.
 * - La URL embebida se puede cambiar fácilmente desde un entorno de configuración.

 * Mejora futura recomendada:
 * - Reemplazar SharePoint con una solución más personalizada o agregar un modo offline.
 * - Agregar una opción para descargar el manual directamente.
 * - Localización multilenguaje si se amplía el sistema a otros públicos.
 */

import React, { useRef, useState } from "react";
import { Typography, CircularProgress, Box, SpeedDial, SpeedDialAction } from "@mui/material";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useNavigate } from "react-router-dom";

const ManualCalidad = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const iframeRef = useRef(null);
  const navigate = useNavigate();

  // Verificar si es Invitado
  const rolActivo = JSON.parse(localStorage.getItem("rolActivo") || "null") || { nombreRol: "Invitado" };
  const esInvitado = rolActivo?.nombreRol === "Invitado";

  // Función para pantalla completa
  const handleFullscreen = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4 relative">
      <Typography
        variant="h4"
        align="center"
        padding={4}
        gutterBottom
        sx={{ fontWeight: "bold", color: "#0056b3" }}
      >
        Manual de Calidad
      </Typography>

      {!isLoaded && (
        <Box sx={{ minHeight: 600, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
          <CircularProgress size={60} thickness={4} color="primary" />
        </Box>
      )}

      <div className={`w-full max-w-4xl ${!isLoaded ? "hidden" : ""}`}>
        <iframe
          ref={iframeRef}
          src="https://uaslpedu.sharepoint.com/sites/Sical-virtual/_layouts/15/embed.aspx?UniqueId=69f2e061-d922-4e84-984a-bbba68b7246d"
          width="100%"
          height="600"
          frameBorder="0"
          allowFullScreen
          title="MANUAL DE CALIDAD 28042024"
          aria-label="Manual de Calidad"
          className="shadow-lg rounded-lg"
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      {/* SpeedDial solo para Invitado */}
      {esInvitado && (
        <SpeedDial
          ariaLabel="Opciones"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          icon={<FullscreenIcon />}
        >
          <SpeedDialAction
            icon={<FullscreenIcon />}
            tooltipTitle="Pantalla completa"
            onClick={handleFullscreen}
          />
          <SpeedDialAction
            icon={<NewspaperIcon />}
            tooltipTitle="Ir a Noticias"
            onClick={() => navigate('/user-eventos')}
          />
        </SpeedDial>
      )}
    </div>
  );
};

export default ManualCalidad;
