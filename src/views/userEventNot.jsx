import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';

// Componentes personalizados
import NewsCarousel from '../components/NewsCarrusel';
import DualCarousel from '../components/EventosAvisosCarousel';
import ImageModal from '../components/Modals/ImageModal';
import NewsModal from '../components/Modals/NewsModal';
import Title from '../components/Title';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from 'react-router-dom';


// Estilo personalizado para flechas del carrusel
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
  // Estados para almacenar noticias, eventos y avisos
  const [newsData, setNewsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [announcementsData, setAnnouncementsData] = useState([]);
  
  // Estados para control de modales
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(true);

  // Se determina si el usuario es "Invitado"
  const rolActivo = JSON.parse(localStorage.getItem("rolActivo") || "null") || { nombreRol: "Invitado" };
  const esInvitado = rolActivo.nombreRol === "Invitado";

  const navigate = useNavigate();

  // Cargar datos al montar la vista
  useEffect(() => {
    Promise.all([fetchNews(), fetchEvents(), fetchAnnouncements()])
      .finally(() => setLoading(false));
  }, []);

  // Obtiene noticias desde Laravel
  const fetchNews = async () => {
    try {
      const resp = await axios.get('http://127.0.0.1:8000/api/noticias');
      const news = resp.data.map(n => ({
        id: n.idNoticias,
        title: n.titulo,
        description: n.descripcion,
        image: n.rutaImg
      }));
      setNewsData(news);
    } catch (error) {
      console.error('Error al cargar noticias:', error);
    }
  };
  // Obtiene eventos desde Laravel
  const fetchEvents = async () => {
    try {
      const resp = await axios.get('http://127.0.0.1:8000/api/eventos-avisos?tipo=Evento');
      const events = resp.data.map(e => ({
        id: e.idEventosAvisos,
        image: e.rutaImg
      }));
      setEventsData(events);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    }
  };

  // Obtiene avisos desde Laravel
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

  // Manejadores de modales
  const handleImageClick = (imageUrl) => setSelectedImage(imageUrl);
  const handleCloseImageModal = () => setSelectedImage(null);
  const handleViewMoreNews = (newsItem) => setSelectedNews(newsItem);
  const handleCloseNewsModal = () => setSelectedNews(null);

  return (
    <Box sx={{ p: 3 }}>
      <style>{arrowOverride}</style>

      {esInvitado && (
        <SpeedDial
          ariaLabel="Accesos rápidos"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          icon={<MenuBookIcon />}
        >
          <SpeedDialAction
            icon={<MenuBookIcon />}
            tooltipTitle="Manual de Calidad"
            onClick={() => navigate('/manual-calidad')}
          />
        </SpeedDial>
      )}

      {/* Noticias */}
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ mb: 4, fontWeight: 'bold', color: '#00aaff', paddingTop: '20px' }}
      >
        Noticias
      </Typography>
      <NewsCarousel newsData={newsData} onViewMore={handleViewMoreNews} loading={loading} />

      {/* Eventos y Avisos */}
      <DualCarousel
        eventsData={eventsData}
        announcementsData={announcementsData}
        onImageClick={handleImageClick}
        loading={loading}
      />

      {/* Modal Imagen */}
      <ImageModal open={Boolean(selectedImage)} imageUrl={selectedImage} onClose={handleCloseImageModal} />

      {/* Modal Noticia */}
      <NewsModal open={Boolean(selectedNews)} newsItem={selectedNews} onClose={handleCloseNewsModal} />
    </Box>
  );
};

export default UserHome;
