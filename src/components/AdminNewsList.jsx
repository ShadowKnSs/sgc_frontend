import React, { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import {
  Box, Grid, Card, CardContent, CardActions, Typography,
  IconButton, CardMedia, Tooltip, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArticleIcon from '@mui/icons-material/Article';
import axios from 'axios';

import AdminNewsModal from './Modals/AdminNewsModal';
import ConfirmDelete from '../components/confirmDelete';
import ConfirmEdit from '../components/confirmEdit';
import FabCustom from "../components/FabCustom";
import Add from "@mui/icons-material/Add";
import FeedbackSnackbar from '../components/Feedback';

function formatDate(dateString) {
  if (!dateString) return '';
  return dayjs(dateString).format('DD-MM-YYYY HH:mm');
}

const AdminNewsList = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
  const idUsuario = usuario?.idUsuario ?? null;

  const [news, setNews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(null);

  const [isLoading, setIsLoading] = useState(true);


  // FeedbackSnackbar
  const [feedback, setFeedback] = useState({
    open: false,
    type: 'info',
    title: '',
    message: '',
  });
  const showFeedback = useCallback((type, title, message) => {
    setFeedback({ open: true, type, title, message });
  }, []);


  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await axios.get('http://127.0.0.1:8000/api/noticias');
      setNews(resp.data);
    } catch (error) {
      console.error('Error al cargar noticias:', error);
      showFeedback('error', 'Error', 'Error al cargar noticias');
    } finally {
      setIsLoading(false);
    }
  }, [showFeedback]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleCreate = () => { setEditItem(null); setModalOpen(true); };
  const handleEditClick = (item) => { setEditItem(item); setModalOpen(true); };
  const handleDeleteClick = (item) => { setDeleteItem(item); setConfirmDeleteOpen(true); };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/noticias/${deleteItem.idNoticias}`);
      setNews(news.filter(n => n.idNoticias !== deleteItem.idNoticias));
      showFeedback('success', 'Eliminada', `Noticia "${deleteItem.titulo}" eliminada con éxito`);
    } catch (error) {
      console.error('Error al eliminar noticia:', error);
      showFeedback('error', 'Error', 'Error al eliminar la noticia');
    }
    setDeleteItem(null);
    setConfirmDeleteOpen(false);
  };
  const handleCloseDeleteDialog = () => { setDeleteItem(null); setConfirmDeleteOpen(false); };

  const handleCloseModal = () => { setModalOpen(false); setEditItem(null); };

  const handleRequestEdit = async (formData) => {
    if (editItem) {
      setPendingChanges(formData);
      setConfirmEditOpen(true);
      return;
    }
    return createNews(formData);
  };

  const createNews = async (formData) => {
    try {
      const data = new FormData();
      data.append('idUsuario', idUsuario);
      data.append('titulo', formData.titulo);
      data.append('descripcion', formData.descripcion);
      if (formData.file) data.append('imagen', formData.file);

      const resp = await axios.post('http://127.0.0.1:8000/api/noticias', data);
      setNews([...news, resp.data]);
      showFeedback('success', 'Creada', 'Noticia creada con éxito');
      return resp;
    } catch (error) {
      console.error('Error al crear noticia:', error);
      showFeedback('error', 'Error', 'Error al crear noticia');
      throw error; // <- permite al modal manejar fallo si quieres
    } finally {
      handleCloseModal(); // <- se cierra al finalizar
    }
  };

  const handleConfirmEdit = async () => {
    if (!pendingChanges || !editItem) return;

    try {
      const data = new FormData();
      data.append('titulo', pendingChanges.titulo);
      data.append('descripcion', pendingChanges.descripcion);
      if (pendingChanges.file) data.append('imagen', pendingChanges.file);

      const resp = await axios.post(
        `http://127.0.0.1:8000/api/noticias/${editItem.idNoticias}?_method=PUT`,
        data
      );

      const updated = news.map(n =>
        n.idNoticias === editItem.idNoticias ? resp.data : n
      );
      setNews(updated);

      showFeedback('success', 'Editada', `Noticia "${editItem.titulo}" editada con éxito`);
      setConfirmEditOpen(false);
      setModalOpen(false);
      setEditItem(null);
      setPendingChanges(null);

      return resp;
    } catch (error) {
      console.error('Error al editar noticia:', error);
      showFeedback('error', 'Error', 'Error al editar noticia');
    }
  };


  const handleCloseEditDialog = () => { setConfirmEditOpen(false); setPendingChanges(null); };

  return (
    <Box sx={{ position: 'relative', minHeight: '400px' }}>
      {isLoading ? (
        <Box sx={{ minHeight: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <CircularProgress size={42} />
          <Typography variant="body2" color="text.secondary">Cargando noticias…</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {news.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', width: '100%' }}>
              <ArticleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body1" color="text.secondary">
                No se han creado aún noticias
              </Typography>
            </Box>
          ) : (
            news.map(item => (
              <Grid item xs={12} sm={6} md={4} key={item.idNoticias}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': { transform: 'scale(1.03)', boxShadow: '0 4px 12px #2dc1df' },
                  }}
                >
                  {item.rutaImg && (
                    <CardMedia
                      component="img"
                      height="150"
                      image={item.rutaImg.startsWith('http') ? item.rutaImg : `http://127.0.0.1:8000${item.rutaImg}`}
                      alt={item.titulo}
                    />
                  )}

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom noWrap>{item.titulo}</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.descripcion}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Fecha: {formatDate(item.fechaPublicacion)}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Tooltip title="Editar">
                      <IconButton sx={{ color: 'primary.main' }} onClick={() => handleEditClick(item)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton sx={{ color: 'error.main' }} onClick={() => handleDeleteClick(item)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* FAB Crear Noticia */}
      <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <FabCustom onClick={handleCreate} title="Agregar Noticia" icon={<Add />} />
      </Box>

      {/* Modal Crear/Editar */}
      {modalOpen && (
        <AdminNewsModal
          open={modalOpen}
          onClose={handleCloseModal}
          onSave={handleRequestEdit}
          editItem={editItem}
        />
      )}

      {/* Confirmaciones */}
      <ConfirmDelete
        open={confirmDeleteOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        entityType="noticia"
        entityName={deleteItem ? deleteItem.titulo : ''}
      />
      <ConfirmEdit
        open={confirmEditOpen}
        onClose={handleCloseEditDialog}
        onConfirm={handleConfirmEdit}
        entityType="noticia"
        entityName={editItem ? editItem.titulo : 'Noticia nueva'}
      />

      {/* Feedback global */}
      <FeedbackSnackbar
        open={feedback.open}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onClose={() => setFeedback(f => ({ ...f, open: false }))}
      />
    </Box>
  );
};

export default AdminNewsList;
