import React, { useState, useEffect } from 'react';
import { Box, Drawer, TextField, IconButton, Typography, Button, Snackbar, Grid, Card, CardContent, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const BuscadorAuditoria = ({ open, onClose, searchTerm, setSearchTerm }) => {
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [hallazgosFilter, setHallazgosFilter] = useState('todos');
  const [oportunidadesFilter, setOportunidadesFilter] = useState('todos');

  const API_URLS = {
    auditorias: 'http://127.0.0.1:8000/api/buscar-auditorias'
  };

  const validateYear = (year) => {
    if (!year.trim()) {
      setError('Por favor ingrese un año');
      return false;
    }
    if (!/^\d+$/.test(year)) {
      setError('El año debe contener solo números');
      return false;
    }
    if (year.length !== 4) {
      setError('El año debe tener 4 dígitos');
      return false;
    }
    return true;
  };

  const formatAuditorias = (data) => {
    return data.map(reporte => ({
      idReporte: reporte.idReporte,
      nombre: "Auditoría Interna",
      fechaGeneracion: reporte.fechaGeneracion || "Fecha no disponible",
      ruta: reporte.ruta,
      tieneHallazgos: reporte.hallazgo && reporte.hallazgo.trim() !== "" && reporte.hallazgo.trim() !== "Sin hallazgos",
      tieneOportunidades: reporte.oportunidadesMejora && reporte.oportunidadesMejora.trim() !== "" && reporte.oportunidadesMejora.trim() !== "Sin oportunidades"
    }));
  };

  const applyFilters = () => {
    let results = [...allResults];

    if (hallazgosFilter !== 'todos') {
      results = results.filter(reporte => 
        hallazgosFilter === 'con_hallazgos' ? reporte.tieneHallazgos : !reporte.tieneHallazgos
      );
    }

    if (oportunidadesFilter !== 'todos') {
      results = results.filter(reporte => 
        oportunidadesFilter === 'con_oportunidades' ? reporte.tieneOportunidades : !reporte.tieneOportunidades
      );
    }

    setFilteredResults(results);
  };

  useEffect(() => {
    applyFilters();
  }, [hallazgosFilter, oportunidadesFilter, allResults]);

  const handleHallazgosFilterChange = (event) => {
    setHallazgosFilter(event.target.value);
  };

  const handleOportunidadesFilterChange = (event) => {
    setOportunidadesFilter(event.target.value);
  };

  const searchAuditorias = async () => {
    setLoadingResults(true);
    try {
      const params = { 
        fechaGeneracion: searchTerm,
      };
      const response = await axios.get(API_URLS.auditorias, { params });
      const reportes = formatAuditorias(response.data);
      setAllResults(reportes);
      setFilteredResults(reportes);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Error al buscar auditorías';
      setError(errorMsg);
      setAllResults([]);
      setFilteredResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleSearch = () => {
    if (!validateYear(searchTerm)) {
      setInputError(true);
      return;
    }
    setInputError(false);
    setHasSearched(true);
    searchAuditorias();
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose} PaperProps={{ sx: { width: 400 } }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Buscar Auditorías</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        
        <TextField 
          label="Ingresa el año"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          error={inputError}
          helperText={inputError && "Ingrese un año válido (4 dígitos)"}
        />
        
        <Button 
          variant="contained" 
          onClick={handleSearch} 
          sx={{ mt: 2 }}
          disabled={loadingResults}
        >
          {loadingResults ? <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} /> : 'Buscar'}
        </Button>

        {hasSearched && !loadingResults && (
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Filtrar por hallazgos</InputLabel>
              <Select 
                value={hallazgosFilter} 
                onChange={handleHallazgosFilterChange}
                label="Filtrar por hallazgos"
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="con_hallazgos">Con hallazgos</MenuItem>
                <MenuItem value="sin_hallazgos">Sin hallazgos</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Filtrar por oportunidades</InputLabel>
              <Select 
                value={oportunidadesFilter} 
                onChange={handleOportunidadesFilterChange}
                label="Filtrar por oportunidades"
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="con_oportunidades">Con oportunidades</MenuItem>
                <MenuItem value="sin_oportunidades">Sin oportunidades</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {filteredResults.length > 0 ? (
          <Grid container spacing={2} sx={{ mt: 3 }}>
            {filteredResults.map((reporte) => (
              <Grid item key={reporte.idReporte} xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {reporte.nombre}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {reporte.fechaGeneracion}
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      sx={{ mt: 2 }}
                      href={reporte.ruta} 
                      target="_blank"
                      fullWidth
                    >
                      Descargar
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : hasSearched && !loadingResults && (
          <Typography sx={{ mt: 3, textAlign: 'center' }}>
            No se encontraron auditorías con los filtros seleccionados
          </Typography>
        )}

        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError(null)} 
          message={error}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </Drawer>
  );
};

export default BuscadorAuditoria;