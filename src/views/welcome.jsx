import React from "react";
import { Box } from "@mui/material";
import MenuCard from "../components/menuCard";
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import AssuredWorkloadOutlinedIcon from '@mui/icons-material/AssuredWorkloadOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  const rolActivo = JSON.parse(localStorage.getItem("rolActivo") || "null");
  const permisos = rolActivo?.permisos?.map(p => p.modulo) || [];

  console.log("El rol es: ", rolActivo);
  console.log("Permisos", permisos);

  const menuItems = [
    { icon: <AutoStoriesOutlinedIcon />, title: "Manual de Calidad", path: "/manual-calidad" },
    { icon: <MenuBookOutlinedIcon />, title: "Manual del Sitio", path: "/manualDelSitio" },
    { icon: <GroupAddOutlinedIcon />, title: "Usuarios", path: "/usuarios" },
    { icon: <AccountTreeOutlinedIcon />, title: "Procesos", path: "/procesos" },
    { icon: <CampaignOutlinedIcon />, title: "Noticias", path: "/user-eventos" },
    { icon: <NewspaperOutlinedIcon />, title: "Gestión Noticias", path: "/admin-eventos" },
    { icon: <CalendarMonthOutlinedIcon />, title: "Cronograma", path: "/cronograma" },
    { icon: <AssuredWorkloadOutlinedIcon />, title: "Entidades", path: "/entidades" },
    { icon: <SummarizeOutlinedIcon />, title: "Reportes", path: "/typesReports" },
    { icon: <DocumentScannerIcon />, title: "Formatos", path: "/formatos" },
  ];

  const itemsFiltrados = menuItems.filter(item => permisos.includes(item.title));

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, auto)",
        gap: 8,
        placeItems: "center",
        justifyContent: "center",
        alignContent: "start",
        minHeight: "calc(100vh - 100px)",
        padding: "20px",
        marginTop: "80px",
        marginBottom: "20px",
      }}
    >
      {itemsFiltrados.map((item, index) => (
        <MenuCard
          key={index}
          icon={item.icon}
          title={item.title}
          onClick={() => navigate(item.path)}
        />
      ))}
    </Box>
  );
};

export default Welcome;
