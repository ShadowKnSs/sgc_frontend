import React, { useState } from 'react';
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
import AdminEAModal from './Modals/AdminEAModal';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import ConfirmEditDialog from '../components/ConfirmEditDialog';
import NewEAButton from "../components/NewCardButtom";


// Datos estáticos simulados
const initialEventos = [
  {
    idEventosAvisos: 1,
    rutaImg: 'http://127.0.0.1:8000/storage/img/efecto.jpg',
    fechaPublicacion: '2014-02-01 11:00 AM'

  },
  {
    idEventosAvisos: 2,
    rutaImg: 'http://127.0.0.1:8000/storage/img/efecto.jpg',
    fechaPublicacion: '2034-05-02 10:45 AM'
  },
];

const initialAvisos = [
  {
    idEventosAvisos: 1,
    rutaImg: 'http://127.0.0.1:8000/storage/img/efecto.jpg',
    fechaPublicacion: '2034-05-02 10:45 AM'
  },
  {
    idEventosAvisos: 2,
    rutaImg: 'http://127.0.0.1:8000/storage/img/efecto.jpg',
    fechaPublicacion: '2034-05-02 10:45 AM'

  },
];

const AdminEAList = ({ tipo }) => {
  // Dependiendo del tipo, inicializamos con eventos o avisos
  const [items, setItems] = useState(
    tipo === 'Evento' ? initialEventos : initialAvisos
  );

  // Modal de crear/editar
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Confirmación de eliminación
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  // Confirmación de edición
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

  // Editar (primero abrimos modal normal)
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
    // Filtramos localmente
    setItems(items.filter(x => x.idEventosAvisos !== deleteItem.idEventosAvisos));
    setSnackbarMessage(`${tipo} "${deleteItem.idEventosAvisos}" eliminado con éxito`);
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

  // Petición de edición (cuando se da "Guardar" en AdminEAModal)
  const handleRequestEdit = (formData) => {
    if (editItem) {
      // Confirmar edición
      setPendingChanges(formData);
      setConfirmEditOpen(true);
    } else {
      // Crear sin confirmar
      const newId = items.length ? Math.max(...items.map(x => x.idEventosAvisos)) + 1 : 1;
      const fecha = new Date().toLocaleString();
      const newItem = {
        idEventosAvisos: newId,
        ...formData,
        fechaPublicacion: fecha
      };
      setItems([...items, newItem]);
      setSnackbarMessage(`${tipo} creado con éxito`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setModalOpen(false);
    }
  }



  // Confirmar edición
  const handleConfirmEdit = () => {
    if (!pendingChanges) return;
    if (editItem) {
      // Editar
      const updated = items.map(x => {
        if (x.idEventosAvisos === editItem.idEventosAvisos) {
          return { ...x, ...pendingChanges };
        }
        return x;
      });
      setItems(updated);
      setSnackbarMessage(`${tipo} #${editItem.idEventosAvisos} editado con éxito`);
    } else {
      // Crear
      const newId = items.length ? Math.max(...items.map(x => x.idEventosAvisos)) + 1 : 1;
      const newItem = { idEventosAvisos: newId, ...pendingChanges };
      setItems([...items, newItem]);
      setSnackbarMessage(`${tipo} creado con éxito`);
    }
    setSnackbarSeverity('success');
    setSnackbarOpen(true);

    // Cerrar modal de edición y el confirm
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
        {items.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.idEventosAvisos}>
            <Card>
              {/* Mostrar la imagen */}
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
                  Fecha: {item.fechaPublicacion}
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

      {/* Botón Crear (parte inferior derecha) */}
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          right: 16,
        }}
      >
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

export default AdminEAList;
