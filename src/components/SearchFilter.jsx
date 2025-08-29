import React, { useState } from 'react';
import { Box, Drawer, TextField, IconButton, Typography, Button, Snackbar, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import ReporteSemCard from "../components/componentsReportSem/CardReportSem";

const SearchFilter = ({ open, onClose, searchTerm, setSearchTerm }) => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState(false);

  const handleSearch = () => {
    // Validación 1: Campo vacío
    if (!searchTerm.trim()) {
      setError('Por favor ingrese un año');
      setInputError(true);
      setResults([]);
      return;
    }

    // Validación 2: Solo números
    if (!/^\d+$/.test(searchTerm)) {
      setError('El año debe contener solo números');
      setInputError(true);
      setResults([]);
      return;
    }

    // Validación 3: Exactamente 4 dígitos
    if (searchTerm.length !== 4) {
      setError('El año debe tener 4 dígitos');
      setInputError(true);
      setResults([]);
      return;
    }

    // Si pasa todas las validaciones
    setInputError(false);
    
    axios.get('http://127.0.0.1:8000/api/buscar-por-anio', {
      params: { anio: searchTerm }
    })
    .then(response => {
      const reportes = response.data.map(reporte => ({
        idReporteSemestral: reporte.idReporteSemestral,
        anio: reporte.anio,
        periodo: reporte.periodo,
        fechaGeneracion: reporte.fechaGeneracion || "Fecha no disponible",
        ubicacion: reporte.ubicacion
      }));
      setResults(reportes);
      setError(null);
    })
    .catch(error => {
      console.error("Error al obtener los reportes:", error);
      setError('No se encontraron reportes para el año especificado.');
      setResults([]);
    });
  };

  // Validación en tiempo real del input
  const handleInputChange = (e) => {
    const value = e.target.value;
    // Solo permite números y máximo 4 caracteres
    if (value === '' || (/^\d{0,4}$/.test(value))) {
      setSearchTerm(value);
      setInputError(false);
      setError(null);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 3 }}>
        {/* Título y botón de cerrar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Buscar Reportes</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Campo de búsqueda con validación */}
        <TextField 
          label="Ingresa el año"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          error={inputError}
          inputProps={{
            maxLength: 4,
            inputMode: 'numeric'
          }}
        />

        {/* Botón de búsqueda */}
        <Button 
          variant="contained" 
          onClick={handleSearch} 
          sx={{ 
            mt: 2,
            backgroundColor: "#004A98",
            "&:hover": { backgroundColor: "#003366" }
          }}
        >
          Buscar
        </Button>

        {/* Mostrar resultados */}
        {results.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Resultados:</Typography>
            <Grid container spacing={2}>
              {results.map((reporte) => (
                <Grid item key={reporte.idReporteSemestral} xs={12}>
                  <ReporteSemCard
                    anio={reporte.anio}
                    periodo={reporte.periodo}
                    fechaGeneracion={reporte.fechaGeneracion}
                    ubicacion={reporte.ubicacion}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Mostrar errores */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => {
            setError(null);
            setInputError(false);
          }}
          message={error}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </Drawer>
  );
};

export default SearchFilter;