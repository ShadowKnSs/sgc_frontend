import { useEffect, useState, useMemo, useCallback, lazy, Suspense } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress
} from "@mui/material";
import Title from "../components/Title";
import { getResourcesByRole, getRoleFromStorage } from "../data/roleResources";
import { downloadManual } from "../utils/downloadUtils";

// Carga perezosa de componentes
const ResourceCard = lazy(() => import("../components/ManualCard"));
const FeedbackSnackbar = lazy(() => import("../components/Feedback"));
const ResourceSkeleton = lazy(() => import("../components/ResourceSkeleton"));

const ManualDelSitio = () => {
  const [rol, setRol] = useState("Invitado");
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const userRole = getRoleFromStorage();
        setRol(userRole);
        setRecursos(getResourcesByRole(userRole));
      } catch (error) {
        console.error("Error loading resources:", error);
        setRecursos([]);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  const handleDownload = useCallback(async () => {
    setDownloading(true);

    try {
      await downloadManual(rol);
    } catch (error) {
      console.error("Download error:", error);
      setFeedback({
        open: true,
        type: "error",
        title: "Error en la descarga",
        message: error.message || "No se pudo descargar el manual. Intenta nuevamente."
      });
    } finally {
      setDownloading(false);
    }
  }, [rol]);

  const handleCloseFeedback = () => {
    setFeedback({ ...feedback, open: false });
  };

  const videoResource = useMemo(() => recursos.find(r => r.tipo === "video"), [recursos]);
  const pdfResource = useMemo(() => recursos.find(r => r.tipo === "pdf"), [recursos]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 4, marginTop: 3 }}>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#fff',
          zIndex: 1200,
          py: 2,
          borderBottom: '2px solid',
          borderColor: 'divider',
        }}
      >
        <Title text="Manual del Sitio" />
        <Typography variant="body1" sx={{ textAlign: "center", mt: 1 }}>
          Aquí tienes los tutoriales y manuales para tu rol de{" "}
          <strong>{rol}</strong>.
        </Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        {recursos.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
            No hay recursos disponibles para tu rol actualmente.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Suspense fallback={<ResourceSkeleton type="video" />}>
                <ResourceCard type="video" resource={videoResource} />
              </Suspense>
            </Grid>

            <Grid item xs={12} md={6}>
              <Suspense fallback={<ResourceSkeleton type="pdf" />}>
                <ResourceCard
                  type="pdf"
                  resource={pdfResource}
                  onDownload={handleDownload}
                  downloading={downloading}
                />
              </Suspense>
            </Grid>
          </Grid>
        )}
      </Box>

      <Suspense fallback={null}>
        <FeedbackSnackbar
          open={feedback.open}
          onClose={handleCloseFeedback}
          type={feedback.type}
          title={feedback.title}
          message={feedback.message}
          autoHideDuration={6000}
        />
      </Suspense>
    </Container>
  );
};

export default ManualDelSitio;