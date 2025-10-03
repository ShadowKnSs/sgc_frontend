import React, { useState, useEffect, useCallback, useMemo, useDeferredValue } from 'react';
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
import { lazy, Suspense } from 'react';
import CardEntidad from '../components/CardGesEntidad';
import ConfirmEdit from '../components/confirmEdit';
import DialogTitleCustom from '../components/TitleDialog';
import Title from "../components/Title";
import BreadcrumbNav from "../components/BreadcrumbNav";
import FeedbackSnackbar from '../components/Feedback';
import EmptyStateEnty from '../components/EmptyStateEnty';
import ConfirmToggle from '../components/confirmToogle';
import SectionTabs from "../components/SectionTabs";
import { useEntidades } from '../hooks/useEntidades';
import { Stack, TextField, InputAdornment, IconButton, MenuItem } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

// Función para normalizar texto (quitar acentos y convertir a minúsculas)
const AddEntidad = lazy(() => import('../components/Modals/AddEntidad'));

const normalizeText = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

const GestionEntidades = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [statusFilter, setStatusFilter] = useState(0); // 0: Todos, 1: Activos, 2: Inactivos


  const {
    entidades,
    loading,
    error,
    snackbar,
    obtenerEntidades,
    crearEntidad,
    actualizarEntidad,
    toggleEntidad,
    handleCloseSnackbar
  } = useEntidades();

  const [openDialog, setOpenDialog] = useState(false);
  const [showConfirmToggle, setShowConfirmToggle] = useState(false);
  const [entidadSeleccionadaId, setEntidadSeleccionadaId] = useState(null); 
  const [modoEdicion, setModoEdicion] = useState(false);
  const [entidadAEditar, setEntidadAEditar] = useState(null);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [entidadEditada, setEntidadEditada] = useState(null);
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q); // evita bloqueos al tipear // buscador
  const [tipoFilter, setTipoFilter] = useState("");

  const [togglingId, setTogglingId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const entidadSeleccionadaObj = useMemo(
    () => entidades.find(e => e.idEntidadDependencia === entidadSeleccionadaId) || null,
    [entidades, entidadSeleccionadaId]
  );


  const filteredEntidades = useMemo(() => {
    const normalizedSearch = normalizeText(dq);
    const byText = (ent) => normalizeText(ent.nombreEntidad).includes(normalizedSearch);
    const byTipo = (ent) => (tipoFilter === "" ? true : ent.tipo === tipoFilter);
    const byStatus = (ent) => (statusFilter === 0 ? ent.activo === 1 : ent.activo === 0);
    return entidades.filter(ent => byText(ent) && byTipo(ent) && byStatus(ent));
  }, [entidades, dq, tipoFilter, statusFilter]);


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

  const handleShowConfirmToggle = useCallback((id) => {
    if (togglingId) return;
    setEntidadSeleccionadaId(id);
    setShowConfirmToggle(true);
  }, [togglingId]);

  const handleConfirmToggle = useCallback(async () => {
    if (entidadSeleccionadaId != null) {
      try {
        const entidad = entidades.find(e => e.idEntidadDependencia === entidadSeleccionadaId);
        if (!entidad) return;
        setTogglingId(entidad.idEntidadDependencia);
        await toggleEntidad(entidad.idEntidadDependencia, entidad.activo);
        setTogglingId(null);
        setShowConfirmToggle(false);
        setEntidadSeleccionadaId(null);
      } catch (error) {
        console.error('Error al cambiar estado:', error);
      }
    }
  }, [entidadSeleccionadaId, entidades, toggleEntidad]);

  const handleEditar = useCallback((id) => {
    if (editingId) return;
    setEditingId(id);
    const entidad = entidades.find(e => e.idEntidadDependencia === id);
    if (!entidad) return;
    setEntidadAEditar({ ...entidad });
    setModoEdicion(true);
    setOpenDialog(true);
  }, [entidades, editingId]);

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
      const entidadId = entidadAEditar.idEntidadDependencia;
      await actualizarEntidad(entidadId, entidadEditada);
      setEditingId(null);
      setShowConfirmEdit(false);
      setOpenDialog(false);
      setModoEdicion(false);
      setEntidadAEditar(null);
      setEntidadEditada(null);
    } catch (error) {
      console.error('Error al editar:', error);
    }
  }, [entidadAEditar, entidadEditada, actualizarEntidad]);

  const entidadesList = useMemo(() => {
    if (loading) {
      return (
        <Box
          role="status"
          aria-live="polite"
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', py: 4 }}
        >
          <CircularProgress sx={{ mb: 1.5 }} />
          <Typography variant="body2" color="text.secondary">
            Cargando Entidades/Dependencia...
          </Typography>
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


    if (filteredEntidades.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4, width: '100%' }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron entidades que coincidan con la búsqueda
          </Typography>
        </Box>
      );
    }

    return (
      <Grid
        container
        spacing={4}
        sx={{
          width: '100%',
          margin: '0 auto'
        }}
      >
        {filteredEntidades.map((entidad) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            lg={2.4}
            key={entidad.idEntidadDependencia}
          >
            <CardEntidad
              title={entidad.nombreEntidad}
              icon={entidad.icono}
              subtitle={`${entidad.tipo} - ${entidad.ubicacion}`}
              isActive={entidad.activo === 1}
              handleEdit={() => handleEditar(entidad.idEntidadDependencia)}
              handleToggle={() => handleShowConfirmToggle(entidad.idEntidadDependencia)}
              disabled={togglingId === entidad.idEntidadDependencia || editingId === entidad.idEntidadDependencia}
              sx={{
                width: '100%',
                height: '100%'
              }}
            />
          </Grid>
        ))}
      </Grid>
    );
  }, [
    loading,
    error,
    entidades,
    filteredEntidades,
    handleOpenDialog,
    handleEditar,
    handleShowConfirmToggle,
    togglingId,
    editingId,
  ]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 2 }, minHeight: "100vh" }}>
      <BreadcrumbNav items={[{ label: "Gestión de Entidades", icon: LocationCityIcon }]} />

      {/* Contenedor del título */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Title
          text="Gestión de Entidades"
          mode="sticky"
        />
        <Typography variant="body1" color="text.secondary">
          Administra las entidades y dependencias del sistema
        </Typography>
      </Box>


      {/* Toolbar de filtros */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        sx={{
          mb: 2,
          zIndex: 1,
          bgcolor: "background.paper",
          py: 1,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        {/* Buscador por nombreEntidad */}
        <TextField
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre de entidad"
          size="small"
          fullWidth
          inputProps={{ "aria-label": "Buscar entidades" }}
          sx={{ maxWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: q ? (
              <InputAdornment position="end">
                <IconButton onClick={() => setQ("")} size="small">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
        {/* Tabs de estado */}
        <Box sx={{ mx: { xs: 0, sm: 1 } }}>
          {/* SectionTabs para filtrar por estado */}
          <SectionTabs
            sections={['Activos', 'Inactivos']}
            selectedTab={statusFilter}
            onTabChange={setStatusFilter}
          />
        </Box>


        {/* Filtro por tipo */}
        <TextField
          select
          size="small"
          label="Tipo"
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="Entidad">Entidad</MenuItem>
          <MenuItem value="Dependencia">Dependencia</MenuItem>
        </TextField>
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredEntidades.length} resultados · {entidades.length} totales
        </Typography>
        {(q || tipoFilter || statusFilter !== 0) && (
          <IconButton size="small" onClick={() => { setQ(""); setTipoFilter(""); setStatusFilter(0); }} aria-label="Limpiar filtros">
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Contenedor principal que centra el contenido */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}>
        <Box sx={{
          width: '100%',
          maxWidth: '1400px' // Ajusta este valor según necesites
        }}>
          {entidadesList}
        </Box>
      </Box>

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
        <DialogTitleCustom title={modoEdicion ? 'Editar Entidad/Dependencia' : 'Nueva Entidad/Dependencia'} />
        <DialogContent>
          <Suspense fallback={<Box sx={{ p: 2 }}><CircularProgress size={20} /></Box>}>
            <AddEntidad
              onClose={handleCloseDialog}
              onSubmit={handleSubmitEntidad}
              initialData={entidadAEditar}
              isEditing={modoEdicion}
            />
          </Suspense>
        </DialogContent>
      </Dialog>

      <ConfirmToggle
        open={showConfirmToggle}
        onClose={() => {
          setShowConfirmToggle(false);
          setEntidadSeleccionadaId(null);
        }}
        entityType="entidad"
        entityName={entidadSeleccionadaObj?.nombreEntidad || ''}
        isActive={entidadSeleccionadaObj ? entidadSeleccionadaObj.activo === 1 : false}
        onConfirm={handleConfirmToggle}
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
    </Box >
  );
};

export default React.memo(GestionEntidades);