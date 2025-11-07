/**
 * Vista: UserHome
 * Descripción:
 * Página principal del usuario donde se muestran:
 * - Noticias recientes (con título, descripción e imagen)
 * - Carruseles de eventos y avisos (visuales)
 * - Accesos rápidos si el rol es "Invitado" (por ejemplo, al Manual de Calidad)
 * 
 * Funcionalidades:
 * - Consulta noticias, eventos y avisos desde la API de Laravel.
 * - Permite ver detalles de una noticia o imagen en modales.
 * - Adapta el contenido visual según el rol del usuario.
 * 
 * Componentes personalizados utilizados:
 * - `NewsCarousel`, `DualCarousel`, `ImageModal`, `NewsModal`, `Title`, `SpeedDial`
 */
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';


// Componentes personalizados
import NewsCarousel from '../components/NewsCarrusel';
import DualCarousel from '../components/EventosAvisosCarousel';
import ImageModal from '../components/Modals/ImageModal';
import NewsModal from '../components/Modals/NewsModal';
import ZoomImageModal from '../components/Modals/ImagenModalNot';
import Title from "../components/Title";
import BreadcrumbNav from "../components/BreadcrumbNav";

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NewspaperIcon from '@mui/icons-material/Newspaper'
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

  const [enlargeOpen, setEnlargeOpen] = useState(false);
  const [enlargeSrc, setEnlargeSrc] = useState(null);
  const [enlargeTitle, setEnlargeTitle] = useState("");

  // Se determina si el usuario es "Invitado"
  const rolActivo = JSON.parse(localStorage.getItem("rolActivo") || "null") || { nombreRol: "Invitado" };
  const esInvitado = rolActivo.nombreRol === "Invitado";

  const navigate = useNavigate();

  // Breadcrumb: Inicio > Noticias y Eventos (con icono)
  const breadcrumbItems = [
    { label: "Noticias y Eventos", icon: NewspaperIcon }
  ];

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
    }
  };

  // Manejadores de modales
  const handleImageClick = (imageUrl) => setSelectedImage(imageUrl);
  const handleCloseImageModal = () => setSelectedImage(null);
  const handleViewMoreNews = (newsItem) => setSelectedNews(newsItem);
  const handleCloseNewsModal = () => setSelectedNews(null);

  // Abrir el modal de zoom desde el NewsModal

  const handleEnlargeFromNews = (src, title) => {
    setEnlargeSrc(src);
    setEnlargeTitle(title || "Vista ampliada");
    setEnlargeOpen(true);
  };
  const handleCloseEnlarge = () => {
    setEnlargeOpen(false);
    setEnlargeSrc(null);
    setEnlargeTitle("");
  };

  return (
    <Box sx={{ p: 2 }}>
      <style>{arrowOverride}</style>

      {/* Breadcrumb pegado a la izquierda */}
      <BreadcrumbNav items={breadcrumbItems} />

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
      <Title text="Noticias" ></Title>
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
      <NewsModal open={Boolean(selectedNews)} newsItem={selectedNews} onClose={handleCloseNewsModal} onEnlarge={handleEnlargeFromNews} />

      <ZoomImageModal
        open={enlargeOpen}
        src={enlargeSrc}
        title={enlargeTitle}
        onClose={handleCloseEnlarge}
      />
    </Box>
  );
};

export default UserHome;
