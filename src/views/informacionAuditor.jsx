import React, { useEffect, useState, useRef } from "react";
import { Box, Paper, Avatar, Typography, Tooltip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { motion } from "framer-motion";
import axios from "axios";
import Title from "../components/Title"; // tu componente sticky

const DetalleAuditor = ({ auditor, onBack }) => {
  const [auditorias, setAuditorias] = useState([]);
  const [showStickyTitle, setShowStickyTitle] = useState(false);
  const cardRef = useRef();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/auditores/${auditor.idUsuario}/auditorias`)
      .then(res => {
        if (res.data.success) setAuditorias(res.data.data);
      })
      .catch(err => console.error("Error al obtener auditorías:", err));
  }, [auditor.idUsuario]);

  // IntersectionObserver para detectar cuando la card de info desaparece
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyTitle(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box sx={{ p: 4, minHeight: "100vh" }}>
      {/* Sticky Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: showStickyTitle ? 1 : 0, y: showStickyTitle ? 0 : -20 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          backgroundColor: "#fff",
          padding: "12px 0",
        }}
      >
        {showStickyTitle && <Title text={`${auditor.nombre} ${auditor.apellidoPat} ${auditor.apellidoMat || ""}`} />}
      </motion.div>

      {/* Botón de regreso */}
      <button
        onClick={onBack}
        style={{
          backgroundColor: "#004A98",
          color: "white",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        ⬅ Volver
      </button>

      {/* Contenedor principal */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "center"
        }}
      >
        {/* Card de Información del Auditor */}
        <Paper
          ref={cardRef}
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 4,
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2
          }}
        >
          <Avatar sx={{ width: 100, height: 100, bgcolor: "#004A98" }}>
            <PersonIcon sx={{ fontSize: 60, color: "#fff" }} />
          </Avatar>

          <Typography variant="h5" fontWeight="bold" color="#004A98" sx={{ textAlign: "center" }}>
            {auditor.nombre} {auditor.apellidoPat} {auditor.apellidoMat}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", mt: 2 }}>
            <Tooltip title="Haz clic para enviar un correo">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon color="primary" />
                <Typography fontWeight="bold">Correo:</Typography>
                <Typography
                  component="a"
                  href={`mailto:${auditor.correo}`}
                  sx={{ color: "#004A98", textDecoration: "underline" }}
                >
                  {auditor.correo}
                </Typography>
              </Box>
            </Tooltip>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon color="primary" />
              <Typography fontWeight="bold">Teléfono:</Typography>
              <Typography>{auditor.telefono}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SchoolIcon color="primary" />
              <Typography fontWeight="bold">Grado Académico:</Typography>
              <Typography>{auditor.gradoAcademico || "No disponible"}</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Auditorías */}
        <Box sx={{ width: { xs: "100%", md: "70%" }, display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AssignmentTurnedInIcon color="primary" />
            <Typography variant="h6" fontWeight="bold" color="#004A98">
              Auditorías Realizadas
            </Typography>
            <Box
              sx={{
                ml: 2,
                backgroundColor: "#004A98",
                color: "#fff",
                borderRadius: "12px",
                px: 2,
                py: 0.5,
                fontWeight: "bold",
                fontSize: "0.9rem"
              }}
            >
              {auditorias.length} {auditorias.length === 1 ? "auditoría" : "auditorías"}
            </Box>
          </Box>

          {auditorias.length === 0 ? (
            <Typography color="text.secondary" fontStyle="italic">
              No se han registrado auditorías aún.
            </Typography>
          ) : (
            auditorias.map((auditoria, index) => (
              <Paper
                key={index}
                elevation={4}
                sx={{
                  display: "flex",
                  gap: 3,
                  p: 3,
                  borderRadius: 3,
                  alignItems: "center",
                  backgroundColor: "#f0f4ff",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 25px rgba(0,0,0,0.15)"
                  }
                }}
              >
                {/* Número de auditoría */}
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    backgroundColor: "#004A98",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    flexShrink: 0
                  }}
                >
                  {index + 1}
                </Box>

                {/* Información de la auditoría */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="#003366">
                    {auditoria.nombreProceso}
                  </Typography>
                  <Typography variant="body2" color="#555">
                    Entidad: <strong>{auditoria.nombreEntidad || "Sin entidad"}</strong>
                  </Typography>
                  <Typography variant="body2" color="#555">
                    Fecha: {new Date(auditoria.fechaAuditoria).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="#555">
                    Alcance: {auditoria.tipoAuditoria}
                  </Typography>
                </Box>
              </Paper>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DetalleAuditor;
