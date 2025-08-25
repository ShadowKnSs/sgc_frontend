/**
 * Componente: GestionEntidades
 * Ubicación: src/views/GestionEntidades.jsx
 *
 * Descripción:
 * Componente que permite **gestionar las entidades o dependencias** del sistema.
 * Soporta operaciones CRUD completas: crear, listar, editar y eliminar entidades.
 * Se apoya en componentes modales, tarjetas y diálogos de confirmación para brindar una experiencia fluida.
 *
 * Funcionalidades principales:
 * - Visualiza una lista de entidades en forma de cards (componente `CardEntidad`).
 * - Permite crear nuevas entidades mediante un FAB y un formulario (`AddEntidad`).
 * - Soporta edición con confirmación (`ConfirmEdit`).
 * - Permite eliminar con confirmación (`ConfirmDelete`).
 *
 * Estructura del estado:
 * - `entidades`: lista completa de entidades traída desde el backend.
 * - `openDialog`: controla si el modal de creación/edición está abierto.
 * - `modoEdicion`: define si el formulario se usa para crear o editar.
 * - `entidadAEditar`: datos de la entidad que se está editando.
 * - `entidadSeleccionada`: índice de la entidad que se quiere eliminar.
 * - `showConfirmDelete`, `showConfirmEdit`: controlan la visibilidad de los diálogos de confirmación.
 *
 * Componentes utilizados:
 * - `CardEntidad`: representa visualmente cada entidad.
 * - `AddEntidad`: formulario de entrada para crear o editar.
 * - `ConfirmDelete`, `ConfirmEdit`: diálogos de confirmación reutilizables.
 * - `DialogTitleCustom`: encabezado del modal de formulario.
 *
 * Endpoints usados:
 * - `GET /api/entidades`: obtener todas las entidades.
 * - `POST /api/entidades`: crear nueva entidad.
 * - `PUT /api/entidades/{id}`: actualizar entidad existente.
 * - `DELETE /api/entidades/{id}`: eliminar entidad existente.
 *
 * Consideraciones:
 * - El campo `icono` tiene un valor por defecto `"BusinessIcon"` si no se define.
 * - En modo edición, se muestra una confirmación antes de enviar cambios al backend.
 * - En eliminación, se valida primero el índice seleccionado para evitar errores de rango.
 *
 * Mejoras futuras recomendadas:
 * - Usar `useReducer` en lugar de múltiples `useState` para una mejor organización.
 * - Validación del formulario en `AddEntidad`.
 * - Soporte para íconos visuales dinámicos según el valor `icono`.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Box, 
  Dialog, 
  DialogContent, 
  Grid, 
  CircularProgress,
  Typography,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import FabCustom from "../components/FabCustom";
import Add from "@mui/icons-material/Add";
import AddEntidad from '../components/Modals/AddEntidad';
import CardEntidad from '../components/CardGesEntidad';
import ConfirmDelete from '../components/confirmDelete';
import ConfirmEdit from '../components/confirmEdit';
import DialogTitleCustom from '../components/TitleDialog';
import Title from "../components/Title";
import BreadcrumbNav from "../components/BreadcrumbNav";
import FeedbackSnackbar from '../components/Feedback';
import EmptyStateEnty from '../components/EmptyStateEnty';
import { useEntidades } from '../hooks/useEntidades';

const GestionEntidades = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const {
    entidades,
    loading,
    error,
    snackbar,
    obtenerEntidades,
    crearEntidad,
    actualizarEntidad,
    eliminarEntidad,
    handleCloseSnackbar
  } = useEntidades();

  const [openDialog, setOpenDialog] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [entidadSeleccionada, setEntidadSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [entidadAEditar, setEntidadAEditar] = useState(null);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [entidadEditada, setEntidadEditada] = useState(null);

  useEffect(() => {
    obtenerEntidades();
  }, [obtenerEntidades]);

  const handleOpenDialog = useCallback(() => {
    setModoEdicion(false);
    setEntidadAEditar(null);
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleShowConfirmDelete = useCallback((index) => {
    setEntidadSeleccionada(index);
    setShowConfirmDelete(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (entidadSeleccionada !== null) {
      try {
        const entidad = entidades[entidadSeleccionada];
        await eliminarEntidad(entidad.idEntidadDependencia);
        setShowConfirmDelete(false);
        setEntidadSeleccionada(null);
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  }, [entidadSeleccionada, entidades, eliminarEntidad]);

  const handleEditar = useCallback((index) => {
    const entidad = entidades[index];
    setEntidadAEditar({ ...entidad, index });
    setModoEdicion(true);
    setOpenDialog(true);
  }, [entidades]);

  const handleSubmitEntidad = useCallback(async (data) => {
    if (modoEdicion) {
      setEntidadEditada(data);
      setShowConfirmEdit(true);
    } else {
      try {
        await crearEntidad({
          ...data,
          icono: data.icono || 'BusinessIcon'
        });
        handleCloseDialog();
      } catch (error) {
        console.error('Error al crear entidad:', error);
      }
    }
  }, [modoEdicion, crearEntidad, handleCloseDialog]);

  const handleConfirmEdit = useCallback(async () => {
    try {
      const index = entidadAEditar.index;
      const entidadId = entidades[index].idEntidadDependencia;
      
      await actualizarEntidad(entidadId, entidadEditada);
      
      setShowConfirmEdit(false);
      setOpenDialog(false);
      setModoEdicion(false);
      setEntidadAEditar(null);
      setEntidadEditada(null);
    } catch (error) {
      console.error('Error al editar:', error);
    }
  }, [entidadAEditar, entidades, entidadEditada, actualizarEntidad]);

  const entidadesList = useMemo(() => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ width: '100%', py: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Box>
      );
    }

    if (entidades.length === 0) {
      return (
        <EmptyStateEnty
          icon={<LocationCityIcon sx={{ fontSize: 60, color: 'text.secondary' }} />}
          title="No hay entidades registradas"
          description="Comienza agregando una nueva entidad o dependencia al sistema"
          actionText="Agregar Entidad"
          onAction={handleOpenDialog}
        />
      );
    }

    return (
      <Grid container spacing={3}>
        {entidades.map((entidad, index) => (
          <Grid item xs={12} sm={6} md={4} key={entidad.idEntidadDependencia}>
            <CardEntidad
              title={entidad.nombreEntidad}
              icon={entidad.icono}
              subtitle={`${entidad.tipo} - ${entidad.ubicacion}`}
              handleClick={() => console.log('Ver entidad', entidad)}
              handleEdit={() => handleEditar(index)}
              handleDelete={() => handleShowConfirmDelete(index)}
            />
          </Grid>
        ))}
      </Grid>
    );
  }, [entidades, loading, error, handleOpenDialog, handleEditar, handleShowConfirmDelete]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh' }}>
      <BreadcrumbNav items={[{ label: "Gestión de Entidades", icon: LocationCityIcon }]} />

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Title 
          text="Gestión de Entidades" 
          sx={{ 
            fontSize: { xs: "1.5rem", sm: "2rem" }, 
            fontWeight: "bold",
            mb: 1
          }} 
        />
        <Typography variant="body1" color="text.secondary">
          Administra las entidades y dependencias del sistema
        </Typography>
      </Box>

      {entidadesList}

      <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}>
        <FabCustom
          onClick={handleOpenDialog}
          title="Agregar Entidad"
          icon={<Add />}
        />
      </Box>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitleCustom title={modoEdicion ? 'Editar Entidad' : 'Nueva Entidad'} />
        <DialogContent>
          <AddEntidad
            onClose={handleCloseDialog}
            onSubmit={handleSubmitEntidad}
            initialData={entidadAEditar}
            isEditing={modoEdicion}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        entityType="entidad"
        entityName={entidades[entidadSeleccionada]?.nombreEntidad}
        onConfirm={handleConfirmDelete}
      />

      <ConfirmEdit
        open={showConfirmEdit}
        onClose={() => setShowConfirmEdit(false)}
        entityName={entidadEditada?.nombreEntidad}
        onConfirm={handleConfirmEdit}
      />

      <FeedbackSnackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        type={snackbar.type}
        title={snackbar.title}
        message={snackbar.message}
      />
    </Box>
  );
};

export default React.memo(GestionEntidades);