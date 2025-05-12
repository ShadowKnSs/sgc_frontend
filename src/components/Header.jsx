import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUser, FaBell, FaSignOutAlt } from "react-icons/fa"; // Import icons
import { Link } from "react-router-dom"; // Import Link
import axios from 'axios';
import { Drawer, List, ListItem, ListItemText, IconButton, Badge, Divider, Box, Typography, ListItemButton } from '@mui/material';
import { FaBars } from 'react-icons/fa';
import "../css/Header.css"; // Estilos
import image from "../assests/UASLP_Logo.png"; // Ruta de tu logo
import DialogNotifications from "./Modals/DialogNotifications";

const colorPalette = {
  azulOscuro: "#185FA4",
  azulClaro: "#68A2C9",
  azulCielo: "#2dc1df",
  verdeAgua: "#BBD8D7",
  verdeClaro: "#DFECDF",
  verdePastel: "#E3EBDA",
  grisClaro: "#DEDFD1",
  grisOscuro: "#A4A7A0",
};

const menuItems = [
  { title: "Manual de Calidad", path: "/manual-calidad" },
  { title: "Manual del Sitio", path: "/manualDelSitio" },
  { title: "Usuarios", path: "/usuarios" },
  { title: "Gestión de Procesos", path: "/procesos" },
  { title: "Noticias", path: "/user-eventos" },
  { title: "Gestión Noticias", path: "/admin-eventos" },
  { title: "Cronograma", path: "/cronograma" },
  { title: "Entidades", path: "/entidades" },
  { title: "Reportes", path: "/typesReports" },
  { title: "Formatos", path: "/formatos" },
  { title: "Supervisor", path: "/busca_supervisor" },
  { title: "Auditores", path: "/auditores" },
  { title: "Gestión Entidades", path: "/gestion-entidades" }
];

function Header() {
  const [openDialog, setOpenDialog] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const idUsuario = usuario?.idUsuario || 0;
  const isLoggedIn = usuario !== null;
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const defaultRol = {
    nombreRol: "Invitado",
    permisos: ["Manual de Calidad", "Noticias"]
  };

  const rolActivo = JSON.parse(localStorage.getItem("rolActivo") || JSON.stringify(defaultRol));
  const viaToken = localStorage.getItem("viaToken") === "true";

  const permisos = rolActivo?.permisos?.map(p => p.modulo || p) || [];
  const [procesoLider, setProcesoLider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nombreCompleto, setNombreCompleto] = useState("");

  useEffect(() => {
    if (idUsuario) {
      axios.get(`http://localhost:8000/api/usuario/${idUsuario}`)
        .then(response => {
          setNombreCompleto(response.data.nombreCompleto);
        })
        .catch(error => {
          console.error("Error al obtener el nombre del usuario:", error);
        });
    }
  }, [idUsuario]);

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

  useEffect(() => {
    axios.get('http://localhost:8000/api/notificaciones/count/${idUsuario}')
      .then(response => {
        setNotificationCount(response.data.notificacionesNoLeidas);
      })
      .catch(error => {
        console.error('Error al obtener el conteo de notificaciones:', error);
      });
  }, [idUsuario]);

  // Se filtran los items por permisos
  let itemsFiltrados = menuItems.filter(item => permisos.includes(item.title));

  // Filtro adicional si la sesión fue vía token
  if (viaToken) {
    itemsFiltrados = itemsFiltrados.filter(item => item.title !== "Cronograma");
  }


  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setMenuOpen(open);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("roles");
    localStorage.removeItem("rolActivo");
    navigate("/login");
  };


  if (rolActivo?.nombreRol === "Líder" && procesoLider?.idProceso) {
    itemsFiltrados.push({
      title: "Mi Proceso",
      path: `/estructura-procesos/${procesoLider.idProceso}`
    });
  }

  useEffect(() => {
    if (!idUsuario) return;
    axios.get(`http://localhost:8000/api/notificaciones/count/${idUsuario}`)
    .then(response => {
        setNotificationCount(response.data.notificacionesNoLeidas);
      })
      .catch(error => {
        console.error('Error al obtener el conteo de notificaciones:', error);
      });
  }, [idUsuario]);
  const menuList = (
  <Box sx={{ width: 280, height: '100%' }}>
    <Box sx={{ p: 2, textAlign: 'center', backgroundColor: colorPalette.azulOscuro }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
        {nombreCompleto || "Usuario"}
      </Typography>
    </Box>
     <Box sx={{ height: '8px', backgroundColor: colorPalette.azulCielo}} />

    <Divider />

    <List>
      {itemsFiltrados.map((item, index) => (
        <ListItemButton
          key={index}
          onClick={() => {
            navigate(item.path);
            setMenuOpen(false);
          }}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 1,
            my: 0.5,
            mx: 1,
            '&:hover': {
              backgroundColor: colorPalette.azulClaro,
              color: 'white',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <ListItemText
            primary={item.title}
            primaryTypographyProps={{
              fontSize: 16,
              fontWeight: 500,
            }}
          />
        </ListItemButton>
      ))}
    </List>
  </Box>
);

  return (
    <header className="header">
      <div className="header-left">
        <img src={image} alt="Logo" className="logo" />
        <h1 className="company-name">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Sistema de Gestión de Calidad
          </Link>
        </h1>
      </div>

      <div className="header-right">
        <IconButton onClick={handleOpenDialog} className="header-link">
          <Badge
            badgeContent={notificationCount}
            color="error"
            sx={{
              '& .MuiBadge-badge': { right: 22, top: 2, fontSize: '0.75rem' }
            }}
          >
            <FaBell className="notification-icon" />
          </Badge>
        </IconButton>

        {isLoggedIn ? (
          <IconButton onClick={handleLogout} className="header-link">
            <FaSignOutAlt className="user-icon-hover" />
          </IconButton>
        ) : (
          <IconButton onClick={() => navigate("/login")} className="header-link">
            <FaUser className="user-icon-hover" />
          </IconButton>
        )}
        {rolActivo && rolActivo.nombreRol !== "Invitado" && rolActivo.nombreRol !== "Administrador" && (
          <IconButton onClick={toggleDrawer(true)} className="header-link">
            <FaBars  className='menu-icon'/>
          </IconButton>
        )}


      </div>
      <DialogNotifications open={openDialog} onClose={handleCloseDialog} idUsuario={idUsuario} />
      <Drawer anchor="left" open={menuOpen} onClose={toggleDrawer(false)}>
        {menuList}
      </Drawer>

    </header>
  );
}

export default Header;