// 📁 src/views/ProcessStructure.jsx
import React, { useMemo } from "react";
import { Box } from "@mui/material";
import MenuCard from "../components/menuCard";
import BookIcon from "@mui/icons-material/Book";
import WarningIcon from "@mui/icons-material/Warning";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DescriptionIcon from "@mui/icons-material/Description";
import LinkIcon from "@mui/icons-material/Link";
import { useNavigate, useParams } from "react-router-dom";
import ContextoProcesoEntidad from "../components/ProcesoEntidad";
import { motion } from "framer-motion";

const ProcessStructure = () => {
  const navigate = useNavigate();
  const { idProceso } = useParams();
  const rolActivo = JSON.parse(localStorage.getItem("rolActivo"));
  const permisos = rolActivo?.permisos?.map((p) => p.modulo) || [];

  const menuItems = useMemo(() => [
    { icon: <BookIcon />, title: "Manual Operativo", path: `/manual-operativo/${idProceso}` },
    { icon: <WarningIcon />, title: "Gestión de Riesgo", path: `/carpetas/${idProceso}/Gestión de Riesgo` },
    { icon: <InsertDriveFileIcon />, title: "Análisis de Datos", path: `/carpetas/${idProceso}/Análisis de Datos` },
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
        height: "100vh",
        paddingTop: 4,
      }}
    >
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
