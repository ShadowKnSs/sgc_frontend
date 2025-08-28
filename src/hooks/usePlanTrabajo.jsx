import { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

export const usePlanTrabajo = (idRegistro) => {
  const [formData, setFormData] = useState({
    responsable: "",
    fechaElaboracion: "",
    objetivo: "",
    revisadoPor: "",
    fechaRevision: "",
    elaboradoPor: "",
  });

  const [records, setRecords] = useState([]);        // fuentes [{ idFuente?, numero, ... }]
  const [idPlanTrabajo, setIdPlanTrabajo] = useState(null);

  useEffect(() => {
    const fetchPlanTrabajo = async () => {
      try {
        const { data: plan } = await api.get(`/plantrabajo/registro/${idRegistro}`);
        setIdPlanTrabajo(plan.idPlanTrabajo ?? null);

        if (Array.isArray(plan.fuentes) && plan.fuentes.length) {
          const fuentesNumeradas = plan.fuentes.map((f, i) => ({ ...f, numero: i + 1 }));
          setRecords(fuentesNumeradas);
        } else {
          setRecords([]);
        }

        setFormData({
          responsable: plan.responsable || "",
          fechaElaboracion: plan.fechaElaboracion || new Date().toISOString().slice(0, 10),
          objetivo: plan.objetivo || "",
          revisadoPor: plan.revisadoPor || "",
          fechaRevision: plan.fechaRevision || "",
          elaboradoPor: plan.elaboradoPor || "",
          idActividadMejora: plan.idActividadMejora || undefined,
        });
      } catch (err) {
        console.error("❌ Error al obtener plan de trabajo:", err);
        setFormData((prev) => ({
          ...prev,
          fechaElaboracion: new Date().toISOString().slice(0, 10),
        }));
      }
    };

    if (idRegistro) fetchPlanTrabajo();
  }, [idRegistro]);

  const isFormValid = () =>
    formData.responsable.trim() !== "" &&
    formData.fechaElaboracion.trim() !== "" &&
    formData.objetivo.trim() !== "";

  // ---------- helpers ----------

  const guardarInfoGeneral = async () => {
    if (!idPlanTrabajo) {
      // crear plan si no existe
      const payload = {
        idRegistro,
        planTrabajo: {
          fechaElaboracion: formData.fechaElaboracion,
          objetivo: formData.objetivo,
          revisadoPor: formData.revisadoPor || null,
          fechaRevision: formData.fechaRevision || null,
          elaboradoPor: formData.elaboradoPor || null,
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
      revisadoPor: formData.revisadoPor || null,
      fechaRevision: formData.fechaRevision || null,
      elaboradoPor: formData.elaboradoPor || null,
    };
    const { data } = await api.put(`/plantrabajo/${idPlanTrabajo}`, payload);
    return data;
  };

  const crearFuentesBatch = async (nuevas) => {
    if (!nuevas.length) return null;

    // batch con arreglo, SOLO para crear
    const body = {
      fuentes: nuevas.map((f) => ({
        ...f,
        noActividad: f.numero, // mapeo consistente
        elementoEntrada: f.elementoEntrada || "",
        descripcion: f.descripcion || "",
        entregable: f.entregable || "",
      })),
    };
    const { data } = await api.post(`/plantrabajo/${idRegistro}/fuentes`, body);
    return data;
  };

  const updateFuente = async (f) => {
    if (!f.idFuente) return null;

    // payload PLANO (sin "fuentes")
    const body = {
      responsable: f.responsable ?? "",
      fechaInicio: f.fechaInicio || null,
      fechaTermino: f.fechaTermino || null,
      estado: f.estado || "En proceso",
      nombreFuente: f.nombreFuente ?? "",
      elementoEntrada: f.elementoEntrada || "",
      descripcion: f.descripcion || "",
      entregable: f.entregable || "",
      noActividad: f.numero, // requerido para PT-XX en backend
    };
    const { data } = await api.put(`/plantrabajo/fuentes/${f.idFuente}`, body);
    return data;
  };

  const guardarTodo = async () => {
    // 1) Guardar/actualizar info general
    if (isFormValid()) {
      await guardarInfoGeneral();
    }

    // 2) Separar nuevas vs existentes
    const nuevas = records.filter((r) => !r.idFuente);
    const existentes = records.filter((r) => r.idFuente);

    // 3) Crear nuevas en batch (POST con arreglo)
    if (nuevas.length) {
      await crearFuentesBatch(nuevas);
    }

    // 4) Actualizar existentes de a una (PUT plano)
    for (const f of existentes) {
      await updateFuente(f);
    }

    return "Plan de Trabajo y fuentes guardados correctamente.";
  };

  return {
    formData,
    setFormData,
    records,
    setRecords,
    isFormValid,
    guardarTodo,
  };
};
