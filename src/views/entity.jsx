import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
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
  const [loading, setLoading] = useState(true);
  const [entidadesFiltradas, setEntidadesFiltradas] = useState([]);


  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const rolActivo = JSON.parse(localStorage.getItem("rolActivo"));
   
    if (!usuario || !rolActivo) {
      console.error("No se encontró información del usuario o rol.");
      return;
    }

    const permisos = rolActivo.permisos || [];
    const puedeVerProcesos = permisos.some(
      (permiso) => permiso.modulo === "Entidades" && 
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
        console.log("📦 Entidades desde backend:", response.data.entidades);

        const entidadesConIcono = response.data.entidades.map((entidad) => ({
          ...entidad,
          icono: iconMap[entidad.icono] || <BusinessIcon/>, // ícono por defecto si no se encuentra
        }));
        
        setEntidades(entidadesConIcono);
        setEntidadesFiltradas(entidadesConIcono);

      })
      .catch((error) =>
        console.error("❌ Error al obtener entidades:", error)
      )
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
            key={entidad.idEntidadDependencia}
            icon={entidad.icono}
            title={entidad.nombreEntidad}
            onClick={() =>
              navigate(`/procesos/${entidad.idEntidadDependencia}`)
            }
          />
        ))
      )}
    </Box>
  );
};

export default Entity;
