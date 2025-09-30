import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TitleDialog from '../TitleDialog';
import CustomButton from "../Button";
import FeedbackSnackbar from '../Feedback';

const MAX_TITULO = 200;
const MAX_DESC = 1000;

const AdminNewsModal = ({ open, onClose, onSave, editItem }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [file, setFile] = useState(null);
  const [fecha, setFecha] = useState('');
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Errores por campo
  const [errors, setErrors] = useState({
    titulo: '',
    descripcion: '',
  });

  // Feedback global (usa tu componente FeedbackSnackbar)
  const [feedback, setFeedback] = useState({
    open: false,
    type: 'info', // success | error | info | warning
    title: '',
    message: '',
  });
  const showFeedback = (type, title, message) =>
    setFeedback({ open: true, type, title, message });

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
      setErrors({ titulo: '', descripcion: '' });
    } else {
      setTitulo('');
      setDescripcion('');
      setFile(null);
      setPreview(null);
      setFileName('');
      const now = dayjs().format('DD-MM-YYYY HH:mm');
      setFecha(now);
      setErrors({ titulo: '', descripcion: '' });
    }
  }, [editItem]);

  // Handlers con limpieza de errores y respeto a longitud
  const handleTituloChange = (e) => {
    const v = e.target.value;
    if (v.length <= MAX_TITULO) setTitulo(v);
    if (v.trim().length > 0) {
      setErrors((prev) => ({ ...prev, titulo: '' }));
    }
  };

  const handleDescripcionChange = (e) => {
    const v = e.target.value;
    if (v.length <= MAX_DESC) setDescripcion(v);
    if (v.trim().length > 0) {
      setErrors((prev) => ({ ...prev, descripcion: '' }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      showFeedback('error', 'Archivo inválido', 'Solo se permiten archivos de imagen');
      return;
    }
    if (selectedFile.size > 2 * 2048 * 2048) {
      showFeedback('error', 'Archivo demasiado grande', 'El tamaño máximo permitido es 5 MB');
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async () => {
    if (submitting) return;

    // Validación requerida
    const newErrors = { titulo: '', descripcion: '' };
    if (!titulo.trim()) newErrors.titulo = 'El título es obligatorio';
    if (!descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria';
    setErrors(newErrors);
    if (newErrors.titulo || newErrors.descripcion) return;

    setSubmitting(true);
    try {
      const formData = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        file,
      };
      // onSave debe devolver una Promise (ya lo preparamos en el padre)
      await onSave(formData);
      // Éxito: el padre cierra el modal; si quieres feedback local, descomenta:
      // showFeedback('success', 'Éxito', editItem ? 'Noticia editada' : 'Noticia creada');
    } catch (err) {
      // Error del backend
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Ocurrió un error al guardar la noticia';
      showFeedback('error', 'Error al guardar', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <Box sx={{ position: 'relative' }}>
          <TitleDialog title={editItem ? "Editar Noticia" : "Crear Noticia"} />
          <IconButton
            aria-label="cerrar"
            onClick={onClose}
            sx={{ position: 'absolute', right: 12, top: 12, color: '#999' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

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
            required
            fullWidth
            margin="normal"
            value={titulo}
            onChange={handleTituloChange}
            error={Boolean(errors.titulo)}
            helperText={errors.titulo || `${titulo.length}/${MAX_TITULO}`}
            inputProps={{ maxLength: MAX_TITULO }}
          />

          <TextField
            label="Descripción"
            required
            fullWidth
            margin="normal"
            multiline
            rows={10}
            value={descripcion}
            onChange={handleDescripcionChange}
            error={Boolean(errors.descripcion)}
            helperText={errors.descripcion || `${descripcion.length}/${MAX_DESC}`}
            inputProps={{ maxLength: MAX_DESC }}
          />

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Subir Imagen
          </Typography>
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 1, backgroundColor: "#68A2C9", display: "flex" }}
          >
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
                <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
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

        <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 2 }}>
          <CustomButton type="cancelar" onClick={onClose} disabled={submitting} aria-label="Cancelar">
            Cancelar
          </CustomButton>
          <CustomButton
            type="guardar"
            onClick={handleSubmit}
            loading={submitting}
            aria-label={editItem ? "Editar noticia" : "Crear noticia"}
          >
            {editItem ? "Editar" : "Crear"}
          </CustomButton>
        </DialogActions>
      </Dialog>

      {/* Feedback global para errores (archivo / backend) */}
      <FeedbackSnackbar
        open={feedback.open}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onClose={() => setFeedback(f => ({ ...f, open: false }))}
      />
    </>
  );
};

export default AdminNewsModal;
