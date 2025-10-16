import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import { usePlanTrabajo } from "../hooks/usePlanTrabajo";
import PTForm from "../components/Forms/PTForm";
import FuentesManager from "../components/FuentesManager";
import FeedbackSnackbar from "../components/Feedback";
import CustomButton from "../components/Button";

const PlanTrabajoFormV = ({ soloLectura, puedeEditar, rolActivo, showSnackbar }) => {
  const { idRegistro } = useParams();

  const {
    formData,
    setFormData,
    records,
    setRecords,
    isFormValid,
    guardarTodo,
    loading,
    error,
    loadData
  } = usePlanTrabajo(idRegistro);

  const [feedback, setFeedback] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
  });

  const [saving, setSaving] = useState(false);
  const [hasData, setHasData] = useState(false);

  // ✅ Función para manejar snackbar local si no viene del padre
  const handleLocalSnackbar = (message, type = "info", title = "") => {
    if (showSnackbar) {
      showSnackbar(message, type, title);
    } else {
      setFeedback({ open: true, type, title, message });
    }
  };

  // ✅ Función para cerrar snackbar local
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setFeedback({ ...feedback, open: false });
  };

  // ✅ Verificar si hay datos
  useEffect(() => {
    const checkData = () => {
      const formHasData = formData && Object.keys(formData).some(key => 
        formData[key] && formData[key].toString().trim() !== ""
      );
      const hasRecords = records && records.length > 0;
      setHasData(formHasData || hasRecords);
    };

    checkData();
  }, [formData, records]);

  // ✅ Manejador de cambios mejorado
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

  // ✅ Manejo de envío mejorado
  const handleSubmit = async () => {
    if (!isFormValid() && records.length === 0) {
      handleLocalSnackbar(
        "Debes llenar al menos la información general o agregar una fuente.", 
        "warning", 
        "Formulario incompleto"
      );
      return;
    }

    setSaving(true);
    try {
      // Preparar datos para el backend
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

      // Limpieza final
      Object.keys(datosParaEnviar).forEach(key => {
        if (datosParaEnviar[key] === undefined || datosParaEnviar[key] === null) {
          datosParaEnviar[key] = "";
        }
      });

      const msg = await guardarTodo(datosParaEnviar);
      handleLocalSnackbar(msg, "success", "Guardado exitoso");
    } catch (error) {
      console.error("Error en el proceso de guardado:", error);
      
      // Mostrar errores específicos del backend
      let errorMessage = "No se pudo guardar el plan de trabajo. Intenta nuevamente.";
      
      if (error.response?.status === 422) {
        errorMessage = "Errores de validación: ";
        const errors = error.response.data.errors || {};
        Object.values(errors).forEach(err => {
          errorMessage += Array.isArray(err) ? err.join(', ') : err;
        });
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = "Error de conexión. Verifique su internet.";
      }
      
      handleLocalSnackbar(errorMessage, "error", "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Renderizado de estados
  const renderContent = () => {
    // Estado de carga
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh" flexDirection="column">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Cargando plan de trabajo...
          </Typography>
        </Box>
      );
    }

    // Estado de error
    if (error) {
      return (
        <Box sx={{ textAlign: "center", my: 4, p: 3 }}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              '& .MuiAlert-message': { textAlign: 'left' }
            }}
          >
            <Typography variant="h6" gutterBottom>
              Error al cargar
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
          </Alert>
          <CustomButton
            type="guardar"
            onClick={loadData}
            variant="outlined"
          >
            Reintentar
          </CustomButton>
        </Box>
      );
    }

    // Estado sin datos
    if (!hasData && !loading) {
      return (
        <Box sx={{ textAlign: "center", my: 4, p: 3 }}>
          <Alert 
            severity="info" 
            sx={{ 
              mb: 2,
              '& .MuiAlert-message': { textAlign: 'left' }
            }}
          >
            <Typography variant="h6" gutterBottom>
              No hay datos del plan de trabajo
            </Typography>
            <Typography variant="body2">
              {puedeEditar && !soloLectura
                ? "Puede comenzar llenando la información general o agregando una fuente."
                : "No tiene permisos para editar este plan de trabajo."
              }
            </Typography>
          </Alert>
        </Box>
      );
    }

    // Contenido normal
    return (
      <>
        <PTForm
          formData={formData}
          handleChange={handleChange}
          soloLectura={soloLectura}
          puedeEditar={puedeEditar}
          rolActivo={rolActivo}
        />

        <FuentesManager
          records={records}
          setRecords={setRecords}
          soloLectura={soloLectura}
          showSnackbar={handleLocalSnackbar}
        />

        {!soloLectura && puedeEditar && (
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <CustomButton 
              type="guardar" 
              onClick={handleSubmit}
              loading={saving}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar Plan de Trabajo"}
            </CustomButton>
          </Box>
        )}
      </>
    );
  };

  return (
    <Box sx={{ px: 2 }}>
      {renderContent()}

      {/* ✅ Snackbar local (solo si no se usa el del padre) */}
      {!showSnackbar && (
        <FeedbackSnackbar
          open={feedback.open}
          onClose={handleCloseSnackbar}
          type={feedback.type}
          title={feedback.title}
          message={feedback.message}
          autoHideDuration={6000}
        />
      )}
    </Box>
  );
};

export default PlanTrabajoFormV;