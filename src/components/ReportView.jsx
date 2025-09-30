import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import CustomButton from "./Button";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";

const ReportView = ({ report, onDelete }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: 4,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        p: 3,
        width: 280,
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "all 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)"
        },
        mx: "auto" // centra la card horizontalmente
      }}
    >
      {/* Información del reporte */}
      <Stack spacing={0.5} sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#003366" }}>
          {report.title || "Auditoría Interna"}
        </Typography>
        <Typography variant="body2"><b>Entidad:</b> {report.entidad}</Typography>
        <Typography variant="body2"><b>Proceso:</b> {report.proceso}</Typography>
        <Typography variant="body2"><b>Auditor líder:</b> {report.lider}</Typography>
        <Typography variant="body2"><b>Fecha:</b> {report.date}</Typography>
      </Stack>

      {/* Botones de acción */}
      <Box sx={{ display: "flex", gap: 1.5, mt: 3, justifyContent: "center", width: "100%" }}>
        <CustomButton
          type="cancelar"
          startIcon={<DeleteIcon />}
          sx={{ flex: 1 }}
          onClick={() => onDelete(report.id)}
        >
          Eliminar
        </CustomButton>
                <CustomButton
          type="descargar"
          startIcon={<DownloadIcon />}
          sx={{ flex: 1 }}
          onClick={() =>
            window.open(
              `http://localhost:8000/api/reporte-pdf/${report.idAuditorialInterna}`,
              "_blank"
            )
          }
        >
          Descargar
        </CustomButton>
      </Box>
    </Box>
  );
};

export default ReportView;
