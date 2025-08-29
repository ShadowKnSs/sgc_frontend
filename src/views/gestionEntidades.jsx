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
import ConfirmEdit from '../components/confirmEdit';
import DialogTitleCustom from '../components/TitleDialog';
import Title from "../components/Title";
import BreadcrumbNav from "../components/BreadcrumbNav";
import FeedbackSnackbar from '../components/Feedback';
import EmptyStateEnty from '../components/EmptyStateEnty';
import ConfirmToggle from '../components/confirmToogle';
import { useEntidades } from '../hooks/useEntidades';
import { Stack, TextField, InputAdornment, IconButton, MenuItem } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

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
    toggleEntidad,
    handleCloseSnackbar
  } = useEntidades();

  const [openDialog, setOpenDialog] = useState(false);
  const [showConfirmToggle, setShowConfirmToggle] = useState(false);
  const [entidadSeleccionada, setEntidadSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [entidadAEditar, setEntidadAEditar] = useState(null);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [entidadEditada, setEntidadEditada] = useState(null);
  const [q, setQ] = useState(""); // buscador
  const [tipoFilter, setTipoFilter] = useState("");

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

  const handleShowConfirmToggle = useCallback((index) => {
    setEntidadSeleccionada(index);
    setShowConfirmToggle(true);
  }, []);

  const handleConfirmToggle = useCallback(async () => {
    if (entidadSeleccionada !== null) {
      try {
        const entidad = entidades[entidadSeleccionada];
        await toggleEntidad(entidad.idEntidadDependencia, entidad.activo);
        setShowConfirmToggle(false);
        setEntidadSeleccionada(null);
      } catch (error) {
        console.error('Error al cambiar estado:', error);
      }
    }
  }, [entidadSeleccionada, entidades, toggleEntidad]);

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
    const filteredEntidades = entidades.filter((ent) => {
  const matchesSearch = ent.nombreEntidad.toLowerCase().includes(q.toLowerCase());
  const matchesTipo = tipoFilter === "" || ent.tipo === tipoFilter;
  return matchesSearch && matchesTipo;
});


    return (
      <Grid container spacing={3}>
        {filteredEntidades.map((entidad, index) => (
  <Grid item xs={12} sm={6} md={4} key={entidad.idEntidadDependencia}>
    <CardEntidad
      title={entidad.nombreEntidad}
      icon={entidad.icono}
      subtitle={`${entidad.tipo} - ${entidad.ubicacion}`}
              isActive={entidad.activo === 1}
      handleClick={() => console.log("Ver entidad", entidad)}
      handleEdit={() => handleEditar(index)}
      handleToggle={() => handleShowConfirmToggle(index)}
    />
  </Grid>
))}

      </Grid>
    );
  }, [entidades, loading, error, q, tipoFilter, handleOpenDialog, handleEditar, handleShowConfirmToggle]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: "100vh" }}>
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
    mb: 3,
    zIndex: 1,
    bgcolor: "background.paper",
    py: 1.5,
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

      <ConfirmToggle
        open={showConfirmToggle}
        onClose={() => {
          setShowConfirmToggle(false);
          setEntidadSeleccionada(null);
        }}
        entityType="entidad"
        entityName={entidadSeleccionada !== null ? entidades[entidadSeleccionada]?.nombreEntidad : ''}
        isActive={entidadSeleccionada !== null ? entidades[entidadSeleccionada]?.activo === 1 : false}
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
    </Box>
  );
};

export default React.memo(GestionEntidades);