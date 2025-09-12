import React, { useMemo } from 'react';
import { Box, Grid, CircularProgress, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CampaignIcon from '@mui/icons-material/Campaign';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Title from "../components/Title";

const EmptyBlock = ({ icon, text }) => (
  <Box sx={{
    minHeight: 220,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    backgroundColor: '#F5F7F8',
    borderRadius: '8px',
    border: '1px dashed',
    borderColor: 'divider',
    mx: 'auto',
    width: '100%'
  }}>
    {icon}
    <Typography variant="body2" color="text.secondary">{text}</Typography>
  </Box>
);

const MediaCard = ({ src, alt, onClick }) => (
  <Box
    sx={{
      textAlign: 'center',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': { transform: 'scale(1.02)', boxShadow: '0 4px 12px #2dc1df' }
    }}
  >
    <Box
      component="img"
      src={src}
      alt={alt}
      loading="lazy"
      onClick={onClick}
      sx={{
        width: '100%',
        maxWidth: 480,
        mx: 'auto',
        display: 'block',
        borderRadius: '8px',
        cursor: 'pointer',
        // Mantén relación 3:2 y recorta con cover
        aspectRatio: '3 / 2',
        objectFit: 'cover'
      }}
    />
  </Box>
);

const EventosAvisosCarousel = ({ eventsData, announcementsData, onImageClick, loading }) => {
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm')); // ≥600 => 2 (para dos columnas internas de carrusel)
  const spv = useMemo(() => (smUp ? 2 : 1), [smUp]);

  if (loading) {
    return (
      <Box sx={{ minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <CircularProgress size={42} />
        <Typography variant="body2" color="text.secondary">Cargando eventos y avisos…</Typography>
      </Box>
    );
  }

  const renderEvents = () => {
    if (!eventsData || eventsData.length === 0) {
      return (
        <EmptyBlock
          icon={<EventAvailableIcon sx={{ fontSize: 48, color: 'text.disabled' }} />}
          text="No hay eventos por ahora"
        />
      );
    }
    return (
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={eventsData.length > spv}
        loop={eventsData.length > spv}
        breakpoints={{
          0:   { slidesPerView: 1, spaceBetween: 10 },
          600: { slidesPerView: 2, spaceBetween: 12 },
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        style={{ padding: '10px 0', width: '100%', margin: '0 auto' }}
      >
        {eventsData.map(event => (
          <SwiperSlide key={event.id}>
            <MediaCard
              src={event.image}
              alt={`Evento ${event.id}`}
              onClick={() => onImageClick(event.image)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  const renderAnnouncements = () => {
    if (!announcementsData || announcementsData.length === 0) {
      return (
        <EmptyBlock
          icon={<CampaignIcon sx={{ fontSize: 48, color: 'text.disabled' }} />}
          text="No hay avisos por ahora"
        />
      );
    }
    return (
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={announcementsData.length > spv}
        loop={announcementsData.length > spv}
        breakpoints={{
          0:   { slidesPerView: 1, spaceBetween: 10 },
          600: { slidesPerView: 2, spaceBetween: 12 },
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        style={{ padding: '10px 0', width: '100%', margin: '0 auto' }}
      >
        {announcementsData.map(announcement => (
          <SwiperSlide key={announcement.id}>
            <MediaCard
              src={announcement.image}
              alt={`Aviso ${announcement.id}`}
              onClick={() => onImageClick(announcement.image)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  return (
    <Grid
      container
      spacing={{ xs: 3, md: 4 }}
      columnSpacing={{ md: 8 }}
      sx={{ mt: { xs: 3, md: 5 } }}
    >
      {/* EVENTOS */}
      <Grid item xs={12} md={6}>
        <Title text="Eventos" />
        {renderEvents()}
      </Grid>

      {/* AVISOS */}
      <Grid item xs={12} md={6}>
        <Title text="Avisos" />
        {renderAnnouncements()}
      </Grid>
    </Grid>
  );
};

export default EventosAvisosCarousel;
