import React from "react";
import { Box, Typography, Button } from "@mui/material";

const ReportCard = ({ report, onDelete }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: 320,
        minHeight: 160,
        borderLeft: "6px solid #004A98",
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-4px)" }
      }}
    >
      {/* Contenido centrado */}
      <Box sx={{ 
        mb: 1, 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        flexGrow: 1
      }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          {report.nombre || "Auditoría Interna"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <b>Entidad:</b> {report.entidad || "Sin entidad"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <b>Líder:</b> {report.lider || "Sin líder"}
        </Typography>
        <Typography variant="body2">
          <b>Fecha:</b> {report.fechaGeneracion || report.date}
        </Typography>
      </Box>

      {/* Botones (se mantienen en su posición actual) */}
      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#004A98",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#00336b" }
          }}
          onClick={() => window.open(`http://localhost:8000/api/reporte-pdf/${report.idAuditorialInterna}`, '_blank')}
        >
          Descargar
        </Button>

        {onDelete && (
          <Button
            variant="outlined"
            sx={{ 
              color: "#B00020", 
              borderColor: "#B00020", 
              borderRadius: "8px", 
              fontWeight: "bold", 
              "&:hover": { backgroundColor: "#fbe9e7" } 
            }}
            onClick={() => onDelete(report.idReporte || report.id)}
          >
            Eliminar
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ReportCard;