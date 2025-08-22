import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Stack,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Card,
  CardContent,
  CardActions
} from "@mui/material";
import {
  PictureAsPdf,
  PlayCircle,
  OpenInNew, Download

} from "@mui/icons-material";
import Title from "../components/Title";
import FeedbackSnackbar from "../components/Feedback";
import CustomButton from "../components/Button";


// Mapeo de recursos por rol
const linksPorRol = {
  Administrador: [
    {
      label: "Video del Administrador",
      tipo: "video",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=9d632f68-cbe2-445a-9f91-cf40c0cd4fa4&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=OneUpFileViewer&referrerScenario=EmbedDialog.Create",
    },
    {
      label: "Manual en PDF",
      tipo: "pdf",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=bac5baae-8341-4ff0-9d68-ecb962206202",
      download: true,
    }
  ],
  Coordinador: [
    {
      label: "Video Canva",
      tipo: "video",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=f937db67-53cf-4d8e-82a5-9ca6a924b28f&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=OneUpFileViewer&referrerScenario=EmbedDialog.Create",
    },
    {
      label: "Guía en PDF para Coordinador",
      tipo: "pdf",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=def1c94c-ef13-4b01-af09-475e8e3d9d7a",
      download: true,
    }
  ],
  Líder: [
    {
      label: "Video para Líder de Proceso",
      tipo: "video",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=e7149bbd-28c8-4a5f-9f92-0a7649a8edf3&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=OneUpFileViewer&referrerScenario=EmbedDialog.Create",
    },
    {
      label: "Manual en PDF",
      tipo: "pdf",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=4aeae0f2-6f9b-4ccb-bd82-60ea066b7238",
      download: true,
    }
  ],
  Supervisor: [
    {
      label: "Video para Supervisor",
      tipo: "video",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=5e46bb60-c5c5-48ff-b8b4-21f319464ffb&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=OneUpFileViewer&referrerScenario=EmbedDialog.Create",
    },
    {
      label: "Manual en PDF",
      tipo: "pdf",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=602b9a11-a1d2-4190-a32d-debdd2278be2",
      download: true,
    }
  ],
  Auditor: [
    {
      label: "Video para Auditor",
      tipo: "video",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=5e46bb60-c5c5-48ff-b8b4-21f319464ffb&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=OneUpFileViewer&referrerScenario=EmbedDialog.Create",
    },
    {
      label: "Manual en PDF",
      tipo: "pdf",
      src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=e7149bbd-28c8-4a5f-9f92-0a7649a8edf3&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=OneUpFileViewer&referrerScenario=EmbedDialog.Create",
      download: true,
    }
  ],
};

const ManualDelSitio = () => {
  const [rol, setRol] = useState("Invitado");
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Estados para la descarga
  const [downloading, setDownloading] = useState(false);
  const [feedback, setFeedback] = useState({
    open: false,
    type: "",
    title: "",
    message: ""
  });

  useEffect(() => {
    const loadResources = () => {
      try {
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
      } catch (error) {
        console.error("Error loading resources:", error);
        setRecursos([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadResources, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async () => {
    setDownloading(true);

    try {
      // Determinar el rol para la descarga
      const rolParaDescarga = rol.toLowerCase();

      // URL del endpoint - cambiar según el entorno
      const baseUrl = 'http://localhost:8000';

      const response = await fetch(`${baseUrl}/api/descargar-manual/${rolParaDescarga}`, {

      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al descargar el archivo');
      }

      // Crear un blob y descargar
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `manual-${rol}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error("Download error:", error);

      // Mostrar feedback de error
      setFeedback({
        open: true,
        type: "error",
        title: "Error en la descarga",
        message: error.message || "No se pudo descargar el manual. Intenta nuevamente."
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleCloseFeedback = () => {
    setFeedback({ ...feedback, open: false });
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 4, marginTop: 3 }}>
      {/* Encabezado fijo */}
      <Box
        sx={{
          position: 'sticky',
          top: isMobile ? 56 : 64,
          backgroundColor: 'background.paper',
          zIndex: 10,
          py: 2,
          borderBottom: '2px solid',
          borderColor: 'divider',
          mb: 3
        }}
      >
        <Title text="Manual del Sitio" />
        <Typography variant="body1" sx={{ textAlign: "center", mt: 1 }}>
          Aquí tienes los tutoriales y manuales para tu rol de{" "}
          <strong>{rol}</strong>.
        </Typography>
      </Box>

      {/* Contenido con scroll */}
      <Box sx={{ mt: 3 }}>
        {recursos.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
            No hay recursos disponibles para tu rol actualmente.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {/* Columna de Video */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              >
                <Box sx={{ p: 2, backgroundColor: theme.palette.primary.main, color: 'white' }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <PlayCircle sx={{ mr: 1 }} />
                    {recursos.find(r => r.tipo === "video")?.label || "Video Tutorial"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    src={recursos.find(r => r.tipo === "video")?.src}
                    title={recursos.find(r => r.tipo === "video")?.label}
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
                    loading="lazy"
                  />
                </Box>
              </Card>
            </Grid>

            {/* Columna de PDF */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              >
                <Box sx={{ p: 2, backgroundColor: theme.palette.secondary.main, color: 'white' }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <PictureAsPdf sx={{ mr: 1 }} />
                    {recursos.find(r => r.tipo === "pdf")?.label || "Manual en PDF"}
                  </Typography>
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 6 }}>
                  <PictureAsPdf sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                    Haz clic en el botón para ver o descargar el manual en PDF
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', pb: 3, pt: 0 }}>
                  <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                    <CustomButton
                      type="descargar"
                      href={recursos.find(r => r.tipo === "pdf")?.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<OpenInNew />}
                      sx={{ px: 3 }}
                    >
                      Ver en nueva pestaña
                    </CustomButton>

                    <CustomButton
                      type="cancelar"
                      onClick={handleDownload}
                      loading={downloading}
                      debounceTime={1000} // Puedes ajustar este tiempo según necesites
                      sx={{ px: 3 }}
                      aria-busy={downloading}
                      aria-label="Descargar manual en PDF"
                      startIcon={<Download />}
                    >
                      {downloading ? 'Descargando...' : 'Descargar PDF'}
                    </CustomButton>
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        )
        }
      </Box >

      {/* Componente de Feedback */}
      < FeedbackSnackbar
        open={feedback.open}
        onClose={handleCloseFeedback}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        autoHideDuration={6000}
      />
    </Container >
  );
};

export default ManualDelSitio;