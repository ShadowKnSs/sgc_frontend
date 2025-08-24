
/**
 * Componente: UserTempCard
 * Descripción:
 * Tarjeta que representa un usuario temporal con su token y fecha de expiración.
 * Permite copiar el token al portapapeles y muestra un Snackbar de confirmación.
 */
import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Divider,
    Box,
    Chip,
    Tooltip,
    IconButton,
    Snackbar
} from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const colorPalette = {
    azulOscuro: "#185FA4",
    azulClaro: "#68A2C9",
    verdeAgua: "#BBD8D7",
    verdeClaro: "#DFECDF",
    verdePastel: "#E3EBDA",
    grisClaro: "#DEDFD1",
    grisOscuro: "#A4A7A0",
};

export default function UserTempCard({ tempUser }) {
    const fechaExp = new Date(tempUser.expiracion).toLocaleString();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(tempUser.token);
        setCopied(true);
    };

    return (
        <>
            <Card
                sx={{
                    width: 320,
                    borderRadius: 4,
                    boxShadow: 4,
                    overflow: "hidden",
                    transition: "transform 0.3s ease",
                    backgroundColor: "#fff",
                    "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: 8,
                    },
                }}
            >
                {/* Encabezado */}
                <Box
                    sx={{
                        backgroundColor: colorPalette.verdePastel,
                        color: colorPalette.azulOscuro,
                        textAlign: "center",
                        py: 2,
                        px: 1.5,
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        Usuario Temporal
                    </Typography>
                    <Typography variant="body2" sx={{ color: colorPalette.grisOscuro }}>
                        Token generado
                    </Typography>
                </Box>

                <CardContent sx={{ backgroundColor: colorPalette.verdeClaro }}>
                    {/* Token */}
                    <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={2}>
                        <Tooltip title="Token para acceso temporal" arrow>
                            <Chip
                                label={tempUser.token}
                                sx={{
                                    backgroundColor: colorPalette.azulOscuro,
                                    color: "#fff",
                                    maxWidth: "220px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    "& .MuiChip-icon": {
                                        color: "#FFD700", // Aplica específicamente al ícono dentro del chip
                                    },
                                }}
                                icon={<VpnKeyIcon />}
                            />

                        </Tooltip>
                        <Tooltip title="Copiar token">
                            <IconButton onClick={handleCopy} size="small">
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Divider sx={{ my: 2, backgroundColor: colorPalette.grisClaro }} />

                    {/* Fecha de expiración */}
                    <Box textAlign="center">
                        <Typography variant="caption" sx={{ color: "#4a4a4a" }}>
                            Expira el:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: colorPalette.azulOscuro }}>
                            {fechaExp}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Mensaje snackbar */}
            <Snackbar
                open={copied}
                autoHideDuration={2000}
                onClose={() => setCopied(false)}
                message="Token copiado al portapapeles"
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        </>
    );
}
