/**
 * Componente: Entity
 * Ubicación: src/views/Entity.jsx
 *
 * Descripción:
 * Vista principal que muestra las entidades o facultades disponibles para el usuario autenticado,
 * según su rol y permisos. Cada entidad se representa como una tarjeta (`MenuCard`) con ícono y nombre.
 * Permite filtrar entidades dinámicamente mediante un buscador.
 *
 * Funcionalidad:
 * - Verifica el rol y los permisos del usuario desde `localStorage`.
 * - Si el usuario tiene permisos de acceso al módulo de "Entidades", realiza una petición al backend para obtener las entidades relacionadas al usuario.
 * - Se renderiza un `MenuCard` por cada entidad, con ícono asociado.
 * - Incluye un buscador (`Buscador`) que permite filtrar dinámicamente las entidades por nombre.
 * - Redirige al hacer clic en una entidad (`/procesos/:idEntidadDependencia`).
 *
 * Iconos:
 * - Mapeo estático de iconos a través del objeto `iconMap`.
 * - Se selecciona el icono según el valor `entidad.icono` recibido del backend, con un ícono por defecto (`BusinessIcon`) en caso de no coincidencia.
 *
 * Estados:
 * - `entidades`: entidades obtenidas del backend, enriquecidas con íconos.
 * - `entidadesFiltradas`: entidades visibles según búsqueda.
 * - `loading`: bandera para mostrar spinner mientras se cargan los datos.
 *
 * Componentes utilizados:
 * - `MenuCard`: tarjeta visual por cada entidad.
 * - `Buscador`: input con lógica de filtrado por nombre.
 *
 * Lógica de permisos:
 * - Acceso restringido según el campo `modulo === "Entidades"` y `tipoAcceso ∈ ["Lectura", "Edición", "Administración"]`.
 * - Si el rol no tiene acceso, no se muestran tarjetas y el `loading` se desactiva.
 *
 * Mejoras sugeridas:
 * - Manejo más amigable si el usuario no tiene acceso (mostrar mensaje claro en lugar de solo ocultar).
 * - Posibilidad de mostrar una entidad por default al ingresar.
 * - Soporte para paginación si la cantidad de entidades crece.
 */

import React, { useState, useEffect, useMemo } from "react";
import { Box, CircularProgress, Stack, TextField, MenuItem } from "@mui/material";
import MenuCard from "../components/menuCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Buscador from "../components/BuscadorEntidades";

// Iconos
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import BloodtypeOutlinedIcon from "@mui/icons-material/BloodtypeOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";


import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import YardOutlinedIcon from '@mui/icons-material/YardOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import BiotechOutlinedIcon from '@mui/icons-material/BiotechOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import SocialDistanceOutlinedIcon from '@mui/icons-material/SocialDistanceOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import LaptopChromebookOutlinedIcon from '@mui/icons-material/LaptopChromebookOutlined';
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';

const iconMap = {
  Business: <BusinessIcon />,
  School: <SchoolIcon />,
  AccountBalance: <AccountBalanceOutlinedIcon />,
  HomeWork: <HomeWorkIcon />,
  Yard: <YardOutlinedIcon />,
  Science: <ScienceOutlinedIcon />,
  Biotech: <BiotechOutlinedIcon />,
  Psychology: <PsychologyOutlinedIcon />,
  Medical: <MedicalInformationOutlinedIcon />,
  Bloodtype: <BloodtypeOutlinedIcon />,
  LocalHospital: <LocalHospitalOutlinedIcon />,
  Topic: <TopicOutlinedIcon />,
  Assignment: <AssignmentOutlinedIcon />,
  Article: <ArticleOutlinedIcon />,
  ImportContacts: <ImportContactsOutlinedIcon />,
  AutoStories: <AutoStoriesOutlinedIcon />,
  LocalLibrary: <LocalLibraryOutlinedIcon />,
  Lightbulb: <LightbulbOutlinedIcon />,
  Settings: <SettingsOutlinedIcon />,
  PeopleOutline: <PeopleOutlineOutlinedIcon />,
  SocialDistance: <SocialDistanceOutlinedIcon />,
  Groups: <GroupsOutlinedIcon />,
  Gavel: <GavelOutlinedIcon />,
  Balance: <BalanceOutlinedIcon />,
  Assessment: <AssessmentOutlinedIcon />,
  Timeline: <TimelineOutlinedIcon />,
  Paid: <PaidOutlinedIcon />,
  RequestQuote: <RequestQuoteOutlinedIcon />,
  Translate: <TranslateOutlinedIcon />,
  Campaign: <CampaignOutlinedIcon />,
  LaptopChromebook: <LaptopChromebookOutlinedIcon />
}

