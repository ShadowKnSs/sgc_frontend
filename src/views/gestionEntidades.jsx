import React, { useState, useEffect } from 'react';
import {Box,Dialog,DialogTitle,DialogContent,Fab,Grid} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

import AddEntidad from '../components/Modals/AddEntidad';
import CardEntidad from '../components/CardGesEntidad';
import ConfirmDelete from '../components/confirmDelete';
import ConfirmEdit from '../components/confirmEdit';

const API_URL = 'http://localhost:8000/api/entidades';

const GestionEntidades = () => {
  const [entidades, setEntidades] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  
  //variables para eliminar una entidad 
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [entidadSeleccionada, setEntidadSeleccionada] = useState(null); 

  //varaibles para manejar la edicion de una entidad
  const [modoEdicion, setModoEdicion] = useState(false);
  const [entidadAEditar, setEntidadAEditar] = useState(null); // objeto 
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [entidadEditada, setEntidadEditada] = useState(null); // guarda temporalmente lo editado

  useEffect(() => {
    obtenerEntidades();
  }, []);
  
  const obtenerEntidades = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log('Respuesta de entidades:', response.data);
      setEntidades(response.data.entidades);
    } catch (error) {
      console.error('Error al obtener entidades:', error);
    }
  };
  
  const handleOpenDialog = () => {
    setModoEdicion(false); // por si venías de editar
    setEntidadAEditar(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  //funcion para ver el dialog de confirmar eliminar 
  const handleShowConfirm = (index) => {
    setEntidadSeleccionada(index);
    setShowConfirmDelete(true);
  };

  //funcion por si confirma la eliminación realizarla 
  const handleConfirmDelete = () => {
    if (entidadSeleccionada !== null) {
      handleEliminar(entidadSeleccionada);
      setEntidadSeleccionada(null);
      setShowConfirmDelete(false);
    }
  };
  
  //funcion para realizar la eliminación
  const handleEliminar = async (index) => {
    try {
      const entidad = entidades[index];
      await axios.delete(`${API_URL}/${entidad.idEntidadDependencia}`);
  
      setEntidades((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar la entidad.');
    }
  };
  
  const handleEditar = (index) => {
    const entidad = entidades[index];
    setEntidadAEditar({ ...entidad, index });
    setModoEdicion(true);
    setOpenDialog(true);
  };

  const handleSubmitEntidad = async (data) => {
    if (modoEdicion) {
      setEntidadEditada(data);
      setShowConfirmEdit(true);
    } else {
      try {
        const nuevaEntidad = {
          ...data,
          icono: data.icono || 'BusinessIcon'
        };
  
        const response = await axios.post(API_URL, nuevaEntidad);
        setEntidades((prev) => [...prev, response.data.entidad]); // la respuesta incluye la entidad creada
        handleCloseDialog();
      } catch (error) {
        console.error('Error al crear entidad:', error);
        alert(error.response?.data?.error || 'No se pudo crear la entidad.');
      }
    }
  };
  
  const handleConfirmEdit = async () => {
    try {
      const index = entidadAEditar.index;
      const entidadId = entidades[index].idEntidadDependencia;

      console.log('Entidad a enviar:', {
        ...entidadEditada
      });      
  
      const response = await axios.put(`${API_URL}/${entidadId}`, {
        ...entidadEditada
      });
  
      const nuevasEntidades = [...entidades];
      nuevasEntidades[index] = response.data.entidad; // actualizada desde el backend
      setEntidades(nuevasEntidades);
  
      // Limpiar
      setShowConfirmEdit(false);
      setOpenDialog(false);
      setModoEdicion(false);
      setEntidadAEditar(null);
      setEntidadEditada(null);
    } catch (error) {
      console.error('Error al editar:', error);
      alert(error.response?.data?.error || 'No se pudo editar la entidad.');
    }
  };
  
    
  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3}>
        {entidades.map((entidad, index) => (
          <Grid item key={index}>
            <CardEntidad
              title={entidad.nombreEntidad}
              icon={entidad.icono}
              handleClick={() => console.log('Ver entidad', entidad)}
              handleEdit={() => handleEditar(index)}
              handleDelete={() => handleShowConfirm(index)}
            />
          </Grid>
        ))}
      </Grid>

      <Fab
        color="primary"
        onClick={handleOpenDialog}
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
      >
        <AddIcon />
      </Fab>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{modoEdicion ? 'Editar Entidad' : 'Nueva Entidad'}</DialogTitle>
        <DialogContent>
          <AddEntidad
            onSubmit={handleSubmitEntidad}
            initialData={entidadAEditar}
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
    </Box>
  );
};

export default GestionEntidades;