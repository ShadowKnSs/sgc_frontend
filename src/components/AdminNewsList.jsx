import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  CardMedia,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

// Componentes locales
import AdminNewsModal from './Modals/AdminNewsModal';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import ConfirmEditDialog from '../components/ConfirmEditDialog';
import NewNoticiaButton from '../components/NewCardButtom';

// Formatea la fecha con dayjs
function formatDate(dateString) {
  if (!dateString) return '';
  return dayjs(dateString).format('DD-MM-YYYY HH:mm');
}

const AdminNewsList = () => {
  // Lista de noticias
  const [news, setNews] = useState([]);

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
  

  // Cargar noticias al montar
  useEffect(() => {
    fetchNews();
  }, []);

  // GET /api/noticias
  const fetchNews = async () => {
    try {
      const resp = await axios.get('http://127.0.0.1:8000/api/noticias');
      setNews(resp.data); // array devuelto por el backend
    } catch (error) {
      console.error('Error al cargar noticias:', error);
      setSnackbarMessage('Error al cargar noticias');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

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

  // Confirmar eliminación => DELETE /api/noticias/{id}
  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/noticias/${deleteItem.idNoticias}`);
      // Filtramos local
      setNews(news.filter(n => n.idNoticias !== deleteItem.idNoticias));

      setSnackbarMessage(`Noticia "${deleteItem.titulo}" eliminada con éxito`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al eliminar noticia:', error);
      setSnackbarMessage('Error al eliminar la noticia');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
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

  /**
   * Se llama cuando el modal da "Guardar".
   * - Si editItem existe => confirmamos edición
   * - Si no => creamos
   */
  const handleRequestEdit = (formData) => {
    if (editItem) {
      // Modo edición => confirmamos
      setPendingChanges(formData);
      setConfirmEditOpen(true);
    } else {
      // Modo crear => directamente creamos
      createNews(formData);
    }
  };

  // Crear => POST /api/noticias
  const createNews = async (formData) => {
    try {
      const data = new FormData();
      data.append('idUsuario', 1); // o el ID real del usuario
      data.append('titulo', formData.titulo);
      data.append('descripcion', formData.descripcion);
      if (formData.file) {
        data.append('imagen', formData.file);
      }

      const resp = await axios.post('http://127.0.0.1:8000/api/noticias', data);

      // Agregamos la noticia al estado local
      setNews([...news, resp.data]);
      setSnackbarMessage('Noticia creada con éxito');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al crear noticia:', error);
      setSnackbarMessage('Error al crear noticia');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    handleCloseModal();
  };

  // Confirmar Edición => PUT /api/noticias/{id}
  const handleConfirmEdit = async () => {
    if (!pendingChanges || !editItem) return;
    try {
      const data = new FormData();
      data.append('titulo', pendingChanges.titulo);
      data.append('descripcion', pendingChanges.descripcion);
      if (pendingChanges.file) {
        data.append('imagen', pendingChanges.file);
      }
      // Usamos ?_method=PUT
      const resp = await axios.post(
        `http://127.0.0.1:8000/api/noticias/${editItem.idNoticias}?_method=PUT`,
        data
      );

      // Reemplazamos la noticia en la lista
      const updated = news.map(n => n.idNoticias === editItem.idNoticias ? resp.data : n);
      setNews(updated);

      setSnackbarMessage(`Noticia "${editItem.titulo}" editada con éxito`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al editar noticia:', error);
      setSnackbarMessage('Error al editar noticia');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
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
            <Card
              sx={{
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px #2dc1df',
                },
              }}
            >
              {/* Mostrar la imagen devuelta por el backend */}
              {item.rutaImg && (
                <CardMedia
                  component="img"
                  height="150"
                  image={item.rutaImg.startsWith('http') 
                    ? item.rutaImg 
                    : `http://127.0.0.1:8000${item.rutaImg}`
                  }
                  alt={item.titulo}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.titulo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.descripcion?.substring(0, 150)}...
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Fecha: {formatDate(item.fechaPublicacion)}
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
                  sx={{ color: '#f9b800' }}
                  onClick={() => handleDeleteClick(item)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Botón Crear Noticia */}
      <Box sx={{ position: 'absolute', bottom: -30, right: 16 }}>
        <NewNoticiaButton onClick={handleCreate} />
      </Box>

      {/* Modal Crear/Editar Noticia */}
      {modalOpen && (
        <AdminNewsModal
          open={modalOpen}
          onClose={handleCloseModal}
          onSave={handleRequestEdit}
          editItem={editItem}
        />
      )}

      {/* Confirmar Eliminación */}
      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        itemName={deleteItem ? deleteItem.titulo : ''}
      />

      {/* Confirmar Edición */}
      <ConfirmEditDialog
        open={confirmEditOpen}
        onClose={handleCloseEditDialog}
        onConfirm={handleConfirmEdit}
        itemName={editItem ? editItem.titulo : 'Noticia nueva'}
      />

      {/* Snackbar para mensajes */}
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
