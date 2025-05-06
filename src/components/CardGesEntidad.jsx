import React from 'react';
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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

const colorPalette = {
  azulOscuro: "#185FA4",
  azulClaro: "#68A2C9",
  verdeAgua: "#BBD8D7",
  verdeClaro: "#DFECDF",
  verdePastel: "#E3EBDA",
  grisClaro: "#DEDFD1",
  grisOscuro: "#A4A7A0",
};

const CardEntidad = ({ title, icon, handleClick, handleEdit, handleDelete }) => {
  return (
    <Card
      onClick={handleClick}
      role="button"
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
        cursor: "pointer",
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
        <IconButton
          size="small"
          onClick={handleEdit}
          sx={{
            backgroundColor: colorPalette.verdePastel,
            color: colorPalette.azulOscuro,
            "&:hover": {
              backgroundColor: colorPalette.azulClaro,
              color: "#fff"
            }
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          onClick={handleDelete}
          sx={{
            backgroundColor: "#E57373",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#C62828"
            }
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
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
        {iconMap[icon] && React.cloneElement(iconMap[icon], {
          sx: { color: "#fff", fontSize: 70 }
        })}

        <Typography
          variant="subtitle1"
          fontWeight="bold"
          mt={1}
          sx={{
            color: "#fff",
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CardEntidad;
