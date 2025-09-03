import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  IconButton,
  Radio,
  RadioGroup,
  FormLabel,
  FormHelperText,
  Typography
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import axios from "axios";



const steps = [
  "Datos del Proceso",
  "Descripción de la No Conformidad",
  "Reacción para Controlar y Corregir",
  "Consecuencias Identificadas",
  "Plan de Acción"
];

const initialDynamicEntry = { actividad: "", responsable: "", fechaProgramada: "" };

function PlanCorrectivoForm({ idProceso, onSave, onCancel, initialData, sequence }) {
  // Objeto por defecto que contiene todas las propiedades esperadas
  const defaultForm = {
    entidad: "",
    noConformidad: false,
    codigo: "", // Se generará automáticamente si es nuevo
    coordinadorPlan: "",
    fechaInicio: "",
    origenConformidad: "",
    equipoMejora: "",
    requisito: "",
    incumplimiento: "",
    evidencia: "",
    reaccion: [{ ...initialDynamicEntry }],
    revisionAnalisis: "",
    causaRaiz: "",
    estadoSimilares: "", // Ej: "Si" o "No"
    planAccion: [{ ...initialDynamicEntry }],
    estadoConformidad: "Activo"
  };

  // Fusionamos initialData con defaultForm para que no falten propiedades al editar
  const mergedData = useMemo(() => (
    initialData ? { ...defaultForm, ...initialData } : defaultForm
  ), [initialData]);
  const [formData, setFormData] = useState(mergedData);
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});

  // Simulación de carga para Dependencia/Entidad
  useEffect(() => {
    if (!idProceso) return;
    axios.get(`http://127.0.0.1:8000/api/proceso-entidad/${idProceso}`)
      .then(res => {
        const { entidad } = res.data;
        setFormData(prev => ({ ...prev, entidad: entidad || "" }));
      })
      .catch(err => console.error("❌ Error al obtener entidad:", err));
  }, [idProceso]);

  useEffect(() => {
    if (!initialData && idProceso) {
      const year = new Date().getFullYear().toString().slice(-2);
      const seqStr = sequence.toString().padStart(2, "0");
      setFormData(prev => ({ ...prev, codigo: `PAC-${seqStr}${year}` }));
    }
  }, [initialData, idProceso, sequence]);


  const validateForm = () => {
    let formErrors = {};

    // Sección 0
    if (!formData.entidad) formErrors.entidad = "La entidad es requerida.";
    if (!formData.coordinadorPlan) formErrors.coordinadorPlan = "El coordinador es requerido.";
    if (!formData.fechaInicio) formErrors.fechaInicio = "La fecha de inicio es requerida.";
    if (!formData.origenConformidad) formErrors.origenConformidad = "El origen es requerido.";
    if (!formData.equipoMejora) formErrors.equipoMejora = "El equipo de mejora es requerido.";

    // Sección 1
    if (!formData.requisito) formErrors.requisito = "El requisito es obligatorio.";
    if (!formData.incumplimiento) formErrors.incumplimiento = "El incumplimiento es requerido.";
    if (!formData.evidencia) formErrors.evidencia = "La evidencia es requerida.";

    // Sección 2 - Validación dinámica de reaccion
    (formData.reaccion || []).forEach((item, index) => {
      if (!item.actividad) formErrors[`reaccion.${index}.actividad`] = "Actividad requerida";
      if (!item.responsable) formErrors[`reaccion.${index}.responsable`] = "Responsable requerido";
      if (!item.fechaProgramada) formErrors[`reaccion.${index}.fechaProgramada`] = "Fecha requerida";
    });

    // Sección 3
    if (!formData.revisionAnalisis) formErrors.revisionAnalisis = "La revisión es obligatoria.";
    if (!formData.causaRaiz) formErrors.causaRaiz = "La causa raíz es obligatoria.";
    if (!formData.estadoSimilares) formErrors.estadoSimilares = "Seleccione una opción.";

    // Sección 4 - Validación dinámica de planAccion
    (formData.planAccion || []).forEach((item, index) => {
      const anyFilled = item.actividad || item.responsable || item.fechaProgramada;
      if (!anyFilled) return; // todo vacío es válido
      if (!item.actividad) formErrors[`planAccion.${index}.actividad`] = "Actividad requerida";
      if (!item.responsable) formErrors[`planAccion.${index}.responsable`] = "Responsable requerido";
      if (!item.fechaProgramada) formErrors[`planAccion.${index}.fechaProgramada`] = "Fecha requerida";
    });

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const getStepsCompleted = () => {
    const completed = [];

    // Paso 0: Datos del Proceso
    if (
      formData.entidad &&
      formData.coordinadorPlan &&
      formData.fechaInicio &&
      formData.origenConformidad &&
      formData.equipoMejora
    ) completed.push(0);

    // Paso 1: No Conformidad
    if (
      formData.requisito &&
      formData.incumplimiento &&
      formData.evidencia
    ) completed.push(1);

    // Paso 2: Reacción
    const validReaccion = (formData.reaccion || []).every(
      item => item.actividad && item.responsable && item.fechaProgramada
    );
    if (formData.reaccion?.length > 0 && validReaccion) completed.push(2);

    // Paso 3: Consecuencias
    if (
      formData.revisionAnalisis &&
      formData.causaRaiz &&
      formData.estadoSimilares
    ) completed.push(3);

    // Paso 4: Plan de Acción
    const acciones = formData.planAccion || [];
    const vacio = acciones.length === 0;
    const completo = acciones.length > 0 && acciones.every(item => item.actividad && item.responsable && item.fechaProgramada);
    if (vacio || completo) completed.push(4);
    return completed;
  };


  const sectionHasErrors = (prefix) => Object.keys(errors).some(key => key.startsWith(prefix));

  const getStepsWithErrors = () => {
    const stepsError = [];

    if (
      errors.entidad ||
      errors.coordinadorPlan ||
      errors.fechaInicio ||
      errors.origenConformidad ||
      errors.equipoMejora
    ) {
      stepsError.push(0);
    }

    if (
      errors.requisito ||
      errors.incumplimiento ||
      errors.evidencia
    ) {
      stepsError.push(1);
    }

    if (sectionHasErrors("reaccion.")) {
      stepsError.push(2);
    }

    if (
      errors.revisionAnalisis ||
      errors.causaRaiz ||
      errors.estadoSimilares
    ) {
      stepsError.push(3);
    }

    return stepsError;
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
    if (errors[name] && newValue) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDynamicChange = (section, index, field, value) => {
    const updated = (formData[section] || []).map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    setFormData({ ...formData, [section]: updated });
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
    setFormData({
      ...formData,
      [section]: [...(formData[section] || []), { ...initialDynamicEntry }]
    });
  };

  const removeDynamicEntry = (section, index) => {
    const updated = (formData[section] || []).filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: updated });
  };

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

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  const stepsWithErrors = getStepsWithErrors();
  const maxChars = 255;

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            {/* Primera fila: Entidad, No conformidad y Código */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <FormControl sx={{ flex: 1 }} error={!!errors.entidad}>
                <TextField
                  label="Entidad"
                  value={formData.entidad}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />

                {errors.entidad && <FormHelperText>{errors.entidad}</FormHelperText>}
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
                name="coordinadorPlan"
                value={formData.coordinadorPlan}
                onChange={handleChange}
                fullWidth
                error={!!errors.coordinadorPlan}
                helperText={errors.coordinadorPlan}
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
                name="origenConformidad"
                value={formData.origenConformidad}
                onChange={handleChange}
                error={!!errors.origenConformidad}
                helperText={errors.origenConformidad}
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
            <Box>
              <Typography
                variant="caption"
                sx={{ display: "block", textAlign: "right", color: "text.secondary" }}
              >
                {formData.requisito.length}/{maxChars}
              </Typography>
              <TextField
                label="Requisito"
                name="requisito"
                value={formData.requisito}
                onChange={handleChange}
                fullWidth
                error={!!errors.requisito}
                helperText={errors.requisito || "Especifica los requisitos relacionados."}
                multiline
                minRows={2}
                maxRows={6}
                inputProps={{ maxLength: maxChars }}
              />
            </Box>

            <Box>
              <Typography
                variant="caption"
                sx={{ display: "block", textAlign: "right", color: "text.secondary" }}
              >
                {formData.incumplimiento.length}/{maxChars}
              </Typography>
              <TextField
                label="Incumplimiento"
                name="incumplimiento"
                value={formData.incumplimiento}
                onChange={handleChange}
                fullWidth
                error={!!errors.incumplimiento}
                helperText={errors.incumplimiento || "Describe el incumplimiento detectado."}
                multiline
                minRows={2}
                maxRows={6}
                inputProps={{ maxLength: maxChars }}
              />
              
            </Box>

            <Box>
              <Typography
                variant="caption"
                sx={{ display: "block", textAlign: "right", color: "text.secondary" }}
              >
                {formData.evidencia.length}/{maxChars}
              </Typography>
              <TextField
                label="Evidencia"
                name="evidencia"
                value={formData.evidencia}
                onChange={handleChange}
                fullWidth
                error={!!errors.evidencia}
                helperText={errors.evidencia || "Adjunta o describe la evidencia recopilada."}
                multiline
                minRows={2}
                maxRows={6}
                inputProps={{ maxLength: maxChars }}
              />
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box>

            {(formData.reaccion || []).map((item, index) => (
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
            <Box>
              <Typography
                variant="caption"
                sx={{ display: "block", textAlign: "right", color: "text.secondary" }}
              >
                {formData.revisionAnalisis.length}/{maxChars}
              </Typography>
              <TextField
                label="Revisión de la necesidad de acción para eliminar la causa"
                name="revisionAnalisis"
                value={formData.revisionAnalisis}
                onChange={handleChange}
                fullWidth
                helperText="Ej: Se requiere acción inmediata."
                error={!!errors.revisionAnalisis}
                multiline
                minRows={2}
                maxRows={6}
                inputProps={{ maxLength: maxChars }}
              />
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{ display: "block", textAlign: "right", color: "text.secondary" }}
              >
                {formData.causaRaiz.length}/{maxChars}
              </Typography>
              <TextField
                label="Determinación de la causa raíz"
                name="causaRaiz"
                value={formData.causaRaiz}
                onChange={handleChange}
                fullWidth
                helperText="Indique la causa principal."
                error={!!errors.causaRaiz}
                multiline
                minRows={2}
                maxRows={6}
                inputProps={{ maxLength: maxChars }}
              />
            </Box>
            <FormControl component="fieldset" error={!!errors.estadoSimilares}>
              <FormLabel component="legend">¿Ha habido casos similares?</FormLabel>
              <RadioGroup
                sx={{ justifyContent: "center" }}
                row
                name="estadoSimilares"
                value={formData.estadoSimilares}
                onChange={handleChange}
              >
                <FormControlLabel value="Si" control={<Radio />} label="Sí" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
              {errors.estadoSimilares && <FormHelperText>{errors.estadoSimilares}</FormHelperText>}
            </FormControl>
          </Box>
        );
      case 4:
        return (
          <Box>

            {(formData.planAccion || []).map((item, index) => (
              <Box
                key={index}
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 2, mb: 2 }}
              >
                <TextField
                  label="Actividad"
                  value={item.actividad || ""}
                  onChange={(e) => handleDynamicChange("planAccion", index, "actividad", e.target.value)}
                  fullWidth
                  
                />
                <TextField
                  label="Responsable"
                  value={item.responsable}
                  onChange={(e) => handleDynamicChange("planAccion", index, "responsable", e.target.value)}
                  fullWidth
                  
                />
                <TextField
                  label="Fecha Programada"
                  type="date"
                  value={item.fechaProgramada}
                  onChange={(e) => handleDynamicChange("planAccion", index, "fechaProgramada", e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  
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
      <Stepper nonLinear activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step
            key={label}
            onClick={() => handleStepClick(index)}
            completed={getStepsCompleted().includes(index)}
            sx={{ cursor: "pointer" }}
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
          <Button variant="contained" onClick={handleNext} sx={{ backgroundColor: "#68A2C9" }}>
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
