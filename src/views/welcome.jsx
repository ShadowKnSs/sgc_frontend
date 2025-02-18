import React from "react";
import { Box } from "@mui/material";
import MenuCard from "../components/menuCard";
import BookIcon from "@mui/icons-material/Book";
import LanguageIcon from "@mui/icons-material/Language";
import PeopleIcon from "@mui/icons-material/People";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import BarChartIcon from "@mui/icons-material/BarChart";

const Welcome = () => {
  const menuItems = [
    { icon: <BookIcon />, title: "Manual de Calidad" },
    { icon: <LanguageIcon />, title: "Manual del Sitio" },
    { icon: <PeopleIcon />, title: "Usuarios" },
    { icon: <AccountTreeIcon />, title: "Procesos" },
    { icon: <DescriptionIcon />, title: "Formatos" },
    { icon: <VerifiedUserIcon />, title: "Auditores" },
    { icon: <SupervisorAccountIcon />, title: "Supervisores" },
    { icon: <BarChartIcon />, title: "Reportes" },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 3,
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: 2,
      }}
    >
      {menuItems.map((item, index) => (
        <MenuCard key={index} icon={item.icon} title={item.title} />
      ))}
    </Box>
  );
};

export default Welcome;





