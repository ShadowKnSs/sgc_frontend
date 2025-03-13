import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { Card, CardContent, Typography, Box } from "@mui/material";

const MinutaCard = ({ fecha, lugar, duracion, onClick }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        maxWidth: 320,
        borderRadius: 3,
        boxShadow: 3,
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="h6" fontWeight="bold">
            📅 {fecha}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            📍 {lugar}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ⏳ Duración: {duracion} min
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MinutaCard;


