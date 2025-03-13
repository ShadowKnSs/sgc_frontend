import React, { useState } from "react";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import DetailsModal from "./Modals/DetailsModal";

const CardRegistros = ({ records = [], handleOpenModal, handleDeleteRecord }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleOpenCardModal = (record) => {
    setSelectedRecord(record);
    setOpenModal(true);
  };

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
            width: 250,
            height: 250,
            boxShadow: 5,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
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
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {record.nombreFuente}
            </Typography>
            <Typography variant="body2">
              <strong>Número:</strong> {record.numero}
            </Typography>
            <Typography variant="body2">
              <strong>Responsable:</strong> {record.responsable}
            </Typography>
            <Typography variant="body2">
              <strong>Estado:</strong> {record.estado}
            </Typography>
            <Typography variant="body2">
              <strong>Inicio:</strong> {record.fechaInicio}
            </Typography>
            <Typography variant="body2">
              <strong>Término:</strong> {record.fechaTermino}
            </Typography>
          </CardContent>

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
              sx={{ color: "#1976d2", "&:hover": { color: "#125aa0" } }}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenModal(index);
              }}
            >
              <Edit fontSize="large" />
            </IconButton>
            <IconButton
              sx={{ color: "error.main", "&:hover": { color: "red" } }}
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
