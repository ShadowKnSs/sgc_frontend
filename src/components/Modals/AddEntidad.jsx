import React, { useState } from 'react';
import {TextField,MenuItem,Button,Typography,Grid, Box, IconButton} from '@mui/material';

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
  { name: 'Science', component: <ScienceOutlinedIcon/>},
  { name: 'Biotech', component: <BiotechOutlinedIcon/>},
  { name: 'Psychology', component: <PsychologyOutlinedIcon/>},
  { name: 'Medical', component:< MedicalInformationOutlinedIcon/> },
  { name: 'Bloodtype', component: <BloodtypeOutlinedIcon/>},
  { name: 'LocalHospital', component: <LocalHospitalOutlinedIcon/>},
  { name: 'Topic', component: <TopicOutlinedIcon/>},
  { name: 'Assignment', component: <AssignmentOutlinedIcon/>},
  { name: 'Article', component:<ArticleOutlinedIcon/> },
  { name: 'ImportContacts', component: <ImportContactsOutlinedIcon/>},
  { name: 'AutoStories', component: <AutoStoriesOutlinedIcon/>},
  { name: 'LocalLibrary', component: <LocalLibraryOutlinedIcon/>},
  { name: 'Lightbulb', component:<LightbulbOutlinedIcon/> },
  { name: 'Settings', component:<SettingsOutlinedIcon/> },
  { name: 'PeopleOutline', component: <PeopleOutlineOutlinedIcon/>},
  { name: 'SocialDistance', component: <SocialDistanceOutlinedIcon/>},
  { name: 'Groups', component: <GroupsOutlinedIcon/>},
  { name: 'Gavel', component: <GavelOutlinedIcon/>},
  { name: 'Balance', component: <BalanceOutlinedIcon/>},
  { name: 'Assessment', component: <AssessmentOutlinedIcon/>},
  { name: 'Timeline', component: <TimelineOutlinedIcon/>},
  { name: 'Paid', component: <PaidOutlinedIcon/>},
  { name: 'RequestQuote', component: <RequestQuoteOutlinedIcon/>},
  { name: 'Translate', component: <TranslateOutlinedIcon/>},
  { name: 'Campaign', component: <CampaignOutlinedIcon/>},
  { name: 'LaptopChromebook', component: <LaptopChromebookOutlinedIcon/>},
  
];

const AddEntidad = ({ onSubmit }) => {
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    ubicacion: ''
  });

  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0].name);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectIcon = (iconName) => {
    setSelectedIcon(iconName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, icon: selectedIcon });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, minWidth: 300 }}>
      <TextField
        fullWidth
        label="Nombre"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        select
        fullWidth
        label="Tipo"
        name="tipo"
        value={form.tipo}
        onChange={handleChange}
        margin="normal"
        required
      >
        <MenuItem value="Entidad">Entidad</MenuItem>
        <MenuItem value="Dependencia">Dependencia</MenuItem>
      </TextField>
      <TextField
        fullWidth
        label="Ubicación"
        name="ubicacion"
        value={form.ubicacion}
        onChange={handleChange}
        margin="normal"
        required
      />

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Selecciona un icono:</Typography>
        <Grid container spacing={2}>
          {iconOptions.map(({ name, component }) => (
            <Grid item key={name}>
              <IconButton
                onClick={() => handleSelectIcon(name)}
                sx={{
                  border: selectedIcon === name ? '2px solid' : '1px dashed',
                  borderColor: selectedIcon === name ? 'primary.main' : 'grey.400',
                  borderRadius: 2,
                  p: 1,
                  backgroundColor: selectedIcon === name ? 'primary.light' : 'transparent'
                }}
              >
                {React.cloneElement(component, {
                  fontSize: 'large',
                  color: selectedIcon === name ? 'primary' : 'action'
                })}
              </IconButton>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ textAlign: 'right', mt: 3 }}>
        <Button type="submit" variant="contained">Guardar</Button>
      </Box>
    </Box>
  );
};

export default AddEntidad;
