import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { usePlanTrabajo } from "../hooks/usePlanTrabajo";
import PTForm from "../components/Forms/PTForm";
import FuentesManager from "../components/FuentesManager";
import FeedbackSnackbar from "../components/Feedback";
import CustomButton from "../components/Button";

const PlanTrabajoFormV = ({ soloLectura, puedeEditar, rolActivo }) => {
  const { idRegistro } = useParams();

  const {
    formData,
    setFormData,
    records,
    setRecords,
    isFormValid,
    guardarTodo,
  } = usePlanTrabajo(idRegistro);

  const [feedback, setFeedback] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
  });

  // 🔹 Manejador de cambios mejorado
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let cleanedValue = value;
    
    // Prevenir null/undefined
    if (value === null || value === undefined) {
      cleanedValue = "";
    }
    
    // Validar fechas
    if (name.includes("fecha")) {
      if (value) {
        const date = new Date(value);
        cleanedValue = isNaN(date.getTime()) ? "" : value;
      }
    }
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: cleanedValue 
    }));
  };

  const handleSubmit = async () => {
    if (!isFormValid() && records.length === 0) {
      setFeedback({
        open: true,
        type: "warning",
        title: "Formulario incompleto",
        message: "Debes llenar al menos la información general o agregar una fuente.",
      });
      return;
    }

    try {
      // 🔹 Preparar datos para el backend
      const datosParaEnviar = {
        ...formData,
        revisadoPor: formData.revisadoPor || "",
        elaboradoPor: formData.elaboradoPor || "",
        fechaElaboracion: formData.fechaElaboracion 
          ? new Date(formData.fechaElaboracion).toISOString().split('T')[0]
          : "",
        fechaRevision: formData.fechaRevision 
          ? new Date(formData.fechaRevision).toISOString().split('T')[0]
          : "",
      };

      // 🔹 Limpieza final
      Object.keys(datosParaEnviar).forEach(key => {
        if (datosParaEnviar[key] === undefined || datosParaEnviar[key] === null) {
          datosParaEnviar[key] = "";
        }
      });

      const msg = await guardarTodo(datosParaEnviar);
      setFeedback({
        open: true,
        type: "success",
        title: "Guardado exitoso",
        message: msg,
      });
    } catch (error) {
      console.error("Error en el proceso de guardado:", error);
      
      // 🔹 Mostrar errores específicos del backend
      let errorMessage = "No se pudo guardar el plan de trabajo. Intenta nuevamente.";
      
      if (error.response?.status === 422) {
        errorMessage = "Errores de validación: ";
        const errors = error.response.data.errors || {};
        Object.values(errors).forEach(err => {
          errorMessage += Array.isArray(err) ? err.join(', ') : err;
        });
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setFeedback({
        open: true,
        type: "error",
        title: "Error al guardar",
        message: errorMessage,
      });
    }
  };

  return (
    <Box sx={{ px: 2 }}>
      <PTForm
        formData={formData}
        handleChange={handleChange} // 🔹 Usar el manejador mejorado
        soloLectura={soloLectura}
        puedeEditar={puedeEditar}
        rolActivo={rolActivo}
      />

      <FuentesManager
        records={records}
        setRecords={setRecords}
        soloLectura={soloLectura}
      />

      {!soloLectura && puedeEditar && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <CustomButton type="guardar" onClick={handleSubmit}>
            Guardar Plan de Trabajo
          </CustomButton>
        </Box>
      )}

      <FeedbackSnackbar
        open={feedback.open}
        onClose={() => setFeedback({ ...feedback, open: false })}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
      />
    </Box>
  );
};

export default PlanTrabajoFormV;