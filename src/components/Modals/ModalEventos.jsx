import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, TextField, Box } from '@mui/material';
import DialogActionButtons from '../DialogActionButtons';

const NewsModal = ({ open, news, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (news) {
      setTitle(news.title || '');
      setAuthor(news.author || '');
      setContent(news.content || '');
      setImage(news.image || '');
      setDate(news.date || '');
    } else {
      setTitle('');
      setAuthor('');
      setContent('');
      setImage('');
      setDate('');
    }
  }, [news]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, author, content, image, date });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{news ? 'Editar Noticia' : 'Crear Noticia'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 1 }}>
            <TextField
              label="Título"
              fullWidth
              margin="normal"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <TextField
              label="Autor"
              fullWidth
              margin="normal"
              value={author}
              onChange={e => setAuthor(e.target.value)}
            />
            <TextField
              label="Contenido"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
            <TextField
              label="URL de Imagen"
              fullWidth
              margin="normal"
              value={image}
              onChange={e => setImage(e.target.value)}
            />
            <TextField
              label="Fecha"
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </Box>
        </DialogContent>
        <Box sx={{ p: 2 }}>
          <Grid item xs={12}>
            <DialogActionButtons
              onCancel={onClose}
              onSave={handleSubmit}
              saveText={news ? "Actualizar" : "Guardar"}
              cancelText="Cancelar"
              saveColor="terciary.main"
              cancelColor="primary.main"
            />
          </Grid>
        </Box>
      </form>
    </Dialog>
  );
};

export default NewsModal;
