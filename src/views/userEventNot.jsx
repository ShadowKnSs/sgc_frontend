// src/views/UserHome.js
import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import NewsCarousel from '../components/NewsCarrusel';
import DualCarousel from '../components/EventosAvisosCarousel';
import ImageModal from '../components/Modals/ImageModal';
import NewsModal from '../components/Modals/NewsModal';

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
    { id: 1, title: 'Noticia 1', description: 'Descripcion breve....LLDP permite que los dispositivos de red que operan en las capas inferiores de una pila de protocolos (como puentes y conmutadores de capa 2) aprendan algunas de las capacidades y características de los dispositivos LAN disponibles para los protocolos de capa superior, como las direcciones IP. La información recopilada a través de la operación LLDP se almacena en un dispositivo de red y se consulta con SNMP. La información de topología también se puede recopilar de esta base de datos.', image: 'http://127.0.0.1:8000/storage/img/aviso.png' },
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

   // Cerrar modal de imagen
   const handleCloseImageModal = () => {
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
      {/* Incrustamos estilos para flechas de swiper */}
      <style>{arrowOverride}</style>

      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ mb: 4, fontWeight: 'bold', color: '#00aaff' }}
      >
        Informate
      </Typography>

      {/* Carrusel de Noticias */}
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ mb: 4, fontWeight: 'bold', color: '#00aaff' }}
      >
        Noticias
      </Typography>
      <NewsCarousel newsData={newsData} onViewMore={handleViewMoreNews} />

      {/* Carrusel de Eventos y Avisos */}
      <DualCarousel
        eventsData={eventsData}
        announcementsData={announcementsData}
        onImageClick={handleImageClick}
      />

      {/* Modal para imagen ampliada */}
      <ImageModal
        open={Boolean(selectedImage)}
        imageUrl={selectedImage}
        onClose={handleCloseImageModal}
      />

      {/* Modal para noticia completa */}
      <NewsModal
        open={Boolean(selectedNews)}
        newsItem={selectedNews}
        onClose={handleCloseNewsModal}
      />
    </Box>
  );
};

export default UserHome;
