import React, { useState } from "react";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import DetailsModal from "./Modals/DetailsModal";

const CardRegistros = ({ records = [], handleOpenModal, handleDeleteRecord }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Abrir modal con un registro seleccionado
  const handleOpenCardModal = (record) => {
    setSelectedRecord(record);
    setOpenModal(true);
  };

  // Cerrar modal
  const handleCloseCardModal = () => {
    setOpenModal(false);
    setSelectedRecord(null);
  };

  return (
    <Box
      sx={{
        mt: 4,
        width: "90%",
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "center",
      }}
    >
      {records.map((record, index) => (
        <Card
          key={index}
          sx={{
            width: 180,
            height: 220,
            boxShadow: 5,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "transform 0.2s ease-in-out",
            cursor: "pointer",
            "&:hover": {
              transform: "scale(1.05)",
              bgcolor: "#f5f5f5",
            },
          }}
          onClick={() => handleOpenCardModal(record)}
        >
          <CardContent
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight:"normal", color: "000000" }}>
              {record.nombreFuente}
            </Typography>
          </CardContent>

          {/* Botones de editar y borrar */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
              bgcolor: "#f0f0f0",
              p: 1,
              borderRadius: "0 0 12px 12px",
            }}
          >
            <IconButton
              sx={{
                color: "#1976d2",
                fontSize: "1.5rem",
                "&:hover": { color: "#125aa0" },
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenModal(index);
              }}
            >
              <Edit fontSize="large" />
            </IconButton>
            <IconButton
              sx={{
                color: "error.main",
                fontSize: "1.5rem",
                "&:hover": { color: "red" },
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteRecord(index);
              }}
            >
              <Delete fontSize="large" />
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
