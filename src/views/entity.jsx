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
import { useNavigate } from "react-router-dom";

const Entity = () => {
  const navigate = useNavigate();
  const menuItems = [
    { icon: <BookIcon />, title: "Facultad de Enfermería ", path: "/estructura-procesos" },
    { icon: <LanguageIcon />, title: "Unidad Academica Multidisciplinaria Region Altiplano", path: "/estructura-procesos" },
    { icon: <PeopleIcon />, title: "Facultad de Ingeniería ", path: "/estructura-procesos" },
    { icon: <AccountTreeIcon />, title: "Facultad de Ciencias Sociales y Humanidades", path: "/estructura-procesos" },
    { icon: <DescriptionIcon />, title: "Facultad de Agronomía y Veterinaria " , path: "/estructura-procesos"},
    { icon: <VerifiedUserIcon />, title: "Facultad de Estudios Profesionales Zona Huasteca", path: "/estructura-procesos" },
    { icon: <SupervisorAccountIcon />, title: "Facultad de Ciencias de la Comunicación", path: "/estructura-procesos" },
    { icon: <BarChartIcon />, title: "Coordinación Académica Región Altiplano Oeste", path: "/estructura-procesos" },
    { icon: <DescriptionIcon />, title: "Facultad de Agronomía y Veterinaria ", path: "/estructura-procesos" },
    { icon: <VerifiedUserIcon />, title: "Facultad de Estudios Profesionales Zona Huasteca", path: "/estructura-procesos" },
    { icon: <SupervisorAccountIcon />, title: "Facultad de Ciencias de la Comunicación", path: "/estructura-procesos" },
    { icon: <BarChartIcon />, title: "Coordinación Académica Región Altiplano Oeste", path: "/estructura-procesos" },
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
        <MenuCard
          key={index}
          icon={item.icon}
          title={item.title}
          onClick={() => {
            if (item.path) {
              navigate(item.path);
            }
          }}
        />
      ))}
    </Box>
  );
};

export default Entity;
