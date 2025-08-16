/**
 * Vista: ManualDelSitio
 * Descripción:
 * Componente que muestra recursos visuales (PDFs y videos) personalizados para cada tipo de rol dentro del sistema.
 * Permite a los usuarios acceder a manuales y tutoriales según su función (rol) en el sistema.

 * Funcionalidades clave:
 * -  Detecta el rol activo del usuario desde `localStorage.rolActivo`.
 * -  Muestra recursos embebidos desde SharePoint o YouTube, según el tipo (PDF o video).
 * -  Permite descargar manuales PDF si la opción `download` está habilitada.
 * -  Soporte para múltiples roles: Administrador, Coordinador, Líder, Supervisor, Auditor.
 * -  Los usuarios sin rol o con rol no contemplado verán el mensaje "Invitado".

 * Comportamiento:
 * - Usa el hook `useEffect` para ejecutar lógica de detección del rol y carga de recursos al montar el componente.
 * - Utiliza `mapeoRoles` para traducir el nombre de rol recibido del backend (e.g. "líder" → "Líder").
 * - Los recursos están definidos en la constante `linksPorRol`, categorizados por tipo (`pdf` o `video`) y rol.

 * Componentes usados:
 * - `Title`: componente reutilizable para encabezados estilizados.
 * - `Typography`, `Box`, `Grid`, `Stack`, `Button`: componentes de Material UI para diseño y estructura.

 * Consideraciones técnicas:
 * -  Los documentos PDF se visualizan dentro de un `iframe` con un contenedor estilizado.
 * -  Los videos se incrustan con soporte de pantalla completa.
 * -  Se evita el uso de bibliotecas externas adicionales para visualización o video.
 * -  Si no hay recursos disponibles para el rol detectado, se muestra un mensaje neutral.

 * Escenarios contemplados:
 * -  Un administrador podrá ver un PDF y video instructivo para su función.
 * -  Un coordinador o líder verá recursos adaptados a su contexto.
 * -  Si un rol no está mapeado, el componente mostrará el rol como "Invitado" y sin recursos.

 * Posibles mejoras:
 * - Integrar backend para servir enlaces y contenido desde base de datos.
 * - Soporte multilenguaje (internacionalización).
 * - Agregar loader mientras se cargan los recursos.

 */

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Stack,
} from "@mui/material";
import Title from "../components/Title";

// Mapeo de recursos por rol
const linksPorRol = {
  Administrador: [
    {
      label: "Manual en PDF",
      tipo: "pdf",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=bac5baae-8341-4ff0-9d68-ecb962206202",
      download: true,
    },
    {
      label: "Video del Administrador",
      tipo: "video",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=9d632f68-cbe2-445a-9f91-cf40c0cd4fa4&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=OneUpFileViewer&referrerScenario=EmbedDialog.Create",
    },
  ],
  Coordinador: [
    {
      label: "Guía en PDF para Coordinador",
      tipo: "pdf",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=def1c94c-ef13-4b01-af09-475e8e3d9d7a",
      download: true,
    },
    {
      label: "Video Canva",
      tipo: "video",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=f937db67-53cf-4d8e-82a5-9ca6a924b28f&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=OneUpFileViewer&referrerScenario=EmbedDialog.Create",
    },
  ],
  Líder: [
    {
      label: "Manual en PDF",
      tipo: "pdf",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=4aeae0f2-6f9b-4ccb-bd82-60ea066b7238",
      download: true,
    }, {
      label: "Video para Líder de Proceso",
      tipo: "video",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=e7149bbd-28c8-4a5f-9f92-0a7649a8edf3&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=OneUpFileViewer&referrerScenario=EmbedDialog.Create",
    },
  ],
  Supervisor: [
    {
      label: "Manual en PDF",
      tipo: "pdf",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=602b9a11-a1d2-4190-a32d-debdd2278be2",
      download: true,
    }, {
      label: "Video para Supervisor",
      tipo: "video",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=5e46bb60-c5c5-48ff-b8b4-21f319464ffb&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=OneUpFileViewer&referrerScenario=EmbedDialog.Create",
    },
  ],
  Auditor: [
    {
      label: "Manual en PDF",
      tipo: "pdf",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=e7149bbd-28c8-4a5f-9f92-0a7649a8edf3&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=OneUpFileViewer&referrerScenario=EmbedDialog.Create",
      download: true,
    }, {
      label: "Video para Auditor",
      tipo: "video",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=5e46bb60-c5c5-48ff-b8b4-21f319464ffb&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=OneUpFileViewer&referrerScenario=EmbedDialog.Create",
    },
  ],
};

const ManualDelSitio = () => {
  const [rol, setRol] = useState("Invitado");
  const [recursos, setRecursos] = useState([]);

  useEffect(() => {
    const rolActivo = JSON.parse(localStorage.getItem("rolActivo"));
    const nombreRol = rolActivo?.nombreRol?.toLowerCase();

    const mapeoRoles = {
      administrador: "Administrador",
      coordinador: "Coordinador",
      líder: "Líder",
      supervisor: "Supervisor",
      auditor: "Auditor",
    };

    const rolFormateado = mapeoRoles[nombreRol] || "Invitado";
    setRol(rolFormateado);
    setRecursos(linksPorRol[rolFormateado] || []);
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Title text="Manual del Sitio" />
      <Typography variant="body1" sx={{ mt: 3, textAlign: "center", mb: 4 }}>
        Aquí encontrarás manuales y tutoriales en video para el rol{" "}
        <strong>{rol}</strong>.
      </Typography>

      {recursos.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center">
          No hay recursos disponibles para tu rol actualmente.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {recursos.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: "#185FA4",
                  borderBottom: "2px solid #2dc1df",
                  display: "inline-block", 
                  pb: 0.5,
                  
                }}
              >
                {item.label}
              </Typography>

              {item.tipo === "pdf" ? (
                <>
                  <Box
                    sx={{
                      width: "100%",
                      height: 600,
                      mb: 2,
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <iframe
                      src={item.src}
                      title={item.label}
                      width="100%"
                      height="100%"
                      style={{ border: "none" }}
                    />
                  </Box>
                  {item.download && (
                    <Stack direction="row" justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        href={item.src}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Descargar PDF
                      </Button>
                    </Stack>
                  )}
                </>
              ) : item.tipo === "video" ? (
                <Box
                  sx={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                    overflow: "hidden",
                    borderRadius: 2,
                    boxShadow: 2,
                  }}
                >
                  <iframe
                    src={item.src}
                    title={item.label}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                  />
                </Box>
              ) : null}
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ManualDelSitio;
