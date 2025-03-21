import { Button, Container, Typography, Box } from "@mui/material";
import Title from "../components/Title";

const ManualDelSitio = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Title text="Manual del Sitio" sx={{ textAlign: "center", mb: 4 }} />
      </Box>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Aquí se mostrará el manual del sitio, donde encontrarás información detallada sobre su uso y funcionalidades.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button variant="contained" color="primary">
          Checar video
        </Button>
      </Box>
    </Container>
  );
};

export default ManualDelSitio;