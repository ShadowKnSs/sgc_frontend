import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: { "Content-Type": "application/json" },
});

export const useProyectoMejoraForm = (showSnackbar) => {
  const { idRegistro } = useParams();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    idRegistro: "",
    division: "",
    departamento: "",
    fecha: new Date().toISOString().split("T")[0],
    noMejora: "",
    responsable: "",
    descripcionMejora: "",
    objetivos: [{ descripcion: "" }],
    areaImpacto: "",
    personalBeneficiado: "",
    responsables: [{ nombre: "" }],
    situacionActual: "",
    indicadoresExito: [{ nombre: "", meta: "" }],
    recursos: [{ tiempoEstimado: "", recursosMatHum: "" }],
    costoProyecto: "",
    actividadesPM: [{ actividad: "", responsable: "", fecha: "" }],
    aprobacionNombre: "",
    aprobacionPuesto: "",
  });

  const [erroresCampos, setErroresCampos] = useState({});
  const [loading] = useState(false);
  const [error] = useState(null);
  const [saving, setSaving] = useState(false);

  const msg = (m, type = "info", title = "") => {
    if (typeof showSnackbar === "function") showSnackbar(m, type, title);
  };

  useEffect(() => {
    if (idRegistro) setFormData((prev) => ({ ...prev, idRegistro }));
  }, [idRegistro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErroresCampos((prev) => ({ ...prev, [name]: false }));
  };

  const handleDynamicChange = (section, index, field, value) => {
    const updated = [...formData[section]];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, [section]: updated }));
    setErroresCampos((prev) => ({ ...prev, [`${section}.${index}.${field}`]: false }));
  };

  const addDynamicField = (section, newItem) => {
    setFormData((prev) => ({ ...prev, [section]: [...prev[section], newItem] }));
  };

  const removeDynamicField = (section, index) => {
    const updated = [...formData[section]];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, [section]: updated }));
    // limpia errores asociados a esa fila/sección
    setErroresCampos((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach((k) => {
        if (k.startsWith(`${section}.${index}.`) || k.startsWith(`${section}.`)) {
          delete copy[k];
        }
      });
      return copy;
    });
  };

  const steps = [
    "Datos Generales",
    "Descripción de la Mejora",
    "Objetivos",
    "Información Complementaria",
    "Indicadores de Éxito",
    "Recursos",
    "Plan de Trabajo",
    "Aprobación",
  ];

  // --------- VALIDADORES POR SECCIÓN (JS) ----------
  const vDatosGenerales = () => ({
    division: !formData.division?.trim(),
    departamento: !formData.departamento?.trim(),
    fecha: !formData.fecha?.trim(),
    noMejora: !String(formData.noMejora ?? "").trim(),
    responsable: !formData.responsable?.trim(),
  });

  const vDescripcion = () => ({
    descripcionMejora: !formData.descripcionMejora?.trim(),
  });

  const vObjetivos = () =>
    Object.fromEntries(
      formData.objetivos.map((obj, i) => [`objetivos.${i}.descripcion`, !obj.descripcion?.trim()])
    );

  const vInfoComplementaria = () => ({
    areaImpacto: !formData.areaImpacto?.trim(),
    personalBeneficiado: !String(formData.personalBeneficiado ?? "").trim(),
    ...Object.fromEntries(
      formData.responsables.map((r, i) => [`responsables.${i}.nombre`, !r.nombre?.trim()])
    ),
    situacionActual: !formData.situacionActual?.trim(),
  });

  const vIndicadores = () =>
    Object.fromEntries(
      formData.indicadoresExito.flatMap((ind, i) => [
        [`indicadoresExito.${i}.nombre`, !ind.nombre?.trim()],
        [`indicadoresExito.${i}.meta`, !String(ind.meta ?? "").trim()],
      ])
    );

  const vRecursos = () => ({
    ...Object.fromEntries(
      formData.recursos.flatMap((r, i) => [
        [`recursos.${i}.tiempoEstimado`, !r.tiempoEstimado?.trim()],
        [`recursos.${i}.recursosMatHum`, !r.recursosMatHum?.trim()],
      ])
    ),
    costoProyecto: !String(formData.costoProyecto ?? "").trim(),
  });

  const vPlan = () =>
    Object.fromEntries(
      formData.actividadesPM.flatMap((a, i) => [
        [`actividadesPM.${i}.actividad`, !a.actividad?.trim()],
        [`actividadesPM.${i}.responsable`, !a.responsable?.trim()],
        [`actividadesPM.${i}.fecha`, !a.fecha?.trim()],
      ])
    );

  const vAprobacion = () => ({
    aprobacionNombre: !formData.aprobacionNombre?.trim(),
    aprobacionPuesto: !formData.aprobacionPuesto?.trim(),
  });

  const validators = [
    vDatosGenerales, // 0
    vDescripcion, // 1
    vObjetivos, // 2
    vInfoComplementaria, // 3
    vIndicadores, // 4
    vRecursos, // 5
    vPlan, // 6
    vAprobacion, // 7
  ];

  const mergeErrors = (...maps) => maps.reduce((acc, m) => ({ ...acc, ...m }), {});
  const hasErrors = (m) => Object.values(m).some(Boolean);

  const validateStep = (step) => validators[step]();
  const validateAll = () => mergeErrors(...validators.map((fn) => fn()));

  // --------- NAVEGACIÓN / SUBMIT ----------
  const onNext = () => {
    const errs = validateStep(activeStep);
    if (hasErrors(errs)) {
      setErroresCampos((prev) => ({ ...prev, ...errs }));
      msg("Completa los campos obligatorios de esta sección.", "error", "Validación");
      return;
    }
    setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const onBack = () => setActiveStep((s) => Math.max(s - 1, 0));

  const onStepClick = (targetIndex) => {
    // Si intenta avanzar, valida la sección actual
    if (targetIndex > activeStep) {
      const errs = validateStep(activeStep);
      if (hasErrors(errs)) {
        setErroresCampos((prev) => ({ ...prev, ...errs }));
        msg("Corrige los campos pendientes antes de avanzar.", "error", "Validación");
        return;
      }
    }
    setActiveStep(targetIndex);
  };

  const handleSubmit = async () => {
    setSaving(true);
    const errs = validateAll();
    if (hasErrors(errs)) {
      setErroresCampos((prev) => ({ ...prev, ...errs }));
      // Mueve el stepper al primer paso con error
      const firstBad = validators.findIndex((fn) => hasErrors(fn()));
      if (firstBad >= 0) setActiveStep(firstBad);
      msg("Hay campos obligatorios sin completar.", "error", "Error de validación");
      setSaving(false);
      return;
    }

    try {
      await api.post("/proyecto-mejora", formData);
      msg("Proyecto guardado correctamente!", "success", "Éxito");
      setTimeout(() => navigate(-1), 800);
    } catch (e) {
      let errorMessage = "Error al guardar el proyecto";
      if (e?.response?.status === 422) errorMessage = "Errores de validación en los datos enviados";
      else if (e?.response?.status >= 500) errorMessage = "Error del servidor al guardar";
      else if (e?.request) errorMessage = "Error de conexión. Verifique su internet";
      msg(errorMessage, "error", "Error");
    } finally {
      setSaving(false);
    }
  };

  // Indica si un paso tiene errores (para pintar StepButton)
  const stepHasError = (step) => hasErrors(validators[step]());

  return {
    steps,
    idRegistro,
    formData,
    setFormData,
    activeStep,
    onStepClick,
    onNext,
    onBack,
    handleChange,
    handleDynamicChange,
    addDynamicField,
    removeDynamicField,
    handleSubmit,
    erroresCampos,
    loading,
    error,
    saving,
    stepHasError,
  };
};
