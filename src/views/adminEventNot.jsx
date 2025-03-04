import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, CardActions, Button, Typography, Grid } from '@mui/material';
import axios from 'axios';
import NewsModal from '../components/Modals/ModalEventos';

const AdminNewsList = () => {
  const [news, setNews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    // Obtener noticias del backend
    axios.get('/api/news')
      .then(response => setNews(response.data))
      .catch(err => console.error(err));
  }, []);

  const handleEdit = (newsItem) => {
    setSelectedNews(newsItem);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`/api/news/${id}`)
      .then(() => setNews(news.filter(n => n.id !== id)))
      .catch(err => console.error(err));
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedNews(null);
  };

  const handleSave = (data) => {
    if (selectedNews) {
      // Actualizar noticia
      axios.put(`/api/news/${selectedNews.id}`, data)
        .then(response => {
          setNews(news.map(n => n.id === selectedNews.id ? response.data : n));
          handleModalClose();
        })
        .catch(err => console.error(err));
    } else {
      // Crear noticia nueva
      axios.post('/api/news', data)
        .then(response => {
          setNews([...news, response.data]);
          handleModalClose();
        })
        .catch(err => console.error(err));
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Gestión de Noticias</Typography>
      <Button variant="contained" onClick={() => { setSelectedNews(null); setModalOpen(true); }}>
        Crear Noticia
      </Button>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {news.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2">
                  {item.content.substring(0, 100)}...
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleEdit(item)}>Editar</Button>
                <Button size="small" onClick={() => handleDelete(item.id)}>Eliminar</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <NewsModal open={modalOpen} news={selectedNews} onClose={handleModalClose} onSave={handleSave} />
    </Box>
  );
};

export default AdminNewsList;
