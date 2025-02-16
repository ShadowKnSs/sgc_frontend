import React from "react";
import { FaSearch, FaUser } from "react-icons/fa"; // Import icons
import "../css/Header.css"; // Estilos
import image from "../assests/UASLP_Logo.png"; // Ruta de tu logo


function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <img src={image} alt="Logo" className="logo" />
        <h1 className="company-name">Sistema de Gestión de Calidad</h1>
      </div>
      
      {/* <div className="header-center">
        <input type="text" placeholder="Buscar" className="search-bar" />
        <FaSearch className="search-icon" />
      </div> */}
      
      
      <div className="header-right">
        <a href="" className="header-link">
          <FaUser className="user-icon-hover" />
        </a>
      </div>
    </header>
  );
}

export default Header;
