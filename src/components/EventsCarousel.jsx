import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

const EventsCarousel = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const events = [
    { id: 1, image: 'https://via.placeholder.com/300x200', title: 'Evento 1' },
    { id: 2, image: 'https://via.placeholder.com/300x200', title: 'Evento 2' },
    { id: 3, image: 'https://via.placeholder.com/300x200', title: 'Evento 3' },
  ];

  return (
    <div>
      <h2>Eventos</h2>
      <Swiper spaceBetween={30} slidesPerView={3} centeredSlides>
        {events.map(event => (
          <SwiperSlide key={event.id}>
            <img
              src={event.image}
              alt={event.title}
              style={{ width: '100%', cursor: 'pointer' }}
              onClick={() => setSelectedEvent(event)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {selectedEvent && (
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
            <h3>{selectedEvent.title}</h3>
            <img src={selectedEvent.image} alt={selectedEvent.title} style={{ width: '100%' }} />
            <br />
            <button onClick={() => setSelectedEvent(null)} style={{ marginTop: '1em' }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsCarousel;
