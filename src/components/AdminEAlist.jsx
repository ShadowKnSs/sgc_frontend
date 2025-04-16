import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  CardMedia,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import dayjs from 'dayjs';

import AdminEAModal from './Modals/AdminEAModal';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import ConfirmEditDialog from '../components/ConfirmEditDialog';
import NewEAButton from "../components/NewCardButtom";
import ConfirmDelete from './confirmDelete';

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

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // 1) Cargar lista de eventos o avisos al montar o cuando cambie `tipo`
  useEffect(() => {
    fetchItems();
  }, [tipo]);

  // GET /api/eventos-avisos?tipo=Evento o Aviso
  const fetchItems = async () => {
    try {
      const resp = await axios.get(`http://127.0.0.1:8000/api/eventos-avisos?tipo=${tipo}`);
      setItems(resp.data); // array devuelto por el backend
    } catch (error) {
      console.error('Error al cargar items:', error);
      setSnackbarMessage(`Error al cargar ${tipo}s`);
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

  // Confirmar eliminación => DELETE /api/eventos-avisos/{id}
  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/eventos-avisos/${deleteItem.idEventosAvisos}`);
      // Filtrar local
      setItems(items.filter(x => x.idEventosAvisos !== deleteItem.idEventosAvisos));

      setSnackbarMessage(`${tipo} #${deleteItem.idEventosAvisos} eliminado con éxito`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al eliminar:', error);
      setSnackbarMessage(`Error al eliminar ${tipo}`);
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
      // Editar => confirmamos
      setPendingChanges(formData);
      setConfirmEditOpen(true);
    } else {
      // Crear => no confirmamos
      createItem(formData);
    }
  };

  // Crear => POST /api/eventos-avisos
  const createItem = async (formData) => {
    try {
      const data = new FormData();
      data.append('idUsuario', 2);
      data.append('tipo', tipo);
      if (formData.file) {
        data.append('imagen', formData.file);
      }

      const resp = await axios.post('http://127.0.0.1:8000/api/eventos-avisos', data,);

      setItems([...items, resp.data]);
      showSuccessSnackbar(`${tipo} creado con éxito`);
    } catch (error) {
      handleApiError(error, `Error al crear ${tipo}`);
    }
    handleCloseModal();
  };

  const showSuccessSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleApiError = (error, defaultMessage) => {
    const message = error.response?.data?.message || defaultMessage;
    setSnackbarMessage(message);
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  };
  const handleConfirmEdit = async () => {
    if (!pendingChanges || !editItem) return;
    try {
      const data = new FormData();
      data.append('tipo', tipo);
      if (pendingChanges.file) {
        data.append('imagen', pendingChanges.file);
      }
      data.append('_method', 'PUT');

      const resp = await axios.post(
        `http://127.0.0.1:8000/api/eventos-avisos/${editItem.idEventosAvisos}`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const updated = items.map(x => x.idEventosAvisos === editItem.idEventosAvisos ? resp.data : x);
      setItems(updated);
      showSuccessSnackbar(`${tipo} #${editItem.idEventosAvisos} editado con éxito`);
    } catch (error) {
      handleApiError(error, `Error al editar ${tipo}`);
    }
    setModalOpen(false);
    setEditItem(null);
    setPendingChanges(null);
    setConfirmEditOpen(false);
    
  };

  // Confirmar edición => PUT /api/eventos-avisos/{id}

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
        {items.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.idEventosAvisos}>
            <Card sx={{
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
                  image={item.rutaImg}
                  alt={`${tipo} #${item.idEventosAvisos}`}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {tipo} #{item.idEventosAvisos}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Fecha: {formatDate(item.fechaPublicacion)}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <IconButton sx={{ color: 'primary.main' }} onClick={() => handleEditClick(item)}>
                  <EditIcon />
                </IconButton>
                <IconButton sx={{ color: '#f9b800' }} onClick={() => handleDeleteClick(item)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Botón Crear */}
      <Box sx={{ position: 'absolute', bottom: -30, right: 16 }}>
        <NewEAButton onClick={handleCreate} />
      </Box>

      {/* Modal de Crear/Editar */}
      {modalOpen && (
        <AdminEAModal
          open={modalOpen}
          onClose={handleCloseModal}
          onRequestEdit={handleRequestEdit}
          editItem={editItem}
          tipo={tipo}
        />
      )}

      {/* Confirmar Eliminación */}
      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        itemName={`${tipo} #${deleteItem ? deleteItem.idEventosAvisos : ''}`}
      />
      

      {/* Confirmar Edición */}
      <ConfirmEditDialog
        open={confirmEditOpen}
        onClose={handleCloseEditDialog}
        onConfirm={handleConfirmEdit}
        itemName={editItem ? `${tipo} #${editItem.idEventosAvisos}` : `Nuevo ${tipo}`}
      />

      {/* Snackbar */}
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

export default AdminEAList;
