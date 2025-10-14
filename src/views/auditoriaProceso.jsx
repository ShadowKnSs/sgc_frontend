/**
 * Componente: AuditoriaProceso
 * Ubicación: src/views/AuditoriaProceso.jsx
 * Descripción:
 * Vista principal para mostrar todas las auditorías internas registradas en un proceso específico y su registro por año (`idRegistro`).

 * Funcionalidades:
 * 1. ✅ Muestra todas las auditorías internas asociadas al `idRegistro` (año) y `idProceso`.
 * 2. ✅ Permite navegar a la vista de creación o edición del informe de auditoría.
 * 3. ✅ Ofrece la eliminación de auditorías con confirmación.
 * 4. ✅ Usa el valor de `soloLectura` y `puedeEditar` para controlar permisos del usuario.
 * 5. ✅ Utiliza un botón flotante con un menú para elegir acciones (crear informe).
 * 6. ✅ Obtiene y muestra los nombres de la entidad y del proceso actual.
 * 7. ✅ Muestra mensajes y errores con componentes personalizados (`MensajeAlert`, `ErrorAlert`).

 * Props externas:
 * - `idProceso` y `soloLectura` se reciben desde `location.state` o desde `localStorage`.

 * Hooks:
 * - `useParams`: para obtener `idRegistro` desde la URL.
 * - `useNavigate`, `useLocation`: navegación y recepción de props vía `state`.
 * - `useEffect`: para cargar auditorías, nombres del proceso y entidad, y el año del registro.

 * Estados principales:
 * - `auditorias`: lista de auditorías para el proceso y registro.
 * - `nombreProceso`, `nombreEntidad`: nombres de proceso y entidad mostrados como título.
 * - `anioRegistro`: año del registro actual, usado como contexto.
 * - `mensaje`, `error`, `errorCarga`: usados para mostrar alertas.
 * - `confirmDialogOpen`, `auditoriaAEliminar`: controlan el modal de confirmación de eliminación.
 * - `anchorEl`: maneja el anclaje del `Menu` para acciones de creación.

 * Reutiliza:
 * - `Title`: encabezado estilizado.
 * - `MensajeAlert`, `ErrorAlert`: alertas visuales.
 * - `ConfirmDeleteDialog`: modal de confirmación para eliminar auditorías.

 * UX/UI:
 * - Muestra tarjetas (`Paper`) individuales para cada auditoría.
 * - Fab (`+`) flotante para crear o acceder a opciones de creación de informes.
 * - Loading central con `CircularProgress` si no se han cargado los datos.

 * Recomendaciones futuras:
 * - Unificar el uso del botón flotante: solo uno debería estar presente según permisos.
 * - Considerar paginación o búsqueda para auditorías si la lista crece.
 * - Mostrar también si la auditoría tiene informe generado.

 * Seguridad:
 * - La acción de eliminación requiere confirmación explícita del usuario.
 * - Se usa `soloLectura` y `puedeEditar` para condicionar acciones sensibles.
 */

import React, { useEffect, useState } from "react";
import usePermiso from "../hooks/userPermiso";
import Title from "../components/Title";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
} from "@mui/material";
import MensajeAlert from '../components/MensajeAlert';
import ErrorAlert from '../components/ErrorAlert';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import axios from "axios";
import { CircularProgress } from '@mui/material';
import AuditoriaCard from "../components/AuditoriaView";
import BreadcrumbNav from "../components/BreadcrumbNav";
import FolderIcon from '@mui/icons-material/Folder';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DescriptionIcon from "@mui/icons-material/Description";
import FabCustom from "../components/FabCustom";


const AuditoriaProceso = () => {
  const { idRegistro } = useParams(); // ID de la carpeta (representa el año)
  const location = useLocation();
  const navigate = useNavigate();
  const idProceso = location.state?.idProceso || localStorage.getItem("idProcesoActivo");
  const { soloLectura, puedeEditar } = usePermiso("Auditoría");
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
    }
  };

  useEffect(() => {
    if (!idProceso || !idRegistro) return;

    const fetchAuditorias = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/auditorias/registro-anio/${idRegistro}`);
        setAuditorias(res.data);
      } catch (error) {
        setErrorCarga("Error al cargar las auditorías del proceso.");
      } finally {
        setCargando(false);
      }
    };

    const fetchNombreProcesoYEntidad = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/procesos/${idProceso}`);
        const proceso = res.data.proceso;

        setNombreProceso(proceso.nombreProceso);

        const entidadRes = await axios.get(`http://localhost:8000/api/entidades/${proceso.idEntidad}`);
        setNombreEntidad(entidadRes.data.nombreEntidad);
      } catch (error) {
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
    <Box sx={{ p: 2 }}>
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
      <BreadcrumbNav items={[{
        label: 'Estructura',
        to: idProceso ? `/estructura-procesos/${idProceso}` : '/estructura-procesos',
        icon: AccountTreeIcon
      },
      {
        label: 'Carpetas Auditoría',
        to: idProceso ? `/carpetas/${idProceso}/Auditoria` : undefined,
        icon: FolderIcon
      },
      { label: 'Auditorías', icon: DescriptionIcon }]} />

      <Title text={`Auditorías del Proceso de ${nombreProceso} de la ${nombreEntidad}`} />
      <Grid container spacing={3}>
        {auditorias.length === 0 ? (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "30vh",
            }}
          >
            <Typography variant="body1" color="text.secondary" align="center">
              No se han registrado auditorías en el año {anioRegistro}.
            </Typography>
          </Grid>
        ) : (
          auditorias.map((auditoria, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <AuditoriaCard
                auditoria={auditoria}
                onEditar={handleEditar}
                onEliminar={confirmarEliminar}
              />
            </Grid>
          ))
        )}
      </Grid>
      {!soloLectura && puedeEditar && (
        <FabCustom
          title="Generar informe"
          onClick={() => navigate("/informe-auditoria", { state: { idProceso, idRegistro, nombreProceso, nombreEntidad } })}
          sx={{ position: "fixed", bottom: 20, right: 20 }}
        />
      )}
    </Box>
  );
};

export default AuditoriaProceso;
