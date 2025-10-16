import React, { useEffect, useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import CustomButton from "../Button";
import DialogTitleCustom from "../TitleDialog";

const LIMITS = {
    nombreActividad: 255,
    procedimiento: 512,
    caracteristicasVerificar: 512,
    criterioAceptacion: 512,
    frecuencia: 512,
    identificacionSalida: 512,
    tratamiento: 512,
    registroSalida: 512,
    responsable: 255,
};

const campos = [
    { label: "Actividad de Control", key: "nombreActividad" },
    { label: "Procedimiento", key: "procedimiento" },
    { label: "Características a Verificar", key: "caracteristicasVerificar" },
    { label: "Criterio de Aceptación", key: "criterioAceptacion" },
    { label: "Frecuencia", key: "frecuencia" },
    { label: "Identificación de Salidas No Conformes", key: "identificacionSalida" },
    { label: "Tratamiento", key: "tratamiento" },
    { label: "Registro de Salidas No Conformes", key: "registroSalida" },
    { label: "Responsable de Liberación", key: "responsable" },
];

const FormDialogActividad = ({ 
    open, 
    onClose, 
    onSave, 
    formData, 
    setFormData, 
    errors = {}, 
    modo, 
    saving = false,
    showSnackbar 
}) => {
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!open) {
            setSubmitted(false);
        }
    }, [open]);

    const safeForm = useMemo(() => formData || {}, [formData]);

    const handleChange = (field) => (e) => {
        const raw = e.target.value ?? "";
        const max = LIMITS[field] ?? 512;
        const clipped = raw.slice(0, max);
        setFormData({ ...safeForm, [field]: clipped });
    };

    const getFieldError = (key, value) => {
        const hasExternalError = Boolean(errors?.[key]);
        if (!submitted || !hasExternalError) return "";
        if ((value ?? "").trim() !== "") return "";
        return errors[key];
    };

    const handleSave = async () => {
        setSubmitted(true);
        
        // Validación básica antes de guardar
        const camposObligatorios = Object.keys(LIMITS);
        const camposVacios = camposObligatorios.filter(campo => !safeForm[campo]?.trim());
        
        if (camposVacios.length > 0) {
            if (showSnackbar) {
                showSnackbar("Por favor complete todos los campos obligatorios", "error", "Error de validación");
            }
            return;
        }

        try {
            await onSave?.();
        } catch (error) {
            console.error("Error en el formulario:", error);
            // El manejo de errores específico se hace en el componente padre
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitleCustom
                title={modo === "editar" ? "Editar Actividad de Control" : "Agregar Nuevo Plan de Control"}
                subtitle="Por favor, completa todos los campos requeridos"
            />

            <DialogContent>
                {campos.map(({ label, key }) => {
                    const value = safeForm[key] || "";
                    const max = LIMITS[key] ?? 512;
                    const errorText = getFieldError(key, value);
                    const showError = Boolean(errorText);
                    const helper = showError ? errorText : `${value.length}/${max}`;

                    return (
                        <TextField
                            key={key}
                            label={`${label}`}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2 }}
                            multiline
                            minRows={2}
                            value={value}
                            onChange={handleChange(key)}
                            inputProps={{ maxLength: max }}
                            error={showError}
                            helperText={helper}
                            InputLabelProps={{ shrink: true, required: true }}
                            FormHelperTextProps={{
                                sx: {
                                    display: "flex",
                                    justifyContent: showError ? "flex-start" : "flex-end",
                                    m: 0.5,
                                },
                            }}
                            disabled={saving}
                        />
                    );
                })}
            </DialogContent>

            <DialogActions>
                <CustomButton type="cancelar" onClick={onClose} disabled={saving}>
                    Cancelar
                </CustomButton>
                <CustomButton type="guardar" onClick={handleSave} loading={saving} disabled={saving}>
                    {modo === "editar" ? "Actualizar" : "Guardar"}
                </CustomButton>
            </DialogActions>
        </Dialog>
    );
};

export default FormDialogActividad;