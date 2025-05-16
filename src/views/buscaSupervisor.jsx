/**
 * Componente: BuscaSupervisor
 * Ubicación: src/views/BuscaSupervisor.jsx
 * Descripción:
 * Vista que permite al usuario líder de proceso consultar visualmente quién es el supervisor asignado a su proceso.

 * Funcionalidades principales:
 * 1.  Consulta el proceso asociado al usuario líder logueado vía POST a `/api/proceso-por-lider`.
 * 2.  Consulta al supervisor correspondiente a ese proceso vía GET `/api/supervisor/proceso/:idProceso`.
 * 3.  Muestra datos del supervisor: nombre, correo, teléfono y grado académico.
 * 4.  Utiliza animaciones con Framer Motion para una entrada visual atractiva.
 * 5.  Integra `FeedbackSnackbar` para notificaciones en caso de errores o mensajes del servidor.
 * 6. Usa `Tooltip` de Material UI para mostrar descripciones contextuales en cada ícono.
 *
 * Estados controlados:
 * - `supervisor`: objeto con los datos del supervisor actual (nombre, correo, teléfono, grado).
 * - `loading`: booleano que controla el spinner de carga mientras se realiza la consulta.
 * - `feedback`: objeto con los campos:
 *   - `open`: boolean, controla si el snackbar está visible.
 *   - `type`: "info" | "warning" | "error" | "success"
 *   - `title`: título del mensaje mostrado.
 *   - `message`: contenido del mensaje.

 * Estructura del objeto `supervisor` esperado desde el backend:
 * {
 *   nombre: string,
 *   correo: string,
 *   telefono: string,
 *   gradoAcademico: string
 * }

 * Diseño UI:
 * - Encabezado con componente reutilizable `Title`.
 * - Avatar representando al supervisor.
 * - Colores institucionales (#004A98 para primario).
 * - Tooltips para accesibilidad.
 * - Layout centrado y responsivo.

 * Reutiliza:
 * - `Title`: título superior.
 * - `FeedbackSnackbar`: notificaciones flotantes.

 * Tecnologías adicionales:
 * - `framer-motion` para animaciones de entrada suaves.
 * - `axios` para llamadas HTTP.

 * Recomendaciones futuras:
 * - Mostrar imagen de perfil si se cuenta con una URL.
 * - Permitir ver procesos supervisados si el usuario es supervisor.
 * - Soporte para múltiples procesos y supervisores.
 */

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
