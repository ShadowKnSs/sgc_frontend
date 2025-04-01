import React, { useState } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import Title from '../components/Title';
import BuscadorAuditoria from '../components/buscadorAuditoria';
import BuscadorProcesos from '../components/buscadorProceso'; 

const BuscaReportes = () => {
  const [openAuditoriaSearch, setOpenAuditoriaSearch] = useState(false);
  const [openProcesoSearch, setOpenProcesoSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenAuditoriaSearch = () => {
    setOpenAuditoriaSearch(true);
  };

  const handleOpenProcesoSearch = () => {
    setOpenProcesoSearch(true);
  };

  const handleCloseSearch = () => {
    setOpenAuditoriaSearch(false);
    setOpenProcesoSearch(false);
  };

  return (
    <Box sx={{ p: 2, position: 'relative', minHeight: '100vh' }}>
      <Box sx={{ textAlign: "center", paddingTop: 3 }}>
        <Title text="Buscar Reportes" />
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Seleccione el tipo de reporte que desea buscar
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mt: 4, justifyContent: 'center' }}>
        <Grid item xs={12} sm={6} md={4}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleOpenAuditoriaSearch}
            fullWidth
            sx={{ py: 3 }}
          >
            Buscar Auditorías
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleOpenProcesoSearch}
            fullWidth
            sx={{ py: 3 }}
          >
            Buscar Procesos
          </Button>
        </Grid>
      </Grid>

      <BuscadorAuditoria
        open={openAuditoriaSearch}
        onClose={handleCloseSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <BuscadorProcesos
        open={openProcesoSearch}
        onClose={handleCloseSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </Box>
  );
};

export default BuscaReportes;