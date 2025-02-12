import React from "react";
import "../styles/Interfaz1.css";
import { FaSearch, FaUser } from "react-icons/fa";
import image from "../img/UASLP_Logo.png";
import Navegacion from "./Navegacion";

function Interfaz1() {
  return (
    <div className="container">
      {/* Cabecera */}
      <header className="header">
        <div className="header-left">
          <img src={image} alt="Logo" className="logo" />
          <h1 className="company-name">Sistema de Gestión de Calidad</h1>
        </div>
        <div className="header-center">
          <input type="text" placeholder="Buscar" className="search-bar" />
          <FaSearch className="search-icon" />
        </div>
        <div className="header-right">
          
        </div>
      </header>
      
      {/* Navegación */}
      <Navegacion/>
      
      {/* Contenido Principal */}
      <main className="main-content">
        <section className="dashboard">
          <h2>Bienvenido al Sistema de Gestión de Calidad</h2>
          <p>Seleccione una opción en el menú para comenzar.</p>
        </section>
      </main>
    </div>
  );
}

export default Interfaz1;
