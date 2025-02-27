import React from "react";
import { Card, CardContent, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Registro = ({ texto, onEdit, onDelete }) => {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 1,
        margin: 1,
        boxShadow: 2,
        width: 600, 
        height: 10,// Ajusta el ancho aquí
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body1">{texto}</Typography>
      </CardContent>
      <IconButton onClick={onEdit} color="primary">
        <EditIcon />
      </IconButton>
      <IconButton onClick={onDelete} color="error">
        <DeleteIcon />
      </IconButton>
    </Card>
  );
};

export default Registro;

