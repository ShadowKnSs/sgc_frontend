import React from 'react';
import { Box, Grid, CircularProgress } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Title from "../components/Title";

const EventosAvisosCarousel = ({ eventsData, announcementsData, onImageClick, loading }) => {
  // Muestra animación de carga mientras se traen los datos
  if (loading) {
    return (
      <Box sx={{ minHeight: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={60} thickness={5} color="primary" />
      </Box>
    );
  }

  return (
    <Grid container spacing={4} columnSpacing={10} sx={{ mt: 5, marginTop: 2 }}>
      {/* ====================== EVENTOS ====================== */}
      <Grid item xs={12} md={6}>
      <Title text="Eventos" ></Title>        
      <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          loop={eventsData.length > 2}
          slidesPerView={Math.min(eventsData.length, 2)}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          spaceBetween={10}
          style={{ padding: '10px 0', width: '90%', margin: '0 auto' }}
        >
          {eventsData.map(event => (
            <SwiperSlide key={event.id}>
              <Box sx={{
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px #2dc1df',
                }
              }}>
                <img
                  src={event.image}
                  alt={`Evento ${event.id}`}
                  loading="lazy"
                  style={{
                    width: '300px',
                    height: '200px',
                    objectFit: 'fill',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onImageClick(event.image)} // Abre modal con la imagen
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Grid>

      {/* ====================== AVISOS ====================== */}
      <Grid item xs={12} md={6}>
      <Title text="Avisos" ></Title>        

        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          loop={announcementsData.length > 2}
          slidesPerView={Math.min(announcementsData.length, 2)}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          spaceBetween={10}
          style={{ padding: '10px 0', width: '90%', margin: '0 auto' }}
        >
          {announcementsData.map(announcement => (
            <SwiperSlide key={announcement.id}>
              <Box sx={{
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px #2dc1df',
                }
              }}>
                <img
                  src={announcement.image}
                  alt={`Aviso ${announcement.id}`}
                  loading="lazy"
                  style={{
                    width: '300px',
                    height: '200px',
                    objectFit: 'fill',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onImageClick(announcement.image)} // Abre modal con la imagen
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
