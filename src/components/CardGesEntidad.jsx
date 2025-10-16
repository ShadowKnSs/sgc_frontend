import React from 'react';
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Box, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


const iconMap = {
  Business: BusinessIcon,
  School: SchoolIcon,
  AccountBalance: AccountBalanceOutlinedIcon,
  HomeWork: HomeWorkIcon,
  Yard: YardOutlinedIcon,
  Science: ScienceOutlinedIcon,
  Biotech: BiotechOutlinedIcon,
  Psychology: PsychologyOutlinedIcon,
  Medical: MedicalInformationOutlinedIcon,
  Bloodtype: BloodtypeOutlinedIcon,
  LocalHospital: LocalHospitalOutlinedIcon,
  Topic: TopicOutlinedIcon,
  Assignment: AssignmentOutlinedIcon,
  Article: ArticleOutlinedIcon,
  ImportContacts: ImportContactsOutlinedIcon,
  AutoStories: AutoStoriesOutlinedIcon,
  LocalLibrary: LocalLibraryOutlinedIcon,
  Lightbulb: LightbulbOutlinedIcon,
  Settings: SettingsOutlinedIcon,
  PeopleOutline: PeopleOutlineOutlinedIcon,
  SocialDistance: SocialDistanceOutlinedIcon,
  Groups: GroupsOutlinedIcon,
  Gavel: GavelOutlinedIcon,
  Balance: BalanceOutlinedIcon,
  Assessment: AssessmentOutlinedIcon,
  Timeline: TimelineOutlinedIcon,
  Paid: PaidOutlinedIcon,
  RequestQuote: RequestQuoteOutlinedIcon,
  Translate: TranslateOutlinedIcon,
  Campaign: CampaignOutlinedIcon,
  LaptopChromebook: LaptopChromebookOutlinedIcon
}

const colorPalette = {
  azulOscuro: "#185FA4",
  azulClaro: "#68A2C9",
  verdeAgua: "#BBD8D7",
  verdeClaro: "#DFECDF",
  verdePastel: "#E3EBDA",
  grisClaro: "#DEDFD1",
  grisOscuro: "#A4A7A0",
};

const CardEntidad = ({ title, icon, isActive, handleEdit, handleToggle, disabled = false }) => {
  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`Abrir ${title}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); } }}
      sx={{
        position: 'relative',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 200,
        height: 200,
        borderRadius: 4,
        boxShadow: 3,
        cursor: "standard",
        backgroundColor: colorPalette.azulClaro,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 6,
          backgroundColor: colorPalette.azulOscuro,
        }
      }}
    >
      {/* Botones de editar y eliminar */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 0.5,
          zIndex: 2,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Tooltip title="Editar entidad" arrow>
          <IconButton
            size="small"
            onClick={handleEdit}
            sx={{
              backgroundColor: colorPalette.verdePastel,
              color: colorPalette.azulOscuro,
              "&:hover": { backgroundColor: colorPalette.azulClaro, color: "#fff" }
            }}
            aria-label="Editar entidad"
            disabled={disabled}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={isActive ? "Deshabilitar entidad" : "Habilitar entidad"} arrow>
          <IconButton
            size="small"
            onClick={handleToggle}
            sx={{ backgroundColor: "#E57373", color: "#fff", "&:hover": { backgroundColor: "#C62828" } }}
            aria-label={isActive ? "Deshabilitar entidad" : "Habilitar entidad"}
            disabled={disabled}
          >
            {isActive ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          color: "#fff",
        }}
      >
        {(() => { const Icon = iconMap[icon] || BusinessIcon; return <Icon sx={{ color: "#fff", fontSize: 70 }} />; })()}


        <Tooltip title={title} arrow>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            mt={1}
            sx={{
              color: "#fff",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-word",
              maxWidth: 170
            }}
          >
            {title}
          </Typography>
        </Tooltip>
      </CardContent>
    </Card>
  );
};

export default CardEntidad;
