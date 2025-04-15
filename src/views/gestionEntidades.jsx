import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Fab,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';

import AddEntidad from '../components/Modals/AddEntidad';
import CardEntidad from '../components/CardGesEntidad';

const GestionEntidades = () => {
  const [entidades, setEntidades] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleAgregarEntidad = (data) => {
    const nuevaEntidad = {
      ...data,
      icon: data.icon || 'BusinessIcon'  // Default por si acaso
    };
    setEntidades((prev) => [...prev, nuevaEntidad]);
    handleCloseDialog();
  };

  const handleEliminar = (index) => {
    setEntidades((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditar = (index) => {
    alert(`Editar entidad en posición ${index} (a implementar)`);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3}>

        {entidades.map((entidad, index) => (
          <Grid item key={index}>
            <CardEntidad
              title={entidad.nombre}
              icon={entidad.icon}
              handleClick={() => console.log('Ver entidad', entidad)}
              handleEdit={() => handleEditar(index)}
              handleDelete={() => handleEliminar(index)}
            />
          </Grid>
        ))}
      </Grid>

      {/* FAB para agregar entidad */}
      <Fab
        color="primary"
        onClick={handleOpenDialog}
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
      >
        <AddIcon />
      </Fab>

      {/* Diálogo con el formulario */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Nueva Entidad</DialogTitle>
        <DialogContent>
          <AddEntidad onSubmit={handleAgregarEntidad} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GestionEntidades;
