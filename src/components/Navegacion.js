import React from "react";
import "../styles/Navegacion.css"; // Crea un archivo CSS para la navegación

function Navegacion() {
  return (
    <nav className="nav">
      <ul className="nav-list">
        <li><a href="#procesos">Procesos</a></li>
        <li><a href="#cronograma">Cronograma</a></li>
        <li><a href="#auditoria">Auditoría</a></li>
      </ul>
    </nav>
  );
}

export default Navegacion;
