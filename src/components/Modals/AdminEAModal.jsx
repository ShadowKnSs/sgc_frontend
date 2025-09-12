import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  TextField,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TitleDialog from '../TitleDialog';
import dayjs from 'dayjs';
import CustomButton from "../Button";

const AdminEAModal = ({ open, onClose, onRequestEdit, editItem, tipo }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fecha, setFecha] = useState('');
  const [fileName, setFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // error específico para la imagen obligatoria
  const [imgError, setImgError] = useState('');

  useEffect(() => {
    if (editItem) {
      setFile(null);
      setPreview(editItem.rutaImg || null);
      setFileName('');
      if (editItem.fechaPublicacion) {
        const dateFormatted = dayjs(editItem.fechaPublicacion).format('DD-MM-YYYY HH:mm');
        setFecha(dateFormatted);
      } else {
        setFecha('');
      }
      setImgError(''); // limpiar error al entrar en edición
    } else {
      setFile(null);
      setPreview(null);
      setFileName('');
      const now = dayjs().format('DD-MM-YYYY HH:mm');
      setFecha(now);
      setImgError('');
    }
  }, [editItem]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validación de tipo y tamaño
    if (!selectedFile.type.startsWith('image/')) {
      setImgError('Solo se permiten archivos de imagen');
      return;
    }
    if (selectedFile.size > 2 * 1024 * 1024) {
      setImgError('El tamaño máximo permitido es 2 MB');
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setPreview(URL.createObjectURL(selectedFile));
    // si había error por falta de imagen, lo limpiamos al elegir archivo válido
    setImgError('');
  };

  const handleSubmit = async () => {
    if (submitting) return;

    // Requisito: imagen obligatoria al CREAR.
    // En edición, si ya hay preview (imagen previa del item) no obligamos subir nueva.
    const mustHaveImage = !editItem; // crear => true, editar => false
    const hasExistingImage = Boolean(preview); // si editItem trae rutaImg, preview está seteado

    if (mustHaveImage && !file) {
      setImgError('La imagen es obligatoria');
      return;
    }
    if (!mustHaveImage && !file && !hasExistingImage) {
      // caso extremo: edición sin imagen previa y sin seleccionar nueva (por seguridad)
      setImgError('La imagen es obligatoria');
      return;
    }

    setSubmitting(true);
    try {
      const formData = { file };
      await onRequestEdit(formData); // el padre devuelve una Promise; el botón muestra loading
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ position: 'relative' }}>
        <TitleDialog
          title={editItem ? `Editar ${tipo}` : `Crear ${tipo}`}
          subtitle={editItem ? `${tipo} #${editItem.idEventosAvisos}` : null}
        />
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12, color: "#999" }}
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

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Subir Imagen <Typography component="span" color="error">*</Typography>
        </Typography>

        <Button
          variant="contained"
          component="label"
          sx={{ mt: 1, backgroundColor: "#68A2C9", display: "flex" }}
          aria-describedby="imagen-helper"
        >
          Subir archivo
          <input
            hidden
            accept="image/*"
            type="file"
            onChange={handleFileChange}
          />
        </Button>

        {/* HelperText para imagen */}
        <Typography
          id="imagen-helper"
          variant="body2"
          sx={{ mt: 1 }}
          color={imgError ? 'error' : 'text.secondary'}
        >
          {imgError
            ? imgError
            : (fileName
                ? <>Imagen seleccionada: <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{fileName}</Box></>
                : (editItem && preview
                    ? 'Se conservará la imagen actual si no seleccionas una nueva.'
                    : 'Ninguna imagen seleccionada'))}
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
        <CustomButton type="cancelar" onClick={onClose} disabled={submitting}>
          Cancelar
        </CustomButton>
        <CustomButton type="guardar" onClick={handleSubmit} loading={submitting}>
          {editItem ? "Editar" : "Crear"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default AdminEAModal;
