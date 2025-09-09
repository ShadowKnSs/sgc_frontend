// src/components/InfoMapaProceso.jsx
import React, { useMemo, useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";

import CustomButton from "./Button";
import FeedbackSnackbar from "./Feedback"; // tu componente de feedback

const icons = {
    documentos: <DescriptionIcon sx={{ color: "#458cd4", fontSize: 28 }} />,
    fuente: <SourceIcon sx={{ color: "#458cd4", fontSize: 28 }} />,
    material: <InventoryIcon sx={{ color: "#458cd4", fontSize: 28 }} />,
    requisitos: <AssignmentIcon sx={{ color: "#458cd4", fontSize: 28 }} />,
    salidas: <OutboxIcon sx={{ color: "#458cd4", fontSize: 28 }} />,
    receptores: <GroupsIcon sx={{ color: "#458cd4", fontSize: 28 }} />,
    puestosInvolucrados: <GroupWorkIcon sx={{ color: "#458cd4", fontSize: 28 }} />,
};

// Campos y límites
const fields = [
    { label: "Documentos", key: "documentos", max: 255 },
    { label: "Fuente", key: "fuente", max: 150 },
    { label: "Material", key: "material", max: 255 },
    { label: "Requisitos", key: "requisitos", max: 150 },
    { label: "Salidas", key: "salidas", max: 255 },
    { label: "Receptores", key: "receptores", max: 255 }, // asumido
    { label: "Puestos Involucrados", key: "puestosInvolucrados", max: 255 },
];

const InfoMapaProceso = ({
    mapaProceso,
    setMapaProceso,
    editMode,
    setEditMode,
    handleSaveChanges,
    soloLectura,
}) => {
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [saving, setSaving] = useState(false);

    const [backup, setBackup] = useState(null); // ← snapshot para cancelar



    // Snackbar de error de validación
    const [snackbar, setSnackbar] = useState({
        open: false,
        type: "error",
        title: "Validación",
        message: ""
    });
    const closeSnackbar = () => setSnackbar(s => ({ ...s, open: false }));

    const limitsMap = useMemo(() => {
        const m = {};
        fields.forEach(f => { m[f.key] = f.max; });
        return m;
    }, []);

    const validateAll = () => {
        const newErrors = {};
        fields.forEach(({ key, label, max }) => {
            const val = (mapaProceso?.[key] || "").trim();
            if (!val) {
                newErrors[key] = `${label} es obligatorio.`;
                return;
            }
            if (val.length > max) {
                newErrors[key] = `${label} excede el máximo de ${max} caracteres.`;
            }
        });
        return newErrors;
    };


    const handleCancel = () => {
        setEditMode(false);
        setSubmitted(false);
        setErrors({});
        setSnackbar(s => ({ ...s, open: false }));
    };
    const onSubmit = async () => {
        setSubmitted(true);
        const newErrors = validateAll();
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            // Mostrar primer error en el snackbar (solo cuando hay error)
            const firstKey = Object.keys(newErrors)[0];
            setSnackbar({
                open: true,
                type: "error",
                title: "Validación",
                message: newErrors[firstKey],
            });
            return;
        }

        // Sin errores → guardar
        try {
            setSaving(true);
            // soporta async/sync
            await Promise.resolve(handleSaveChanges?.());
            setEditMode(false);
            setSubmitted(false);
            setErrors({});
        } catch (e) {
            setSnackbar({
                open: true,
                type: "error",
                title: "Error",
                message: "No se pudo guardar la información.",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key, value) => {
        // Cortar manual si pegaste texto largo
        const max = limitsMap[key] ?? 1000;
        const trimmed = value.slice(0, max);

        setMapaProceso(prev => ({ ...prev, [key]: trimmed }));

        // Si ya hubo submit o el campo tenía error, limpiar el error de ese campo al escribir
        if (submitted || errors[key]) {
            setErrors(prev => {
                const cp = { ...prev };
                delete cp[key];
                return cp;
            });
        }
    };

    const getCount = (key) => (mapaProceso?.[key]?.length || 0);

    return (
        <Box
            sx={{
                mb: 4,
                p: 4,
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 3,
                position: "relative",
            }}
        >
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
                    borderRadius: 1,
                }}
            >
                Información General del Mapa de Procesos
            </Typography>

            <Grid container spacing={3}>
                {fields.map(({ label, key, max }) => {
                    const value = mapaProceso?.[key] || "";
                    const showError = Boolean(errors[key]);
                    const helper = showError ? errors[key] : `${getCount(key)}/${max}`;

                    return (
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
                                            alignItems: "flex-start",
                                            textAlign: "left"
                                        }}
                                        aria-label={`${label}: ${value || "No disponible"}`}
                                    >
                                        {icons[key]}
                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                fontWeight="bold"
                                                color="#333"
                                                mb={0.5}
                                                component="label"
                                            >
                                                {label}
                                                <Typography component="span" color="error" >
                                                    *
                                                </Typography>
                                                :
                                            </Typography>

                                            {editMode ? (
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    multiline
                                                    minRows={2}
                                                    required
                                                    InputLabelProps={{ shrink: true, required: true }}
                                                    value={value}
                                                    onChange={(e) => handleChange(key, e.target.value)}
                                                    inputProps={{ maxLength: max }}
                                                    error={showError}
                                                    helperText={helper}
                                                    FormHelperTextProps={{
                                                        sx: {
                                                            display: "flex",
                                                            justifyContent: showError ? "flex-start" : "flex-end",
                                                            m: 0.5,
                                                        },
                                                    }}
                                                />
                                            ) : (
                                                <Typography
                                                    color="#555"
                                                    sx={{
                                                        textAlign: "justify",
                                                        whiteSpace: "pre-line",
                                                        backgroundColor: "#FAFAFA",
                                                        p: 1,
                                                        borderRadius: 1,
                                                    }}
                                                >
                                                    {value || "No disponible"}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </motion.div>
                            </AnimatePresence>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Botones */}
            {!soloLectura && (
                <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    {editMode ? (
                        <>
                            <CustomButton
                                type="cancelar"
                                onClick={handleCancel}
                            >
                                Cancelar
                            </CustomButton>
                            <CustomButton
                                type="guardar"
                                onClick={onSubmit}
                                loading={saving}
                            >
                                Guardar Información
                            </CustomButton>

                        </>

                    ) : (
                        <CustomButton type="cancelar" onClick={() => setEditMode(true)}>                            Editar Información
                        </CustomButton>
                    )
                    }
                </Box >
            )
            }

            {/* Snackbar solo para error */}
            <FeedbackSnackbar
                open={snackbar.open}
                onClose={closeSnackbar}
                type={snackbar.type}
                title={snackbar.title}
                message={snackbar.message}
                autoHideDuration={5000}
            />
        </Box >
    );
};

export default InfoMapaProceso;
