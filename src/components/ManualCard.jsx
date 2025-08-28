import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Stack,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  PictureAsPdf,
  PlayCircle,
  OpenInNew,
  Download
} from "@mui/icons-material";
import CustomButton from "./Button";

const ResourceCard = ({ type, resource, onDownload, downloading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (type === 'video') {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ p: 2, backgroundColor: theme.palette.primary.main, color: 'white' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <PlayCircle sx={{ mr: 1 }} />
            {resource?.label || "Video Tutorial"}
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
            src={resource?.src}
            title={resource?.label}
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
    );
  }

  if (type === 'pdf') {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ p: 2, backgroundColor: theme.palette.secondary.main, color: 'white' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <PictureAsPdf sx={{ mr: 1 }} />
            {resource?.label || "Manual en PDF"}
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
              href={resource?.src}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<OpenInNew />}
              sx={{ px: 3 }}
            >
              Ver en nueva pestaña
            </CustomButton>

            <CustomButton
              type="cancelar"
              onClick={onDownload}
              loading={downloading}
              debounceTime={1000}
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
    );
  }

  return null;
};

export default ResourceCard;