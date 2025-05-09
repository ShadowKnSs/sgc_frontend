import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import "../css/Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <span>Dirección Institucional de Gestión de Calidad</span>
          <span>Av. Dr. Manuel Nava 201, planta baja, Zona universitaria, San Luis Potosí, México</span>
          <span>San Luis Potosí, S.L.P.</span>
          <span>444 826 2300 ext. 7151, 7152, 7153, 7154</span>
          <span>© {currentYear} Todos los derechos reservados</span>
        </div>
        <div className="footer-right">
        <a
            href="https://www.facebook.com/sical.uaslp/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <FaFacebook className="social-icon" />
          </a>
          <a
            href="https://www.instagram.com/sicaluaslp"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <FaInstagram className="social-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
