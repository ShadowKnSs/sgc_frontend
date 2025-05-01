// src/components/ProcessCard.jsx
import React from "react";
import {  Button, Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

const ProcessCard = ({ process, onEdit, onDelete }) => {
  // Buscar el ícono correspondiente al proceso
  const iconObj = iconOptions.find(icon => icon.name === process.icono);
  const IconComponent = iconObj ? iconObj.component : null;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 6,
        },
        minHeight: 180,
        position: "relative",
      }}
    >
      {/* Icono en esquina superior derecha */}
      {IconComponent && (
        <Box sx={{ position: "absolute", top: 12, right: 12 }}>
          {React.cloneElement(IconComponent, {
            fontSize: "large",
            color: "primary",
          })}
        </Box>
      )}

      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold", pr: 6 }}>
          {process.nombreProceso}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {process.entidad || process.dependencia || "Sin entidad"}
        </Typography>
      </CardContent>

      {/* Botones */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: -1 }}>
        <Button variant="outlined" color="primary" onClick={onEdit}>
          Editar
        </Button>
        <Button variant="outlined" color="error" onClick={onDelete}>
          Eliminar
        </Button>
      </Box>
    </Card>
  );
};

export default ProcessCard;