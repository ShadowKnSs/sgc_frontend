import React, { useEffect, useState } from "react";
import { Box, CircularProgress} from "@mui/material";
import MenuCard from "../components/menuCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Importación de íconos para las tarjetas del menú
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


const Welcome = () => {
  const navigate = useNavigate();

  // Rol por defecto si no hay sesión activa
  // FUTURO: Este rol por defecto aplica si no hay sesión activa. 
  // Puede ser modificado si se desea mostrar diferentes permisos por defecto al público.
 
  const defaultRol = {
    nombreRol: "Invitado", // Asume rol "Invitado" si no hay rol en localStorage
    permisos: ["Manual de Calidad", "Noticias"]
  };

  // Se lee el rol desde localStorage o usa el default
  const rolActivo = JSON.parse(localStorage.getItem("rolActivo") || JSON.stringify(defaultRol));

  // Bandera para saber si el acceso se hizo mediante token temporal usado para auditores externos
  const viaToken = localStorage.getItem("viaToken") === "true";

  // Lista de permisos disponibles para el rol activo
  const permisos = rolActivo?.permisos?.map(p => p.modulo || p) || [];
  // Se obtiene el usuario para extraer el idUsuario
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const idUsuario = usuario?.idUsuario || 0;

  const [procesoLider, setProcesoLider] = useState(null);
  const [loading, setLoading] = useState(true);


  console.log("El rol es:", rolActivo);
  console.log("Permisos", permisos);
  console.log("idUsuario", idUsuario);
  console.log("Sesión vía token:", viaToken);

  const menuItems = [
    { icon: <AutoStoriesOutlinedIcon />, title: "Manual de Calidad", path: "/manual-calidad" },
    { icon: <MenuBookOutlinedIcon />, title: "Manual del Sitio", path: "/manualDelSitio" },
    { icon: <GroupAddOutlinedIcon />, title: "Usuarios", path: "/usuarios" },
    { icon: <AccountTreeOutlinedIcon />, title: "Gestión de Procesos", path: "/procesos" },
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

  if (rolActivo?.nombreRol === "Líder" && procesoLider?.idProceso) {
    itemsFiltrados.push({
      icon: <AddHomeWorkOutlinedIcon />,
      title: "Mi Proceso",
      path: `/estructura-procesos/${procesoLider.idProceso}`
    });
  }
  

  // Si la sesión se inició con token, se quita la card de "Cronograma"
  if (viaToken) {
    itemsFiltrados = itemsFiltrados.filter(item => item.title !== "Cronograma");
  }

// Redirección automática si el usuario no tiene sesión (Personal Operativo / Invitado)
useEffect(() => {
    if (rolActivo?.nombreRol === "Invitado") {
      navigate("/user-eventos"); // ← Lleva directamente a las noticias
    }
  }, [rolActivo, navigate]);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario?.idUsuario && rolActivo?.nombreRol === "Líder") {
      axios
        .get(`http://localhost:8000/api/proceso-usuario/${usuario.idUsuario}`)
        .then(res => {
          setProcesoLider(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error al obtener proceso:", err);
          setLoading(false); // Asegúrate de quitar el loading aunque falle
        });
    } else {
      setLoading(false); // Si no es líder, también termina el loading
    }
  }, []);
  
  
  if (rolActivo?.nombreRol === "Invitado") return null; // ← Evita renderizar cards

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress size={60} thickness={5} color="primary" />
      </Box>
    );
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
