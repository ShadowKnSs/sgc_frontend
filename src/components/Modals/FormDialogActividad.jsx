// components/FormDialogActividad.jsx
import React, { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    TextField,

} from "@mui/material";
import CustomButton from "../Button";
import DialogTitleCustom from "../TitleDialog";


const FormDialogActividad = ({ open, onClose, onSave, formData, setFormData, errors, modo }) => {
    const handleChange = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

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

    useEffect(() => {
        if (!open) {
            setFormData({});
        }
    }, [open, setFormData]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitleCustom
                title={modo === "editar" ? "Editar Actividad de Control" : "Agregar Nuevo Plan de Control"}
                subtitle="Por favor, completa todos los campos requeridos"
            />
            <DialogContent>
                {campos.map((campo) => (
                    <TextField
                        key={campo.key}
                        label={campo.label}
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                        multiline
                        minRows={3}
                        value={formData[campo.key] || ""}
                        onChange={handleChange(campo.key)}
                        error={!!errors[campo.key]}
                        helperText={errors[campo.key]}
                    />
                ))}
            </DialogContent>
            <DialogActions>
                <CustomButton type="cancelar" onClick={onClose}>
                    Cancelar
                </CustomButton>
                <CustomButton type="guardar" onClick={onSave}>
                    {modo === "editar" ? "Actualizar" : "Guardar"}
                </CustomButton>
            </DialogActions>
        </Dialog>
    );
};

export default FormDialogActividad;