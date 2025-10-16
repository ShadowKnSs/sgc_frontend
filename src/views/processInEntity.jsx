/**
 * Vista: ProcessInEntity
 * Descripción:
 * Muestra todos los procesos asociados a una entidad específica (`idEntidad`).
 * Utiliza el parámetro de ruta (`useParams`) para identificar la entidad y 
 * obtiene tanto su nombre como la lista de procesos desde la API.

 * Funcionalidades clave:
 * - Visualiza los procesos relacionados a una entidad en tarjetas (`MenuCard`) con íconos personalizados.
 * - Redirige al hacer clic en un proceso hacia la vista de estructura: `/estructura-procesos/:idProceso`.
 * - Muestra un mensaje amigable si la entidad no tiene procesos registrados.
 * - Soporte visual para íconos usando `@mui/icons-material` y `iconOptions` mapeados por nombre.

 * Endpoints utilizados:
 * - `GET /api/procesos/entidad/{idEntidad}` → obtiene procesos vinculados a la entidad.
 * - `GET /api/entidades/{idEntidad}` → obtiene el nombre de la entidad.

 * Componentes externos:
 * - `Title`: Encabezado estilizado para el título principal.
 * - `MenuCard`: Componente visual para mostrar cada proceso.
 * - `CircularProgress`, `Alert`: Indicadores de carga y mensajes.

 * Estado local:
 * - `procesos`: lista de procesos cargados desde la API.
 * - `nombreEntidad`: nombre de la entidad obtenida por su ID.
 * - `isLoading`: indicador de estado de carga de los datos.

 * Navegación:
 * - Al hacer clic en una tarjeta de proceso, redirige a `/estructura-procesos/:idProceso`.

 * Observación:
 * Cada proceso tiene un campo `icono` que debe coincidir con los nombres definidos en `iconOptions`.
 */

import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MenuCard from "../components/menuCard";
import { Box, CircularProgress, Alert, Stack, TextField, MenuItem } from "@mui/material";
import Title from "../components/Title";
import BreadcrumbNav from "../components/BreadcrumbNav";

import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import YardOutlinedIcon from '@mui/icons-material/YardOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined';
import BiotechOutlinedIcon from '@mui/icons-material/BiotechOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import SocialDistanceOutlinedIcon from '@mui/icons-material/SocialDistanceOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import LaptopChromebookOutlinedIcon from '@mui/icons-material/LaptopChromebookOutlined';
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LocationCityIcon from '@mui/icons-material/LocationCity';


const iconOptions = [
  { name: 'Business', component: <BusinessIcon /> },
  { name: 'School', component: <SchoolIcon /> },
  { name: 'AccountBalance', component: <AccountBalanceOutlinedIcon /> },
  { name: 'HomeWork', component: <HomeWorkIcon /> },
  { name: 'Yard', component: <YardOutlinedIcon /> },
  { name: 'Science', component: <ScienceOutlinedIcon /> },
  { name: 'Biotech', component: <BiotechOutlinedIcon /> },
  { name: 'Psychology', component: <PsychologyOutlinedIcon /> },
  { name: 'Medical', component: < MedicalInformationOutlinedIcon /> },
  { name: 'Bloodtype', component: <BloodtypeOutlinedIcon /> },
  { name: 'LocalHospital', component: <LocalHospitalOutlinedIcon /> },
  { name: 'Topic', component: <TopicOutlinedIcon /> },
  { name: 'Assignment', component: <AssignmentOutlinedIcon /> },
  { name: 'Article', component: <ArticleOutlinedIcon /> },
  { name: 'ImportContacts', component: <ImportContactsOutlinedIcon /> },
  { name: 'AutoStories', component: <AutoStoriesOutlinedIcon /> },
  { name: 'LocalLibrary', component: <LocalLibraryOutlinedIcon /> },
  { name: 'Lightbulb', component: <LightbulbOutlinedIcon /> },
  { name: 'Settings', component: <SettingsOutlinedIcon /> },
  { name: 'PeopleOutline', component: <PeopleOutlineOutlinedIcon /> },
  { name: 'SocialDistance', component: <SocialDistanceOutlinedIcon /> },
  { name: 'Groups', component: <GroupsOutlinedIcon /> },
  { name: 'Gavel', component: <GavelOutlinedIcon /> },
  { name: 'Balance', component: <BalanceOutlinedIcon /> },
  { name: 'Assessment', component: <AssessmentOutlinedIcon /> },
  { name: 'Timeline', component: <TimelineOutlinedIcon /> },
  { name: 'Paid', component: <PaidOutlinedIcon /> },
  { name: 'RequestQuote', component: <RequestQuoteOutlinedIcon /> },
  { name: 'Translate', component: <TranslateOutlinedIcon /> },
  { name: 'Campaign', component: <CampaignOutlinedIcon /> },
  { name: 'LaptopChromebook', component: <LaptopChromebookOutlinedIcon /> },

];

