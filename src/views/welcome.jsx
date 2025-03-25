import React from "react";
import { Box } from "@mui/material";
import MenuCard from "../components/menuCard";
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import AssuredWorkloadOutlinedIcon from '@mui/icons-material/AssuredWorkloadOutlined';
import { useNavigate } from "react-router-dom";
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';

const Welcome = () => {
  const navigate = useNavigate(); 

  const menuItems = [
    { icon: <AutoStoriesOutlinedIcon />, title: "Manual de Calidad", path: "/" },
    { icon: <MenuBookOutlinedIcon />, title: "Manual del Sitio", path: "/manualDelSitio" },
    { icon: <GroupAddOutlinedIcon />, title: "Usuarios", path: "/usuarios" },
    { icon: <AccountTreeOutlinedIcon />, title: "Procesos", path: "/procesos" },
    { icon: <CampaignOutlinedIcon />, title: "Noticias", path: "/user-eventos" },
    { icon: <NewspaperOutlinedIcon />, title: "Gestión Noticias", path: "/admin-eventos" },
    { icon: <CalendarMonthOutlinedIcon />, title: "Cronograma", path: "/cronograma" },
    { icon: <AssuredWorkloadOutlinedIcon />, title: "Entidades", path: "/entidades" },
    { icon: <SummarizeOutlinedIcon />, title: "Reportes", path: "typesReports" },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, auto)", 
        gap: 8, 
        placeItems: "center", 
        justifyContent: "center",
        alignContent: "start", // Cambiado para evitar centrado absoluto
        minHeight: "calc(100vh - 100px)", // Ajusta 100px según tu header y footer
        padding: "20px",
        marginTop: "80px", // Ajusta según el tamaño del header
        marginBottom: "20px", // Ajusta según el tamaño del footer
      }}
    >
      {menuItems.map((item, index) => (
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