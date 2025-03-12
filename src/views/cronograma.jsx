import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Importamos los estilos predeterminados

function Cronograma() {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <Box
      sx={{
        p: 4,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start", // Alinea el contenido en la parte superior
        backgroundColor: "#f4f4f4",
        paddingTop: "20px", // Añade un pequeño espacio desde el header
        position: "relative", // Permite posicionar el botón correctamente
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "110px",
          fontFamily: "'Roboto', sans-serif",
          color: "#004A98",
        }}
      >
        Cronograma de Auditorías
      </h1>

      <div
        style={{
          transform: "scale(1.5)",
          transformOrigin: "center",
          position: "relative",
        }}
      >
        <Calendar onChange={handleDateChange} value={date} locale="es-ES" />
      </div>

      {/* Botón en la parte inferior derecha */}
      <Box
        sx={{
          position: "absolute",
          bottom: "40px",
          right: "40px",
        }}
      >
        <Button variant="contained" color="primary">
          Crear Auditoría
        </Button>
      </Box>
    </Box>
  );
}

export default Cronograma;
