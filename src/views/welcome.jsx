/*
 ¿Me perdonas? ❤️
 Contigo tengo todo lo que necesito.

*/


/**
 * Componente: Welcome
 * Descripción:
 * Esta vista es el menú principal del sistema de gestión de calidad.
 * Muestra accesos (cards) a distintos módulos, filtrados según los permisos del rol activo del usuario.
 * Si el usuario es "Invitado", se redirige automáticamente a la sección de Noticias.
 * Si el usuario es "Líder", se consulta su proceso asignado para incluir la opción "Mi Proceso".
 * Además, si el acceso fue mediante token temporal, se ocultan ciertas tarjetas como el Cronograma.
 */

import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import MenuCard from "../components/menuCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Title from "../components/Title";

// Iconos del menú
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
  const defaultRol = {
    nombreRol: "Invitado",
    permisos: ["Manual de Calidad", "Noticias"]
  };

  // Obtiene el rol activo desde localStorage o usa el rol por defecto
  const rolActivo = JSON.parse(localStorage.getItem("rolActivo") || JSON.stringify(defaultRol));
  const viaToken = localStorage.getItem("viaToken") === "true"; // Sesión con token temporal
  const permisos = rolActivo?.permisos?.map(p => p.modulo || p) || [];

  // Información del usuario desde localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const idUsuario = usuario?.idUsuario || 0;

  const [procesoLider, setProcesoLider] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lista de tarjetas de menú disponibles
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

  const getTituloPanel = () => {
    switch (rolActivo?.nombreRol) {
      case "Administrador":
        return "Panel de Administrador";
      case "Líder":
        return "Panel de Líder de Proceso";
      case "Supervisor":
        return "Panel de Supervisor";
      case "Auditor":
        return "Panel de Auditor";
      case "Personal Operativo":
        return "Panel del Personal Operativo";
      default:
        return `Panel de ${rolActivo?.nombreRol || "Usuario"}`;
    }
  };

  // Filtra las cards según los permisos del rol
  let itemsFiltrados = menuItems.filter(item => permisos.includes(item.title));

  // Si el rol es "Líder", añade su proceso
  if (rolActivo?.nombreRol === "Líder" && procesoLider?.idProceso) {
    itemsFiltrados.push({
      icon: <AddHomeWorkOutlinedIcon />,
      title: "Mi Proceso",
      path: `/estructura-procesos/${procesoLider.idProceso}`
    });
  }

  // Si la sesión se realizó mediante token, se oculta "Cronograma"
  if (viaToken) {
    itemsFiltrados = itemsFiltrados.filter(item => item.title !== "Cronograma");
  }

  // Si es invitado, redirige automáticamente a Noticias
  useEffect(() => {
    if (rolActivo?.nombreRol === "Invitado") {
      navigate("/user-eventos");
    }
  }, [rolActivo, navigate]);

  // Si es líder, consulta su proceso asignado
  useEffect(() => {
    if (usuario?.idUsuario && rolActivo?.nombreRol === "Líder") {
      axios
        .get(`http://localhost:8000/api/proceso-usuario/${usuario.idUsuario}`)
        .then(res => {
          setProcesoLider(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error al obtener proceso:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Evita renderizar si es invitado
  if (rolActivo?.nombreRol === "Invitado") return null;

  // Muestra loader mientras se obtienen los datos
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
        gap: 5,
        placeItems: "center",
        justifyContent: "center",
        alignContent: "start",
        minHeight: "calc(100vh - 100px)",
        padding: "20px",
        marginTop: "10px",
        marginBottom: "20px",
      }}
    >
      {/* Aquí agregamos el título */}
      <Box sx={{ gridColumn: "1 / -1", marginBottom: "0px",}}>
        <Title text={getTituloPanel()} />
      </Box>
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
