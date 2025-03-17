import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import NewsCarousel from '../components/NewsCarrusel';
import DualCarousel from '../components/EventosAvisosCarousel';
import ImageModal from '../components/Modals/ImageModal';
import NewsModal from '../components/Modals/NewsModal';

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
  // Estados para noticias, eventos y avisos
  const [newsData, setNewsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [announcementsData, setAnnouncementsData] = useState([]);

  // Estado para modales
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    fetchNews();
    fetchEvents();
    fetchAnnouncements();
  }, []);

  const fetchNews = async () => {
    try {
      const resp = await axios.get('http://127.0.0.1:8000/api/noticias');
      // Ajustamos la data para el NewsCarousel
      // Suponiendo que en resp.data[i] tienes { idNoticias, titulo, descripcion, rutaImg, ... }
      const news = resp.data.map(n => ({
        id: n.idNoticias,
        title: n.titulo,
        description: n.descripcion,
        image: n.rutaImg // La URL absoluta
      }));
      setNewsData(news);
    } catch (error) {
      console.error('Error al cargar noticias:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const resp = await axios.get('http://127.0.0.1:8000/api/eventos-avisos?tipo=Evento');
      // Suponiendo resp.data[i] => { idEventosAvisos, rutaImg, ... }
      const events = resp.data.map(e => ({
        id: e.idEventosAvisos,
        image: e.rutaImg
      }));
      setEventsData(events);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const resp = await axios.get('http://127.0.0.1:8000/api/eventos-avisos?tipo=Aviso');
      const announcements = resp.data.map(a => ({
        id: a.idEventosAvisos,
        image: a.rutaImg
      }));
      setAnnouncementsData(announcements);
    } catch (error) {
      console.error('Error al cargar avisos:', error);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  const handleViewMoreNews = (newsItem) => {
    setSelectedNews(newsItem);
  };

  const handleCloseNewsModal = () => {
    setSelectedNews(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <style>{arrowOverride}</style>

      {/* <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}
      >
        Informate
      </Typography> */}

      {/* Carrusel de Noticias */}
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ mb: 4, fontWeight: 'bold', color: '#00aaff', paddingTop: '20px'  }}
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
