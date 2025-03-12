import React from "react";
import { Box } from "@mui/material";
import MenuCard from "../components/menuCard";
import BookIcon from "@mui/icons-material/Book";
import WarningIcon from "@mui/icons-material/Warning";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DescriptionIcon from "@mui/icons-material/Description";
import LinkIcon from "@mui/icons-material/Link";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useNavigate, useParams } from "react-router-dom";

const ProcessStructure = () => {
  const navigate = useNavigate();
  const { idProceso } = useParams();
  console.log("id del proceso", idProceso);

  const menuItems = [
    { icon: <BookIcon />, title: "Manual Operativo", path: `/manual-operativo/${idProceso}` },
    { icon: <WarningIcon />, title: "Gestión de Riesgo", path: `/gestion-riesgosForm/${idProceso}` },
    { icon: <InsertDriveFileIcon />, title: "Análisis de Datos", path: `/analisis-DatosForm/${idProceso}` },
    // { icon: <TrendingUpIcon />, title: "Acciones de Mejora", path: `/carpeta-ActividadMejora/${idProceso}` },
    { icon: <TrendingUpIcon />, title: "Acciones de Mejora", path: `/actividad-mejora` },
    { icon: <DescriptionIcon />, title: "Generar informe de auditoría", path: `/manual-operativo/${idProceso}` },
    { icon: <LinkIcon />, title: "Seguimiento", path: `/seguimiento/${idProceso}` },
    { icon: <BarChartIcon />, title: "Indicadores", path: `/indicadores/${idProceso}` },
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
        <MenuCard key={index} icon={item.icon} title={item.title} sx={{ textAlign: "center" }} onClick={() => navigate(item.path)} />
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
          <MenuCard key={index + 4} icon={item.icon} title={item.title} sx={{ textAlign: "center" }} onClick={() => navigate(item.path)} />
        ))}
      </Box>
    </Box>
  );
};

export default ProcessStructure;
