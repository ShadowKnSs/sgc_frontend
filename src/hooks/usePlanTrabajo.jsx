import { useEffect, useState } from "react";
import axios from "axios";

export const usePlanTrabajo = (idRegistro) => {
  const [formData, setFormData] = useState({
    fechaElaboracion: "",
    objetivo: "",
    revisadoPor: "",
    fechaRevision: "",
    elaboradoPor: "",
  });

  const [records, setRecords] = useState([]);
  const [idPlanTrabajo, setIdPlanTrabajo] = useState(null);

  useEffect(() => {
    const fetchPlanTrabajo = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/plantrabajo/registro/${idRegistro}`);
        const plan = res.data;

        setIdPlanTrabajo(plan.idPlanTrabajo);

        if (plan.fuentes?.length) {
          const fuentesNumeradas = plan.fuentes.map((f, i) => ({ ...f, numero: i + 1 }));
          setRecords(fuentesNumeradas);
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

  const guardarTodo = async () => {
    const payload = {
      planTrabajo: {
        fechaElaboracion: formData.fechaElaboracion,
        objetivo: formData.objetivo,
        revisadoPor: formData.revisadoPor || null,
        fechaRevision: formData.fechaRevision || null,
        elaboradoPor: formData.elaboradoPor || null,
      },
      fuentes: records.map(({ numero, ...f }) => f),
    };

    try {
      let response;
      if (idPlanTrabajo) {
        // PUT para actualizar
        response = await axios.put(`http://localhost:8000/api/plantrabajo/${idPlanTrabajo}`, payload);
      } else {
        // POST para crear
        payload.idRegistro = idRegistro;
        response = await axios.post("http://localhost:8000/api/plantrabajo", payload);
      }

      const savedPlan = response.data.planTrabajo;
      setIdPlanTrabajo(savedPlan.idPlanTrabajo);

      return savedPlan.idPlanTrabajo;
    } catch (error) {
      console.error("❌ Error al guardar plan y fuentes:", error);
      alert("Error al guardar el plan de trabajo.");
      throw error;
    }
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
