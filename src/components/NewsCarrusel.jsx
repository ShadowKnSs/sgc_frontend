import React from 'react';
import { Card, CardContent, CardActions, CardMedia, Typography, Button } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Función para truncar texto
function truncate(str, maxLength) {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}

const NewsCarousel = ({ newsData, onViewMore }) => {
  return (
    <Swiper
      modules={[Navigation]}
      navigation
      loop
      spaceBetween={15}
      slidesPerView={4}
      style={{ padding: '20px 0' }}
    >
      {newsData.map(item => (
        <SwiperSlide key={item.id}>
          <Card sx={{ maxWidth: 260, margin: '0 auto' }}>
            <CardMedia
              component="img"
              height="140"
              image={item.image}
              alt={item.title}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {item.title}
              </Typography>
              {/* Truncamos el contenido a 50 caracteres */}
              <Typography variant="body2" color="text.secondary"sx={{textAlign:"justify"}}>
                {truncate(item.description, 180)}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', mb: 1 }}>
              <Button
                variant="contained"
                size="small"
                sx={{ background: "#F9B800"}}
                onClick={() => onViewMore(item)}
              >
                Ver Más
              </Button>
            </CardActions>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default NewsCarousel;
