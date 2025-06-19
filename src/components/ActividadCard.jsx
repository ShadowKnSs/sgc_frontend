import React from "react";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Box
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { motion } from "framer-motion";
import CustomButton from "./Button";

const ActividadCard = ({
    actividad,
    onSelect,
    onClose,
    onEdit,
    onDelete,
    isActive,
    isSmall
}) => {
    const campos = [
        { title: "Actividad de Control", value: actividad.nombreActividad },
        { title: "Procedimiento", value: actividad.procedimiento },
        { title: "Criterio de Aceptación", value: actividad.criterioAceptacion },
        { title: "Características a Verificar", value: actividad.caracteristicasVerificar },
        { title: "Frecuencia", value: actividad.frecuencia },
        { title: "Identificación de Salida", value: actividad.identificacionSalida },
        { title: "Registro de Salidas", value: actividad.registroSalida },
        { title: "Responsable", value: actividad.responsable },
        { title: "Tratamiento", value: actividad.tratamiento }
    ];

    return (
        <Card
            component={motion.div}
            layout
            initial={{ opacity: 0.8, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            sx={{
                width: isActive ? "100%" : isSmall ? 180 : 240,
                maxWidth: "100%",
                height: isActive ? "auto" : 150,
                padding: 2,
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 3,
                cursor: isActive ? "default" : "pointer",
                "&:hover": { boxShadow: isActive ? 3 : 6 },
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: isActive ? "left" : "center"
            }}
            onClick={!isActive ? () => onSelect?.(actividad) : undefined}
        >
            {isActive ? (
                <CardContent sx={{ width: "100%" }}>
                    <IconButton
                        onClick={() => onClose?.(actividad)}
                        sx={{ position: "absolute", top: 8, right: 8 }}
                    >
                        <Close />
                    </IconButton>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: 2,
                            mb: 3
                        }}
                    >
                        {campos.map((campo, index) => (
                            <Box key={index}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: "bold", color: "#004A98" }}
                                >
                                    {campo.title}
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#333", whiteSpace: "pre-line" }}>
                                    {campo.value || "Sin información"}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    <Box
                        sx={{
                            mt: 1,
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                            flexWrap: "wrap"
                        }}
                    >
                        <CustomButton type="cancelar" onClick={() => onDelete?.(actividad)}>
                            Eliminar
                        </CustomButton>
                        <CustomButton type="editar" onClick={() => onEdit?.(actividad)}>
                            Editar
                        </CustomButton>

                    </Box>
                </CardContent>
            ) : (
                <Box sx={{ width: "100%" }}>
                    <Typography
                        variant="body1"
                        fontWeight="500"
                        color="#004A98"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            textAlign: "center",
                            paddingX: 1,
                            overflow: "hidden",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical"
                        }}
                    >
                        {actividad.nombreActividad || `Actividad ${actividad.idActividad || "Sin ID"}`}
                    </Typography>
                </Box>
            )}
        </Card>
    );
};

export default ActividadCard;
