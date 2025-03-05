// src/admin/AdminNewsList.js
import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, CardActions, Typography, IconButton, CardMedia, Snackbar, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminNewsModal from './Modals/AdminNewsModal';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import ConfirmEditDialog from '../components/ConfirmEditDialog';
import NewNoticiaButton from "../components/NewCardButtom";

// Datos estáticos
const initialNews = [
  {
    idNoticias: 1,
    titulo: 'Noticia 1',
    descripcion: 'Descripción estática noticia 1',
    rutaImg: 'http://127.0.0.1:8000/storage/img/efecto.jpg',
    fechaPublicacion: '2025-03-04 11:16 PM'
  },
  {
    idNoticias: 2,
    titulo: 'Noticia 2',
    descripcion: 'Descripción estática noticia 2',
    rutaImg: 'http://127.0.0.1:8000/storage/img/efecto.jpg',
    fechaPublicacion: '2024-04-05 10:19 PM'
  },
];

const AdminNewsList = () => {
  const [news, setNews] = useState(initialNews);

  // Modal de crear/editar
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Confirmar eliminación
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  // Confirmar edición
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(null);

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Crear
  const handleCreate = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  // Editar
  const handleEditClick = (item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  // Eliminar
  const handleDeleteClick = (item) => {
    setDeleteItem(item);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteItem) return;
    setNews(news.filter(n => n.idNoticias !== deleteItem.idNoticias));
    setSnackbarMessage(`Noticia "${deleteItem.titulo}" eliminada con éxito`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    setDeleteItem(null);
    setConfirmDeleteOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteItem(null);
    setConfirmDeleteOpen(false);
  };

  // Cerrar modal de crear/editar
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditItem(null);
  };

  // Este se llama cuando el usuario da clic en "Guardar" en AdminNewsModal,
  // pero ANTES de confirmar la edición.
  const handleRequestEdit = (formData) => {
    if (editItem) {
      // Modo EDICIÓN => primero confirmar
      setPendingChanges(formData);
      setConfirmEditOpen(true);
    } else {
      // Modo CREAR => no confirmamos, aplicamos directo
      finalizeCreation(formData);
    }
  };

  const finalizeCreation = (formData) => {
    const newId = news.length ? Math.max(...news.map(n => n.idNoticias)) + 1 : 1;
    // Asignamos fecha actual
    const fecha = new Date().toLocaleString(); 
    const newItem = {
      idNoticias: newId,
      ...formData,
      fechaPublicacion: fecha
    };
    setNews([...news, newItem]);
    setSnackbarMessage('Noticia creada con éxito');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    handleCloseModal();
  };

  // Confirmar edición
  const handleConfirmEdit = () => {
    if (!pendingChanges || !editItem) return;
    // Mantenemos la fechaPublicacion que ya tenía
    const updated = news.map(n => {
      if (n.idNoticias === editItem.idNoticias) {
        return {
          ...n,
          ...pendingChanges,
          fechaPublicacion: n.fechaPublicacion // no se cambia la fecha
        };
      }
      return n;
    });
    setNews(updated);
    setSnackbarMessage(`Noticia "${editItem.titulo}" editada con éxito`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);

    setModalOpen(false);
    setEditItem(null);
    setPendingChanges(null);
    setConfirmEditOpen(false);
  };

  const handleCloseEditDialog = () => {
    setConfirmEditOpen(false);
    setPendingChanges(null);
  };

  // Cerrar Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '400px' }}>
      <Grid container spacing={2}>
        {news.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.idNoticias}>
            <Card>
              {item.rutaImg && (
                <CardMedia
                  component="img"
                  height="150"
                  image={item.rutaImg}
                  alt={item.titulo}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>{item.titulo}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.descripcion?.substring(0, 80)}...
                </Typography>
                {/* Mostrar la fecha */}
                <Typography variant="caption" color="text.secondary">
                  Fecha: {item.fechaPublicacion}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <IconButton
                  sx={{ color: 'primary.main' }}
                  onClick={() => handleEditClick(item)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  sx={{ color: 'terciary.main' }}
                  onClick={() => handleDeleteClick(item)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Botón "Crear Noticia" parte inferior derecha */}
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          right: 16,
        }}
      >
        <NewNoticiaButton onClick={handleCreate}/>
      </Box>

      {/* Modal de Crear/Editar Noticia */}
      {modalOpen && (
        <AdminNewsModal
          open={modalOpen}
          onClose={handleCloseModal}
          onSave={handleRequestEdit} // en lugar de onSave
          editItem={editItem}
        />
      )}

      {/* Confirmación de Eliminación */}
      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        itemName={deleteItem ? deleteItem.titulo : ''}
      />

      {/* Confirmación de Edición */}
      <ConfirmEditDialog
        open={confirmEditOpen}
        onClose={handleCloseEditDialog}
        onConfirm={handleConfirmEdit}
        itemName={editItem ? editItem.titulo : 'Noticia nueva'}
      />

      {/* Snackbar al centro */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminNewsList;
