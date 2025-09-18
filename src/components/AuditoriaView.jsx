import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import CustomButton from "./Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const AuditoriaView = ({ auditoria, onEditar, onEliminar }) => {
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
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        },
        mx: "auto",
      }}
    >
      {/* Información de la auditoría */}
      <Stack spacing={0.5} sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#003366" }}>
          {auditoria?.registro?.proceso?.nombreProceso || "Proceso desconocido"}
        </Typography>
        <Typography variant="body2">
          <b>Entidad:</b>{" "}
          {auditoria?.registro?.proceso?.entidad?.nombreEntidad ||
            "Entidad desconocida"}
        </Typography>
        <Typography variant="body2">
          <b>Auditor líder:</b> {auditoria.auditorLider || "No asignado"}
        </Typography>
        <Typography variant="body2">
          <b>Fecha:</b>{" "}
          {new Date(auditoria.fecha).toLocaleDateString("es-MX")}
        </Typography>
      </Stack>

      {/* Botones de acción */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          mt: 3,
          justifyContent: "center",
          width: "100%",
        }}
      >
        <CustomButton
          type="cancelar"
          startIcon={<DeleteIcon />}
          sx={{ flex: 1 }}
          onClick={() => onEliminar(auditoria)}
        >
          Eliminar
        </CustomButton>
        <CustomButton
          type="descargar"
          startIcon={<EditIcon />}
          sx={{ flex: 1 }}
          onClick={() => onEditar(auditoria)}
        >
          Editar
        </CustomButton>
      </Box>
    </Box>
  );
};

export default AuditoriaView;
