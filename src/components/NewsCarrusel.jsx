import React from 'react';
import { Card, CardContent, CardActions, CardMedia, Typography, Button, Tooltip } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Función utilitaria que corta el texto si es muy largo
function truncate(str, maxLength) {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}

const NewsCarousel = ({ newsData, onViewMore }) => {
  // Solo se activa navegación si hay al menos 4 noticias
  const hasEnoughSlides = newsData.length >= 4;
  return (
    <Swiper
      modules={[Navigation]}
      navigation={hasEnoughSlides}
      slidesPerView={4}
      centerInsufficientSlides
      spaceBetween={15}
      style={{ padding: '20px 0' }}
    >
      {newsData.map(item => (
        <SwiperSlide key={item.id}>
          <Card sx={{
            height: 390,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 300,
            margin: '0 auto',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: '0 4px 12px #2dc1df',
            }
          }}>
            <CardMedia
              component="img"
              height="150"
              image={item.image}
              alt={item.title}
              loading="lazy"
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "justify" }}>
                {truncate(item.description, 180)}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', mb: 1 }}>
              <Tooltip title="Ver noticia completa">
                <Button
                  variant="contained"
                  size="small"
                  sx={{ background: "#F9B800" }}
                  onClick={() => onViewMore(item)} // Abre modal con la noticia completa
                >
                  Ver Más
                </Button>
              </Tooltip>
            </CardActions>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default NewsCarousel;
