// src/ProyectoMejoraVertical.js
import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Stepper,
    Step,
    StepButton,
    StepContent,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert
} from "@mui/material";
import axios from "axios";

function ProyectoMejoraVertical() {
    // Estados para cargar opciones desde la BD
    const [divisiones, setDivisiones] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [activeStep, setActiveStep] = useState(0);

    // Definición de los pasos (8 pasos)
    const steps = [
        "Datos Generales",
        "Descripción de la Mejora",
        "Objetivos",
        "Información Complementaria",
        "Indicadores de Éxito",
        "Recursos",
        "Plan de Trabajo",
        "Aprobación"
    ];

    // Estado del formulario
    const [formData, setFormData] = useState({
        // Paso 0: Datos Generales
        division: "",
        departamento: "",
        fecha: "",
        noMejora: "",
        responsable: "",
        // Paso 1: Descripción
        descripcionMejora: "",
        // Paso 2: Objetivos (lista dinámica)
        objetivos: [{ descripcion: "" }],
        // Paso 3: Información Complementaria
        areaImpacto: "",
        personalBeneficiado: "",
        responsables: [{ nombre: "" }],
        situacionActual: "",
        // Paso 4: Indicadores de Éxito (lista dinámica)
        indicadoresExito: [{ nombre: "" }],
        // Paso 5: Recursos (lista dinámica) y costo
        recursos: [{ tiempoEstimado: "", recursosMatHum: "" }],
        costoProyecto: "",
        // Paso 6: Plan de Trabajo (lista dinámica)
        actividadesPM: [{ actividad: "", responsable: "", fecha: "" }],
        // Paso 7: Aprobación
        aprobacionNombre: "",
        aprobacionPuesto: ""
    });

    // Estado para mostrar alertas
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // Cargar datos de División y Departamento
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/entidades")
          .then((res) => {
            console.log("Respuesta de entidades:", res.data);
            // Accedemos a la propiedad 'entidades' del objeto de respuesta
            setDivisiones(res.data.entidades || []);
          })
          .catch((err) => console.error("Error cargando divisiones:", err));
      
        axios.get("http://127.0.0.1:8000/api/procesos")
          .then((res) => {
            console.log("Respuesta de procesos:", res.data);
            // Si la respuesta tiene la propiedad 'procesos' o 'data', la extraemos
            const data = res.data.procesos || res.data.data || [];
            setDepartamentos(data);
          })
          .catch((err) => console.error("Error cargando departamentos:", err));
      }, []);
      


    // Manejo de campos simples
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Manejo de campos dinámicos
    const handleDynamicChange = (section, index, field, value) => {
        const updated = [...formData[section]];
        updated[index][field] = value;
        setFormData(prev => ({ ...prev, [section]: updated }));
    };

    const addDynamicField = (section, newItem) => {
        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], newItem]
        }));
    };

    const removeDynamicField = (section, index) => {
        const updated = [...formData[section]];
        updated.splice(index, 1);
        setFormData(prev => ({ ...prev, [section]: updated }));
    };

    // Navegación entre pasos (no lineal)
    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep(prev => prev - 1);
        }
    };

    // Envío del formulario (POST)
    const handleSubmit = async () => {
        if (!formData.division || !formData.departamento) {
            setSnackbar({
                open: true,
                message: "División y Departamento son obligatorios.",
                severity: "error"
            });
            return;
        }
        console.log("Datos a enviar:", formData);
        try {
            const res = await axios.post("http://127.0.0.1:8000/api/proyecto-mejora", formData);
            console.log("Respuesta del backend:", res.data);
            setSnackbar({
                open: true,
                message: "Proyecto guardado correctamente!",
                severity: "success"
            });
        } catch (error) {
            console.error("Error al guardar:", error);
            setSnackbar({
                open: true,
                message: "Error al guardar el proyecto.",
                severity: "error"
            });
        }
    };

    console.log("Entidaides:", divisiones);

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="division-label">División</InputLabel>
                            <Select
                                labelId="division-label"
                                name="division"
                                value={formData.division}
                                label="División"
                                onChange={handleChange}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    
                                </MenuItem>
                                {Array.isArray(divisiones) && divisiones.map((d) => (
                                    <MenuItem key={d.idEntidadDependecia} value={d.nombreEntidad}>
                                        {d.nombreEntidad}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="departamento-label">Departamento</InputLabel>
                            <Select
                                labelId="departamento-label"
                                name="departamento"
                                value={formData.departamento}
                                label="Departamento"
                                onChange={handleChange}
                            >
                                {departamentos.map((dep) => (
                                    <MenuItem key={dep.idProceso} value={dep.nombreProceso}>
                                        {dep.nombreProceso}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Fecha"
                            name="fecha"
                            type="date"
                            value={formData.fecha}
                            onChange={handleChange}
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            fullWidth
                            label="Número de Mejora"
                            name="noMejora"
                            type="number"
                            value={formData.noMejora}
                            onChange={handleChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Responsable"
                            name="responsable"
                            value={formData.responsable}
                            onChange={handleChange}
                            margin="normal"
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box>
                        <TextField
                            fullWidth
                            label="Descripción de la Mejora"
                            name="descripcionMejora"
                            value={formData.descripcionMejora}
                            onChange={handleChange}
                            margin="normal"
                            multiline
                            rows={10}
                        />
                    </Box>
                );
            case 2:
                return (
                    <Box>
                        {formData.objetivos.map((obj, index) => (
                            <Box key={index} display="flex" alignItems="center">
                                <TextField
                                    fullWidth
                                    label={`Objetivo ${index + 1}`}
                                    value={obj.descripcion}
                                    onChange={(e) =>
                                        handleDynamicChange("objetivos", index, "descripcion", e.target.value)
                                    }
                                    margin="normal"
                                />
                                <Button variant="outlined" color="error" onClick={() => removeDynamicField("objetivos", index)}>
                                    Eliminar
                                </Button>
                            </Box>
                        ))}
                        <Button variant="outlined" onClick={() => addDynamicField("objetivos", { descripcion: "" })}>
                            Agregar Objetivo
                        </Button>
                    </Box>
                );
            case 3:
                return (
                    <Box>
                        <TextField
                            fullWidth
                            label="Área de Impacto"
                            name="areaImpacto"
                            value={formData.areaImpacto}
                            onChange={handleChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Personal Beneficiado"
                            name="personalBeneficiado"
                            type="number"
                            value={formData.personalBeneficiado}
                            onChange={handleChange}
                            margin="normal"
                        />
                        {formData.responsables.map((resp, index) => (
                            <Box key={index} display="flex" alignItems="center">
                                <TextField
                                    fullWidth
                                    label={`Responsable ${index + 1}`}
                                    value={resp.nombre}
                                    onChange={(e) =>
                                        handleDynamicChange("responsables", index, "nombre", e.target.value)
                                    }
                                    margin="normal"
                                />
                                <Button variant="outlined" color="error" onClick={() => removeDynamicField("responsables", index)}>
                                    Eliminar
                                </Button>
                            </Box>
                        ))}
                        <Button variant="outlined" onClick={() => addDynamicField("responsables", { nombre: "" })}>
                            Agregar Responsable
                        </Button>
                        <TextField
                            fullWidth
                            label="Situación Actual"
                            name="situacionActual"
                            value={formData.situacionActual}
                            onChange={handleChange}
                            margin="normal"
                        />
                    </Box>
                );
            case 4:
                return (
                    <Box>
                        {formData.indicadoresExito.map((ind, index) => (
                            <Box key={index} display="flex" alignItems="center">
                                <TextField
                                    fullWidth
                                    label={`Indicador ${index + 1}`}
                                    value={ind.nombre}
                                    onChange={(e) =>
                                        handleDynamicChange("indicadoresExito", index, "nombre", e.target.value)
                                    }
                                    margin="normal"
                                />
                                <Button variant="outlined" color="error" onClick={() => removeDynamicField("indicadoresExito", index)}>
                                    Eliminar
                                </Button>
                            </Box>
                        ))}
                        <Button variant="outlined" onClick={() => addDynamicField("indicadoresExito", { nombre: "" })}>
                            Agregar Indicador
                        </Button>
                    </Box>
                );
            case 5:
                return (
                    <Box>
                        {formData.recursos.map((rec, index) => (
                            <Box key={index} display="flex" alignItems="center" gap={2}>
                                <TextField
                                    fullWidth
                                    label="Tiempo estimado de ejecución"
                                    value={rec.tiempoEstimado}
                                    onChange={(e) =>
                                        handleDynamicChange("recursos", index, "tiempoEstimado", e.target.value)
                                    }
                                    margin="normal"
                                    sx={{ flex: 1 }}
                                />
                                <TextField
                                    fullWidth
                                    label="Recursos materiales y humanos"
                                    value={rec.recursosMatHum}
                                    onChange={(e) =>
                                        handleDynamicChange("recursos", index, "recursosMatHum", e.target.value)
                                    }
                                    margin="normal"
                                    sx={{ flex: 1 }}
                                />
                                <Button variant="outlined" color="error" onClick={() => removeDynamicField("recursos", index)}>
                                    Eliminar
                                </Button>
                            </Box>
                        ))}
                        <Button variant="outlined" onClick={() => addDynamicField("recursos", { tiempoEstimado: "", recursosMatHum: "" })}>
                            Agregar Recurso
                        </Button>
                        <TextField
                            fullWidth
                            label="Costo Estimado del Proyecto"
                            name="costoProyecto"
                            type="number"
                            value={formData.costoProyecto}
                            onChange={handleChange}
                            margin="normal"
                        />
                    </Box>
                );
            case 6:
                return (
                    <Box>
                        {formData.actividadesPM.map((act, index) => (
                            <Box key={index} display="flex" alignItems="center">
                                <TextField
                                    fullWidth
                                    label="Etapa/Actividad"
                                    value={act.actividad}
                                    onChange={(e) =>
                                        handleDynamicChange("actividadesPM", index, "actividad", e.target.value)
                                    }
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Responsable"
                                    value={act.responsable}
                                    onChange={(e) =>
                                        handleDynamicChange("actividadesPM", index, "responsable", e.target.value)
                                    }
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Fecha"
                                    type="date"
                                    value={act.fecha}
                                    onChange={(e) =>
                                        handleDynamicChange("actividadesPM", index, "fecha", e.target.value)
                                    }
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                />
                                <Button variant="outlined" color="error" onClick={() => removeDynamicField("actividadesPM", index)}>
                                    Eliminar
                                </Button>
                            </Box>
                        ))}
                        <Button variant="outlined" onClick={() => addDynamicField("actividadesPM", { actividad: "", responsable: "", fecha: "" })}>
                            Agregar Actividad
                        </Button>
                    </Box>
                );
            case 7:
                return (
                    <Box>
                        <TextField
                            fullWidth
                            label="Nombre de Aprobación"
                            name="aprobacionNombre"
                            value={formData.aprobacionNombre}
                            onChange={handleChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Puesto de Aprobación"
                            name="aprobacionPuesto"
                            value={formData.aprobacionPuesto}
                            onChange={handleChange}
                            margin="normal"
                        />
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ p: 4, width: "800px", margin: "auto", minHeight: "600px", border: "1px solid #ccc" }}>
            <h2>Formulario de Proyecto de Mejora</h2>
            <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepButton onClick={handleStep(index)}>{label}</StepButton>
                        <StepContent>
                            <Box sx={{ minHeight: "300px" }}>
                                {renderStepContent(index)}
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Button variant="contained" onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext} sx={{ mt: 1, mr: 1 }}>
                                    {activeStep === steps.length - 1 ? "Enviar" : "Siguiente"}
                                </Button>
                                {activeStep > 0 && (
                                    <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                                        Anterior
                                    </Button>
                                )}
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ProyectoMejoraVertical;
