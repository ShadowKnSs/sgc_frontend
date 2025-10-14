import { useState, useEffect, useCallback } from 'react';
import { Box, Drawer, TextField, IconButton, Typography, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import ReportCard from "../components/CardReport";
import FeedbackSnackbar from "../components/Feedback"; // Importar el componente personalizado

const BuscadorProceso = ({ open, onClose, searchTerm, setSearchTerm }) => {
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [inputError, setInputError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [selectedProceso, setSelectedProceso] = useState('todos');
  const [procesos, setProcesos] = useState([]);
  const [lider, setLider] = useState("");
  const [leaders, setLeaders] = useState([]);
  const [procesoFilter, setProcesoFilter] = useState("");
  
  // Estado para el FeedbackSnackbar
  const [fb, setFb] = useState({ 
    open: false, 
    type: "info", 
    title: "", 
    message: "" 
  });

  const API_URL = 'http://127.0.0.1:8000/api/procesos-buscar';

  // Función helper para mostrar feedback
  const showFb = (type, title, message) => {
    setFb({ open: true, type, title, message });
  };

  // Validación más flexible del año
  const validateYear = (year) => {
    if (year.trim() === "") {
      return true;
    }
    if (!/^\d+$/.test(year)) {
      showFb("error", "Error de validación", "El año debe contener solo números");
      return false;
    }
    if (year.length !== 4) {
      showFb("error", "Error de validación", "El año debe tener 4 dígitos");
      return false;
    }
    return true;
  };

  // Mover filterByProceso ANTES de los useEffect que la usan
  const filterByProceso = useCallback((procesoId) => {
    if (procesoId === 'todos') {
      setFilteredResults(allResults);
    } else {
      const filtered = allResults.filter(item => item.idProceso === procesoId);
      setFilteredResults(filtered);
    }
  }, [allResults]);

  // Cargar procesos y líderes al abrir el drawer
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Cargar líderes
        const leadersResponse = await axios.get('http://127.0.0.1:8000/api/lideres');
        if (leadersResponse.status === 200) {
          const leadersData = leadersResponse.data.leaders.map(l => ({
            idUsuario: l.idUsuario,
            nombreCompleto: `${l.nombre} ${l.apellidoPat} ${l.apellidoMat}`
          }));
          setLeaders(leadersData);
        }

        // Cargar procesos para el dropdown de filtro
        const procesosResponse = await axios.get('http://127.0.0.1:8000/api/procesos-con-entidad');
        if (procesosResponse.data?.procesos) {
          setProcesos(procesosResponse.data.procesos);
        }
      } catch (err) {
        console.error("Error cargando datos iniciales:", err);
        showFb("error", "Error", "Error al cargar los datos iniciales");
      }
    };

    if (open) {
      fetchInitialData();
    }
  }, [open]);

  useEffect(() => {
    filterByProceso(selectedProceso);
  }, [selectedProceso, filterByProceso]);

  const searchProcesos = async () => {
    setLoadingResults(true);
    try {
      const response = await axios.get(API_URL, { 
        params: { 
          anio: searchTerm.trim() || null,
          lider: lider || null,
          proceso: procesoFilter || null
        }
      });
      
      if (response.data.success) {
        const transformedData = response.data.data.map(item => ({
          idReporteProceso: item.id,
          nombreReporte: item.nombre || 'Reporte sin nombre',
          fechaElaboracion: item.fecha,
          anio: item.anio,
          idProceso: item.idProceso,
          proceso: { nombreProceso: item.nombreProceso },
          entidad: { nombreEntidad: item.nombreEntidad },
          ruta: item.ruta
        }));
        
        setAllResults(transformedData);
        setFilteredResults(transformedData);
        
        if (transformedData.length === 0) {
          showFb("info", "Búsqueda completada", "No se encontraron reportes con los criterios especificados");
        } else {
          showFb("success", "Búsqueda completada", `Se encontraron ${transformedData.length} reportes`);
        }
      } else {
        showFb("error", "Error en la búsqueda", response.data.message || 'No se encontraron resultados');
        setAllResults([]);
        setFilteredResults([]);
      }
    } catch (error) {
      showFb("error", "Error de conexión", 'Error al conectar con el servidor. Intente nuevamente.');
      setAllResults([]);
      setFilteredResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleSearch = () => {
    // Validar que al menos un criterio esté presente
    if (searchTerm.trim() === "" && lider === "" && procesoFilter === "") {
      showFb("warning", "Filtros requeridos", 'Por favor ingrese al menos un criterio de búsqueda (año, líder o proceso)');
      setInputError(true);
      return;
    }

    if (!validateYear(searchTerm)) {
      setInputError(true);
      return;
    }

    setInputError(false);
    setHasSearched(true);
    setSelectedProceso('todos');
    searchProcesos();
  };

  const handleFilterChange = (event) => {
    setSelectedProceso(event.target.value);
  };

  const handleDeleteReport = async (reporte) => {
    try {
      await axios.delete(`http://localhost:8000/api/reportes-proceso/${reporte.idReporteProceso}`);
      await searchProcesos();
      showFb("success", "Eliminado", "Reporte eliminado correctamente");
    } catch (err) {
      showFb("error", "Error", "Error al eliminar el reporte.");
    }
  };

  const getSearchDescription = () => {
    const conditions = [];
    
    if (searchTerm) conditions.push(`año ${searchTerm}`);
    if (lider) {
      const leaderName = leaders.find(l => l.idUsuario === lider)?.nombreCompleto;
      if (leaderName) conditions.push(`líder ${leaderName}`);
    }
    if (procesoFilter) {
      const proceso = procesos.find(p => p.idProceso === procesoFilter);
      if (proceso) conditions.push(`proceso ${proceso.nombreCompleto}`);
    }
    
    if (conditions.length > 0) {
      return `para ${conditions.join(' y ')}`;
    } else {
      return 'mostrando todos los reportes';
    }
  };

  // Limpiar todos los filtros
  const handleClearFilters = () => {
    setSearchTerm("");
    setLider("");
    setProcesoFilter("");
    setAllResults([]);
    setFilteredResults([]);
    setHasSearched(false);
    setInputError(false);
  };

  return (
    <Drawer 
      anchor="right" 
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
        
        {/* --- Input Año (opcional) --- */}
        <TextField 
          label="Año del reporte (opcional - 4 dígitos)"
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
          helperText={inputError ? "Ingrese un año válido (ej. 2023) o deje vacío" : ""}
          sx={{ mb: 2 }}
        />

        {/* --- Select de líderes (opcional) --- */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="lider-filter-label">Filtrar por líder (opcional)</InputLabel>
          <Select
            labelId="lider-filter-label"
            value={lider}
            onChange={(e) => setLider(e.target.value)}
            label="Filtrar por líder (opcional)"
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

        {/* --- Select de procesos (opcional) --- */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="proceso-filter-label">Filtrar por proceso (opcional)</InputLabel>
          <Select
            labelId="proceso-filter-label"
            value={procesoFilter}
            onChange={(e) => setProcesoFilter(e.target.value)}
            label="Filtrar por proceso (opcional)"
            sx={{ '& .MuiSelect-select': { py: 1.5 } }}
          >
            <MenuItem value="">
              <em>Todos los procesos</em>
            </MenuItem>
            {procesos.map((proceso) => (
              <MenuItem key={proceso.idProceso} value={proceso.idProceso}>
                {proceso.nombreCompleto}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* --- Botones de acción --- */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button 
            variant="contained" 
            onClick={handleSearch} 
            disabled={loadingResults}
            sx={{ 
              flex: 1, 
              py: 1.5, 
              fontWeight: 'bold', 
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' } 
            }}
          >
              Buscar Reportes
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={handleClearFilters}
            sx={{ 
              flex: 0.5,
              py: 1.5
            }}
          >
            Limpiar
          </Button>
        </Box>

        {/* --- Filtro de proceso (después de la búsqueda) --- */}
        {hasSearched && !loadingResults && allResults.length > 0 && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="proceso-result-filter-label">Filtrar resultados por proceso</InputLabel>
            <Select
              labelId="proceso-result-filter-label"
              value={selectedProceso}
              onChange={handleFilterChange}
              label="Filtrar resultados por proceso"
              sx={{ '& .MuiSelect-select': { py: 1.5 } }}
            >
              <MenuItem value="todos">
                <Typography fontWeight="medium">Todos los procesos</Typography>
              </MenuItem>
              {[...new Set(allResults.map(item => item.idProceso))].map(idProceso => {
                const proceso = allResults.find(item => item.idProceso === idProceso);
                return (
                  <MenuItem key={idProceso} value={idProceso}>
                    {proceso.proceso.nombreProceso} - {proceso.entidad.nombreEntidad}
                  </MenuItem>
                );
              })}
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
                  Mostrando <strong>{filteredResults.length}</strong> de <strong>{allResults.length}</strong> reportes {' '}
                  {getSearchDescription()}
                </Typography>
                <Box sx={{ 
                  maxHeight: '60vh', 
                  overflowY: 'auto', 
                  width: '100%',
                  '&::-webkit-scrollbar': { width: '8px' },
                  '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
                  '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '4px' }
                }}>
                  {filteredResults.map((reporte) => (
                    <Box key={reporte.idReporteProceso} sx={{ 
                      mb: 2, 
                      width: '100%',
                      '& .MuiPaper-root': { 
                        width: '100% !important', 
                        maxWidth: '100% !important', 
                        margin: 0 
                      } 
                    }}>
                      <ReportCard
                        report={reporte}
                        onDelete={() => handleDeleteReport(reporte)}
                      />
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
                No se encontraron reportes {getSearchDescription()}.
              </Typography>
            )}
          </Box>
        )}

        {/* --- FeedbackSnackbar personalizado --- */}
        <FeedbackSnackbar
          open={fb.open}
          type={fb.type}
          title={fb.title}
          message={fb.message}
          onClose={() => setFb({ ...fb, open: false })}
          autoHideDuration={6000}
        />
      </Box>
    </Drawer>
  );
};

export default BuscadorProceso;