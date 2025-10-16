import React from "react";
import {
    Card, CardContent, Typography, Stack, Box
} from "@mui/material";
import CustomButton from "./Button";

const DocumentCard = ({ documento, onEdit, onDelete, soloLectura }) => {
    return (
        <Card
            sx={{
                width: '100%',
                height: 320, // Altura fija
                display: "flex",
                flexDirection: "column",
                p: 2,
                boxShadow: 3,
                borderRadius: 3,
                overflow: 'hidden', // Para contener el contenido
            }}
        >
            {/* Contenedor del contenido con scroll */}
            <CardContent 
                sx={{ 
                    flexGrow: 1,
                    overflow: 'auto', // Scroll interno si el contenido es muy largo
                    pb: 1,
                    '&::-webkit-scrollbar': {
                        width: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#ccc',
                        borderRadius: '2px',
                    }
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary.main"
                    gutterBottom
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.3,
                        minHeight: '2.6em' // Aproximadamente 2 líneas
                    }}
                >
                    {documento.nombreDocumento}
                </Typography>
                
                <Box sx={{ mb: 1 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: documento.tipoDocumento === "externo" ? "#555" : "#1976D2",
                            fontWeight: 500
                        }}
                    >
                        Tipo: {documento.tipoDocumento || "N/D"}
                    </Typography>
                </Box>

                <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Código: {documento.codigoDocumento || "N/D"}
                    </Typography>
                </Box>

                <Box sx={{ mb: 1 }}>
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        Lugar: {documento.lugarAlmacenamiento || "N/D"}
                    </Typography>
                </Box>
            </CardContent>

            {/* Botones siempre en la parte inferior */}
            <Stack spacing={1} sx={{ flexShrink: 0 }}>
                <CustomButton
                    type="descargar"
                    fullWidth
                    component="a"
                    href={documento.urlArchivo}
                    download
                    disabled={documento.tipoDocumento !== "interno" || !documento.urlArchivo}
                >
                    Descargar
                </CustomButton>

                {!soloLectura && (
                    <>
                        <CustomButton type="guardar" fullWidth onClick={() => onEdit?.(documento)}>
                            Editar
                        </CustomButton>
                        <CustomButton type="cancelar" fullWidth onClick={() => onDelete?.(documento)}>
                            Eliminar
                        </CustomButton>
                    </>
                )}
            </Stack>
        </Card>
    );
};

export default DocumentCard;