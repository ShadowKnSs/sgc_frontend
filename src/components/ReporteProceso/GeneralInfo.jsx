import React from "react";
import { Box, Typography, Chip } from "@mui/material";

const GeneralInfo = ({ reportData }) => {
    // Función para asignar color según el estado
    const getEstadoColor = (estado) => {
        switch (estado) {
            case "Activo":
                return "success";
            case "Inactivo":
                return "error";
            case "En Revisión":
                return "warning";
            default:
                return "default";
        }
    };

    return (
        <Box sx={{ p: 5, borderRadius: 2, boxShadow: 3, backgroundColor: "#fff", paddingLeft: 7, paddingRight: 7, marginLeft: 7, marginRight: 7 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}>
                Información General
            </Typography>

            {/* Norma y Año en el mismo renglón */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body1">
                    <strong>Norma:</strong> {reportData.norma}
                </Typography>
                <Typography variant="body1">
                    <strong>Año de Certificación:</strong> {reportData.anioCertificacion}
                </Typography>
            </Box>
            {/* Entidad y Nombre del Proceso en el mismo renglón */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body1">
                    <strong>Entidad/Dependencia:</strong> {reportData.entidad}
                </Typography>
                <Typography variant="body1">
                    <strong>Nombre del Proceso:</strong> {reportData.nombreProceso}
                </Typography>
            </Box>

            {/* Líder del proceso */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                    <strong>Líder del Proceso:</strong> {reportData.liderProceso}
                </Typography>
            </Box>

            {/* Objetivo */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                    <strong>Objetivo:</strong> {reportData.objetivo}
                </Typography>
            </Box>

            {/* Alcance */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                    <strong>Alcance:</strong> {reportData.alcance}
                </Typography>
            </Box>



            {/* Estado con color */}
            <Box sx={{ mt: 3 }}>
                <Chip label={reportData.estado} color={getEstadoColor(reportData.estado)} sx={{ fontSize: "16px", p: 1 }} />
            </Box>
        </Box>
    );
};

export default GeneralInfo;
