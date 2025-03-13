import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import MenuCard from "../components/menuCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Importar iconos de Material UI
import BookIcon from "@mui/icons-material/Book";
import LanguageIcon from "@mui/icons-material/Language";
import PeopleIcon from "@mui/icons-material/People";

// Mapeo de iconos basado en el nombre de la entidad
const iconos = {
 "Facultad de Ingeniería": <BookIcon />,
"Facultad de Ciencias": <LanguageIcon />,
"Departamento Administrativo ": <PeopleIcon />,
  // Agrega más iconos según sea necesario
};

const Entity = () => {
  const navigate = useNavigate();
  const [entidades, setEntidades] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/entidades") 
      .then((response) => {
        console.log("Respuesta del backend:", response.data);

        // Revisa la estructura exacta de las entidades y ajusta el mapeo
        const entidadesConIcono = response.data.entidades.map((entidad) => ({
          ...entidad,
          icon: iconos[entidad.nombreEntidad] || <BookIcon />, // Asignamos un icono predeterminado si no se encuentra
        }));

        setEntidades(entidadesConIcono); // Actualizamos el estado con las entidades mapeadas
      })
      .catch((error) => console.error("Error obteniendo entidades:", error));
  }, []);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(5, auto)",
        gap: 8,
        placeItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "100vh",
        paddingTop: "80px",
        paddingBottom: "40px",
        width: "100%",
      }}
    >
      {entidades.map((entidad) => (
        <MenuCard
          key={entidad.idEntidadDependecia} // Usamos el ID como clave única
          icon={entidad.icon}
          title={entidad.nombreEntidad} // Mostramos el nombre de la entidad
          onClick={() => navigate("/estructura-procesos")}
        />
      ))}
    </Box>
  );
};

export default Entity;