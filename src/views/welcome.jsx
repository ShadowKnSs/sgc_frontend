import React from "react";
import { Box } from "@mui/material";
import MenuCard from "../components/MenuCard";
import BookIcon from "@mui/icons-material/Book";
import LanguageIcon from "@mui/icons-material/Language";
import PeopleIcon from "@mui/icons-material/People";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import BarChartIcon from "@mui/icons-material/BarChart";
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import AssuredWorkloadOutlinedIcon from '@mui/icons-material/AssuredWorkloadOutlined';
import { useNavigate } from "react-router-dom";


const Welcome = () => {
  const navigate = useNavigate(); 
  const menuItems = [
    { icon: <AutoStoriesOutlinedIcon />, title: "Manual de Calidad", path: "/operational-manual" },
    { icon: <MenuBookOutlinedIcon />, title: "Manual del Sitio", path: "/manual-sitio" },
    { icon: <GroupAddOutlinedIcon />, title: "Usuarios", path: "/usuarios" },
    { icon: <AccountTreeOutlinedIcon />, title: "Procesos", path: "/procesos" },
    { icon: <VerifiedUserOutlinedIcon />, title: "Auditores", path: "/auditores" },
    { icon: <SupervisorAccountOutlinedIcon />, title: "Supervisores", path: "/supervisores" },
    { icon: <InsertChartOutlinedIcon />, title: "Reportes", path: "/reportes" },
    { icon: <AssuredWorkloadOutlinedIcon />, title: "Entidades", path: "/entidades" },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, auto)", 
        gap: 8, 
        placeItems: "center", 
        gridTemplateColumns: "repeat(4, auto)", 
        gap: 8, 
        placeItems: "center", 
        justifyContent: "center",
        alignContent: "center",
        alignContent: "center",
        height: "100vh",
        width: "100%", 
        width: "100%", 
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