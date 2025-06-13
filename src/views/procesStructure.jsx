/**
 * Vista: ProcessStructure
 * Descripción:
 * Muestra un conjunto de tarjetas de navegación (`MenuCard`) hacia los distintos módulos
 * estructurales del proceso seleccionado. El acceso a cada módulo depende de los permisos del rol activo.
 * 
 * Módulos posibles:
 * - Manual Operativo
 * - Gestión de Riesgo
 * - Análisis de Datos
 * - Acciones de Mejora
 * - Auditoría
 * - Seguimiento
 * 
 * Características:
 * - Utiliza animaciones con `framer-motion`.
 * - Usa `ContextoProcesoEntidad` para mostrar información contextual del proceso.
 * - Filtra dinámicamente las tarjetas de acceso con base en los permisos almacenados en `localStorage`.
 * 
 * Dependencias clave:
 * - React Router (`useNavigate`, `useParams`)
 * - `MenuCard`, `ContextoProcesoEntidad`
 * - Íconos de Material UI (ej. `BookIcon`, `WarningIcon`, etc.)
 */
import React, { useMemo } from "react";
import { Box } from "@mui/material";
import MenuCard from "../components/menuCard";
import BookIcon from "@mui/icons-material/Book";
import WarningIcon from "@mui/icons-material/Warning";
import AssessmentIcon from '@mui/icons-material/Assessment'; import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DescriptionIcon from "@mui/icons-material/Description";
import LinkIcon from "@mui/icons-material/Link";
import { useNavigate, useParams } from "react-router-dom";
import ContextoProcesoEntidad from "../components/ProcesoEntidad";
import Title from "../components/Title";
import { motion } from "framer-motion";

const ProcessStructure = () => {
  const navigate = useNavigate();
  const { idProceso } = useParams();
  const rolActivo = JSON.parse(localStorage.getItem("rolActivo"));
  const permisos = rolActivo?.permisos?.map((p) => p.modulo) || [];

  const menuItems = useMemo(() => [
    { icon: <BookIcon />, title: "Manual Operativo", path: `/manual-operativo/${idProceso}` },
    { icon: <WarningIcon />, title: "Gestión de Riesgo", path: `/carpetas/${idProceso}/Gestión de Riesgo` },
    { icon: <AssessmentIcon />, title: "Análisis de Datos", path: `/carpetas/${idProceso}/Análisis de Datos` },
    { icon: <TrendingUpIcon />, title: "Acciones de Mejora", path: `/carpetas/${idProceso}/Acciones de Mejora` },
    { icon: <DescriptionIcon />, title: "Auditoría", path: `/carpetas/${idProceso}/Auditoria` },
    { icon: <LinkIcon />, title: "Seguimiento", path: `/carpetas/${idProceso}/Seguimiento` },
  ], [idProceso]);

  const itemsFiltrados = useMemo(() => menuItems.filter((item) => permisos.includes(item.title)), [menuItems, permisos]);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: '100vh',
        paddingTop: 4,
      }}
    >
      <Title text="Estructura del Proceso" />
      <ContextoProcesoEntidad idProceso={idProceso} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)"
          },
          gap: 4,
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        {itemsFiltrados.map((item, index) => (
          <MenuCard
            key={index}
            icon={item.icon}
            title={item.title}
            sx={{ textAlign: "center" }}
            onClick={() => navigate(item.path)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ProcessStructure;
