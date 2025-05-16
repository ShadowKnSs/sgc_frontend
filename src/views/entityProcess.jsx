/**
 * Componente: EntityP
 * Ubicación: src/views/EntityP.jsx
 *
 * Descripción:
 * Este componente renderiza un **menú visual en formato grid** que representa distintas entidades o facultades
 * de una institución (como la UASLP). Cada facultad es mostrada como una tarjeta (`MenuCard`) con un ícono representativo.
 *
 * Estructura:
 * - Utiliza el componente `MenuCard` para mostrar el título e ícono de cada facultad.
 * - `menuItems`: arreglo de objetos que contienen:
 *   - `icon`: ícono visual de la facultad (usando `@mui/icons-material`)
 *   - `title`: nombre de la facultad
 *   - `path`: (opcional) ruta de navegación si se desea implementar clic
 *
 * Estilos:
 * - Se emplea `Box` de MUI con `gridTemplateColumns: "repeat(4, 1fr)"` para mostrar 4 columnas por fila.
 * - Espaciado controlado con `gap: 3` y `padding: 2`.
 * - Ocupa toda la altura de la pantalla (`height: 100vh`) para un diseño centralizado.
 *
 * Dependencias:
 * - MUI (`@mui/material`) y Material Icons (`@mui/icons-material`)
 * - Componente personalizado `MenuCard`
 *
 * Consideraciones:
 * - Actualmente, solo el primer ítem (`Facultad de Enfermería`) tiene una propiedad `path` para navegación.
 *   Se puede expandir para incluir navegación completa.
 * - `MenuCard` debe manejar internamente la lógica de redirección si `path` está presente.
 *
 * Mejoras sugeridas:
 * - Implementar navegación al hacer clic en cada tarjeta.
 * - Añadir control de permisos según usuario (por ejemplo, restringir acceso a ciertas facultades).
 * - Cargar el listado de facultades desde un backend para mayor escalabilidad.
 */

import React from "react";
import { Box } from "@mui/material";
import MenuCard from "../components/menuCard";
import BookIcon from "@mui/icons-material/Book";
import LanguageIcon from "@mui/icons-material/Language";
import PeopleIcon from "@mui/icons-material/People";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import BarChartIcon from "@mui/icons-material/BarChart";

const EntityP = () => {
  const menuItems = [
    { icon: <BookIcon />, title: "Facultad de Enfermería ", path: "/estructura-procesos" },
    { icon: <LanguageIcon />, title: "Facultad de Economía " },
    { icon: <PeopleIcon />, title: "Facultad de Ingeniería " },
    { icon: <AccountTreeIcon />, title: "Facultad de Ciencias Sociales y Humanidades" },
    { icon: <DescriptionIcon />, title: "Facultad de Agronomía y Veterinaria " },
    { icon: <VerifiedUserIcon />, title: "Facultad de Derecho " },
    { icon: <SupervisorAccountIcon />, title: "Facultad de Ciencias de la Comunicación " },
    { icon: <BarChartIcon />, title: "Facultad de Ciencias Químicas " },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 3,
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: 2,
      }}
    >
      {menuItems.map((item, index) => (
        <MenuCard key={index} icon={item.icon} title={item.title} />
      ))}
    </Box>
  );
};

export default EntityP;



