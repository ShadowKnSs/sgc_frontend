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
import { CircularProgress, Box, SpeedDial, SpeedDialAction, Container, Stack } from "@mui/material";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import BreadcrumbNav from "../components/BreadcrumbNav";
import Title from "../components/Title";
import CustomButton from "../components/Button";
import { useNavigate } from "react-router-dom";

const ManualCalidad = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const iframeRef = useRef(null);
  const navigate = useNavigate();

  // Verificar si es Invitado
  const rolActivo = JSON.parse(localStorage.getItem("rolActivo") || "null") || { nombreRol: "Invitado" };
  const esInvitado = rolActivo?.nombreRol === "Invitado";

  const breadcrumbItems = [
    { label: "Manual de Calidad", icon: NewspaperIcon }
  ];

  // URLs de recurso
  const uniqueId = "69f2e061-d922-4e84-984a-bbba68b7246d";
  const embedUrl = `https://uaslpedu.sharepoint.com/sites/Sical-virtual/_layouts/15/embed.aspx?UniqueId=${uniqueId}`;
  // En SharePoint Online, descarga directa con download.aspx + UniqueId
  const downloadUrl = `https://uaslpedu.sharepoint.com/sites/Sical-virtual/_layouts/15/download.aspx?UniqueId=${uniqueId}`;

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

  // Descarga (abrir en nueva pestaña). Evitamos fetch por CORS.
  const handleDownload = () => {
    if (!isLoaded || downloading) return;
    setDownloading(true);
    // Ancla efímera para descarga directa, un solo disparo
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "";              // sugiere descarga
    a.target = "_blank";          // no bloqueo de navegación actual
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Rehabilita tras un breve lapso (UX: evita doble click)
    setTimeout(() => setDownloading(false), 800);
  };

  return (

    <Container maxWidth={false} sx={{ minHeight: "100vh", py: 2 }}>
      {/* Breadcrumb pegado a la izquierda */}

      <BreadcrumbNav items={breadcrumbItems} />

      {/* Header de acciones: título + botones */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Title text="Manual de Calidad" mode="normal" />
        <Stack direction="row" spacing={1.5}>
          <CustomButton
            type="descargar"
            onClick={handleDownload}
            disabled={!isLoaded || downloading}
            aria-label="Descargar manual de calidad"
          >
            Descargar
          </CustomButton>
          <CustomButton
            type="guardar"
            onClick={handleFullscreen}
            aria-label="Ver en pantalla completa"
            sx={{ ml: { xs: 0, sm: 1 } }}
          >
            Pantalla completa
          </CustomButton>
        </Stack>
      </Stack>
      {!isLoaded && (
        <Box sx={{ minHeight: 600, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
          <CircularProgress size={60} thickness={4} color="primary" />
        </Box>
      )}

      <Box className={!isLoaded ? "hidden" : ""} sx={{ width: "100%", maxWidth: 960, mx: "auto" }}>
        <iframe
          ref={iframeRef}
          src={embedUrl}
          width="100%"
          height="600"
          frameBorder="0"
          allowFullScreen
          title="MANUAL DE CALIDAD"
          aria-label="Manual de Calidad"
          style={{ border: "0", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
          onLoad={() => setIsLoaded(true)}
        />
      </Box>

      {/* SpeedDial solo para Invitado */}
      {esInvitado && (
        <SpeedDial
          ariaLabel="Opciones"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          icon={<FullscreenIcon />}
        >
          
          <SpeedDialAction
            icon={<NewspaperIcon />}
            tooltipTitle="Ir a Noticias"
            onClick={() => navigate('/user-eventos')}
          />
        </SpeedDial>
      )}
    </Container>
  );
};

export default ManualCalidad;
