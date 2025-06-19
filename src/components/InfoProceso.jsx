import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GavelIcon from "@mui/icons-material/Gavel";
import VerifiedIcon from "@mui/icons-material/Verified";

const iconMap = {
    objetivo: <FlagIcon fontSize="medium" />,
    alcance: <TrackChangesIcon fontSize="medium" />,
    anioCertificado: <CalendarTodayIcon fontSize="medium" />,
    norma: <GavelIcon fontSize="medium" />,
    estado: <VerifiedIcon fontSize="medium" />,
};

const labelMap = {
    alcance: "Alcance",
    objetivo: "Objetivo",
    anioCertificado: "Año de Certificado",
    norma: "Norma",
    estado: "Estado",
};

const InfoProceso = ({ proceso }) => {
    return (
        <Box sx={{ mb: 3 }}>
            <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#0056b3", mb: 2 }}
                  >
                    INFORMACIÓN DEL PROCESO
                  </Typography>

            <Box
                sx={{
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    p: 3,
                    boxShadow: 2,
                }}
            >
                <Grid container spacing={3}>
                    {Object.keys(labelMap).map((key, idx) => (
                        <Grid item xs={12} md={key === "alcance" ? 12 : 6} key={idx}>
                            <Box
                                sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                                aria-label={`${labelMap[key]}: ${proceso[key] || "No disponible"}`}
                            >
                                <Box sx={{ color: "#004A98", pt: "2px" }}>{iconMap[key]}</Box>
                                <Box>
                                    <Typography fontWeight="bold" color="#333" textAlign="left">
                                        {labelMap[key]}:
                                    </Typography>
                                    <Typography color="#666" sx={{ textAlign: "justify" }}>
                                        {proceso[key] || "No disponible"}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default InfoProceso;
