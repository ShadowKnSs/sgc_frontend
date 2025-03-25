import React, { useState } from 'react';
import { Box, Drawer, TextField, IconButton, Typography, Button, Snackbar, Card, CardContent, CardActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const SearchFilter = ({ open, onClose, searchTerm, setSearchTerm }) => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = () => {
    axios.get('http://127.0.0.1:8000/api/buscar-por-anio', {
      params: { anio: searchTerm }
    })
    .then(response => {
      const reportes = response.data.map(reporte => ({
        id: reporte.idReporteSemestral,
        anio: reporte.anio,
        periodo: reporte.periodo,
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

  const handleDownload = (ubicacion) => {
    window.open(ubicacion, '_blank');
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 300, p: 3 }}>
        {/* Título y botón de cerrar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Buscar Formatos</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Campo de búsqueda */}
        <TextField 
          label="Ingresa el año"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />

        {/* Botón de búsqueda */}
        <Button variant="contained" onClick={handleSearch} sx={{ mt: 2 }}>
          Buscar
        </Button>

        {/* Mostrar resultados en tarjetas */}
        {results.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Resultados:</Typography>
            {results.map((reporte) => (
              <Card key={reporte.id} sx={{ mt: 2, p: 1 }}>
                <CardContent>
                  <Typography variant="body1"><strong>{reporte.periodo}</strong></Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleDownload(reporte.ubicacion)}
                  >
                    Descargar
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}

        {/* Mostrar error si no hay resultados */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          message={error}
        />
      </Box>
    </Drawer>
  );
};

export default SearchFilter;
