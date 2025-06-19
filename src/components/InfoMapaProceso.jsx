import React from "react";
import {
    Box,
    Typography,
    Grid,
    TextField
} from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import SourceIcon from '@mui/icons-material/Source';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import OutboxIcon from '@mui/icons-material/Outbox';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import CustomButton from "./Button";
import { motion, AnimatePresence } from "framer-motion";

const icons = {
    documentos: <DescriptionIcon sx={{ color: "#004A98", fontSize: 28 }} />,
    fuente: <SourceIcon sx={{ color: "#004A98", fontSize: 28 }} />,
    material: <InventoryIcon sx={{ color: "#004A98", fontSize: 28 }} />,
    requisitos: <AssignmentIcon sx={{ color: "#004A98", fontSize: 28 }} />,
    salidas: <OutboxIcon sx={{ color: "#004A98", fontSize: 28 }} />,
    receptores: <GroupsIcon sx={{ color: "#004A98", fontSize: 28 }} />,
    puestosInvolucrados: <GroupWorkIcon sx={{ color: "#004A98", fontSize: 28 }} />,
};

const fields = [
    { label: "Documentos", key: "documentos" },
    { label: "Fuente", key: "fuente" },
    { label: "Material", key: "material" },
    { label: "Requisitos", key: "requisitos" },
    { label: "Salidas", key: "salidas" },
    { label: "Receptores", key: "receptores" },
    { label: "Puestos Involucrados", key: "puestosInvolucrados" }
];

const InfoMapaProceso = ({
    mapaProceso,
    setMapaProceso,
    editMode,
    setEditMode,
    handleSaveChanges,
    soloLectura
}) => {
    return (
        <Box
            sx={{
                mb: 4,
                p: 4,
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 3,
                position: "relative"
            }}
        >


            {/* Título */}
            <Typography
                variant="h6"
                fontWeight="bold"
                color="#003366"
                mb={3}
                textAlign="left"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: "#EEF4FA",
                    px: 2,
                    py: 1,
                    borderRadius: 1
                }}
            >
                Información General del Mapa de Procesos
            </Typography>

            {/* Campos animados */}
            <Grid container spacing={3}>
                {fields.map(({ label, key }) => (
                    <Grid item xs={12} md={6} key={key}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={editMode ? `${key}-edit` : `${key}-view`}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 2,
                                        alignItems: "flex-start"
                                    }}
                                    aria-label={`${label}: ${mapaProceso[key] || "No disponible"}`}
                                >
                                    {icons[key]}
                                    <Box sx={{ flex: 1 }}>
                                        <Typography fontWeight="bold" color="#333" mb={0.5} align="left">
                                            {label}:
                                        </Typography>
                                        {editMode ? (
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                multiline
                                                minRows={2}
                                                label={label}
                                                InputLabelProps={{ shrink: true }}
                                                value={mapaProceso[key] || ""}
                                                onChange={(e) =>
                                                    setMapaProceso({ ...mapaProceso, [key]: e.target.value })
                                                }
                                            />
                                        ) : (
                                            <Typography
                                                color="#555"
                                                sx={{
                                                    textAlign: "justify",
                                                    whiteSpace: "pre-line",
                                                    backgroundColor: "#FAFAFA",
                                                    p: 1,
                                                    borderRadius: 1
                                                }}
                                            >
                                                {mapaProceso[key] || "No disponible"}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </motion.div>
                        </AnimatePresence>
                    </Grid>
                ))}
            </Grid>

            {/* Botón inferior derecho */}
            {!soloLectura && (
                <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                    <CustomButton
                        type={editMode ? "guardar" : "cancelar"}
                        onClick={editMode ? handleSaveChanges : () => setEditMode(true)}
                    >
                        {editMode ? "Guardar Información" : "Editar Información"}
                    </CustomButton>
                </Box>
            )}
        </Box>
    );
};

export default InfoMapaProceso;
