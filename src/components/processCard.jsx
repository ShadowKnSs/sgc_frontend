// src/components/ProcessCard.jsx
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import CustomButton from "./Button";

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

const ProcessCard = ({ process, onEdit, onDelete, onActive, onForceDelete }) => {
  const iconObj = iconOptions.find(icon => icon.name === process.icono);
  const IconComponent = iconObj ? iconObj.component : null;

  const isActive = process.estado === "Activo";

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
        borderRadius: 4,
        boxShadow: 4,
        minHeight: 200,
        transition: "transform 0.3s, box-shadow 0.3s",
        backgroundColor: isActive ? "#DFECDF" : "#F5F5F5",
        "&:hover": {
          transform: "scale(1.015)",
          boxShadow: 6,
        },
        position: "relative",
        border: isActive ? "none" : "1px solid #e0e0e0",
      }}
    >
      {/* Estado badge */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          backgroundColor: isActive ? "#4CAF50" : "#757575",
          color: "white",
          px: 1,
          py: 0.5,
          borderRadius: 2,
          fontSize: "0.75rem",
          fontWeight: "bold",
        }}
      >
        {isActive ? "Activo" : "Inactivo"}
      </Box>

      {/* Icono decorativo */}
      {IconComponent && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            backgroundColor: isActive ? "#68A2C9" : "#9E9E9E",
            borderRadius: "50%",
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {React.cloneElement(IconComponent, {
            fontSize: "medium",
            htmlColor: "#ffffff",
          })}
        </Box>
      )}

      <CardContent sx={{ pr: 4, mt: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: isActive ? "#185FA4" : "#757575" }}>
          {process.nombreProceso}
        </Typography>
        <Typography variant="body2" sx={{ color: isActive ? "#555" : "#9E9E9E", mt: 0.5 }}>
          {process.entidad || process.dependencia || "Sin entidad"}
        </Typography>
        {process.macroproceso && (
          <Typography variant="body2" sx={{ color: isActive ? "#666" : "#9E9E9E", mt: 0.5, fontSize: "0.8rem" }}>
            {process.macroproceso}
          </Typography>
        )}
      </CardContent>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
        {isActive ? (
          // Botones para procesos ACTIVOS
          <>
            <CustomButton
              type="cancelar"
              onClick={onEdit}
              sx={{ minWidth: "100px" }}
            >
              Editar
            </CustomButton>
            <CustomButton
              type="guardar"
              onClick={onDelete}
              sx={{ minWidth: "120px" }}
            >
              Desactivar
            </CustomButton>
          </>
        ) : (
          // Botones para procesos INACTIVOS
          <>
            <CustomButton
              type="cancelar"
              onClick={onForceDelete}
              sx={{ minWidth: "100px" }}
            >
              Eliminar
            </CustomButton>
            <CustomButton
              type="aceptar"
              onClick={onActive}
              sx={{ minWidth: "100px" }}
            >
              Activar
            </CustomButton>

          </>
        )}
      </Box>
    </Card>
  );
};


export default ProcessCard;