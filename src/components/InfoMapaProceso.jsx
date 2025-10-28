import React, { useMemo, useState, useEffect } from "react"; 
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
    { label: "Receptores", key: "receptores", max: 255 },
    { label: "Puestos Involucrados", key: "puestosInvolucrados", max: 255 },
];

const InfoMapaProceso = ({
    mapaProceso,
    setMapaProceso,
    editMode,
    setEditMode,
    handleSaveChanges,
    soloLectura,
    showSnackbar
}) => {
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [saving, setSaving] = useState(false);
    const [originalData, setOriginalData] = useState(null); 

    const limitsMap = useMemo(() => {
        const m = {};
        fields.forEach(f => { m[f.key] = f.max; });
        return m;
    }, []);

    useEffect(() => {
        if (editMode && !originalData) {
            setOriginalData({ ...mapaProceso });
        }
    }, [editMode, originalData, mapaProceso]);

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
        if (originalData) {
            setMapaProceso({ ...originalData });
        }
        setEditMode(false);
        setSubmitted(false);
        setErrors({});
        setOriginalData(null); 
    };

    const onSubmit = async () => {
        setSubmitted(true);
        const newErrors = validateAll();
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstKey = Object.keys(newErrors)[0];
            if (showSnackbar) {
                showSnackbar(newErrors[firstKey], "error", "Error de validación");
            }
            return;
        }

        try {
            setSaving(true);
            await Promise.resolve(handleSaveChanges?.());
            setEditMode(false);
            setSubmitted(false);
            setErrors({});
            setOriginalData(null); // Limpiar los datos originales después de guardar
        } catch (e) {
            if (showSnackbar) {
                showSnackbar("No se pudo guardar la información", "error", "Error");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key, value) => {
        const max = limitsMap[key] ?? 1000;
        const trimmed = value.slice(0, max);

        setMapaProceso(prev => ({ ...prev, [key]: trimmed }));

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
                        <CustomButton type="cancelar" onClick={() => setEditMode(true)}>
                            Editar Información
                        </CustomButton>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default InfoMapaProceso;