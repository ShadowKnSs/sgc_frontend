import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const EventosAvisosCarousel = ({ eventsData, announcementsData, onImageClick }) => {
  return (
    <Grid container spacing={4} columnSpacing={10} sx={{ mt: 5 }}>
      {/* Eventos */}
      <Grid item xs={12} md={6}>
        <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#00aaff' }}>
          Eventos
        </Typography>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          loop={eventsData.length > 2} // solo activa loop si hay más de 2 slides
          slidesPerView={Math.min(eventsData.length, 2)} // si hay 1 slide, ver 1, si hay 2 o más => ver 2
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          spaceBetween={10}

          style={{ padding: '10px 0', width: '90%', margin: '0 auto' }}
        >
          {eventsData.map(event => (
            <SwiperSlide key={event.id}>
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src={event.image}
                  alt={`Evento ${event.id}`}
                  style={{
                    width: '300px',
                    height: '200px',
                    objectFit: 'fill', // se distorsiona para llenar
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onImageClick(event.image)}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Grid>

      {/* Avisos */}
      <Grid item xs={12} md={6}>
        <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#00aaff' }}>
          Avisos
        </Typography>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          loop={eventsData.length > 2} // solo activa loop si hay más de 2 slides
          slidesPerView={Math.min(eventsData.length, 2)} // si hay 1 slide, ver 1, si hay 2 o más => ver 2
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          spaceBetween={10}
          style={{ padding: '10px 0', width: '90%', margin: '0 auto' }}
        >
          {announcementsData.map(announcement => (
            <SwiperSlide key={announcement.id}>
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src={announcement.image}
                  alt={`Aviso ${announcement.id}`}
                  style={{
                    width: '300px',
                    height: '200px',
                    objectFit: 'fill', // se distorsiona para llenar
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onImageClick(announcement.image)}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Grid>
    </Grid>
  );
};

export default EventosAvisosCarousel;
