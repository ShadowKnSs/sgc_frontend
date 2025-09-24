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
import { Box, Typography } from "@mui/material";
import MenuCard from "../components/menuCard";
import BookIcon from "@mui/icons-material/Book";
import WarningIcon from "@mui/icons-material/Warning";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LinkIcon from "@mui/icons-material/Link";
import { useNavigate, useParams } from "react-router-dom";
import ContextoProcesoEntidad from "../components/ProcesoEntidad";
import Title from "../components/Title";
import BreadcrumbNav from "../components/BreadcrumbNav";
import { motion } from "framer-motion";

const ProcessStructure = () => {
  const navigate = useNavigate();
  const { idProceso } = useParams();

  const rolActivo = useMemo(() => {
    try {
      const rol = localStorage.getItem("rolActivo");
      return rol ? JSON.parse(rol) : null;
    } catch (error) {
      console.error("Error al parsear rolActivo:", error);
      return null;
    }
  }, []);

  const permisos = rolActivo?.permisos?.map((p) => p.modulo) || [];

  const breadcrumbItems = useMemo(
    () => [{ label: "Estructura del proceso", icon: AccountTreeIcon }],
    []
  );

  const menuItems = useMemo(
    () => [
      { key: "manual_operativo", icon: <BookIcon />, title: "Manual Operativo", path: `/manual-operativo/${idProceso}` },
      { key: "gestion_riesgo", icon: <WarningIcon />, title: "Gestión de Riesgo", path: `/carpetas/${idProceso}/${encodeURIComponent("Gestión de Riesgo")}` },
      { key: "analisis_datos", icon: <AssessmentIcon />, title: "Análisis de Datos", path: `/carpetas/${idProceso}/${encodeURIComponent("Análisis de Datos")}` },
      { key: "acciones_mejora", icon: <TrendingUpIcon />, title: "Acciones de Mejora", path: `/carpetas/${idProceso}/${encodeURIComponent("Acciones de Mejora")}` },
      { key: "auditoria", icon: <DescriptionIcon />, title: "Auditoría", path: `/carpetas/${idProceso}/${encodeURIComponent("Auditoria")}` },
      { key: "seguimiento", icon: <LinkIcon />, title: "Seguimiento", path: `/carpetas/${idProceso}/${encodeURIComponent("Seguimiento")}` },
    ],
    [idProceso]
  );

  const itemsFiltrados = useMemo(
    () => menuItems.filter((item) => permisos.includes(item.title)),
    [menuItems, permisos]
  );

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        minHeight: "100vh",
        pt: 1.5,
        overflowX: "hidden",
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ width: "100%", px: { xs: 1, sm: 2 }, boxSizing: "border-box" }}>
        <BreadcrumbNav items={breadcrumbItems} />
      </Box>

      <Box sx={{ width: "100%", mx: "auto", px: { xs: 2, sm: 3 }, boxSizing: "border-box", maxWidth: 1200 }}>
        <Title text="Estructura del Proceso" />
        <ContextoProcesoEntidad idProceso={idProceso} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 220px)", // Ajustado al ancho fijo de las cards
            gap: { xs: 1, sm: 1.5, md: 5 },
            justifyContent: "center", 
            width: "100%",
            boxSizing: "border-box",
            mt: 3,
          }}
        >
          {itemsFiltrados.length === 0 ? (
            <Typography
              variant="body1"
              sx={{ gridColumn: "1 / -1", opacity: 0.7, textAlign: "center", width: "100%" }}
            >
              No tienes acceso a módulos de este proceso con el rol actual.
            </Typography>
          ) : (
            itemsFiltrados.map((item) => (
              <MenuCard
                key={item.key}
                icon={item.icon}
                title={item.title}
                aria-label={item.title}
                onClick={() => navigate(item.path)}
              />
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProcessStructure;