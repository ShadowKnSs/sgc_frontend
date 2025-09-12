import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid, Card, CardContent, CardActions, Typography, IconButton,
  CardMedia, Box, Tooltip, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CampaignIcon from '@mui/icons-material/Campaign';
import axios from 'axios';
import dayjs from 'dayjs';

import AdminEAModal from './Modals/AdminEAModal';
import ConfirmDelete from '../components/confirmDelete';
import ConfirmEdit from '../components/confirmEdit';
import FabCustom from "../components/FabCustom";
import Add from "@mui/icons-material/Add";
import FeedbackSnackbar from '../components/Feedback';

function formatDate(dateString) {
  if (!dateString) return '';
  return dayjs(dateString).format('DD-MM-YYYY HH:mm');
}

const AdminEAList = ({ tipo }) => {
  const [items, setItems] = useState([]);

  // Modal crear/editar
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Confirmar eliminación
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  // Confirmar edición
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(null);

  const [isLoading, setIsLoading] = useState(true);


  // FeedbackSnackbar
  const [feedback, setFeedback] = useState({
    open: false,
    type: 'info', // success | error | info | warning
    title: '',
    message: '',
  });

  const showFeedback = useCallback((type, title, message) => {
    setFeedback({ open: true, type, title, message });
  }, []);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await axios.get(`http://127.0.0.1:8000/api/eventos-avisos?tipo=${tipo}`);
      setItems(resp.data);
    } catch (error) {
      console.error('Error al cargar items:', error);
      showFeedback('error', 'Error', `Error al cargar ${tipo}s`);
    } finally {
      setIsLoading(false);
    }
  }, [tipo, showFeedback]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleCreate = () => { setEditItem(null); setModalOpen(true); };
  const handleEditClick = (item) => { setEditItem(item); setModalOpen(true); };
  const handleDeleteClick = (item) => { setDeleteItem(item); setConfirmDeleteOpen(true); };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/eventos-avisos/${deleteItem.idEventosAvisos}`);
      setItems(items.filter(x => x.idEventosAvisos !== deleteItem.idEventosAvisos));
      showFeedback('success', 'Eliminado', `${tipo} #${deleteItem.idEventosAvisos} eliminado con éxito`);
    } catch (error) {
      console.error('Error al eliminar:', error);
      showFeedback('error', 'Error', `Error al eliminar ${tipo}`);
    }
    setDeleteItem(null);
    setConfirmDeleteOpen(false);
  };
  const handleCloseDeleteDialog = () => { setDeleteItem(null); setConfirmDeleteOpen(false); };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditItem(null);
    setPendingChanges(null);
    setConfirmEditOpen(false);
  };
  const handleRequestEdit = async (formData) => {
    if (editItem) {
      setPendingChanges(formData);
      setConfirmEditOpen(true);   // aquí no hay request; el loading puede terminar
      return;                      // nada que esperar
    }
    // Importante: DEVOLVER la promesa para que el modal espere
    return createItem(formData);
  };
  const createItem = async (formData) => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
      const idUsuario = usuario?.idUsuario;
      if (!idUsuario) {
        showFeedback('error', 'Sesión inválida', 'No hay idUsuario en localStorage');
        return;
      }
      const data = new FormData();
      data.append('idUsuario', idUsuario);
      data.append('tipo', tipo);
      if (formData.file) data.append('imagen', formData.file);

      const resp = await axios.post('http://127.0.0.1:8000/api/eventos-avisos', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setItems([...items, resp.data]);
      showFeedback('success', 'Creado', `${tipo} creado con éxito`);
      return resp;
    } catch (error) {
      console.error(error);
      showFeedback('error', 'Error', `Error al crear ${tipo}`);
      throw error;
    } finally {
      handleCloseModal();
    }
  };

  const handleConfirmEdit = async () => {
    if (!pendingChanges || !editItem) return;
    let resp;
    try {
      const data = new FormData();
      data.append('tipo', tipo);
      if (pendingChanges.file) data.append('imagen', pendingChanges.file);
      data.append('_method', 'PUT');

      resp = await axios.post(
        `http://127.0.0.1:8000/api/eventos-avisos/${editItem.idEventosAvisos}`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const updated = items.map(x =>
        x.idEventosAvisos === editItem.idEventosAvisos ? resp.data : x
      );
      setItems(updated);
      showFeedback('success', 'Editado', `${tipo} #${editItem.idEventosAvisos} editado con éxito`);
    } catch (error) {
      console.error(error);
      showFeedback('error', 'Error', `Error al editar ${tipo}`);
      throw error; // opcional: permite manejar el error arriba si lo necesitas
    } finally {
      // se ejecuta pase lo que pase (éxito, error o excepción)
      setConfirmEditOpen(false);
      setPendingChanges(null);
      setEditItem(null);
      setModalOpen(false);
    }
    return resp; // si necesitas la respuesta, devuélvela después del finally
  };

  const handleCloseEditDialog = () => { setConfirmEditOpen(false); setPendingChanges(null); };

  return (
    <Box sx={{ position: 'relative', minHeight: '400px' }}>
      {isLoading ? (
        <Box sx={{ minHeight: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <CircularProgress size={42} />
          <Typography variant="body2" color="text.secondary">
            Cargando {tipo.toLowerCase()}s…
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {items.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', width: '100%' }}>
              {(tipo === 'Evento' ? (
                <EventAvailableIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              ) : (
                <CampaignIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              ))}
              <Typography variant="body1" color="text.secondary">
                No se han creado aún {tipo === 'Evento' ? 'eventos' : 'avisos'}
              </Typography>
            </Box>
          ) : (items.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.idEventosAvisos}>
              <Card
                sx={{
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': { transform: 'scale(1.05)', boxShadow: '0 4px 12px #2dc1df' },
                }}
              >
                {item.rutaImg && (
                  <CardMedia component="img" height="150" image={item.rutaImg} alt={`${tipo} #${item.idEventosAvisos}`} />
                )}
                <CardContent>
                  <Typography variant="h6" gutterBottom>{tipo} #{item.idEventosAvisos}</Typography>
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
          )))}
        </Grid>
      )}

      {/* FAB Crear */}
      <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <FabCustom onClick={handleCreate} title="Agregar Evento/Aviso" icon={<Add />} />
      </Box>

      {/* Modal Crear/Editar */}
      {modalOpen && (
        <AdminEAModal
          open={modalOpen}
          onClose={handleCloseModal}
          onRequestEdit={handleRequestEdit}
          editItem={editItem}
          tipo={tipo}
        />
      )}

      {/* Confirmaciones */}
      <ConfirmDelete
        open={confirmDeleteOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        entityType="noticia"
        entityName={`${tipo} #${deleteItem ? deleteItem.idEventosAvisos : ''}`}
      />
      <ConfirmEdit
        open={confirmEditOpen}
        onClose={handleCloseEditDialog}
        onConfirm={handleConfirmEdit}
        entityType="noticia"
        entityName={editItem ? `${tipo} #${editItem.idEventosAvisos}` : `Nuevo ${tipo}`}
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

export default AdminEAList;
