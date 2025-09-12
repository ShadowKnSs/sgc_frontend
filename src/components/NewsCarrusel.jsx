import React, { useMemo } from 'react';
import {
  Card, CardContent, CardActions, CardMedia,
  Typography, Tooltip, Box, CircularProgress, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArticleIcon from '@mui/icons-material/Article';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import CustomButton from './Button';

// corta texto si es largo
function truncate(str, maxLength) {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}

const NewsCarousel = ({ newsData, onViewMore, loading = false }) => {
  const theme = useTheme();
  // Breakpoints MUI → xs: <600, sm: 600+, md: 900+, lg: 1200+
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));  // ≥600 => 2
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));  // ≥900 => 3
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));  // ≥1200 => 4

  // slidesPerView actual (para decidir si mostrar flechas)
  const currentSPV = useMemo(() => {
    let spv = 1;
    if (smUp) spv = 2;
    if (mdUp) spv = 3;
    if (lgUp) spv = 4;
    return spv;
  }, [smUp, mdUp, lgUp]);

  if (loading) {
    return (
      <Box sx={{ minHeight: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
        <CircularProgress size={42} />
        <Typography variant="body2" color="text.secondary">Cargando noticias…</Typography>
      </Box>
    );
  }

  if (!loading && (!newsData || newsData.length === 0)) {
    return (
      <Box
        sx={{
          backgroundColor: "#BBD8D7",
          p: { xs: 2, sm: 3 },
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          mb: "5px",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 1
        }}
      >
        <ArticleIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
        <Typography variant="body1" color="text.secondary">
          No hay noticias por ahora
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#BBD8D7",
        p: { xs: 2, sm: 3 },
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        mb: "5px",
        "& .swiper-button-next, & .swiper-button-prev": {
          color: "secondary.main",
          fontSize: { xs: '1rem', sm: '1.25rem' },
        },
        "& .swiper-button-next::after, & .swiper-button-prev::after": {
          fontSize: { xs: "1.6rem", sm: "2rem" },
          fontWeight: "bold",
        }
      }}
    >
      <Swiper
        modules={[Navigation]}
        navigation={newsData.length > currentSPV}
        // Breakpoints nativos de Swiper para slides visibles y separación
        breakpoints={{
          0:    { slidesPerView: 1, spaceBetween: 10 },
          600:  { slidesPerView: 2, spaceBetween: 12 },
          900:  { slidesPerView: 3, spaceBetween: 14 },
          1200: { slidesPerView: 4, spaceBetween: 16 },
        }}
        centerInsufficientSlides
        style={{ padding: '16px 0' }}
      >
        {newsData.map(item => (
          <SwiperSlide key={item.id}>
            <Card
              sx={{
                height: { xs: 320, sm: 340, md: 350 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: 300,
                mx: 'auto',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': { transform: 'scale(1.02)', boxShadow: '0 4px 12px #2dc1df' }
              }}
            >
              <CardMedia
                component="img"
                image={item.image}
                alt={item.title}
                loading="lazy"
                sx={{
                  height: { xs: 130, sm: 150, md: 160 },
                  objectFit: 'cover'
                }}
              />
              <CardContent sx={{ py: 1.5 }}>
                <Tooltip title={item.title} enterDelay={800} arrow placement="top">
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontSize: { xs: '1rem', sm: '1.05rem' },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      cursor: "default"
                    }}
                  >
                    {truncate(item.title, 30)}
                  </Typography>
                </Tooltip>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "justify", fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
                >
                  {truncate(item.description, 60)}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', mb: 1 }}>
                <Tooltip title="Ver noticia completa">
                  <span>
                    <CustomButton
                      type="aceptar"
                      onClick={() => onViewMore(item)}
                      aria-label="Ver noticia completa"
                      sx={{ minHeight: 36, minWidth: { xs: 110, sm: 120 }, px: 2, py: 0.5 }}
                    >
                      Ver Más
                    </CustomButton>
                  </span>
                </Tooltip>
              </CardActions>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default NewsCarousel;
