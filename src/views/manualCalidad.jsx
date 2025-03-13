import React from "react";
import { Typography } from "@mui/material";

const ManualCalidad = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-4">
      {/* Título centrado y en color azul */}
      <Typography variant="h4" align="center" padding={5} gutterBottom sx={{ fontWeight: "bold", color: "#0056b3" }}>
        Manual Calidad
      </Typography>

      {/* Contenedor del iframe */}
      <div className="w-full max-w-4xl">
        <iframe
          src="https://uaslpedu.sharepoint.com/sites/Sical-virtual/_layouts/15/embed.aspx?UniqueId=69f2e061-d922-4e84-984a-bbba68b7246d"
          width="100%"
          height="600"
          frameBorder="0"
          scrolling="no"
          allowFullScreen
          title="MANUAL DE CALIDAD 28042024"
          className="shadow-lg rounded-lg"
        ></iframe>
      </div>
    </div>
  );
};

export default ManualCalidad;