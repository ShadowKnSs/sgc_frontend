import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Card, CardMedia, CardContent, CardActions, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const NewsCarousel = () => {
  const newsItems = [
    {
      id: 1,
      title: 'Noticia 1',
      description: 'Breve descripción de la noticia 1',
      image: 'https://via.placeholder.com/300x150',
      content: 'Contenido completo de la noticia 1...'
    },
    {
      id: 2,
      title: 'Noticia 2',
      description: 'Breve descripción de la noticia 2',
      image: 'https://via.placeholder.com/300x150',
      content: 'Contenido completo de la noticia 2...'
    },
    {
      id: 3,
      title: 'Noticia 3',
      description: 'Breve descripción de la noticia 3',
      image: 'https://via.placeholder.com/300x150',
      content: 'Contenido completo de la noticia 3...'
    },
  ];

  const [selectedNews, setSelectedNews] = useState(null);

  const handleClose = () => {
    setSelectedNews(null);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Noticias</Typography>
      <Swiper spaceBetween={30} slidesPerView={3} centeredSlides>
        {newsItems.map(item => (
          <SwiperSlide key={item.id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="140"
                image={item.image}
                alt={item.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h6">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => setSelectedNews(item)}>
                  Ver más
                </Button>
              </CardActions>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
      <Dialog open={Boolean(selectedNews)} onClose={handleClose} fullWidth maxWidth="sm">
        {selectedNews && (
          <>
            <DialogTitle>{selectedNews.title}</DialogTitle>
            <DialogContent dividers>
              <img src={selectedNews.image} alt={selectedNews.title} style={{ width: '100%', marginBottom: '1em' }} />
              <Typography variant="body1">{selectedNews.content}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cerrar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default NewsCarousel;
