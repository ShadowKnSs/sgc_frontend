import{useState, useEffect} from 'react';
import{Box, Drawer, TextField, IconButton, Typography, Button, Snackbar, CircularProgress, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import ReportCard from "../components/CardReport";

const BuscadorProceso = ({ open, onClose, searchTerm, setSearchTerm }) => {
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [selectedProceso, setSelectedProceso] = useState('todos');
  const [procesos, setProcesos] = useState([]);
  const [lider, setLider] = useState("");
  const [leaders, setLeaders] = useState([]);

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
    const fetchLeaders = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/lideres');
        if (response.status === 200) {
          const leadersData = response.data.leaders.map(l => ({
            idUsuario: l.idUsuario,
            nombreCompleto: `${l.nombre} ${l.apellidoPat} ${l.apellidoMat}`
          }));
          setLeaders(leadersData);
        } else {
          setLeaders([]);
        }
      } catch (err) {
        console.error("Error cargando líderes:", err);
        setLeaders([]);
      }
    };

    fetchLeaders();
  }, []);

  useEffect(() => {
    const fetchOnLeaderChange = async () => {
      if (validateYear(searchTerm)) {
        setHasSearched(true);
        await searchProcesos();
      }
    };

    if (searchTerm.length === 4) {
      fetchOnLeaderChange();
    }
  }, [lider]);

  useEffect(() => {
    filterByProceso(selectedProceso);
  }, [selectedProceso, allResults]);

  const searchProcesos = async () => {
    setLoadingResults(true);
    try {
      const response = await axios.get(API_URL, { 
        params: { anio: searchTerm, lider }
      });
      
      if (response.data.success) {
        const transformedData = response.data.data.map(item => ({
          idReporteProceso: item.id,
          nombreReporte: item.nombre || 'Reporte sin nombre',
          fechaElaboracion: item.fecha,
          anio: searchTerm,
          idProceso: item.idProceso,
          proceso: { nombreProceso: item.nombreProceso },
          entidad: { nombreEntidad: item.nombreEntidad }
        }));
        
        setAllResults(transformedData);
        setProcesos(response.data.procesos);
        setLeaders(response.data.leaders || []);
        setFilteredResults(transformedData);
      } else {
        setError(response.data.message || 'No se encontraron resultados');
        setAllResults([]);
        setFilteredResults([]);
        setProcesos([]);
        setLeaders([]);
      }
    } catch (error) {
      setError('Error al conectar con el servidor. Intente nuevamente.');
      setAllResults([]);
      setFilteredResults([]);
      setProcesos([]);
      setLeaders([]);
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
        sx: { width: 450, overflowY: 'auto' }
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* --- Cabecera --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, borderBottom: '1px solid #eee', pb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Buscar Reportes de Procesos
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* --- Input Año --- */}
        <TextField 
          label="Año del reporte (4 dígitos)"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 4);
            setSearchTerm(value);
          }}
          inputProps={{
            inputMode: "numeric", 
            pattern: "[0-9]*",   
            maxLength: 4   
          }}
          error={inputError}
          helperText={inputError ? "Ingrese un año válido (ej. 2023)" : ""}
          sx={{ mb: 2 }}
        />

        {/* --- Select de líderes --- */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="lider-filter-label">Filtrar por líder</InputLabel>
          <Select
            labelId="lider-filter-label"
            value={lider}
            onChange={(e) => setLider(e.target.value)}
            label="Filtrar por líder"
            sx={{ '& .MuiSelect-select': { py: 1.5 } }}
          >
            <MenuItem value="">
              <em>Todos los líderes</em>
            </MenuItem>
            {leaders.map((l) => (
              <MenuItem key={l.idUsuario} value={l.idUsuario}>
                {l.nombreCompleto}
              </MenuItem>

            ))}
          </Select>
        </FormControl>

        {/* --- Botón Buscar --- */}
        <Button 
          variant="contained" 
          onClick={handleSearch} 
          disabled={loadingResults}
          fullWidth
          sx={{ py: 1.5, mb: 3, fontWeight: 'bold', backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' } }}
        >
          {loadingResults ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            'Buscar Reportes'
          )}
        </Button>

        {/* --- Filtro de proceso --- */}
        {hasSearched && !loadingResults && procesos.length > 0 && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="proceso-filter-label">Filtrar por proceso</InputLabel>
            <Select
              labelId="proceso-filter-label"
              value={selectedProceso}
              onChange={handleFilterChange}
              label="Filtrar por proceso"
              sx={{ '& .MuiSelect-select': { py: 1.5 } }}
            >
              <MenuItem value="todos">
                <Typography fontWeight="medium">Todos los procesos</Typography>
              </MenuItem>
              {procesos.map((proceso) => (
                <MenuItem key={proceso.idProceso} value={proceso.idProceso}>
                  {proceso.nombreCompleto}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* --- Resultados usando ReportCard --- */}
        {hasSearched && (
          <Box sx={{ mt: 2 }}>
            {loadingResults ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : filteredResults.length > 0 ? (
              <>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Mostrando <strong>{filteredResults.length}</strong> de <strong>{allResults.length}</strong> reportes 
                  para <strong>{searchTerm}</strong>
                  {lider && (
                    <> con líder <strong>{leaders.find(l => l.idUsuario === lider)?.nombreCompleto}</strong></>
                  )}
                </Typography>
                <Box sx={{ maxHeight: '60vh', overflowY: 'auto', width: '100%',
                  '&::-webkit-scrollbar': { width: '8px' },
                  '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
                  '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '4px' } }}>
                  {filteredResults.map((reporte) => (
                    <Box key={reporte.idReporteProceso} sx={{ mb: 2, width: '100%',
                      '& .MuiPaper-root': { width: '100% !important', maxWidth: '100% !important', margin: 0 } }}>
                      <ReportCard
                        report={reporte}
                        onClick={() => console.log("Clicked report:", reporte)}
                        onDelete={() => console.log("Delete report:", reporte)}
                      />
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
                No se encontraron reportes.
              </Typography>
            )}
          </Box>
        )}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          message={error}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ '& .MuiSnackbarContent-root': { fontWeight: 'bold', backgroundColor: '#d32f2f' } }}
        />
      </Box>
    </Drawer>
  );
};

export default BuscadorProceso;