// 📁 src/components/MenuNavegacionProceso.jsx
import React from "react";
import { SpeedDial, SpeedDialAction, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import WidgetsIcon from '@mui/icons-material/Widgets';

const MenuNavegacionProceso = ({ items = [] }) => {
  const navigate = useNavigate();
  const rolActivo = JSON.parse(localStorage.getItem("rolActivo"));
  const permisos = rolActivo?.permisos?.map((p) => p.modulo) || [];

  const itemsFiltrados = items.filter((item) => permisos.includes(item.title));
  console.log("Permisos", permisos);

  return (
    <Box sx={{ position: "fixed", top: 120 , left: 16, zIndex: 999 }}>
      <SpeedDial
        ariaLabel="Menú de navegación del proceso"
        icon={<WidgetsIcon />}
        direction="down"
      >
        {itemsFiltrados.map((item, index) => (
          <SpeedDialAction
            key={index}
            icon={item.icon}
            tooltipTitle={item.title}
            onClick={() => navigate(item.path)}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default MenuNavegacionProceso;
