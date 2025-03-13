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
    axios
      .get("http://127.0.0.1:8000/api/entidades")
      .then((response) => {
        console.log("Respuesta del backend:", response.data);

        const entidadesConIcono = response.data.entidades.map((entidad) => ({
          ...entidad,
          icon: iconos[entidad.nombreEntidad] || <BookIcon />, // Icono predeterminado si no se encuentra
        }));

        setEntidades(entidadesConIcono);
      })
      .catch((error) => console.error("Error obteniendo entidades:", error))
      .finally(() => setLoading(false));
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
            key={entidad.idEntidadDependecia}
            icon={entidad.icon}
            title={entidad.nombreEntidad}
            onClick={() => navigate(`/procesos/${entidad.idEntidadDependecia}`)}
          />
        ))
      )}
    </Box>
  );
};

export default Entity;
