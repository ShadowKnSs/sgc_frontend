import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';

function BuscaSupervisor() {
  return (
    <Box
      sx={{
        p: 4,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#f4f4f4",
        paddingTop: "20px",
        position: "relative",
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{
          textAlign: "center",
          marginBottom: "60px",
          fontFamily: "'Roboto', sans-serif",
          color: "#004A98",
          fontWeight: "bold",
        }}
      >
        Supervisor
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          width: "100%",
          maxWidth: 700,
          backgroundColor: "#ffffff",
          padding: 3,
          borderRadius: 2,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Avatar
          sx={{
            width: 150,
            height: 150,
            backgroundColor: "#004A98",
          }}
        >
          <PersonIcon sx={{ fontSize: 75, color: "#ffffff" }} />
        </Avatar>

        <Typography variant="h5" component="h2" sx={{ textAlign: "center", color: "#004A98" }}>
          Juan Pérez Ramírez
        </Typography>

        <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold", color: "#555555" }}>
          <strong>Contacto</strong>
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EmailIcon sx={{ color: "#004A98" }} />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Correo:</Typography>
            <Typography variant="body1">236974@uaslp.com</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PhoneIcon sx={{ color: "#004A98" }} />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Teléfono:</Typography>
            <Typography variant="body1">444-123-5678</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SchoolIcon sx={{ color: "#004A98" }} />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Grado Académico:</Typography>
            <Typography variant="body1">Doctorado</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default BuscaSupervisor;