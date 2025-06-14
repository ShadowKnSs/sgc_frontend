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
    guardarTodo, // nuevo método único
  } = usePlanTrabajo(idRegistro);

  const [feedback, setFeedback] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
  });

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
      const msg = await guardarTodo();
      setFeedback({
        open: true,
        type: "success",
        title: "Guardado exitoso",
        message: msg,
      });
    } catch (error) {
      console.error("Error en el proceso de guardado:", error);
      setFeedback({
        open: true,
        type: "error",
        title: "Error al guardar",
        message: "No se pudo guardar el plan de trabajo. Intenta nuevamente.",
      });
    }
  };

  return (
    <Box sx={{ px: 2 }}>
      <PTForm
        formData={formData}
        handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
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
