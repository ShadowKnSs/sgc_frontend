import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import FormularioProyMejora from "../components/Forms/FormProyMejora";
import DetalleProyectoModal from "../components/Modals/DetalleProyectoModal";
import CustomButton from "../components/Button";
import { useProyectosMejora } from "../hooks/useProyectosMejora";
import FeedbackSnackbar from "../components/Feedback";

function ProyectoMejoraContainer({ soloLectura, puedeEditar, showSnackbar }) {
  const { idRegistro } = useParams();

  const {
    proyectos,
    loading,
    error,
    hasProyectos,
    refetch,
    deleteProyecto,
  } = useProyectosMejora(idRegistro, showSnackbar);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
  });

  const handleLocalSnackbar = (message, type = "info", title = "") => {
    if (showSnackbar) {
      showSnackbar(message, type, title);
    } else {
      setSnackbar({ open: true, type, title, message });
    }
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };

  const handleDeleteProyecto = async (proyecto) => {
    const success = await deleteProyecto(proyecto.idProyectoMejora);
    if (success) setProyectoSeleccionado(null);
  };

  const handleSaved = () => {
    setMostrarFormulario(false);
    refetch();
    handleLocalSnackbar("Proyecto guardado correctamente", "success", "Éxito");
  };

  const handleCancel = () => {
    setMostrarFormulario(false);
    handleLocalSnackbar("Creación de proyecto cancelada", "info", "Cancelado");
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            my: 4,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Cargando proyectos de mejora...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Alert
            severity="error"
            sx={{ mb: 2, "& .MuiAlert-message": { textAlign: "left" } }}
          >
            <Typography variant="h6" gutterBottom>
              Error al cargar
            </Typography>
            <Typography variant="body2">{error}</Typography>
          </Alert>
          <CustomButton type="guardar" onClick={refetch} variant="outlined">
            Reintentar
          </CustomButton>
        </Box>
      );
    }

    if (!hasProyectos && !mostrarFormulario) {
      return (
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Alert
            severity="info"
            sx={{ mb: 2, "& .MuiAlert-message": { textAlign: "left" } }}
          >
            <Typography variant="h6" gutterBottom>
              No hay proyectos de mejora
            </Typography>
            <Typography variant="body2">
              {puedeEditar && !soloLectura
                ? "Puede crear un nuevo proyecto de mejora haciendo clic en el botón 'Nuevo Proyecto de Mejora'."
                : "No tiene permisos para crear proyectos de mejora."}
            </Typography>
          </Alert>
        </Box>
      );
    }

    if (mostrarFormulario) {
      return (
        <FormularioProyMejora
          idRegistro={idRegistro}
          soloLectura={soloLectura}
          puedeEditar={puedeEditar}
          onCancel={handleCancel}
          onSaved={handleSaved}
          showSnackbar={handleLocalSnackbar}
        />
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mt: 2,
          justifyContent: proyectos.length === 1 ? "flex-start" : "center",
        }}
      >
        {proyectos.map((proj) => (
          <Card
            key={proj.idProyectoMejora}
            sx={{
              width: 250,
              cursor: "pointer",
              borderRadius: 3,
              boxShadow: 3,
              transition: "transform 0.3s ease-in-out",
              "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
            }}
            onClick={() => setProyectoSeleccionado(proj)}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {proj.noMejora != null
                  ? `Mejora #${proj.noMejora}`
                  : "Proyecto sin número"}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, minHeight: "60px" }}>
                {proj.descripcionMejora
                  ? `${proj.descripcionMejora.slice(0, 80)}${
                      proj.descripcionMejora.length > 80 ? "..." : ""
                    }`
                  : "Sin descripción"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: "block", mt: 1, color: "text.secondary" }}
              >
                <strong>Responsable:</strong>{" "}
                {proj.responsable || "No definido"}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      {!soloLectura && !mostrarFormulario && (
        <CustomButton
          type="guardar"
          startIcon={<Add />}
          onClick={() => setMostrarFormulario(true)}
          disabled={loading}
        >
          Nuevo Proyecto de Mejora
        </CustomButton>
      )}

      {renderContent()}

      <DetalleProyectoModal
        open={!!proyectoSeleccionado}
        onClose={() => setProyectoSeleccionado(null)}
        proyecto={proyectoSeleccionado}
        onDelete={handleDeleteProyecto}
        soloLectura={soloLectura}
        puedeEditar={puedeEditar}
        showSnackbar={handleLocalSnackbar}
      />

      {!showSnackbar && (
        <FeedbackSnackbar
          open={snackbar.open}
          onClose={handleCloseSnackbar}
          type={snackbar.type}
          title={snackbar.title}
          message={snackbar.message}
          autoHideDuration={6000}
        />
      )}
    </Box>
  );
}

export default ProyectoMejoraContainer;
