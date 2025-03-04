// src/views/UserHome.js
import React, { useState } from 'react';
import { Box, Typography, Dialog, DialogContent, DialogActions, DialogTitle, Button} from '@mui/material';
import NewsCarousel from '../components/NewsCarrusel';
import DualCarousel from '../components/EventosAvisosCarousel';

// Estilos personalizados para flechas
const arrowOverride = `
  .swiper-button-next,
  .swiper-button-prev {
    color: #2dc1df;
    width: 30px;
    height: 30px;
  }
  .swiper-button-next::after,
  .swiper-button-prev::after {
    font-size: 20px;
  }
`;

const UserHome = () => {
  // Datos de ejemplo
  const newsData = [
    { id: 1, title: 'Noticia 1', description: 'Descripcion breve....', image: 'http://127.0.0.1:8000/storage/img/aviso.png' },
    { id: 2, title: 'Noticia 2', description: 'Descripción breve...', image: 'http://127.0.0.1:8000/storage/img/efecto.jpg' },
    { id: 3, title: 'Noticia 3', description: 'Descripción breve...', image: 'http://127.0.0.1:8000/storage/img/aviso.png' },
    { id: 4, title: 'Noticia 4', description: 'Descripción breve...', image: 'http://127.0.0.1:8000/storage/img/aviso.png' },
    { id: 5, title: 'Noticia 5', description: 'Descripción breve...', image: 'http://127.0.0.1:8000/storage/img/aviso.png' }
  ];

  const eventsData = [
    { id: 1, image: 'http://127.0.0.1:8000/storage/img/efecto.jpg' },
    { id: 2, image: 'http://127.0.0.1:8000/storage/img/efecto.jpg' },
    { id: 3, image: 'http://127.0.0.1:8000/storage/img/efecto.jpg' },
    { id: 4, image: 'http://127.0.0.1:8000/storage/img/efecto.jpg' },
  ];

  const announcementsData = [
    { id: 1, image: 'http://127.0.0.1:8000/storage/img/aviso.png' },
    { id: 2, image: 'http://127.0.0.1:8000/storage/img/aviso.png' },
    { id: 3, image: 'http://127.0.0.1:8000/storage/img/aviso.png' },
  ];

  // Estado para mostrar imagen en modal
  const [selectedImage, setSelectedImage] = useState(null);
 // Para mostrar la noticia seleccionada en modal
 const [selectedNews, setSelectedNews] = useState(null);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };


 // Se llama cuando se hace clic en "Ver Más" de una noticia
  const handleViewMoreNews = (newsItem) => {
    setSelectedNews(newsItem);
  };

  const handleCloseNewsModal = () => {
    setSelectedNews(null);
  };
  return (
    <Box sx={{ p: 3 }}>
      {/* Estilos para flechas de swiper */}
      <style>{arrowOverride}</style>

      {/* Título principal */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ mb: 4, fontWeight: 'bold', color: '#00aaff' }}
      >
        Informate
      </Typography>

      {/* Sección de Noticias */}
      <Typography variant="h5" align="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#00aaff' }}>
        Noticias
      </Typography>
      <NewsCarousel newsData={newsData} onViewMore={handleViewMoreNews}/>

      {/* Carruseles de Eventos y Avisos en la misma fila */}
      <DualCarousel
        eventsData={eventsData}
        announcementsData={announcementsData}
        onImageClick={handleImageClick}
      />

      {/* Modal para mostrar imagen ampliada */}
      {selectedImage && (
        <Dialog open={Boolean(selectedImage)} onClose={handleCloseModal} maxWidth="md">
          <DialogContent sx={{ textAlign: 'center' }}>
            <img 
              src={selectedImage} 
              alt="Ampliada" 
              style={{ maxWidth: '100%', borderRadius: '5px' }} 
            />
          </DialogContent>
        </Dialog>
      )}
      {/* Modal para mostrar noticia completa */}
      {selectedNews && (
        <Dialog open={Boolean(selectedNews)} onClose={handleCloseNewsModal} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedNews.title}</DialogTitle>
          <DialogContent dividers sx={{textAlign: "center"}}>
            <img
              src={selectedNews.image}
              alt={selectedNews.title}
              style={{ width: '70%', marginBottom: '1em', borderRadius: '5px' }}
            />
            <Typography variant="body1" sx={{textAlign: "justify"}}>
              {selectedNews.description}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNewsModal}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default UserHome;
