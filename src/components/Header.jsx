import React, { useState } from 'react';
import { FaUser , FaBell} from "react-icons/fa"; // Import icons
import { Link } from "react-router-dom"; // Import Link
import "../css/Header.css"; // Estilos
import image from "../assests/UASLP_Logo.png"; // Ruta de tu logo
import DialogNotifications from "./Modals/DialogNotifications";

function Header() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src={image} alt="Logo" className="logo" />
        {/* Se envuelve el texto en Link para redireccionar a la ruta welcome */}
        <h1 className="company-name">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Sistema de Gestión de Calidad
          </Link>
        </h1>
      </div>

      {/* <div className="header-center">
        <input type="text" placeholder="Buscar" className="search-bar" />
        <FaSearch className="search-icon" />
      </div> */}

      <div className="header-right">
      <a href="#" className="header-link" onClick={handleOpenDialog}>
          <FaBell className="notification-icon" />
        </a>
        <a href="" className="header-link">
          <FaUser className="user-icon-hover" />
        </a>
      </div>
      {/* El diálogo de notificaciones */}
      <DialogNotifications open={openDialog} onClose={handleCloseDialog} />
    </header>
  );
}

export default Header;
