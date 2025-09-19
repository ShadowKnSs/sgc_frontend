import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUser, FaBell, FaSignOutAlt, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  IconButton,
  Badge,
  Tooltip, Snackbar, Alert
} from '@mui/material';
import "../css/Header.css";
import image from "../assests/UASLP_Logo.png";
import DialogNotifications from "./Modals/DialogNotifications";
import MenuDrawer from "./MenuDrawer";
import { useUserData } from '../hooks/useUserData';
import { useNotifications } from '../hooks/useNotifications';
import { menuItems, colorPalette } from '../data/headerConfig';
import axios from 'axios';


function Header() {
  const [openDialog, setOpenDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [procesoLider, setProcesoLider] = useState(null);
  const [toast, setToast] = useState({ open: false, text: "", type: "warning" });
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const idUsuario = usuario?.idUsuario || 0;
  const isLoggedIn = usuario !== null;
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const tieneMultiplesRoles = roles.length > 1;

  const defaultRol = {
    nombreRol: "Invitado",
    permisos: ["Manual de Calidad", "Noticias"]
  };

  const rolActivo = JSON.parse(localStorage.getItem("rolActivo") || JSON.stringify(defaultRol));
  const viaToken = localStorage.getItem("viaToken") === "true";
  const permisos = rolActivo?.permisos?.map(p => p.modulo || p) || [];

  const nombreCompleto = useUserData(idUsuario);
  const notificationCount = useNotifications(idUsuario, rolActivo);
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario?.idUsuario && rolActivo?.nombreRol === "Líder") {
      axios
        .get(`http://localhost:8000/api/proceso-usuario/${usuario.idUsuario}`)
        .then(res => {
          setProcesoLider(res.data);
        })
        .catch(err => {
          console.error("Error al obtener proceso:", err);
        });
    }
  }, [rolActivo?.nombreRol]);

  // Filtrar items del menú
  const itemsFiltrados = useMemo(() => {
    let items = menuItems.filter(item => permisos.includes(item.title));
    if (viaToken) {
      items = items.filter(item => item.title !== "Cronograma");
    }
    if (rolActivo?.nombreRol === "Líder" && procesoLider?.idProceso) {
      if (!viaToken && !items.some(i => i.title === "Cronograma")) {
        items.push({ title: "Cronograma", path: "/cronograma" });
      }
      const disabled = procesoLider?.estado !== "Activo";
      items.push({
        title: "Mi Proceso",
        path: disabled ? null : `/estructura-procesos/${procesoLider.idProceso}`,
        disabled,
        hint: disabled ? "Tu proceso está deshabilitado. Contacta al supervisor." : null
      });
    }
    return items;
  }, [permisos, viaToken, rolActivo?.nombreRol, procesoLider]);

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
    localStorage.removeItem("viaToken");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <img src={image} alt="Logo UASLP" className="logo" />
        </Link>
        <h1 className="company-name">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Sistema de Gestión de Calidad
          </Link>
        </h1>
      </div>

      <div className="header-right">
        {rolActivo?.nombreRol !== "Administrador" && (
          <Tooltip title="Notificaciones" arrow>
            <IconButton onClick={handleOpenDialog} className="header-link">
              <Badge
                badgeContent={notificationCount}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    right: 22,
                    top: 2,
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }
                }}
              >
                <FaBell className="notification-icon" />
              </Badge>
            </IconButton>
          </Tooltip>
        )}

        {isLoggedIn ? (
          <Tooltip title="Cerrar sesión" arrow>
            <IconButton onClick={handleLogout} className="header-link">
              <FaSignOutAlt className="user-icon-hover" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Iniciar sesión" arrow>
            <IconButton onClick={() => navigate("/login")} className="header-link">
              <FaUser className="user-icon-hover" />
            </IconButton>
          </Tooltip>
        )}

        {rolActivo && rolActivo.nombreRol !== "Invitado" && (
          <Tooltip title="Menú de navegación" arrow>
            <IconButton onClick={() => setMenuOpen(true)} className="header-link">
              <FaBars className='menu-icon' />
            </IconButton>
          </Tooltip>
        )}
      </div>

      <DialogNotifications
        open={openDialog}
        onClose={handleCloseDialog}
        idUsuario={idUsuario}
      />

      <MenuDrawer
        open={menuOpen}
        onClose={setMenuOpen}
        itemsFiltrados={itemsFiltrados}
        tieneMultiplesRoles={tieneMultiplesRoles}
        nombreCompleto={nombreCompleto}
        rolActivo={rolActivo}
        colorPalette={colorPalette}
        navigate={navigate}
        onDisabledClick={(item) =>
         setToast({ open: true, text: item.hint || "El proceso está deshabilitado.", type: "warning" })
       }
      />

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.type} onClose={() => setToast({ ...toast, open: false })}>
          {toast.text}
        </Alert>
      </Snackbar>
    </header>
  );
}

export default Header;