import React, { useState, useEffect } from "react";
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    IconButton,
    Radio,
    RadioGroup,
    FormLabel,
    FormHelperText
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

// Definición de los pasos
const steps = [
    "Datos del Proceso",
    "Descripción de la No Conformidad",
    "Reacción para Controlar y Corregir",
    "Consecuencias Identificadas",
    "Plan de Acción"
];

const initialDynamicEntry = { actividad: "", responsable: "", fechaProgramada: "" };

function PlanCorrectivoForm({ onSave, onCancel, initialData, sequence }) {

    const defaultForm = {
        entidad: "",
        noConformidad: false,
        codigo: "", // Se generará automáticamente si es nuevo
        coordinador: "",
        fechaInicio: "",
        origenNoConformidad: "",
        equipoMejora: "",
        requisitos: "",
        incumplimiento: "",
        evidencia: "",
        reaccion: [{ ...initialDynamicEntry }],
        evaluacionAccion: "",
        causaRaiz: "",
        similares: "",
        planAccion: [{ ...initialDynamicEntry }]
    };
    const [formData, setFormData] = useState(initialData || defaultForm);
    const [activeStep, setActiveStep] = useState(0);


    // Simulación de carga de datos para Dependencia/Entidad
    const [entidades, setEntidades] = useState([]);
    useEffect(() => {
        setEntidades([
            "Facultad de Ingeniería",
            "Facultad de Medicina",
            "Departamento Académico"
        ]);
    }, []);

    // Estado de errores global
    const [errors, setErrors] = useState({});

    // Si es un registro nuevo, se genera el código al montar el componente.
    useEffect(() => {
        if (!initialData) {
            const currentYear = new Date().getFullYear();
            const yearLastTwo = currentYear.toString().slice(-2);
            const seqStr = sequence.toString().padStart(2, "0");
            setFormData((prev) => ({ ...prev, codigo: `PAC-${seqStr}${yearLastTwo}` }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Función de validación global: se ejecuta al pulsar Guardar.
    const validateForm = () => {
        let formErrors = {};

        // Sección 0: Datos del Proceso
        if (!formData.entidad) formErrors.entidad = "La entidad es requerida.";
        if (!formData.coordinador) formErrors.coordinador = "El coordinador es requerido.";
        if (!formData.fechaInicio) formErrors.fechaInicio = "La fecha de inicio es requerida.";
        if (!formData.origenNoConformidad)
            formErrors.origenNoConformidad = "El origen es requerido.";
        if (!formData.equipoMejora)
            formErrors.equipoMejora = "El equipo de mejora es requerido.";
        // Si aún no se asigna el código, lo generamos


        // Sección 1: Descripción de la No Conformidad
        if (!formData.requisitos) formErrors.requisitos = "Los requisitos son obligatorios.";
        if (!formData.incumplimiento)
            formErrors.incumplimiento = "El incumplimiento es requerido.";
        if (!formData.evidencia) formErrors.evidencia = "La evidencia es requerida.";

        // // Sección 2: Reacción para controlar y corregir
        // formData.reaccion.forEach((item, index) => {
        //   if (!item.actividad)
        //     formErrors[`reaccion.${index}.actividad`] = "La actividad es obligatoria.";
        //   if (!item.responsable)
        //     formErrors[`reaccion.${index}.responsable`] = "El responsable es obligatorio.";
        //   if (!item.fechaProgramada)
        //     formErrors[`reaccion.${index}.fechaProgramada`] = "La fecha programada es obligatoria.";
        // });

        // Sección 3: Consecuencias Identificadas
        if (!formData.evaluacionAccion)
            formErrors.evaluacionAccion = "La evaluación es obligatoria.";
        if (!formData.causaRaiz) formErrors.causaRaiz = "La causa raíz es obligatoria.";
        if (!formData.similares) formErrors.similares = "Seleccione una opción.";

        // // Sección 4: Plan de Acción
        // formData.planAccion.forEach((item, index) => {
        //   if (!item.actividad)
        //     formErrors[`planAccion.${index}.actividad`] = "La actividad es obligatoria.";
        //   if (!item.responsable)
        //     formErrors[`planAccion.${index}.responsable`] = "El responsable es obligatorio.";
        //   if (!item.fechaProgramada)
        //     formErrors[`planAccion.${index}.fechaProgramada`] = "La fecha programada es obligatoria.";
        // });

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    // Función para determinar qué pasos tienen errores
    const getStepsWithErrors = () => {
        const stepsError = [];
        // Paso 0
        if (
            errors.entidad ||
            errors.coordinador ||
            errors.fechaInicio ||
            errors.origenNoConformidad ||
            errors.equipoMejora
        ) {
            stepsError.push(0);
        }
        // Paso 1
        if (errors.requisitos || errors.incumplimiento || errors.evidencia) {
            stepsError.push(1);
        }
        // Paso 2: verificamos si existe algún error en las entradas dinámicas de "reaccion"
        if (
            Object.keys(errors)
                .filter((key) => key.startsWith("reaccion."))
                .length > 0
        ) {
            stepsError.push(2);
        }
        // Paso 3
        if (errors.evaluacionAccion || errors.causaRaiz || errors.similares) {
            stepsError.push(3);
        }
        // Paso 4
        if (
            Object.keys(errors)
                .filter((key) => key.startsWith("planAccion."))
                .length > 0
        ) {
            stepsError.push(4);
        }
        return stepsError;
    };

    // Actualización de errores en tiempo real: si se corrige el campo se quita el error.
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;
        setFormData({ ...formData, [name]: newValue });
        // Si hay un error y se ingresa valor, lo eliminamos
        if (errors[name] && newValue) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleDynamicChange = (section, index, field, value) => {
        const updated = formData[section].map((entry, i) =>
            i === index ? { ...entry, [field]: value } : entry
        );
        setFormData({ ...formData, [section]: updated });
        // Opcional: si se corrige un campo dinámico, quitar error usando una clave compuesta
        const key = `${section}.${index}.${field}`;
        if (errors[key] && value) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const addDynamicEntry = (section) => {
        setFormData({ ...formData, [section]: [...formData[section], { ...initialDynamicEntry }] });
    };

    const removeDynamicEntry = (section, index) => {
        const updated = formData[section].filter((_, i) => i !== index);
        setFormData({ ...formData, [section]: updated });
    };

    // Navegación entre pasos sin validación inmediata
    const handleNext = () => {
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleSubmit = () => {
        if (validateForm()) {
            console.log("Datos a enviar:", formData);
            onSave(formData);
        } else {
            console.log("Errores en el formulario:", errors);
        }
    };

    // Permitir navegar haciendo clic en el stepper (no lineal)
    const handleStepClick = (step) => {
        setActiveStep(step);
    };


    // Obtiene los pasos con error para marcar en el Stepper
    const stepsWithErrors = getStepsWithErrors();

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        {/* Primera fila: Entidad, No conformidad y Código */}
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            <FormControl sx={{ flex: 1 }} error={!!errors.entidad}>
                                <InputLabel id="entidad-label">Dependencia/Entidad</InputLabel>
                                <Select
                                    labelId="entidad-label"
                                    label="Dependencia/Entidad"
                                    name="entidad"
                                    value={formData.entidad}
                                    onChange={handleChange}
                                >
                                    {entidades.map((ent, idx) => (
                                        <MenuItem key={idx} value={ent}>
                                            {ent}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.entidad && (
                                    <FormHelperText>{errors.entidad}</FormHelperText>
                                )}
                            </FormControl>
                            <FormControlLabel
                                sx={{ flex: 0.5, alignSelf: "center" }}
                                control={
                                    <Checkbox
                                        name="noConformidad"
                                        checked={formData.noConformidad}
                                        onChange={handleChange}
                                    />
                                }
                                label="No conformidad"
                            />
                            <TextField
                                sx={{ flex: 1 }}
                                label="Código"
                                name="codigo"
                                value={formData.codigo}
                                InputProps={{ readOnly: true }}
                                fullWidth
                            />
                        </Box>
                        {/* Segunda fila: Coordinador y Fecha de Inicio */}
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            <TextField
                                sx={{ flex: 1 }}
                                label="Coordinador del plan de acción"
                                name="coordinador"
                                value={formData.coordinador}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors.coordinador}
                                helperText={errors.coordinador}
                            />
                            <TextField
                                sx={{ flex: 1 }}
                                label="Fecha de Inicio"
                                name="fechaInicio"
                                type="date"
                                value={formData.fechaInicio}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.fechaInicio}
                                helperText={errors.fechaInicio}
                            />
                        </Box>
                        {/* Tercera fila: Origen de la no conformidad */}
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Origen de la no conformidad"
                                name="origenNoConformidad"
                                value={formData.origenNoConformidad}
                                onChange={handleChange}
                                error={!!errors.origenNoConformidad}
                                helperText={errors.origenNoConformidad}
                            />
                        </Box>
                        {/* Cuarta fila: Equipo de Mejora */}
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Equipo de Mejora"
                                name="equipoMejora"
                                value={formData.equipoMejora}
                                onChange={handleChange}
                                error={!!errors.equipoMejora}
                                helperText={errors.equipoMejora}
                            />
                        </Box>
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ display: "grid", gap: 2 }}>
                        <TextField
                            label="Requisitos"
                            name="requisitos"
                            value={formData.requisitos}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.requisitos}
                            helperText={errors.requisitos || "Especifica los requisitos relacionados."}
                        />
                        <TextField
                            label="Incumplimiento"
                            name="incumplimiento"
                            value={formData.incumplimiento}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.incumplimiento}
                            helperText={errors.incumplimiento || "Describe el incumplimiento detectado."}
                        />
                        <TextField
                            label="Evidencia"
                            name="evidencia"
                            value={formData.evidencia}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.evidencia}
                            helperText={errors.evidencia || "Adjunta o describe la evidencia recopilada."}
                        />
                    </Box>
                );
            case 2:
                return (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Reacción para controlar y corregir
                        </Typography>
                        {formData.reaccion.map((item, index) => (
                            <Box
                                key={index}
                                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 2, mb: 2 }}
                            >
                                <TextField
                                    label="Actividad"
                                    value={item.actividad}
                                    onChange={(e) => handleDynamicChange("reaccion", index, "actividad", e.target.value)}
                                    fullWidth
                                    error={!!errors[`reaccion.${index}.actividad`]}
                                    helperText={errors[`reaccion.${index}.actividad`]}
                                />
                                <TextField
                                    label="Responsable"
                                    value={item.responsable}
                                    onChange={(e) => handleDynamicChange("reaccion", index, "responsable", e.target.value)}
                                    fullWidth
                                    error={!!errors[`reaccion.${index}.responsable`]}
                                    helperText={errors[`reaccion.${index}.responsable`]}
                                />
                                <TextField
                                    label="Fecha Programada"
                                    type="date"
                                    value={item.fechaProgramada}
                                    onChange={(e) => handleDynamicChange("reaccion", index, "fechaProgramada", e.target.value)}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors[`reaccion.${index}.fechaProgramada`]}
                                    helperText={errors[`reaccion.${index}.fechaProgramada`]}
                                />
                                <IconButton onClick={() => removeDynamicEntry("reaccion", index)}>
                                    <Remove />
                                </IconButton>
                            </Box>
                        ))}
                        <Button variant="outlined" startIcon={<Add />} onClick={() => addDynamicEntry("reaccion")}>
                            Añadir actividad
                        </Button>
                    </Box>
                );
            case 3:
                return (
                    <Box sx={{ display: "grid", gap: 2 }}>
                        <TextField
                            label="Evaluación de la necesidad de acción para eliminar la causa"
                            name="evaluacionAccion"
                            value={formData.evaluacionAccion}
                            onChange={handleChange}
                            fullWidth
                            helperText="Ej: Se requiere acción inmediata."
                            error={!!errors.evaluacionAccion}
                        />
                        <TextField
                            label="Determinación de la causa raíz"
                            name="causaRaiz"
                            value={formData.causaRaiz}
                            onChange={handleChange}
                            fullWidth
                            helperText="Indique la causa principal."
                            error={!!errors.causaRaiz}
                        />
                        <FormControl component="fieldset" error={!!errors.similares}>
                            <FormLabel component="legend">¿Ha habido casos similares?</FormLabel>
                            <RadioGroup sx={{ justifyContent: "center" }}
                                row
                                name="similares"
                                value={formData.similares}
                                onChange={handleChange}
                            >
                                <FormControlLabel value="si" control={<Radio />} label="Sí" />
                                <FormControlLabel value="no" control={<Radio />} label="No" />
                            </RadioGroup>
                            {errors.similares && <FormHelperText>{errors.similares}</FormHelperText>}
                        </FormControl>
                    </Box>
                );
            case 4:
                return (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Plan de Acción
                        </Typography>
                        {formData.planAccion.map((item, index) => (
                            <Box
                                key={index}
                                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 2, mb: 2 }}
                            >
                                <TextField
                                    label="Actividad"
                                    value={item.actividad}
                                    onChange={(e) => handleDynamicChange("planAccion", index, "actividad", e.target.value)}
                                    fullWidth
                                    error={!!errors[`planAccion.${index}.actividad`]}
                                    helperText={errors[`planAccion.${index}.actividad`]}
                                />
                                <TextField
                                    label="Responsable"
                                    value={item.responsable}
                                    onChange={(e) => handleDynamicChange("planAccion", index, "responsable", e.target.value)}
                                    fullWidth
                                    error={!!errors[`planAccion.${index}.responsable`]}
                                    helperText={errors[`planAccion.${index}.responsable`]}
                                />
                                <TextField
                                    label="Fecha Programada"
                                    type="date"
                                    value={item.fechaProgramada}
                                    onChange={(e) => handleDynamicChange("planAccion", index, "fechaProgramada", e.target.value)}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors[`planAccion.${index}.fechaProgramada`]}
                                    helperText={errors[`planAccion.${index}.fechaProgramada`]}
                                />
                                <IconButton onClick={() => removeDynamicEntry("planAccion", index)}>
                                    <Remove />
                                </IconButton>
                            </Box>
                        ))}
                        <Button variant="outlined" startIcon={<Add />} onClick={() => addDynamicEntry("planAccion")}>
                            Añadir actividad
                        </Button>
                    </Box>
                );
            default:
                return <div>Opción no válida</div>;
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            {/* Stepper clickeable y no lineal */}
            <Stepper nonLinear activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                    <Step
                        key={label}
                        onClick={() => handleStepClick(index)}
                        style={{ cursor: "pointer" }}
                    >
                        <StepLabel error={stepsWithErrors.includes(index)}>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box sx={{ mt: 4, mb: 2 }}>{renderStepContent(activeStep)}</Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                    Atrás
                </Button>
                {activeStep === steps.length - 1 ? (
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Guardar
                    </Button>
                ) : (
                    <Button variant="contained"  onClick={handleNext} sx={{backgroundColor:'terciary.main'}}>
                        Siguiente
                    </Button>
                )}
                <Button variant="outlined" color="secondary" onClick={onCancel}>
                    Cancelar
                </Button>
            </Box>
        </Box>
    );
}

export default PlanCorrectivoForm;
