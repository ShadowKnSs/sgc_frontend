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


const Entity = () => {
  const menuItems = [
    { icon: <BookIcon />, title: "Facultad de Enfermería " },
    { icon: <LanguageIcon />, title: "Unidad Academica Multidisciplinaria Region Altiplano" },
    { icon: <PeopleIcon />, title: "Facultad de Ingeniería " },
    { icon: <AccountTreeIcon />, title: "Facultad de Ciencias Sociales y Humanidades" },
    { icon: <DescriptionIcon />, title: "Facultad de Agronomía y Veterinaria " },
    { icon: <VerifiedUserIcon />, title: "Facultad de Estudios Profesionales Zona Huasteca" },
    { icon: <SupervisorAccountIcon />, title: "Facultad de Ciencias de la Comunicación" },
    { icon: <BarChartIcon />, title: "Coordinación Académica Región Altiplano Oeste" },
    { icon: <DescriptionIcon />, title: "Facultad de Agronomía y Veterinaria " },
    { icon: <VerifiedUserIcon />, title: "Facultad de Estudios Profesionales Zona Huasteca" },
    { icon: <SupervisorAccountIcon />, title: "Facultad de Ciencias de la Comunicación" },
    { icon: <BarChartIcon />, title: "Coordinación Académica Región Altiplano Oeste" },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(5, auto)", 
        gap: 8, 
        placeItems: "center", 
        justifyContent: "center",
        textAlign: "center",
        minHeight: "100vh", 
        paddingTop: "80px", 
        paddingBottom: "40px", 
        width: "100%",
      }}
    >
      {menuItems.map((item, index) => (
        <MenuCard key={index} icon={item.icon} title={item.title} />
      ))}
    </Box>
  );
};

export default Entity;





