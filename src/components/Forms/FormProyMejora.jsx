import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();
  const soloLectura = location.state?.soloLectura ?? true;
  const puedeEditar = location.state?.puedeEditar ?? false;

  const [divisiones, setDivisiones] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

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

  const [formData, setFormData] = useState({
    division: "",
    departamento: "",
    fecha: "",
    noMejora: "",
    responsable: "",
    descripcionMejora: "",
    objetivos: [{ descripcion: "" }],
    areaImpacto: "",
    personalBeneficiado: "",
    responsables: [{ nombre: "" }],
    situacionActual: "",
    indicadoresExito: [{ nombre: "" }],
    recursos: [{ tiempoEstimado: "", recursosMatHum: "" }],
    costoProyecto: "",
    actividadesPM: [{ actividad: "", responsable: "", fecha: "" }],
    aprobacionNombre: "",
    aprobacionPuesto: ""
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/entidades")
      .then((res) => setDivisiones(res.data.entidades || []))
      .catch((err) => console.error("Error cargando divisiones:", err));

    axios.get("http://127.0.0.1:8000/api/procesos")
      .then((res) => setDepartamentos(res.data.procesos || res.data.data || []))
      .catch((err) => console.error("Error cargando departamentos:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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

  const handleStep = (step) => () => setActiveStep(step);
  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    if (!formData.division || !formData.departamento) {
      setSnackbar({ open: true, message: "División y Departamento son obligatorios.", severity: "error" });
      return;
    }
    try {
      await axios.post("http://127.0.0.1:8000/api/proyecto-mejora", formData);
      setSnackbar({ open: true, message: "Proyecto guardado correctamente!", severity: "success" });
    } catch (error) {
      console.error("Error al guardar:", error);
      setSnackbar({ open: true, message: "Error al guardar el proyecto.", severity: "error" });
    }
  };

  const renderStepContent = (step) => {
    const disabled = soloLectura;

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
                disabled={disabled}
              >
                <MenuItem value=""></MenuItem>
                {divisiones.map((d) => (
                  <MenuItem key={d.idEntidadDependecia} value={d.nombreEntidad}>{d.nombreEntidad}</MenuItem>
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
                disabled={disabled}
              >
                {departamentos.map((dep) => (
                  <MenuItem key={dep.idProceso} value={dep.nombreProceso}>{dep.nombreProceso}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField fullWidth label="Fecha" name="fecha" type="date" value={formData.fecha} onChange={handleChange} margin="normal" InputLabelProps={{ shrink: true }} disabled={disabled} />
            <TextField fullWidth label="Número de Mejora" name="noMejora" type="number" value={formData.noMejora} onChange={handleChange} margin="normal" disabled={disabled} />
            <TextField fullWidth label="Responsable" name="responsable" value={formData.responsable} onChange={handleChange} margin="normal" disabled={disabled} />
          </Box>
        );
      case 1:
        return (
          <TextField fullWidth label="Descripción de la Mejora" name="descripcionMejora" value={formData.descripcionMejora} onChange={handleChange} margin="normal" multiline rows={10} disabled={disabled} />
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
                  onChange={(e) => handleDynamicChange("objetivos", index, "descripcion", e.target.value)}
                  margin="normal"
                  disabled={disabled}
                />
                {!soloLectura && puedeEditar && (
                  <Button variant="outlined" color="error" onClick={() => removeDynamicField("objetivos", index)}>Eliminar</Button>
                )}
              </Box>
            ))}
            {!soloLectura && puedeEditar && (
              <Button variant="outlined" onClick={() => addDynamicField("objetivos", { descripcion: "" })}>Agregar Objetivo</Button>
            )}
          </Box>
        );
      case 3:
        return (
          <Box>
            <TextField fullWidth label="Área de Impacto" name="areaImpacto" value={formData.areaImpacto} onChange={handleChange} margin="normal" disabled={disabled} />
            <TextField fullWidth label="Personal Beneficiado" name="personalBeneficiado" type="number" value={formData.personalBeneficiado} onChange={handleChange} margin="normal" disabled={disabled} />
            {formData.responsables.map((resp, index) => (
              <Box key={index} display="flex" alignItems="center">
                <TextField fullWidth label={`Responsable ${index + 1}`} value={resp.nombre} onChange={(e) => handleDynamicChange("responsables", index, "nombre", e.target.value)} margin="normal" disabled={disabled} />
                {!soloLectura && puedeEditar && (
                  <Button variant="outlined" color="error" onClick={() => removeDynamicField("responsables", index)}>Eliminar</Button>
                )}
              </Box>
            ))}
            {!soloLectura && puedeEditar && (
              <Button variant="outlined" onClick={() => addDynamicField("responsables", { nombre: "" })}>Agregar Responsable</Button>
            )}
            <TextField fullWidth label="Situación Actual" name="situacionActual" value={formData.situacionActual} onChange={handleChange} margin="normal" disabled={disabled} />
          </Box>
        );
      case 4:
        return (
          <Box>
            {formData.indicadoresExito.map((ind, index) => (
              <Box key={index} display="flex" alignItems="center">
                <TextField fullWidth label={`Indicador ${index + 1}`} value={ind.nombre} onChange={(e) => handleDynamicChange("indicadoresExito", index, "nombre", e.target.value)} margin="normal" disabled={disabled} />
                {!soloLectura && puedeEditar && (
                  <Button variant="outlined" color="error" onClick={() => removeDynamicField("indicadoresExito", index)}>Eliminar</Button>
                )}
              </Box>
            ))}
            {!soloLectura && puedeEditar && (
              <Button variant="outlined" onClick={() => addDynamicField("indicadoresExito", { nombre: "" })}>Agregar Indicador</Button>
            )}
          </Box>
        );
      case 5:
        return (
          <Box>
            {formData.recursos.map((rec, index) => (
              <Box key={index} display="flex" alignItems="center" gap={2}>
                <TextField fullWidth label="Tiempo estimado de ejecución" value={rec.tiempoEstimado} onChange={(e) => handleDynamicChange("recursos", index, "tiempoEstimado", e.target.value)} margin="normal" sx={{ flex: 1 }} disabled={disabled} />
                <TextField fullWidth label="Recursos materiales y humanos" value={rec.recursosMatHum} onChange={(e) => handleDynamicChange("recursos", index, "recursosMatHum", e.target.value)} margin="normal" sx={{ flex: 1 }} disabled={disabled} />
                {!soloLectura && puedeEditar && (
                  <Button variant="outlined" color="error" onClick={() => removeDynamicField("recursos", index)}>Eliminar</Button>
                )}
              </Box>
            ))}
            {!soloLectura && puedeEditar && (
              <Button variant="outlined" onClick={() => addDynamicField("recursos", { tiempoEstimado: "", recursosMatHum: "" })}>Agregar Recurso</Button>
            )}
            <TextField fullWidth label="Costo Estimado del Proyecto" name="costoProyecto" type="number" value={formData.costoProyecto} onChange={handleChange} margin="normal" disabled={disabled} />
          </Box>
        );
      case 6:
        return (
          <Box>
            {formData.actividadesPM.map((act, index) => (
              <Box key={index} display="flex" alignItems="center">
                <TextField fullWidth label="Etapa/Actividad" value={act.actividad} onChange={(e) => handleDynamicChange("actividadesPM", index, "actividad", e.target.value)} margin="normal" disabled={disabled} />
                <TextField fullWidth label="Responsable" value={act.responsable} onChange={(e) => handleDynamicChange("actividadesPM", index, "responsable", e.target.value)} margin="normal" disabled={disabled} />
                <TextField fullWidth label="Fecha" type="date" value={act.fecha} onChange={(e) => handleDynamicChange("actividadesPM", index, "fecha", e.target.value)} margin="normal" InputLabelProps={{ shrink: true }} disabled={disabled} />
                {!soloLectura && puedeEditar && (
                  <Button variant="outlined" color="error" onClick={() => removeDynamicField("actividadesPM", index)}>Eliminar</Button>
                )}
              </Box>
            ))}
            {!soloLectura && puedeEditar && (
              <Button variant="outlined" onClick={() => addDynamicField("actividadesPM", { actividad: "", responsable: "", fecha: "" })}>Agregar Actividad</Button>
            )}
          </Box>
        );
      case 7:
        return (
          <Box>
            <TextField fullWidth label="Nombre de Aprobación" name="aprobacionNombre" value={formData.aprobacionNombre} onChange={handleChange} margin="normal" disabled={disabled} />
            <TextField fullWidth label="Puesto de Aprobación" name="aprobacionPuesto" value={formData.aprobacionPuesto} onChange={handleChange} margin="normal" disabled={disabled} />
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
              <Box sx={{ minHeight: "300px" }}>{renderStepContent(index)}</Box>
              <Box sx={{ mb: 2 }}>
                {!soloLectura && puedeEditar && (
                  <Button variant="contained" onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext} sx={{ mt: 1, mr: 1 }}>
                    {activeStep === steps.length - 1 ? "Enviar" : "Siguiente"}
                  </Button>
                )}
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
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProyectoMejoraVertical;
