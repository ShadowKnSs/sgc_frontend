import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import Title from "../components/Title";
import FeedbackSnackbar from "../components/Feedback";
import { motion } from "framer-motion";
import axios from "axios";

const BuscaSupervisor = () => {
  const [supervisor, setSupervisor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
  });

  const obtenerSupervisor = async () => {
    setLoading(true);
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    try {
      const procesoRes = await axios.post("http://127.0.0.1:8000/api/proceso-por-lider", {
        idUsuario: usuario.idUsuario,
      });

      const idProceso = procesoRes.data.idProceso;

      const supervisorRes = await axios.get(
        `http://127.0.0.1:8000/api/supervisor/proceso/${idProceso}`
      );

      if (supervisorRes.data.success) {
        setSupervisor(supervisorRes.data.supervisor);
      } else {
        setFeedback({
          open: true,
          type: "warning",
          title: "Sin Supervisor",
          message: supervisorRes.data.message || "No hay supervisor asignado.",
        });
      }
    } catch (error) {
      setFeedback({
        open: true,
        type: "error",
        title: "Error",
        message: "Error al consultar el supervisor o el proceso.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerSupervisor();
  }, []);

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
      }}
    >
      <Title text="Supervisor" />

      {loading ? (
        <CircularProgress size={60} sx={{ mt: 4 }} />
      ) : supervisor ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              width: "100%",
              maxWidth: 700,
              backgroundColor: "#ffffff",
              p: 3,
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

            <Typography
              variant="h5"
              sx={{ textAlign: "center", color: "#004A98", fontWeight: "bold" }}
            >
              {supervisor.nombre}
            </Typography>

            <Typography
              variant="h6"
              sx={{ textAlign: "center", fontWeight: "bold", color: "#555" }}
            >
              Contacto
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Tooltip title="Haz clic para enviar un correo">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EmailIcon sx={{ color: "#004A98" }} />
                  <Typography variant="body1" fontWeight="bold">
                    Correo:
                  </Typography>
                  <Typography
                    variant="body1"
                    component="a"
                    href={`mailto:${supervisor.correo}`}
                    sx={{
                      color: "#004A98",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    {supervisor.correo}
                  </Typography>
                </Box>
              </Tooltip>

              <Tooltip title="Número de contacto del supervisor">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneIcon sx={{ color: "#004A98" }} />
                  <Typography variant="body1" fontWeight="bold">
                    Teléfono:
                  </Typography>
                  <Typography variant="body1">{supervisor.telefono}</Typography>
                </Box>
              </Tooltip>

              <Tooltip title="Grado académico del supervisor">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SchoolIcon sx={{ color: "#004A98" }} />
                  <Typography variant="body1" fontWeight="bold">
                    Grado Académico:
                  </Typography>
                  <Typography variant="body1">
                    {supervisor.gradoAcademico}
                  </Typography>
                </Box>
              </Tooltip>
            </Box>
          </Box>
        </motion.div>
      ) : null}

      <FeedbackSnackbar
        open={feedback.open}
        onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
      />
    </Box>
  );
};

export default BuscaSupervisor;