const Entity = () => {
  const navigate = useNavigate();
  const [entidades, setEntidades] = useState([]);
  const [entidadesFiltradas, setEntidadesFiltradas] = useState([]); // <- la salida del Buscador
  const [loading, setLoading] = useState(true);
  const [tipoFilter, setTipoFilter] = useState(""); // "", "Entidad", "Dependencia"

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const rolActivo = JSON.parse(localStorage.getItem("rolActivo"));

    if (!usuario || !rolActivo) {
      console.error("No se encontró información del usuario o rol.");
      setLoading(false);
      return;
    }

    const permisos = rolActivo.permisos || [];
    const puedeVerProcesos = permisos.some(
      (permiso) =>
        permiso.modulo === "Entidades" &&
        ["Lectura", "Edición", "Administración"].includes(permiso.tipoAcceso)
    );

    if (!puedeVerProcesos) {
      console.warn("🚫 Este rol no tiene acceso al módulo de Procesos.");
      setLoading(false);
      return;
    }

    axios
      .post("http://127.0.0.1:8000/api/entidades-por-usuario", {
        idUsuario: usuario.idUsuario,
        rolActivo: rolActivo.nombreRol,
      })
      .then((response) => {
        const entidadesCrudas = response.data.entidades || [];
        const entidadesConIcono = entidadesCrudas.map((entidad) => ({
          ...entidad,
          icono: (typeof iconMap !== "undefined" && iconMap?.[entidad.icono]) || <BusinessIcon />,
        }));

        setEntidades(entidadesConIcono);
        // Inicialmente, mostrar todas
        setEntidadesFiltradas(entidadesConIcono);
      })
      .catch((error) => console.error("❌ Error al obtener entidades:", error))
      .finally(() => setLoading(false));
  }, []);

  const entidadesMostradas = useMemo(() => {

    return (entidadesFiltradas || []).filter((ent) => {
      console.log("Comparando:", ent);
      if (tipoFilter === "") return true;
      return ent.tipo === tipoFilter;
    });
  }, [entidadesFiltradas, tipoFilter]);

  return (
    <Box sx={{ width: "100%", px: 2, mt: 4 }}>
      {/* Toolbar: Buscador + MenuItem por tipo */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="center"
        sx={{
          mb: 3,
          zIndex: 1,
          bgcolor: "background.paper",
          py: 1.5,
          borderBottom: 1,
          borderColor: "divider",
          flexWrap: "wrap", 
          gap: 2,           
        }}
      >
        <Buscador
          entidades={entidades}
          onFiltrar={setEntidadesFiltradas}
        />

        <TextField
          select
          size="small"
          label="Tipo"
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
          sx={{ minWidth: 160, maxWidth: 200 }} // ✅ evita que crezca demasiado
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="Entidad">Entidad</MenuItem>
          <MenuItem value="Dependencia">Dependencia</MenuItem>
        </TextField>
      </Stack>


      {/* Grid de tarjetas */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 4,
          justifyContent: "center",
          alignItems: "start",
          textAlign: "center",
          mt: 4,
          px: 2,
          width: "100%",
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <CircularProgress />
          </Box>
        ) : (
          entidadesMostradas.map((entidad) => (
            <MenuCard
              key={entidad.idEntidadDependencia}
              icon={entidad.icono}
              title={entidad.nombreEntidad}
              onClick={() => navigate(`/procesos/${entidad.idEntidadDependencia}`)}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default Entity;