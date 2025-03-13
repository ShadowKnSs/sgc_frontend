// src/components/ProcessCard.jsx
import React from "react";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ProcessCard = ({ process, onEdit, onDelete }) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        cursor: "pointer",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {process.nombreProceso}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {process.entidad || process.dependencia || "Sin entidad"}
        </Typography>
      </CardContent>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, pt: 1 }}>
        <IconButton onClick={onEdit} sx={{ color: "primary.main" }}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={onDelete} sx={{ color: "terciary.main" }}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

export default ProcessCard;
