import React from "react";
import {
    Card, CardContent, Typography, Stack
} from "@mui/material";
import CustomButton from "./Button";

const DocumentCard = ({ documento, onEdit, onDelete, soloLectura }) => {

    
    return (
        <Card
            sx={{
                width: 260,
                minHeight: 220,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 2,
                boxShadow: 3,
                borderRadius: 3,
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary.main"
                    gutterBottom
                >
                    {documento.nombreDocumento}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: documento.tipoDocumento === "externo" ? "#555" : "#1976D2",
                        fontWeight: 500
                    }}
                >
                    Tipo: {documento.tipoDocumento || "N/D"}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Código: {documento.codigoDocumento || "N/D"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Lugar: {documento.lugarAlmacenamiento || "N/D"}
                </Typography>
            </CardContent>

            <Stack spacing={1}>
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
