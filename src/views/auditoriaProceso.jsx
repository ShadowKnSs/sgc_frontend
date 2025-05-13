import React, { useEffect, useState } from "react";
import Permiso from "../hooks/userPermiso";
import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Title from "../components/Title";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MensajeAlert from '../components/MensajeAlert';
import ErrorAlert from '../components/ErrorAlert';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import axios from "axios";
import { CircularProgress } from '@mui/material';


const AuditoriaProceso = () => {
  const { idRegistro } = useParams(); // ID de la carpeta (representa el año)
  const location = useLocation();
  const navigate = useNavigate();
  const idProceso = location.state?.idProceso;
  const soloLectura = location.state?.soloLectura ?? true;
  const puedeEditar = location.state?.puedeEditar ?? false;
  const [nombreProceso, setNombreProceso] = useState("");
  const [nombreEntidad, setNombreEntidad] = useState("");
  const [auditorias, setAuditorias] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [anioRegistro, setAnioRegistro] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [auditoriaAEliminar, setAuditoriaAEliminar] = useState(null);
  const [errorCarga, setErrorCarga] = useState(null);
  const [cargando, setCargando] = useState(true);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleGenerarInforme = () => {
    handleMenuClose();
    navigate("/informe-auditoria", {
      state: { idProceso, idRegistro, nombreProceso, nombreEntidad },
    });
  };

  const handleEditar = (auditoria) => {
    navigate("/informe-auditoria", {
      state: {
        modoEdicion: true,
        datosAuditoria: auditoria,
        idProceso,
        idRegistro,
        nombreProceso,
        nombreEntidad
      }
    });
  };

  const confirmarEliminar = (auditoria) => {
    setAuditoriaAEliminar(auditoria);
    setConfirmDialogOpen(true);
  };

  const handleEliminar = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/auditorias/${auditoriaAEliminar.idAuditorialInterna}`);
      setAuditorias(prev => prev.filter(a => a.idAuditorialInterna !== auditoriaAEliminar.idAuditorialInterna));
      setMensaje({ tipo: 'success', texto: 'Auditoría eliminada correctamente' });
    } catch (err) {
      console.error(err);
      setError('Error al eliminar auditoría');
    } finally {
      setConfirmDialogOpen(false);
      setAuditoriaAEliminar(null);
    }
  };
  
  const fetchAnioRegistro = async () => {
  try {
      const res = await axios.get(`http://localhost:8000/api/registros/${idRegistro}`);
      setAnioRegistro(res.data.año);
    } catch (error) {
      console.error("Error al obtener el año del registro:", error);
    }
  };

  useEffect(() => {
    if (!idProceso || !idRegistro) return;

    const fetchAuditorias = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/auditorias/registro-anio/${idRegistro}`);
        setAuditorias(res.data);
      } catch (error) {
        console.error("Error al cargar auditorías:", error);
        setErrorCarga("Error al cargar las auditorías del proceso.");
      } finally {
        setCargando(false);
      }
    };

    const fetchNombreProcesoYEntidad = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/procesos/${idProceso}`);
        console.log("Respuesta del proceso:", res.data);
        const proceso = res.data.proceso;

        setNombreProceso(proceso.nombreProceso);

        const entidadRes = await axios.get(`http://localhost:8000/api/entidades/${proceso.idEntidad}`);
        setNombreEntidad(entidadRes.data.nombreEntidad);
      } catch (error) {
        console.error("Error al obtener proceso o entidad:", error);
        setErrorCarga("No se pudo obtener la información del proceso o entidad.");
      }
    };

    fetchAuditorias();
    fetchNombreProcesoYEntidad();
    fetchAnioRegistro();

  }, [idProceso, idRegistro]);


  if (!idProceso) {
    if (errorCarga) {
      return <ErrorAlert message={errorCarga} />;
    }
    return (
      <Typography variant="h6" color="error" sx={{ mt: 4, textAlign: "center" }}>
        Error: ID del proceso no recibido.
      </Typography>
    );
  }

  if (cargando) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="40vh">
        <CircularProgress size={60} thickness={5} />
        <Typography variant="subtitle1" mt={2}>
          Cargando auditorías...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {mensaje && (
        <MensajeAlert tipo={mensaje.tipo} texto={mensaje.texto} onClose={() => setMensaje(null)} />
      )}
      {error && (
        <ErrorAlert message={error} />
      )}
      <ConfirmDeleteDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleEliminar}
        itemName={`la auditoría del ${new Date(auditoriaAEliminar?.fecha || '').toLocaleDateString()}`}
      />
      <Title text={`Auditorías del Proceso de ${nombreProceso} de la ${nombreEntidad}`} />
      <Grid container spacing={3}>
        {auditorias.length === 0 ? (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
            <Typography variant="body1" color="text.secondary" align="center">
              No se han registrado auditorías en el año {anioRegistro}.
            </Typography>
          </Grid>
        ) : (
          auditorias.map((auditoria, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper elevation={3} sx={{ p: 3, borderLeft: "5px solid #004A98", position: 'relative' }}>
                <Typography variant="h6" fontWeight="bold">
                  {auditoria?.registro?.proceso?.nombreProceso || "Proceso desconocido"}
                </Typography>
                <Typography variant="body2"><strong>Entidad:</strong> {auditoria?.registro?.proceso?.entidad?.nombreEntidad || "Entidad desconocida"}</Typography>
                <Typography variant="body2"><strong>Líder:</strong> {auditoria.auditorLider || "No asignado"}</Typography>
                <Typography variant="body2"><strong>Fecha:</strong> {new Date(auditoria.fecha).toLocaleDateString()}</Typography>

                {/* Botones */}
                <Box mt={2} display="flex" gap={1}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleEditar(auditoria)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => confirmarEliminar(auditoria)}
                  >
                    Eliminar
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>

      {!soloLectura && puedeEditar && (
        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: 20, right: 20 }}
          onClick={() => navigate("/informe-auditoria-interna", { state: { idProceso } })}
        >
          <AddIcon />
        </Fab>
      )}
      { ( //incluir el permiso de editar o leer
        <>
          <Fab
            color="primary"
            aria-label="more"
            sx={{ position: "fixed", bottom: 20, right: 20 }}
            onClick={handleMenuOpen}
          >
            <AddIcon />
          </Fab>

          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
            <MenuItem onClick={handleGenerarInforme}>Generar nuevo informe</MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
};

export default AuditoriaProceso;
