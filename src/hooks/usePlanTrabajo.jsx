import { useEffect, useState } from "react";
import axios from "axios";

export const usePlanTrabajo = (idRegistro) => {
  const [formData, setFormData] = useState({
    responsable: "",
    fechaElaboracion: "",
    objetivo: "",
    revisadoPor: "",
    fechaRevision: "",
    elaboradoPor: "",
  });

  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchPlanTrabajo = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/plantrabajo/registro/${idRegistro}`);
        const plan = response.data;

        if (plan.fuentes?.length) {
          const fuentesNumeradas = plan.fuentes.map((fuente, i) => ({
            ...fuente,
            numero: i + 1,
          }));
          setRecords(fuentesNumeradas);
        }

        if (plan) {
          setFormData({
            responsable: plan.responsable || "",
            fechaElaboracion: plan.fechaElaboracion || new Date().toISOString().slice(0, 10),
            objetivo: plan.objetivo || "",
            revisadoPor: plan.revisadoPor || "",
            fechaRevision: plan.fechaRevision || "",
            elaboradoPor: plan.elaboradoPor || "",
            idActividadMejora: plan.idActividadMejora || undefined,
          });
        } else {
          setFormData((prev) => ({
            ...prev,
            fechaElaboracion: new Date().toISOString().slice(0, 10),
          }));
        }
      } catch (error) {
        console.error("❌ Error al obtener plan de trabajo:", error);
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

  const guardarPlanTrabajo = async () => {
    try {
      const payload = {
        idRegistro,
        idActividadMejora: formData.idActividadMejora || undefined,
        responsable: formData.responsable,
        fechaElaboracion: formData.fechaElaboracion,
        objetivo: formData.objetivo,
      };

      if (formData.revisadoPor?.trim()) payload.revisadoPor = formData.revisadoPor;
      if (formData.fechaRevision?.trim()) payload.fechaRevision = formData.fechaRevision;
      if (formData.elaboradoPor?.trim()) payload.elaboradoPor = formData.elaboradoPor;

      const response = await axios.post("http://localhost:8000/api/plantrabajo", payload);
      return response.data.planTrabajo.idPlanTrabajo;
    } catch (error) {
      console.error("❌ Error al guardar plan:", error);
      alert("Error al guardar el plan de trabajo.");
      throw error;
    }
  };

  const guardarFuentes = async (idPlanTrabajo) => {
    try {
      await axios.post(`http://localhost:8000/api/plantrabajo/${idPlanTrabajo}/fuentes`, {
        fuentes: records.map(({ numero, ...rest }) => rest),
      });
    } catch (error) {
      console.error("❌ Error al guardar fuentes:", error);
      alert("Error al guardar las fuentes.");
      throw error;
    }
  };

  return {
    formData,
    setFormData,
    records,
    setRecords,
    isFormValid,
    guardarPlanTrabajo,
    guardarFuentes,
  };
};
