import React from "react";
import { Box } from "@mui/material";
import MenuCard from "../components/menuCard";
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';

const Welcome = () => {
  const menuItems = [
    { icon: <AutoStoriesOutlinedIcon />, title: "Manual de Calidad" },
    { icon: <MenuBookOutlinedIcon />, title: "Manual del Sitio" },
    { icon: <GroupAddOutlinedIcon />, title: "Usuarios" },
    { icon: <AccountTreeOutlinedIcon />, title: "Procesos" },
    { icon: <DescriptionOutlinedIcon />, title: "Formatos" },
    { icon: <VerifiedUserOutlinedIcon />, title: "Auditores" },
    { icon: <SupervisorAccountOutlinedIcon />, title: "Supervisores" },
    { icon: <InsertChartOutlinedIcon />, title: "Reportes" },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, auto)", 
        gap: 8, 
        placeItems: "center", 
        justifyContent: "center",
        alignContent: "center",
        height: "100vh",
        width: "100%", 
      }}
    >
      {menuItems.map((item, index) => (
        <MenuCard key={index} icon={item.icon} title={item.title} />
      ))}
    </Box>
  );
};

export default Welcome;





