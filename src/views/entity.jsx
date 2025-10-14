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
import { Box, CircularProgress, Stack, TextField, MenuItem, Typography } from "@mui/material";
import MenuCard from "../components/menuCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Buscador from "../components/BuscadorEntidades";
import BreadcrumbNav from "../components/BreadcrumbNav";
import FeedbackSnackbar from "../components/Feedback";


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
import LocationCityIcon from '@mui/icons-material/LocationCity';
import Title from "../components/Title";
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
  const [entidadesFiltradas, setEntidadesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipoFilter, setTipoFilter] = useState("");
  const [snack, setSnack] = useState({ open: false, type: "error", msg: "" });

  useEffect(() => {
    const usuarioRaw = localStorage.getItem("usuario");
    const rolRaw = localStorage.getItem("rolActivo");

    if (!usuarioRaw || !rolRaw) {
      setLoading(false);
      setSnack({ open: true, type: "error", msg: "Sesión no válida. Inicia sesión nuevamente." });
      return;
    }

    let usuario, rolActivo;
    try {
      usuario = JSON.parse(usuarioRaw);
      rolActivo = JSON.parse(rolRaw);
    } catch {
      setLoading(false);
      setSnack({ open: true, type: "error", msg: "Error al leer datos locales de sesión." });
      return;
    }

    const permisos = rolActivo?.permisos || [];
    const puedeVerEntidades = permisos.some(
      (p) => p.modulo === "Entidades" && ["Lectura", "Edición", "Administración"].includes(p.tipoAcceso)
    );

    if (!puedeVerEntidades) {
      setLoading(false);
      setSnack({ open: true, type: "warning", msg: "No cuentas con permisos para ver Entidades." });
      return;
    }

    axios
      .post("http://127.0.0.1:8000/api/entidades-por-usuario", {
        idUsuario: usuario.idUsuario,
        rolActivo: rolActivo.nombreRol,
      })
      .then(({ data }) => {
        const entidadesCrudas = data?.entidades || [];
        const entidadesConIcono = entidadesCrudas.map((entidad) => ({
          ...entidad,
          icono: (typeof iconMap !== "undefined" && iconMap?.[entidad.icono]) || <BusinessIcon />,
        }));
        setEntidades(entidadesConIcono);
        setEntidadesFiltradas(entidadesConIcono);
      })
      .catch(() => {
        // Sin console.error: mostramos feedback
        setSnack({ open: true, type: "error", msg: "Error al obtener las entidades." });
      })
      .finally(() => setLoading(false));
  }, []);

  const entidadesMostradas = useMemo(() => {
    return (entidadesFiltradas || []).filter((ent) => (tipoFilter === "" ? true : ent.tipo === tipoFilter));
  }, [entidadesFiltradas, tipoFilter]);

  // ---- Layout responsivo SIN overflow horizontal ----

  const count = entidadesMostradas.length;

  const gridSx =
    count <= 1
      ? {
          gridTemplateColumns: "minmax(260px, 380px)",
          justifyContent: "center",
        }
      : count === 2
      ? {
          gridTemplateColumns: {
            xs: "minmax(260px, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))",
          },
          justifyContent: "center",
        }
      : {
          gridTemplateColumns: {
            xs: "repeat(1, minmax(0, 1fr))",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
        };

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "hidden",          // <- evita desbordamiento horizontal
        boxSizing: "border-box",
        px: { xs: 1.5, sm: 2 },
        mt: 2,
        pb: 2,
        mb: 4
      }}
    >
      <BreadcrumbNav items={[{ label: "Entidades", icon: LocationCityIcon }]} />
      <Title text="Entidades" mode="sticky" />

      {/* Toolbar */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="center"
        sx={{
          zIndex: 1,
          bgcolor: "background.paper",
          py: 1,
          borderBottom: 1,
          borderColor: "divider",
          flexWrap: "wrap",
          gap: 2,
          maxWidth: 1400,
          mx: "auto",
          width: "100%",
        }}
      >
        <Buscador entidades={entidades} onFiltrar={setEntidadesFiltradas} />
        <TextField
          select
          size="small"
          label="Tipo"
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
          sx={{ minWidth: 160, maxWidth: 200, alignSelf: "center" }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="Entidad">Entidad</MenuItem>
          <MenuItem value="Dependencia">Dependencia</MenuItem>
        </TextField>
      </Stack>

      {/* Grid de tarjetas */}
      <Box sx={{ maxWidth: 1400, mx: "auto", width: "100%" }}>
        <Box
          sx={{
            display: "grid",
            gap: 3,
            alignItems: "start",
            textAlign: "center",
            mt: 1,
            px: { xs: 0.5, sm: 2 },
            width: "100%",
            ...gridSx,
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <CircularProgress />
            </Box>
          ) : count === 0 ? (
            // Empty state con icono y texto
            <Box
              sx={{
                width: "100%",
                maxWidth: 520,
                mx: "auto",
                my: 4,
                py: 4,
                px: 3,
                borderRadius: 2,
                border: "1px dashed",
                borderColor: "divider",
              }}
              role="status"
              aria-live="polite"
            >
              <LocationCityIcon sx={{ fontSize: 56, color: "text.secondary", mb: 1 }} />
              <Typography variant="h6" color="text.secondary">
                No hay entidades registradas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ajusta los filtros o intenta más tarde.
              </Typography>
            </Box>
          ) : (
            entidadesMostradas.map((entidad) => (
              <Box key={entidad.idEntidadDependencia} sx={{ minWidth: 0 /* evita overflow por contenido interno */ }}>
                <MenuCard
                  icon={entidad.icono}
                  title={entidad.nombreEntidad}
                  onClick={() => navigate(`/procesos/${entidad.idEntidadDependencia}`)}
                />
              </Box>
            ))
          )}
        </Box>
      </Box>

      {/* Snackbar de feedback (errores/avisos) */}
      <FeedbackSnackbar
        open={snack.open}
        type={snack.type}
        message={snack.msg}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      />
    </Box>
  );
};

export default Entity;