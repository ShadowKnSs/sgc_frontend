import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import MenuCard from "../components/menuCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Importar iconos de Material UI
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import EmergencyOutlinedIcon from "@mui/icons-material/EmergencyOutlined";
import BloodtypeOutlinedIcon from "@mui/icons-material/BloodtypeOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import BookIcon from "@mui/icons-material/Book";

// Mapeo de iconos basado en el nombre de la entidad
const iconos = {
  "Departamento Administrativo": <InventoryOutlinedIcon />,
  "Facultad de Ciencias": <ScienceOutlinedIcon />,
  "Facultad de Ingeniería": <SettingsOutlinedIcon />,
  "Departamento Universitario de Ingles": <TranslateOutlinedIcon />,
  "División de Vinculación Universitaria": <LocationCityOutlinedIcon />,
  "Facultad del Hábitat": <HomeWorkOutlinedIcon />,
  "Facultad de Estomatología": <BloodtypeOutlinedIcon />,
  "Facultad de Medicina": <EmergencyOutlinedIcon />,
};

const Entity = () => {
  const navigate = useNavigate();
  const [entidades, setEntidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const idUsuario = 8;
    const rolActivo = "Líder de Proceso";
  
    console.log("🔐 ID Usuario desde localStorage:", idUsuario);
    console.log("🎭 Rol activo desde localStorage:", rolActivo);
  
    axios
      .post("http://127.0.0.1:8000/api/entidades-por-usuario", { idUsuario, rolActivo })
      .then((response) => {
        console.log("📦 Entidades recibidas del backend:", response.data.entidades);
  
        const entidadesConIcono = response.data.entidades.map((entidad) => ({
          ...entidad,
          icon: iconos[entidad.nombreEntidad] || <BookIcon />,
        }));
  
        setEntidades(entidadesConIcono);
      })
      .catch((error) => console.error("❌ Error al obtener entidades:", error))
      .finally(() => {
        console.log("✅ Petición finalizada.");
        setLoading(false);
      });
  }, []);
  

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 4,
        justifyContent: "center",
        alignItems: "start",
        textAlign: "center",
        marginTop: "80px",
        paddingX: "20px",
        width: "100%",
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <CircularProgress />
        </Box>
      ) : (
        entidades.map((entidad) => (
          <MenuCard
            key={entidad.idEntidadDependencia}
            icon={entidad.icon}
            title={entidad.nombreEntidad}
            onClick={() => navigate(`/procesos/${entidad.idEntidadDependencia}`)}
          />
        ))
      )}
    </Box>
  );
};

export default Entity;
