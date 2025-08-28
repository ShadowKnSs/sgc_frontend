import React, { useState, useMemo } from "react";
import { Box, Modal, IconButton, TextField, Grid, FormHelperText } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomButton from "../Button";
import TitleDialog from "../TitleDialog";

const clamp100 = (n) => Math.max(1, Math.min(100, n | 0));

const EvaluacionEfectividadModal = ({ open, onClose, riesgo, onGuardar, errors = {} }) => {

    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        reevaluacionSeveridad: riesgo?.reevaluacionSeveridad ?? "",
        reevaluacionOcurrencia: riesgo?.reevaluacionOcurrencia ?? "",
        analisisEfectividad: riesgo?.analisisEfectividad ?? "",
    });

    const baseNRP = useMemo(() => {
        const s = parseInt(riesgo?.valorSeveridad, 10) || 0;
        const o = parseInt(riesgo?.valorOcurrencia, 10) || 0;
        return s * o;
    }, [riesgo]);

    const sev = parseInt(formData.reevaluacionSeveridad, 10) || 0;
    const occ = parseInt(formData.reevaluacionOcurrencia, 10) || 0;
    const reNRP = sev * occ;
    const reEfectividad = reNRP < baseNRP ? "Mejoró" : reNRP > baseNRP ? "Empeoró" : "Igual";

    const handleChange = (e) => {
        const { name, value } = e.target;
        // para números, permite vacío pero al guardar los clamp-eamos
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGuardar = async () => {
        try {
            setSaving(true);
            const reevaluacionSeveridad = formData.reevaluacionSeveridad === "" ? 0 : clamp100(parseInt(formData.reevaluacionSeveridad, 10));
            const reevaluacionOcurrencia = formData.reevaluacionOcurrencia === "" ? 0 : clamp100(parseInt(formData.reevaluacionOcurrencia, 10));
            const reevaluacionNRP = reevaluacionSeveridad * reevaluacionOcurrencia;
            const reevaluacionEfectividad = reevaluacionNRP < baseNRP ? "Mejoró" : reevaluacionNRP > baseNRP ? "Empeoró" : "Igual";

            // onGuardar puede ser async; lo esperamos
            await onGuardar({
                ...formData,
                reevaluacionSeveridad,
                reevaluacionOcurrencia,
                reevaluacionNRP,
                reevaluacionEfectividad,
            });
        } finally {
            setSaving(false);
        }
    };
    const field = (label, name, options = {}) => {
        const isError = !!(errors[name]);
        // USAR options.value si viene definido; si no, formData[name]
        const val = Object.prototype.hasOwnProperty.call(options, "value")
            ? options.value
            : (formData[name] ?? "");

        return (
            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label={label}
                    name={name}
                    value={val}
                    onChange={handleChange}
                    disabled={options.disabled}
                    multiline={options.multiline}
                    minRows={options.minRows || 1}
                    type={options.type || "text"}
                    InputLabelProps={options.InputLabelProps}
                    error={isError}
                    helperText={isError ? errors[name] : options.helperText}
                    inputProps={{
                        ...(options.inputProps || {}),
                        // evita edición en disabled también a nivel input
                        readOnly: !!options.disabled,
                    }}
                />
                {options.multiline && (
                    <FormHelperText sx={{ textAlign: "right" }}>
                        {(String(formData[name] || "")).length}/500 caracteres
                    </FormHelperText>
                )}
            </Box>
        );
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)", width: 600,
                bgcolor: "#fff", boxShadow: 6, p: 4, borderRadius: 3, outline: "none",
            }}>
                <IconButton onClick={onClose} sx={{ position: "absolute", top: 12, right: 12, color: "#999", "&:hover": { color: "#333" } }}>
                    <CloseIcon />
                </IconButton>

                <TitleDialog
                    title="Evaluación de Efectividad"
                    subtitle={`Riesgo: ${riesgo?.fuente || riesgo?.descripcion || "-"}`}
                />

                <Box mt={2}>
                    {field("Reevaluación Severidad (1-100)", "reevaluacionSeveridad", {
                        type: "number",
                        inputProps: { min: 1, max: 100 },
                        helperText: "Severidad después de implementar las acciones de mejora",
                    })}

                    {field("Reevaluación Ocurrencia (1-100)", "reevaluacionOcurrencia", {
                        type: "number",
                        inputProps: { min: 1, max: 100 },
                        helperText: "Probabilidad de ocurrencia después de las acciones",
                    })}

                    {/* NRP Reevaluado calculado en vivo */}
                    {field("NRP Reevaluado", "reevaluacionNRP", {
                        type: "number",
                        disabled: true,
                        value: reNRP,
                        helperText: `Nivel de Riesgo Prioritario (base: ${baseNRP})`,
                    })}

                    {field("Análisis de Efectividad", "analisisEfectividad", {
                        multiline: true,
                        minRows: 3,
                        helperText: `Resultado: ${reEfectividad}. Explique los resultados de la evaluación.`,
                    })}
                </Box>

                <Grid container spacing={2} justifyContent="flex-end" mt={3}>
                    <Grid item>
                        <CustomButton type="cancelar" onClick={onClose}>Cancelar</CustomButton>
                    </Grid>
                    <Grid item>
                        <CustomButton type="guardar" onClick={handleGuardar} loading={saving}>
                            Guardar Evaluación
                        </CustomButton>                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default EvaluacionEfectividadModal;
