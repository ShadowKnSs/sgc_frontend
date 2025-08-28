// components/FormDialogActividad.jsx
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

const FormDialogActividad = ({ open, onClose, onSave, formData, setFormData, errors = {}, modo, saving = false }) => {
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!open) {
            setFormData?.({});
            setSubmitted(false);
        }
    }, [open, setFormData]);

    const safeForm = useMemo(() => formData || {}, [formData]);

    const handleChange = (field) => (e) => {
        const raw = e.target.value ?? "";
        const max = LIMITS[field] ?? 512;
        const clipped = raw.slice(0, max); // corte duro
        setFormData({ ...safeForm, [field]: clipped });
    };

    const getFieldError = (key, value) => {
        // Si hay error desde el padre pero el usuario ya empezó a escribir, ocultamos el error
        // y mostramos contador (se requested: el helper desaparece al tipear).
        const hasExternalError = Boolean(errors?.[key]);
        if (!submitted || !hasExternalError) return "";         // no mostrar error aún
        if ((value ?? "").trim() !== "") return "";             // usuario corrigió
        return errors[key];                                     // sigue vacío => muestra error
    };

    const handleSave = async () => {
        setSubmitted(true);
        await onSave?.(); // ← Ya no manejamos saving aquí, el padre lo hace
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
