import React from "react";
import { Box } from "@mui/material";
import MenuCard from "../components/MenuCard";
import BookIcon from "@mui/icons-material/Book";
import WarningIcon from "@mui/icons-material/Warning";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DescriptionIcon from "@mui/icons-material/Description";
import LinkIcon from "@mui/icons-material/Link";
import BarChartIcon from "@mui/icons-material/BarChart";

const ProcessStructure = () => {
  const menuItems = [
    { icon: <BookIcon />, title: "Manual Operativo" },
    { icon: <WarningIcon />, title: "Gestión de Riesgo" },
    { icon: <InsertDriveFileIcon />, title: "Análisis de Datos" },
    { icon: <TrendingUpIcon />, title: "Acciones de Mejora" },
    { icon: <DescriptionIcon />, title: "Generar informe de auditoria" },
    { icon: <LinkIcon />, title: "Seguimiento" },
    { icon: <BarChartIcon />, title: "Indicadores" },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 10,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: 0,
        maxWidth: "900px",
        margin: "auto",
      }}
    >
      {menuItems.slice(0, 4).map((item, index) => (
        <MenuCard key={index} icon={item.icon} title={item.title} sx={{ textAlign: "center" }} />
      ))}
      <Box
        sx={{
          gridColumn: "span 4",
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginTop: -30,
        }}
      >
        {menuItems.slice(4).map((item, index) => (
          <MenuCard key={index + 4} icon={item.icon} title={item.title} sx={{ textAlign: "center" }} />
        ))}
      </Box>
    </Box>
  );
};

export default ProcessStructure;
