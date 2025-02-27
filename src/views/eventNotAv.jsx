// src/views/CarouselView.jsx
import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button, Alert, CircularProgress } from "@mui/material";
import Slider from "react-slick";
import axios from "axios";

// Importar estilos de react-slick
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const EventosNotAv = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [selectedPub, setSelectedPub] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clickedId, setClickedId] = useState(null);


  // Función para obtener las publicaciones del backend
  const fetchPublicaciones = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/eventos");
      setPublicaciones(response.data.eventos || []);
    } catch (err) {
      console.error("Error fetching publicaciones:", err);
      setError("No se pudieron cargar las publicaciones. Intenta nuevamente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicaciones();
  }, []);

  // Configuración de react-slick
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: "40px",
    cssEase: "ease-in-out",
    slidesToShow: 2, // Puedes ajustar según lo necesites
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const handleImageClick = (pub) => {
    // Aplica efecto de escalado temporal
    setClickedId(pub.idEvento);
    setTimeout(() => {
      setClickedId(null);
    }, 300);
    // Actualiza la publicación seleccionada para mostrar sus datos
    setSelectedPub(pub);
  };
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: "'Roboto', sans-serif", color: "primary.main", fontWeight: "bold" }}>
        Publicaciones
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Slider {...settings}>
          {publicaciones.map((pub) => (
            <Box key={pub.idEvento} sx={{ p: 1 }}>
              <Box 
                component="img" 
                src={pub.rutaImg} 
                alt={pub.titulo} 
                sx={{
                  width: "100%",
                  height: 350,
                  objectFit: "cover",
                  borderRadius: 2,
                  boxShadow: 3,
                  cursor: "pointer",
                  transform: clickedId === pub.idEvento ? "scale(1.1)" : "scale(1)",
                  border: selectedPub && selectedPub.idEvento === pub.idEvento ? "2px solid #F9B800" : "none"
                }}
                onClick={() => handleImageClick(pub)}
                />
            </Box>
          ))}
        </Slider>
      )}

      {/* Mostrar detalle de la publicación seleccionada */}
      <Box sx={{ mt: 4, p: 2, borderRadius: 2, boxShadow: 3 }}>
        {selectedPub ? (
          <>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
              {selectedPub.titulo}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {selectedPub.descripcion ? selectedPub.descripcion : "Sin descripción disponible."}
            </Typography>
            <Typography variant="caption" display="block">
              Publicado: {new Date(selectedPub.fechaPublicacion).toLocaleString()}
            </Typography>
            {selectedPub.tipo && (
              <Typography variant="caption" display="block">
                Tipo: {selectedPub.tipo}
              </Typography>
            )}
            {selectedPub.fechaEvento && (
              <Typography variant="caption" display="block">
                Fecha del evento: {new Date(selectedPub.fechaEvento).toLocaleDateString()}
              </Typography>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6">Seleccione una imagen para ver más información</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default EventosNotAv;
