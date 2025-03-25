import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Title from '../components/Title';
import SearchFilter from '../components/SearchFilter';

const BuscaReportes = () => {
  const [openSearch, setOpenSearch] = useState(false); // Estado para controlar la apertura del buscador
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  // Función para abrir el buscador
  const handleOpenSearch = () => {
    setOpenSearch(true);
  };

  // Función para cerrar el buscador
  const handleCloseSearch = () => {
    setOpenSearch(false);
  };

  return (
    <Box sx={{ p: 2, position: 'relative', minHeight: '100vh' }}>
      <Box sx={{ textAlign: "center", paddingTop: 3 }}>
        <Title text="Buscar" />
      </Box>

      {/* Botón para abrir el buscador */}
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Button variant="contained" color="primary" onClick={handleOpenSearch}>
          Abrir Buscador
        </Button>
      </Box>

      {/* Componente SearchFilter con los props necesarios */}
      <SearchFilter 
        open={openSearch}
        onClose={handleCloseSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </Box>
  );
};

export default BuscaReportes;
