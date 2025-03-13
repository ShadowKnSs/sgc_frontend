// src/admin/AdminHome.js
import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import AdminNewsList from '../components/AdminNewsList';
import AdminEAList from '../components/AdminEAlist';

const AdminHome = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom sx={{color: "secondary.main", textAlign: "center", paddingTop: 3}}>Panel de Administración</Typography>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{paddingBottom: 3}}>
        <Tab label="Noticias" />
        <Tab label="Eventos" />
        <Tab label="Avisos" />
      </Tabs>

      {tabValue === 0 && <AdminNewsList />}
      {tabValue === 1 && <AdminEAList tipo="Evento" />}
      {tabValue === 2 && <AdminEAList tipo="Aviso" />}
    </Box>
  );
};

export default AdminHome;
