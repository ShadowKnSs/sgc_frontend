import React, { useState, useEffect } from 'react';
import { Box, Drawer, TextField, IconButton, Typography, Button, Snackbar, Grid, Card, CardContent, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const BuscadorProceso = ({ open, onClose, searchTerm, setSearchTerm }) => {
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [selectedProceso, setSelectedProceso] = useState('todos');
  const [procesos, setProcesos] = useState([]);

  const API_URL = 'http://127.0.0.1:8000/api/procesos-buscar';

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

  const filterByProceso = (procesoId) => {
    if (procesoId === 'todos') {
      setFilteredResults(allResults);
    } else {
      const filtered = allResults.filter(item => item.idProceso === procesoId);
      setFilteredResults(filtered);
    }
  };

  useEffect(() => {
    filterByProceso(selectedProceso);
  }, [selectedProceso, allResults]);

  const searchProcesos = async () => {
    setLoadingResults(true);
    try {
      const response = await axios.get(API_URL, { 
        params: { anio: searchTerm } 
      });
      
      if (response.data.success) {
        setAllResults(response.data.data);
        setProcesos(response.data.procesos);
        setFilteredResults(response.data.data);
      } else {
        setError(response.data.message || 'No se encontraron resultados');
        setAllResults([]);
        setFilteredResults([]);
        setProcesos([]);
      }
    } catch (error) {
      setError('Error al conectar con el servidor. Intente nuevamente.');
      setAllResults([]);
      setFilteredResults([]);
      setProcesos([]);
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
    setError(null);
    setHasSearched(true);
    setSelectedProceso('todos');
    searchProcesos();
  };


  const handleFilterChange = (event) => {
    setSelectedProceso(event.target.value);
  };

  return (
    <Drawer 
      anchor="left" 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: { 
          width: 450,
          overflowY: 'auto'
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          borderBottom: '1px solid #eee',
          pb: 2
        }}>
          <Typography variant="h5" fontWeight="bold">
            Buscar Reportes de Procesos
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <TextField 
          label="Año del reporte (4 dígitos)"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          error={inputError}
          helperText={inputError ? "Ingrese un año válido (ej. 2023)" : ""}
          sx={{ mb: 2 }}
        />
        
        <Button 
          variant="contained" 
          onClick={handleSearch} 
          disabled={loadingResults}
          fullWidth
          sx={{ 
            py: 1.5,
            mb: 3,
            fontWeight: 'bold',
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0'
            }
          }}
        >
          {loadingResults ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            'Buscar Reportes'
          )}
        </Button>

        {hasSearched && !loadingResults && procesos.length > 0 && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="proceso-filter-label">Filtrar por proceso</InputLabel>
            <Select
              labelId="proceso-filter-label"
              value={selectedProceso}
              onChange={handleFilterChange}
              label="Filtrar por proceso"
              sx={{
                '& .MuiSelect-select': {
                  py: 1.5
                }
              }}
            >
              <MenuItem value="todos">
                <Typography fontWeight="medium">Todos los procesos</Typography>
              </MenuItem>
              {procesos.map((proceso) => (
                <MenuItem 
                  key={proceso.idProceso} 
                  value={proceso.idProceso}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{proceso.nombreProceso}</span>
                  <Typography 
                    variant="caption" 
                    color="textSecondary"
                    sx={{ ml: 1 }}
                  >
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {hasSearched && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {filteredResults.length > 0 ? (
                <>
                  Mostrando <strong>{filteredResults.length}</strong> de <strong>{allResults.length}</strong> reportes para <strong>{searchTerm}</strong>
                  {selectedProceso !== 'todos' && (
                    <span> (filtrado por <strong>{
                      procesos.find(p => p.idProceso === selectedProceso)?.nombreProceso || 'proceso seleccionado'
                    }</strong>)</span>
                  )}
                </>
              ) : (
                `No hay reportes para ${searchTerm}${
                  selectedProceso !== 'todos' ? ' con el filtro aplicado' : ''
                }`
              )}
            </Typography>

            {loadingResults ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: 200
              }}>
                <CircularProgress />
              </Box>
            ) : filteredResults.length > 0 ? (
              <Grid container spacing={2}>
                {filteredResults.map((reporte) => (
                  <Grid item xs={12} key={reporte.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        transition: 'box-shadow 0.3s',
                        '&:hover': {
                          boxShadow: 2
                        }
                      }}
                    >
                      <CardContent>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            mb: 1,
                            color: '#1976d2'
                          }}
                        >
                          {reporte.nombre || 'Reporte sin nombre'}
                        </Typography>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap',
                          gap: 2,
                          mb: 2
                        }}>
                          <Typography variant="body2">
                            <strong>Fecha:</strong> {reporte.fecha}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                p: 4,
                border: '1px dashed #ddd',
                borderRadius: 1,
                backgroundColor: '#f9f9f9'
              }}>
                <Typography variant="body1" color="textSecondary">
                  {allResults.length === 0 
                    ? `No se encontraron reportes para el año ${searchTerm}`
                    : `No hay resultados para el filtro seleccionado`}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          message={error}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ 
            '& .MuiSnackbarContent-root': { 
              fontWeight: 'bold',
              backgroundColor: '#d32f2f'
            } 
          }}
        />
      </Box>
    </Drawer>
  );
};

export default BuscadorProceso;