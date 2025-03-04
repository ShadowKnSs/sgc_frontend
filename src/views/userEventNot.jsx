import React, {useState} from 'react';
import { Box, Typography, Card, CardContent, CardActions, CardMedia, Button, Grid , Dialog, DialogContent} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay} from 'swiper/modules';
import 'swiper/css';           // estilos básicos
import 'swiper/css/navigation';// estilos para flechas de navegación // Estilos para flechas de navegaciónlos para flechas de navegación

const arrowOverride = `
  .swiper-button-next,
  .swiper-button-prev {
    color: #2dc1df;            /* color de flechas */
    width: 30px;            /* ancho de la zona clicable */
    height: 30px;           /* alto de la zona clicable */
  }
  .swiper-button-next::after,
  .swiper-button-prev::after {
    font-size: 20px;        /* tamaño del ícono de flecha */
  }
`;
const UserHome = () => {
  // Datos de ejemplo
  const newsData = [
    {
      id: 1,
      title: 'Noticia 1',
      description: 'Descripción breve de la noticia...',
      image: 'http://127.0.0.1:8000/storage/img/aviso.png'
    },
    {
      id: 2,
      title: 'Noticia 2',
      description: 'Descripción breve de la noticia...',
      image: 'http://127.0.0.1:8000/storage/img/efecto.jpg'
    },
    {
      id: 3,
      title: 'Noticia 3',
      description: 'Descripción breve de la noticia...',
      image: 'http://127.0.0.1:8000/storage/img/aviso.png'
    },
    {
      id: 4,
      title: 'Noticia 4',
      description: 'Descripción breve de la noticia...',
      image: 'http://127.0.0.1:8000/storage/img/aviso.png'
    },
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


  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <style>{arrowOverride}</style>

      {/* Título Principal */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ mb: 4, fontWeight: 'bold', color: '#00aaff' }}
      >
        Informate
      </Typography>

      {/* Carrusel de Noticias */}
      <Typography variant="h5" align="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#00aaff' }}>
        Noticias
      </Typography>
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
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', mb: 1 }}>
                <Button variant="contained" size="small" sx={{ background: "#F9B800"}}>Ver Más</Button>
              </CardActions>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Carruseles de Eventos y Avisos en la misma fila */}
      <Grid container spacing={4} columnSpacing={10} sx={{ mt: 5 }}>
        {/* Eventos */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#00aaff' }}>
            Eventos
          </Typography>
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            loop
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            spaceBetween={10}
            slidesPerView={2}
            style={{  padding: '10px 0', width: '90%', margin: '0 auto'}}
          >
            {eventsData.map(event => (
              <SwiperSlide key={event.id}>
                <Box sx={{ textAlign: 'center' }}>
                  <img
                    src={event.image}
                    alt={`Evento ${event.id}`}
                    style={{ 
                      width: '100%', 
                      borderRadius: '5px', 
                      cursor: 'pointer' 
                    }}
                    onClick={() => handleImageClick(event.image)}
                  />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Grid>

        {/* Avisos */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#00aaff' }}>
            Avisos
          </Typography>
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            loop
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            spaceBetween={10}
            slidesPerView={2}
            style={{ padding: '10px 0', width: '90%', margin: '0 auto' }}
          >
            {announcementsData.map(announcement => (
              <SwiperSlide key={announcement.id}>
                <Box sx={{ textAlign: 'center' }}>
                  <img
                    src={announcement.image}
                    alt={`Aviso ${announcement.id}`}
                    style={{ 
                      width: '100%', 
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleImageClick(announcement.image)}
                  />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Grid>
      </Grid>
      {/* Modal para mostrar imagen ampliada */}
      {selectedImage && (
        <Dialog open={Boolean(selectedImage)} onClose={handleCloseModal} maxWidth="md">
          <DialogContent sx={{ textAlign: 'center' }}>
            <img 
              src={selectedImage} 
              alt="Ampliada" 
              style={{ maxWidth: '100%', borderRadius: '5px' }} 
            />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default UserHome;