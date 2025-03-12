import React from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const MinutaCard = ({ fecha, onEdit, onDelete }) => {
  return (
    <Card sx={{ maxWidth: 300, m: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          Minuta
        </Typography>
        <Typography color="text.secondary">Fecha: {fecha}</Typography>
      </CardContent>
      {/* Agregamos los iconos de editar y eliminar */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: 8 }}>
        <IconButton onClick={onEdit}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </div>
    </Card>
  );
};

export default MinutaCard;
