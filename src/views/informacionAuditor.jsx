/**
 * Componente: DetalleAuditor.jsx
 * Descripción:
 * Vista de detalle de un auditor. Muestra su información personal (correo, teléfono, grado académico)
 * y un listado de auditorías en las que ha participado. Está diseñado con un enfoque visual moderno y
 * responsivo usando Material UI y animaciones con Framer Motion.
 * 
 * Props:
 * - auditor: Objeto con los datos del auditor seleccionado.
 * - onBack: Función callback para regresar a la vista anterior.
 * 
 * Funcionalidades:
 * - Realiza una petición GET al montar el componente para obtener las auditorías del auditor.
 * - Presenta la información en dos secciones:
 *    - Card de contacto (foto, correo, teléfono, grado)
 *    - Card de auditorías (lista de auditorías realizadas)
 * - Manejo básico de errores de red con `console.error`.
 * - Diseño responsivo (`Box`, `Grid`, `Paper`) y visual con `Avatar`, `Icons` y `Typography`.

 * Estados (useState):
 * - auditorias: Lista de auditorías obtenidas desde el backend para el auditor dado.

 * Efectos (useEffect):
 * - Al montar el componente, realiza una petición con el id del auditor:
 *   GET http://localhost:8000/api/auditores/{id}/auditorias

 * Dependencias externas:
 * - Axios (para solicitudes HTTP)
 * - Framer Motion (para animación inicial)
 * - Material UI (para diseño visual)

 * Recomendaciones futuras:
 * - Mostrar los nombres reales de entidades en lugar del `idEntidad`.
 * - Permitir navegación a la auditoría seleccionada (`onClick` en la card).
 * - Agregar paginación si la cantidad de auditorías crece.
 * - Usar `Skeleton` o `CircularProgress` durante la carga inicial.
 * - Manejo de errores con Snackbar o mensaje visual.

 */

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Tooltip,
  Paper,
  Divider
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { motion } from "framer-motion";
import axios from "axios";

const DetalleAuditor = ({ auditor, onBack }) => {
  const [auditorias, setAuditorias] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/auditores/${auditor.idUsuario}/auditorias`)
      .then(res => {
        if (res.data.success) {
          setAuditorias(res.data.data);
        }
      })
      .catch(err => {
        console.error("Error al obtener auditorías:", err);
      });
  }, [auditor.idUsuario]);

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        backgroundColor: "#f4f4f4"
      }}
    >
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

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            justifyContent: "center",
            alignItems: "flex-start",
            flexWrap: "wrap",
            mt: 4,
          }}
        >
          {/* Card de Contacto */}
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 4,
              width: { xs: "100%", md: "35%" },
              minWidth: "300px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2
            }}
          >
            <Avatar sx={{ width: 100, height: 100, bgcolor: "#004A98" }}>
              <PersonIcon sx={{ fontSize: 60, color: "#fff" }} />
            </Avatar>

            <Typography variant="h5" fontWeight="bold" color="#004A98">
              {auditor.nombre} {auditor.apellidoPat} {auditor.apellidoMat}
            </Typography>

            <Divider flexItem sx={{ my: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
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

          {/* Card de Auditorías */}
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 4,
              width: { xs: "100%", md: "50%" },
              minWidth: "300px",
              display: "flex",
              flexDirection: "column",
              gap: 3,
              position: "relative"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AssignmentTurnedInIcon color="primary" />
              <Typography variant="h6" fontWeight="bold" color="#004A98">
                Auditorías Realizadas
              </Typography>

              {/* Cantidad total */}
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {auditorias.map((auditoria, index) => (
                  <Paper
                    key={index}
                    elevation={3}
                    sx={{
                      p: 2.5,
                      borderLeft: "6px solid #004A98",
                      backgroundColor: "#f0f4ff",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                      }
                    }}
                  >
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
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        </Box>
      </motion.div>
    </Box>
  );
};

export default DetalleAuditor;
