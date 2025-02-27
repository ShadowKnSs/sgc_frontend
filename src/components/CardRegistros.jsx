import React, { useState } from "react";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import DetailsModal from "./Modals/DetailsModal";

const CardRegistros = ({ records = [], handleOpenModal, handleDeleteRecord }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null); // Estado para el registro seleccionado

  // Abrir modal con un registro seleccionado
  const handleOpenCardModal = (record) => {
    setSelectedRecord(record);
    setOpenModal(true);
  };

  // Cerrar modal
  const handleCloseCardModal = () => {
    setOpenModal(false);
    setSelectedRecord(null); // Reiniciar selección
  };

  return (
    <Box sx={{ mt: 4, width: "80%", display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center",}}>
      {records.map((record, index) => (
        <Card
          key={index}
          sx={{
            width: 150,
            height: 200,
            boxShadow: 7,
            color: "black",
            cursor: "pointer",
            "&:hover": { bgcolor: "lightgrey" },
            position: "relative",
          }}
          onClick={() => handleOpenCardModal(record)}
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
                e.stopPropagation();
                handleOpenModal(index);
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              sx={{ color: "error.main", p: 0.5 }}
              onClick={(e) => {
                e.stopPropagation();
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
        open={openModal}
        selectedRecord={selectedRecord}
        records={records}
        handleCloseCardModal={handleCloseCardModal}
      />
    </Box>
  );
};

export default CardRegistros;
