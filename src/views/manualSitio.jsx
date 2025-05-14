import { useEffect, useState } from "react";
import { Button, Container, Typography,  Grid } from "@mui/material";
import Title from "../components/Title";

// Mapeo de videos por rol
const linksPorRol = {
  Administrador: [
    { label: "Manual del Administrador", url: "https://www.canva.com/design/DAGnY-_DVyE/mCJXjhAgxkjbtzRVczM9iQ/watch?utm_content=DAGnY-_DVyE&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h5f1e8b6dfe" },
  ],
  Coordinador: [
    { label: "Guía para Coordinador", url: "https://www.canva.com/design/DAGnYfxecUs/71io2_wC9ITWB1SgseBhBQ/watch?utm_content=DAGnYfxecUs&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h3239790ee4" },
  ],
  Líder: [
    { label: "Uso del módulo de Procesos", url: "https://uaslpedu-my.sharepoint.com/personal/a338885_alumnos_uaslp_mx/_layouts/15/stream.aspx?id=%2Fpersonal%2Fa338885%5Falumnos%5Fuaslp%5Fmx%2FDocuments%2FVideo%5FSical%2FManual%20del%20Usuario%20%2D%20L%C3%ADder%2Emp4&ga=1" },
  ],
  Supervisor: [
    { label: "Guía para Supervisor", url: "https://www.canva.com/design/DAGnY2nKmFo/NsYEYYXJR8bwlL-IbABz5w/watch?utm_content=DAGnY2nKmFo&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h87d36f03b1" },
  ],
  Auditor: [
    { label: "Auditoría en el Sistema", url: "https://youtu.be/auditor-video" },
  ],
};

const ManualDelSitio = () => {
  const [rol, setRol] = useState("Invitado");
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const rolActivo = JSON.parse(localStorage.getItem("rolActivo"));

    const nombreRol = rolActivo?.nombreRol?.toLowerCase();

    // Mapeo de nombres normalizados
    const mapeoRoles = {
      administrador: "Administrador",
      coordinador: "Coordinador",
      líder: "Líder",
      supervisor: "Supervisor",
      auditor: "Auditor",
    };

    const rolFormateado = mapeoRoles[nombreRol] || "Invitado";

    setRol(rolFormateado);
    setVideos(linksPorRol[rolFormateado] || []);
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Title text="Manual del Sitio" />
      <Typography variant="body1" sx={{ mt: 3, textAlign: "center", mb: 4 }}>
        Aquí encontrarás manuales y tutoriales en video para el rol <strong>{rol}</strong>.
      </Typography>

      {videos.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center">
          No hay videos disponibles para tu rol actualmente.
        </Typography>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {videos.map((video, index) => (
            <Grid item key={index}>
              <Button
                variant="contained"
                color="primary"
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {video.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ManualDelSitio;
