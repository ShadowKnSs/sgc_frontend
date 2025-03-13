import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TextField, Button, Typography, Snackbar, Alert, Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DialogActionButtons from '../DialogActionButtons';

const AdminNewsModal = ({ open, onClose, onSave, editItem }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [file, setFile] = useState(null);
  const [fecha, setFecha] = useState('');
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editItem) {
      setTitulo(editItem.titulo || '');
      setDescripcion(editItem.descripcion || '');
      setPreview(editItem.rutaImg || null);
      setFile(null);
      setFileName('');
      if (editItem.fechaPublicacion) {
        const dateFormatted = dayjs(editItem.fechaPublicacion).format('DD-MM-YYYY HH:mm');
        setFecha(dateFormatted);
      } else {
        setFecha('');
      }
    } else {
      setTitulo('');
      setDescripcion('');
      setFile(null);
      setPreview(null);
      setFileName('');
      const now = dayjs().format('DD-MM-YYYY HH:mm');
      setFecha(now);
    }
  }, [editItem]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validaciones
    if (!selectedFile.type.startsWith('image/')) {
      setErrorMessage('Solo se permiten archivos de imagen');
      setErrorOpen(true);
      return;
    }
    if (selectedFile.size > 2 * 1024 * 1024) {
      setErrorMessage('El tamaño máximo permitido es 2MB');
      setErrorOpen(true);
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = () => {
    const formData = {
      titulo,
      descripcion,
      file
    };
    console.log("Este es el formData que se envía:", formData);
    onSave(formData);
  };

  const handleCloseError = () => {
    setErrorOpen(false);
    setErrorMessage('');
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editItem ? 'Editar Noticia' : 'Crear Noticia'}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            label="Fecha de Publicación"
            value={fecha}
            fullWidth
            margin="normal"
            disabled
          />

          <TextField
            label="Título"
            fullWidth
            margin="normal"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <TextField
            label="Descripción"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Subir Imagen
          </Typography>
          <Button variant="contained" component="label" sx={{ mt: 1, backgroundColor: "secondary.main", display: "flex" }}>
            Seleccionar Imagen
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleFileChange}
            />
          </Button>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {fileName ? (
              <>
                Imagen Seleccionada:{' '}
                <Box
                  component="span"
                  sx={{ fontWeight: 'bold', color: 'primary.main' }} // Ajusta tu color y estilo
                >
                  {fileName}
                </Box>
              </>
            ) : (
              'Ninguna imagen seleccionada'
            )}
          </Typography>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{ width: '100%', marginTop: '1em', borderRadius: '5px' }}
            />
          )}
        </DialogContent>

        <DialogActions>
          <DialogActionButtons
            onCancel={onClose}
            onSave={handleSubmit}
            saveText={editItem ? 'Editar' : 'Crear'}
            cancelText="Cancelar"
            saveColor="terciary.main"
            cancelColor="primary.main"
          />
        </DialogActions>
      </Dialog>

      {/* Snackbar de Error */}
      <Snackbar
        open={errorOpen}
        autoHideDuration={3000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminNewsModal;
