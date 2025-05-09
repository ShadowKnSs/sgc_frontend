import React, { useState } from "react";
import {
  Card, CardContent, Typography, IconButton, Box, Tooltip
} from "@mui/material";
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
        width: "95%",
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
        justifyContent: "center",
      }}
    >
      {records.map((record, index) => (
        <Card
          key={index}
          sx={{
            width: 280,
            height: 270,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: 4,
            boxShadow: 4,
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
            "&:hover": {
              transform: "scale(1.03)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              cursor: "pointer"
            },
          }}
          onClick={() => handleOpenCardModal(record)}
        >
          <CardContent sx={{ px: 3, pt: 2 }}>
            <Tooltip title={record.nombreFuente}>
              <Typography
                variant="h6"
                noWrap
                sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
              >
                {record.nombreFuente}
              </Typography>
            </Tooltip>
            <Typography variant="body2"><strong>Número:</strong> {record.numero}</Typography>
            <Typography variant="body2"><strong>Responsable:</strong> {record.responsable}</Typography>
            <Typography variant="body2"><strong>Estado:</strong> {record.estado}</Typography>
            <Typography variant="body2"><strong>Inicio:</strong> {record.fechaInicio}</Typography>
            <Typography variant="body2"><strong>Término:</strong> {record.fechaTermino}</Typography>
          </CardContent>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              py: 1,
              bgcolor: "#f7f7f7",
              borderTop: "1px solid #e0e0e0",
              borderRadius: "0 0 16px 16px",
            }}
          >
            <Tooltip title="Editar">
              <IconButton
                sx={{ color: "warning.main" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal(index);
                }}
              >
                <Edit fontSize="medium" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                sx={{ color: "error.main" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRecord(index);
                }}
              >
                <Delete fontSize="medium" />
              </IconButton>
            </Tooltip>
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