const macroprocesoMap = {
  1: "Gestión Escolar",
  2: "Desarrollo y Formación Integral del Estudiante",
  3: "Gestión Administrativa"
};

const ProcessInEntity = () => {
  const { idEntidad } = useParams();
  const navigate = useNavigate();
  const [procesos, setProcesos] = useState([]);
  const [nombreEntidad, setNombreEntidad] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [macroFilter, setMacroFilter] = useState("");

  useEffect(() => {
    if (!idEntidad) return;

    axios.get(`http://127.0.0.1:8000/api/procesos/entidad/${idEntidad}`)
      .then(response => {
        setProcesos(response.data.procesos || response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error obteniendo procesos:", error);
        setIsLoading(false);
      });

    axios.get(`http://127.0.0.1:8000/api/entidades/${idEntidad}`)
      .then(response => setNombreEntidad(response.data.nombreEntidad))
      .catch(error => console.error("Error obteniendo el nombre de la entidad:", error));
  }, [idEntidad]);

  // Filtrado por macroproceso
  const procesosFiltrados = useMemo(() => {
    return procesos.filter(p => {
      if (!macroFilter) return true;
      return p.idMacroproceso === parseInt(macroFilter);
    });
  }, [procesos, macroFilter]);

  // Detectar macroprocesos presentes
  const macroProcesosPresentes = useMemo(() => {
    const setMacro = new Set(procesos.map(p => p.idMacroproceso));
    return Array.from(setMacro); // Array de ids distintos
  }, [procesos]);


  return (
    <Box sx={{ textAlign: "center", padding: "15px" }}>
      <BreadcrumbNav items={[{ label: "Entidades", icon: LocationCityIcon, to: "/entidades"  }, { label: `Procesos de ${nombreEntidad}`, icon: AccountTreeIcon  }]} />

      <Title text={`Procesos de ${nombreEntidad}`} />

      {/* Mostrar filtro solo si hay más de un macroproceso */}
      {procesos.length > 0 && macroProcesosPresentes.length > 1 && (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          sx={{ mb: 3 }}
        >
          <TextField
            select
            size="small"
            label="Macroproceso"
            value={macroFilter}
            onChange={(e) => setMacroFilter(e.target.value)}
            sx={{ minWidth: 250 }}
          >
            <MenuItem value="">Todos</MenuItem>
            {macroProcesosPresentes.map(id => (
              <MenuItem key={id} value={id}>{macroprocesoMap[id]}</MenuItem>
            ))}
          </TextField>
        </Stack>
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "16px",
            marginTop: "20px"
          }}
        >
          {procesosFiltrados.length === 0 ? (
            <Alert severity="warning" sx={{ width: "50%", margin: "0 auto" }}>
              No se encontraron procesos para esta entidad.
            </Alert>
          ) : (
            procesosFiltrados.map(proceso => {
              const iconObj = iconOptions.find(icon => icon.name === proceso.icono);
              const IconComponent = iconObj ? iconObj.component : null;

              return (
                <MenuCard
                  key={proceso.idProceso}
                  icon={IconComponent || null}
                  title={proceso.nombreProceso}
                  onClick={() => navigate(`/estructura-procesos/${proceso.idProceso}`)}
                />
              );
            })
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProcessInEntity;


