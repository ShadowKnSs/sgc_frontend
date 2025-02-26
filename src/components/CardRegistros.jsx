import React, { useState } from "react";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import DetailsModal from "./Modals/DetailsModal"; // Importa el modal

const CardRegistros = ({ records, handleOpenModal, handleDeleteRecord }) => {
  const [selectedRecord, setSelectedRecord] = useState(null); // Estado para la tarjeta seleccionada

  // Abrir modal con la información completa
  const handleOpenCardModal = (record) => {
    setSelectedRecord(record);
  };

  // Cerrar modal
  const handleCloseCardModal = () => {
    setSelectedRecord(null);
  };

  return (
    <Box sx={{ mt: 4, width: "80%", display: "flex", flexWrap: "wrap", gap: 2 }}>
      {records.map((record, index) => (
        <Card
          key={index}
          sx={{
            width: 100,
            height: 150,
            boxShadow: 3,
            bgcolor: "primary.light",
            color: "white",
            cursor: "pointer",
            "&:hover": { bgcolor: "primary.dark" },
            position: "relative",
          }}
          onClick={() => handleOpenCardModal(record)} // Abrir modal al hacer clic
        >
          <CardContent sx={{ p: 1 }}>
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
              <strong>Número:</strong> {record.numero}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
              <strong>Fuente:</strong> {record.fuente}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
              <strong>Elemento:</strong> {record.elementoEntrada}
            </Typography>
          </CardContent>
          {/* Botones de editar y borrar */}
          <Box sx={{ position: "absolute", bottom: 0, right: 0, display: "flex", gap: 1 }}>
            <IconButton
              sx={{ color: "orange", p: 0.5 }}
              onClick={(e) => {
                e.stopPropagation(); // Evita que se abra el modal al hacer clic en el botón
                handleOpenModal(index);
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              sx={{ color: "error.main", p: 0.5 }}
              onClick={(e) => {
                e.stopPropagation(); // Evita que se abra el modal al hacer clic en el botón
                handleDeleteRecord(index);
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Card>
      ))}

      {/* Modal de detalles */}
      <DetailsModal
        selectedRecord={selectedRecord}
        handleCloseCardModal={handleCloseCardModal}
      />
    </Box>
  );
};

export default CardRegistros;