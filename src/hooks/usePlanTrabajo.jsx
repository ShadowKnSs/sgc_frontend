import { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

export const usePlanTrabajo = (idRegistro, showSnackbar) => {
  const [formData, setFormData] = useState({
    responsable: "",
    fechaElaboracion: "",
    objetivo: "",
    revisadoPor: "",
    fechaRevision: "",
    elaboradoPor: "",
  });

  const [records, setRecords] = useState([]);
  const [idPlanTrabajo, setIdPlanTrabajo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasData, setHasData] = useState(false);

  // Función para manejar mensajes
  const handleMessage = (message, type = "info", title = "") => {
    if (showSnackbar) {
      showSnackbar(message, type, title);
    }
  };

  //  Función para cargar datos mejorada
  const loadData = async () => {
    if (!idRegistro) {
      setError("No se proporcionó un ID de registro válido");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data: plan } = await api.get(`/plantrabajo/registro/${idRegistro}`);

      setIdPlanTrabajo(plan.idPlanTrabajo ?? null);

      if (Array.isArray(plan.fuentes) && plan.fuentes.length) {
        const fuentesNumeradas = plan.fuentes.map((f) => ({
          ...f,
          numero: (f.noActividad ?? f.numero ?? f.numeroActividad ?? 0),
        }));
        setRecords(fuentesNumeradas);
      } else {
        setRecords([]);
      }

      const newFormData = {
        responsable: plan.responsable || "",
        fechaElaboracion: plan.fechaElaboracion || new Date().toISOString().slice(0, 10),
        objetivo: plan.objetivo || "",
        revisadoPor: plan.revisadoPor || "",
        fechaRevision: plan.fechaRevision || "",
        elaboradoPor: plan.elaboradoPor || "",
        idActividadMejora: plan.idActividadMejora || undefined,
      };

      setFormData(newFormData);

      // Verificar si hay datos
      const formHasData = Object.values(newFormData).some(value =>
        value && value.toString().trim() !== ""
      );
      const hasRecords = Array.isArray(plan.fuentes) && plan.fuentes.length > 0;
      setHasData(formHasData || hasRecords);

      if (!plan.idPlanTrabajo && !formHasData && !hasRecords) {
        handleMessage("No hay un plan de trabajo registrado. Puede crear uno nuevo.", "info", "Información");
      } else if (plan.idPlanTrabajo) {
        handleMessage("Plan de trabajo cargado correctamente", "success", "Éxito");
      }

    } catch (err) {

      let errorMessage = "Error al cargar el plan de trabajo";

      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = "No se encontró un plan de trabajo para este registro";
          // No es un error crítico, es información
          setHasData(false);
          setFormData(prev => ({
            ...prev,
            fechaElaboracion: new Date().toISOString().slice(0, 10),
          }));
        } else if (err.response.status >= 500) {
          errorMessage = "Error del servidor al cargar el plan de trabajo";
        }
      } else if (err.request) {
        errorMessage = "Error de conexión. Verifique su internet";
      }

      setError(errorMessage);
      handleMessage(errorMessage, "error", "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [idRegistro]);

  const isFormValid = () =>
    formData.fechaElaboracion.trim() !== "" &&
    formData.objetivo.trim() !== "";

  // ---------- helpers ----------

  const guardarInfoGeneral = async () => {
    try {
      if (!idPlanTrabajo) {
        // crear plan si no existe
        const payload = {
          idRegistro,
          planTrabajo: {
            fechaElaboracion: new Date(formData.fechaElaboracion).toISOString().slice(0, 10),
            objetivo: formData.objetivo,
            revisadoPor: (typeof formData.revisadoPor === 'string' && formData.revisadoPor.trim() !== '') ? formData.revisadoPor.trim() : null,
            fechaRevision: formData.fechaRevision ? new Date(formData.fechaRevision).toISOString().slice(0, 10) : null,
            elaboradoPor: (typeof formData.elaboradoPor === 'string' && formData.elaboradoPor.trim() !== '') ? formData.elaboradoPor.trim() : null,
          },
        };
        const { data } = await api.post(`/plantrabajo`, payload);
        setIdPlanTrabajo(data?.planTrabajo?.idPlanTrabajo ?? null);
        return data;
      }

      // actualizar plan existente (payload PLANO, sin "fuentes")
      const payload = {
        fechaElaboracion: formData.fechaElaboracion,
        objetivo: formData.objetivo,
      };
      if (typeof formData.revisadoPor === 'string' && formData.revisadoPor.trim() !== '') {
        payload.revisadoPor = formData.revisadoPor.trim();
      }
      if (formData.fechaRevision) {
        // normaliza a YYYY-MM-DD
        payload.fechaRevision = new Date(formData.fechaRevision).toISOString().slice(0, 10);
      }
      if (typeof formData.elaboradoPor === 'string' && formData.elaboradoPor.trim() !== '') {
        payload.elaboradoPor = formData.elaboradoPor.trim();
      }
      const { data } = await api.put(`/plantrabajo/${idPlanTrabajo}`, payload);
      return data;
    } catch (err) {
      console.error("Error guardando información general:", err);
      let errorMessage = "Error al guardar la información general";

      if (err.response) {
        if (err.response.status >= 500) {
          errorMessage = "Error del servidor al guardar";
        } else if (err.response.status === 422) {
          errorMessage = "Errores de validación en los datos";
        }
      } else if (err.request) {
        errorMessage = "Error de conexión al guardar";
      }

      throw new Error(errorMessage);
    }
  };

  const crearFuentesBatch = async (todas) => {
    if (!todas.length) return null;
    const body = {
      fuentes: todas.map((f) => ({
        ...f,
        noActividad: f.noActividad ?? f.numero,            
        elementoEntrada: f.elementoEntrada || "",
        descripcion: f.descripcion?.toString().trim() ? f.descripcion : null,
        entregable: f.entregable?.toString().trim() ? f.entregable : null,
        fechaInicio: f.fechaInicio || null,
        fechaTermino: f.fechaTermino || null,
        estado: f.estado || "En proceso",
        nombreFuente: f.nombreFuente || "Gestión de Riesgos",
      })),
    };

    try {
      const { data } = await api.post(`/plantrabajo/${idPlanTrabajo}/fuentes`, body);
      return data;
    } catch (error) {
      console.error("Error creating fuentes:", error.response?.data);
      let errorMessage = "Error al crear las fuentes";

      if (error.response?.status >= 500) {
        errorMessage = "Error del servidor al crear fuentes";
      } else if (error.request) {
        errorMessage = "Error de conexión al crear fuentes";
      }

      throw new Error(errorMessage);
    }
  }

  const guardarTodo = async () => {
    try {
      // 1) Guardar/actualizar info general
      if (isFormValid()) {
        await guardarInfoGeneral();
        handleMessage("Información general guardada correctamente", "success", "Éxito");
      }

      if (records.length) {
        await crearFuentesBatch(records);
        handleMessage(`${records.length} fuente(s) guardada(s) correctamente`, "success", "Éxito");
      }

      // Recargar datos después de guardar
      await loadData();

      return "Plan de Trabajo y fuentes guardados correctamente.";
    } catch (error) {
      throw error; // Re-lanzar el error para que lo maneje el componente
    }
  };

  return {
    formData,
    setFormData,
    records,
    setRecords,
    isFormValid,
    guardarTodo,
    loading,
    error,
    hasData,
    loadData, //  Exportar función para reintentar
  };
};