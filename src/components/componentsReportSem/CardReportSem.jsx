import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

const ReporteSemCard = ({ anio, periodo, fechaGeneracion, ubicacion }) => {
  // Convertir periodo a texto legible
  const periodoTexto = periodo === "01-06" ? "Ene - Jun" : periodo === "07-12" ? "Jul - Dic" : periodo;

  return (
    <Card sx={{ maxWidth: 345, backgroundColor: "#F9F8F8", borderLeft: "8px solid #004A98", borderRadius: 2, p: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: "#004A98", fontWeight: "bold" }}>
          {"Reporte "}{anio} {periodoTexto}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Generado: {fechaGeneracion}
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#D32F2F", // Rojo
            color: "white",
            "&:hover": { backgroundColor: "#B71C1C" },
            mt: 2,
            mr: 1,
          }}
        >
          Eliminar
        </Button>
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
