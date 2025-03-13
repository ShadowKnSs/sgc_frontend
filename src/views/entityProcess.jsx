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

const EntityP = () => {
  const menuItems = [
    { icon: <BookIcon />, title: "Facultad de Enfermería ", path: "/estructura-procesos" },
    { icon: <LanguageIcon />, title: "Facultad de Economía " },
    { icon: <PeopleIcon />, title: "Facultad de Ingeniería " },
    { icon: <AccountTreeIcon />, title: "Facultad de Ciencias Sociales y Humanidades" },
    { icon: <DescriptionIcon />, title: "Facultad de Agronomía y Veterinaria " },
    { icon: <VerifiedUserIcon />, title: "Facultad de Derecho " },
    { icon: <SupervisorAccountIcon />, title: "Facultad de Ciencias de la Comunicación " },
    { icon: <BarChartIcon />, title: "Facultad de Ciencias Químicas " },
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

export default EntityP;



