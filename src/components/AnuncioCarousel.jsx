import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

const AnuncioCarousel = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const announcements = [
    { id: 1, title: 'Aviso 1', description: 'Detalles del aviso 1', image: 'https://via.placeholder.com/300x150' },
    { id: 2, title: 'Aviso 2', description: 'Detalles del aviso 2', image: 'https://via.placeholder.com/300x150' },
    { id: 3, title: 'Aviso 3', description: 'Detalles del aviso 3', image: 'https://via.placeholder.com/300x150' },
  ];

  return (
    <div>
      <h2>Avisos</h2>
      <Swiper spaceBetween={30} slidesPerView={3} centeredSlides>
        {announcements.map(announcement => (
          <SwiperSlide key={announcement.id}>
            <div style={{ cursor: 'pointer' }} onClick={() => setSelectedAnnouncement(announcement)}>
              <img src={announcement.image} alt={announcement.title} style={{ width: '100%' }} />
              <h4>{announcement.title}</h4>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {selectedAnnouncement && (
        <div
          className="modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div style={{ background: '#fff', padding: '1em', maxWidth: '500px', textAlign: 'center' }}>
            <h3>{selectedAnnouncement.title}</h3>
            <p>{selectedAnnouncement.description}</p>
            <img src={selectedAnnouncement.image} alt={selectedAnnouncement.title} style={{ width: '100%' }} />
            <br />
            <button onClick={() => setSelectedAnnouncement(null)} style={{ marginTop: '1em' }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnuncioCarousel;
