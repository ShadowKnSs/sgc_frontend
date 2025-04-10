import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUser, FaBell, FaSignOutAlt } from "react-icons/fa"; // Import icons
import { Link } from "react-router-dom"; // Import Link
import axios from 'axios';
import { Badge, IconButton } from '@mui/material';
import "../css/Header.css"; // Estilos
import image from "../assests/UASLP_Logo.png"; // Ruta de tu logo
import DialogNotifications from "./Modals/DialogNotifications";

function Header() {
  const [openDialog, setOpenDialog] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  // const idUsuario = 5; // Fijo, pero luego irá dinámico con auth 
  
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const idUsuario = usuario?.idUsuario || 0;
  const isLoggedIn = usuario !== null;
  const navigate = useNavigate();


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

  useEffect(() => {
    axios.get(`http://localhost:8000/api/notificaciones/count/${idUsuario}`)
      .then(response => {
        setNotificationCount(response.data.notificacionesNoLeidas);
      })
      .catch(error => {
        console.error('Error al obtener el conteo de notificaciones:', error);
      });
  }, [idUsuario]);

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
      </div>


      <DialogNotifications open={openDialog} onClose={handleCloseDialog} idUsuario={idUsuario} />
    </header>
  );
}

export default Header;