import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

const ReporteSemCard = ({ anio, periodo, fechaGeneracion, ubicacion }) => {
  return (
    <Card sx={{ maxWidth: 345, backgroundColor: "#F9F8F8", borderLeft: "8px solid #004A98", borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: "#004A98", fontWeight: "bold" }}>
          {anio} - {periodo}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Fecha: {fechaGeneracion}
        </Typography>
        <Button
          href={ubicacion}
          download
          variant="contained"
          sx={{
            backgroundColor: "#F9B800",
            color: "white",
            "&:hover": { backgroundColor: "#00B2E3" },
            mt: 2,
          }}
        >
          Descargar
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReporteSemCard;
