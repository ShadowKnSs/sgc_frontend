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
      src: "https://www.orimi.com/pdf-test.pdf",
      download: true,
    },
    {
      label: "Video Canva",
      tipo: "video",
      src: "https://www.canva.com/design/DAGnYfxecUs/71io2_wC9ITWB1SgseBhBQ/watch?utm_content=DAGnYfxecUs&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h3239790ee4",
    },
  ],
  Líder: [
    {
      label: "Video para Líder de Proceso",
      tipo: "video",
      src: "https://uaslpedu-my.sharepoint.com/personal/a338885_alumnos_uaslp_mx/_layouts/15/stream.aspx?id=%2Fpersonal%2Fa338885%5Falumnos%5Fuaslp%5Fmx%2FDocuments%2FVideo%5FSical%2FManual%20del%20Usuario%20%2D%20L%C3%ADder%2Emp4&ga=1",
    },
  ],
  Supervisor: [
    {
      label: "Video para Supervisor",
      tipo: "video",
      src: "https://www.canva.com/design/DAGnY2nKmFo/NsYEYYXJR8bwlL-IbABz5w/watch?utm_content=DAGnY2nKmFo&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h87d36f03b1",
    },
  ],
  Auditor: [
    {
      label: "Video para Auditor",
      tipo: "video",
      src: "https://www.youtube.com/embed/ub82Xb1C8os",
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
              <Typography variant="h6" sx={{ mb: 1 }}>
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
