import{useState, useEffect} from 'react';
import{Box, Drawer, TextField, IconButton, Typography, Button, Snackbar, Grid, CircularProgress, MenuItem} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import ReportCard from '../components/ReportCard';

const BuscadorAuditoria = ({ open, onClose, searchTerm, setSearchTerm }) => {
  const [allResults, setAllResults] = useState([]);
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);

  const [auditor, setAuditor] = useState('');
  const [auditoresOptions, setAuditoresOptions] = useState([]);
  const [loadingAuditores, setLoadingAuditores] = useState(false);
  const [loadingProcesos, setLoadingProcesos] = useState(false);
  const [loadingEntidades, setLoadingEntidades] = useState(false);


  const [entidad, setEntidad] = useState('');
  const [proceso, setProceso] = useState('');
  const [entidadesOptions, setEntidadesOptions] = useState([]);
  const [procesosOptions, setProcesosOptions] = useState([]);

  const API_URLS = {
    auditorias: 'http://127.0.0.1:8000/api/buscar-auditorias',
    auditores: 'http://127.0.0.1:8000/api/auditores',
    entidades: 'http://127.0.0.1:8000/api/entidades',
    procesos: 'http://127.0.0.1:8000/api/procesos'
  };

  useEffect(() => {
    if (open) {
      fetchAuditores();
      fetchEntidades();
      fetchProcesos();
    }
  }, [open]);

  const fetchAuditores = async () => {
    setLoadingAuditores(true);
    try {
      const response = await axios.get(API_URLS.auditores);

      if (response.data.success && Array.isArray(response.data.data)) {
        const auditores = response.data.data.map(a => ({
          idUsuario: a.idUsuario,
          nombreCompleto: a.nombre
        }));

        const nombresUnicos = [...new Set(auditores.map(a => a.nombreCompleto))];

        setAuditoresOptions(nombresUnicos);
      } else {
        setAuditoresOptions([]);
      }
    } catch (err) {
      console.error("Error al obtener auditores", err);
      setAuditoresOptions([]);
    } finally {
      setLoadingAuditores(false);
    }
  };

  const fetchEntidades = async () => {
    setLoadingEntidades(true);
    try {
      const response = await axios.get(API_URLS.entidades);
      if (Array.isArray(response.data)) {
        setEntidadesOptions(response.data);
      } else if (response.data.entidades) {
        setEntidadesOptions(response.data.entidades);
      } else {
        setEntidadesOptions([]);
      }
    } catch (err) {
      console.error("Error al obtener entidades", err);
      setEntidadesOptions([]);
    } finally {
      setLoadingEntidades(false);
    }
  };

  const fetchProcesos = async () => {
    setLoadingProcesos(true);
    try {
      const response = await axios.get(API_URLS.procesos);
      if (Array.isArray(response.data)) {
        setProcesosOptions(response.data);
      } else {
        setProcesosOptions([]);
      }
    } catch (err) {
      console.error("Error al obtener procesos", err);
      setProcesosOptions([]);
    } finally {
      setLoadingProcesos(false);
    }
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      if (value.length <= 4) {
        setSearchTerm(value);
        setInputError(false);
        setError(null);
      }
    }
  };

  const validateYear = (year) => {
    if (!year.trim()) {
      setError('Por favor ingrese un año');
      setInputError(true);
      return false;
    }
    if (!/^\d+$/.test(year)) {
      setError('El año debe contener solo números');
      setInputError(true);
      return false;
    }
    if (year.length !== 4) {
      setError('El año debe tener exactamente 4 dígitos');
      setInputError(true);
      return false;
    }
    setInputError(false);
    setError(null);
    return true;
  };

  const formatAuditorias = (data) => {
    return data.map(reporte => ({
      idReporte: reporte.idReporte,
      idAuditorialInterna: reporte.idAuditorialInterna,
      nombre: "Auditoría Interna",
      fechaGeneracion: reporte.fechaGeneracion || "Fecha no disponible",
      ruta: reporte.ruta,
      entidad: reporte.entidad || "Sin entidad",
      lider: reporte.auditorLider || "Sin líder" 
    }));
  };

  const searchAuditorias = async () => {
    setLoadingResults(true);
    try {
      const params = { 
        fechaGeneracion: searchTerm,
        auditor,
        idEntidad: entidad,
        idProceso: proceso
      };
      const response = await axios.get(API_URLS.auditorias, { params });
      const reportes = formatAuditorias(response.data);
      setAllResults(reportes);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Error al buscar auditorías';
      setError(errorMsg);
      setAllResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleSearch = () => {
    if (!validateYear(searchTerm)) return;
    setHasSearched(true);
    searchAuditorias();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDelete = (id) => {
    setAllResults(allResults.filter(r => r.idReporte !== id));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setAuditor('');
    setEntidad('');
    setProceso('');
    setAllResults([]);
    setHasSearched(false);
    setError(null);
    setInputError(false);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 450 } }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Buscar Auditorías</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        <TextField
          label="Año (4 dígitos)"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleYearChange}
          onKeyPress={handleKeyPress}
          error={inputError}
          helperText={inputError ? "Ingrese un año válido (4 dígitos)" : "Ejemplo: 2023"}
          inputProps={{
            maxLength: 4,
            inputMode: 'numeric',
            pattern: '[0-9]*'
          }}
          placeholder="2023"
          sx={{ mb: 2 }}
        />

        <TextField
          select
          label="Auditor (opcional)"
          variant="outlined"
          fullWidth
          value={auditor}
          onChange={(e) => setAuditor(e.target.value)}
          sx={{ mb: 2 }}
          disabled={false}
        >
          <MenuItem value="">
            <em>Todos los auditores</em>
          </MenuItem>
          {loadingAuditores ? (
            <MenuItem disabled>
              <CircularProgress size={20} sx={{ mr: 1 }} /> Cargando auditores...
            </MenuItem>
          ) : (
            auditoresOptions.map((nombreAuditor, index) => (
              <MenuItem key={index} value={nombreAuditor}>
                {nombreAuditor}
              </MenuItem>
            ))
          )}
        </TextField>

        <TextField
          select
          label="Entidad (opcional)"
          variant="outlined"
          fullWidth
          value={entidad || ''}
          onChange={(e) => setEntidad(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="">
            <em>Todas las entidades</em>
          </MenuItem>

          {loadingEntidades && (
            <MenuItem disabled>
              <CircularProgress size={20} sx={{ mr: 1 }} /> Cargando entidades...
            </MenuItem>
          )}

          {!loadingEntidades &&
            entidadesOptions.map((e) => (
              <MenuItem key={e.idEntidadDependencia} value={e.idEntidadDependencia}>
                {e.nombreEntidad}
              </MenuItem>
            ))}
        </TextField>

        <TextField
          select
          label="Proceso (opcional)"
          variant="outlined"
          fullWidth
          value={proceso}
          onChange={(e) => setProceso(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="">
            <em>Todos los procesos</em>
          </MenuItem>

          {loadingProcesos && (
            <MenuItem disabled>
              <CircularProgress size={20} sx={{ mr: 1 }} /> Cargando procesos...
            </MenuItem>
          )}

          {!loadingProcesos &&
            procesosOptions.map((p) => (
              <MenuItem key={p.idProceso} value={p.idProceso}>
                {p.nombreProceso}
              </MenuItem>
            ))}
        </TextField>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loadingResults || searchTerm.length !== 4}
            sx={{ flex: 1 }}
          >
            {loadingResults ? <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} /> : 'Buscar'}
          </Button>

          <Button
            variant="outlined"
            onClick={handleClearFilters}
            sx={{ flex: 1 }}
          >
            Limpiar
          </Button>
        </Box>

        {hasSearched && (
          <Box sx={{ mt: 3 }}>
            {allResults.length > 0 ? (
              <Grid container spacing={2}>
                {allResults.map((reporte) => (
                  <Grid item key={reporte.idReporte} xs={12}>
                    <ReportCard report={reporte} onDelete={handleDelete} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography sx={{ mt: 3, textAlign: 'center' }}>
                No se encontraron auditorías
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
        />
      </Box>
    </Drawer>
  );
};

export default BuscadorAuditoria;