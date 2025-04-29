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
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AddHomeWorkOutlinedIcon from '@mui/icons-material/AddHomeWorkOutlined';
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  // Definir un rol por defecto en caso de que no se encuentre en localStorage
  const defaultRol = {
    nombreRol: "Invitado",
    permisos: ["Manual de Calidad", "Noticias"]
  };
  const rolActivo = JSON.parse(localStorage.getItem("rolActivo") || JSON.stringify(defaultRol));
  
  // Se obtiene el usuario para extraer el idUsuario
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const idUsuario = usuario?.idUsuario || 0;
  
  // Flag que indica si se inició sesión mediante token
  const viaToken = localStorage.getItem("viaToken") === "true";

  // Se asume que rolActivo.permisos es un arreglo de objetos o de cadenas.
  // Si son objetos se extrae la propiedad "modulo". Si son cadenas se usa directamente.
  const permisos = rolActivo?.permisos?.map(p => p.modulo || p) || [];

  console.log("El rol es:", rolActivo);
  console.log("Permisos", permisos);
  console.log("idUsuario", idUsuario);
  console.log("Sesión vía token:", viaToken);

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
    { icon: <PersonSearchIcon />, title: "Supervisor", path: "/busca_supervisor" },
    { icon: <PersonSearchIcon />, title: "Auditores", path: "/auditores" },
    { icon: <AddHomeWorkOutlinedIcon />, title: "Gestión Entidades", path: "/gestion-entidades" },
  ];

  // Filtra los ítems según los permisos del usuario
  let itemsFiltrados = menuItems.filter(item => permisos.includes(item.title));

  // Si la sesión se inició con token, se quita la card de "Cronograma"
  if (viaToken) {
    itemsFiltrados = itemsFiltrados.filter(item => item.title !== "Cronograma");
  }

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
