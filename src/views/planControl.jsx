import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Box, Typography, Stack, Alert, CircularProgress } from "@mui/material";
import { Add, ExpandMore, ExpandLess } from "@mui/icons-material";
import ActividadCard from "../components/ActividadCard";
import FormDialogActividad from "../components/Modals/FormDialogActividad";
import CustomButton from "../components/Button";
import ConfirmDelete from "../components/confirmDelete";
import ConfirmEdit from "../components/confirmEdit";

function ProcessMapView({ idProceso, soloLectura, showSnackbar }) {
  const [actividades, setActividades] = useState([]);
  const [errors, setErrors] = useState({});
  const [activeCards, setActiveCards] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editActividad, setEditActividad] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nombreActividad: "",
    procedimiento: "",
    criterioAceptacion: "",
    caracteristicasVerificar: "",
    frecuencia: "",
    identificacionSalida: "",
    registroSalida: "",
    responsable: "",
    tratamiento: "",
    año: new Date().getFullYear()
  });

  // Función para cargar actividades
  const cargarActividades = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await axios.get(`http://localhost:8000/api/actividadcontrol/${idProceso}`);
      
      if (!response.data || response.data.length === 0) {
        setActividades([]);
        // No mostrar mensaje de "no hay datos" aquí, se maneja en el render
      } else {
        setActividades(response.data);
      }
    } catch (error) {
      console.error("Error al obtener actividades:", error);
      
      let errorMessage = "Error al cargar las actividades";
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "No se encontraron actividades";
        } else if (error.response.status >= 500) {
          errorMessage = "Error del servidor al cargar actividades";
        }
      } else if (error.request) {
        errorMessage = "Error de conexión. Verifique su internet";
      }
      
      setError(errorMessage);
      setActividades([]);
      
      if (showSnackbar) {
        showSnackbar(errorMessage, "error", "Error");
      }
    } finally {
      setLoading(false);
    }
  }, [idProceso, showSnackbar]);

  useEffect(() => {
    if (!idProceso) {
      setLoading(false);
      return;
    }
    
    cargarActividades();
  }, [idProceso, cargarActividades]);

  const validateFields = () => {
    const camposObligatorios = [
      "nombreActividad",
      "procedimiento",
      "criterioAceptacion",
      "caracteristicasVerificar",
      "frecuencia",
      "identificacionSalida",
      "registroSalida",
      "responsable",
      "tratamiento"
    ];
    let tempErrors = {};
    camposObligatorios.forEach((campo) => {
      if (!formData[campo]?.trim()) {
        tempErrors[campo] = "Este campo es obligatorio";
      }
    });
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleAddActividad = async () => {
    if (!validateFields()) {
      if (showSnackbar) {
        showSnackbar("Por favor complete todos los campos obligatorios", "error", "Error de validación");
      }
      return;
    }

    setSaving(true);
    const payload = { ...formData, idProceso, año: new Date().getFullYear() };

    try {
      const res = await axios.post("http://localhost:8000/api/actividadcontrol", payload);
      setActividades((prev) => [...prev, res.data.actividad]);
      setOpenForm(false);
      setFormData({});
      
      if (showSnackbar) {
        showSnackbar("Actividad agregada correctamente", "success", "Éxito");
      }
    } catch (error) {
      console.error("Error al agregar actividad:", error);
      
      let errorMessage = "Error al agregar actividad";
      if (error.response?.status === 400) {
        errorMessage = "Datos inválidos para crear la actividad";
      }
      
      if (showSnackbar) {
        showSnackbar(errorMessage, "error", "Error");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEditActividad = (actividad) => {
    setSelectedActividad(actividad);
    setConfirmEditOpen(true);
  };

  const confirmEdit = () => {
    setEditActividad(selectedActividad);
    setFormData(selectedActividad);
    setEditMode(true);
    setOpenForm(true);
    setConfirmEditOpen(false);
  };

  const handleUpdateActividad = async () => {
    if (!validateFields()) {
      if (showSnackbar) {
        showSnackbar("Por favor complete todos los campos obligatorios", "error", "Error de validación");
      }
      return;
    }

    setSaving(true);
    
    try {
      const res = await axios.put(`http://localhost:8000/api/actividadcontrol/${editActividad.idActividad}`, {
        ...formData,
        idProceso,
      });
      
      const updated = res.data;
      
      if (!updated || !updated.idActividad) {
        console.error("No se recibió actividad actualizada correctamente:", res.data);
        if (showSnackbar) {
          showSnackbar("Error al procesar la actividad actualizada", "error", "Error");
        }
        return;
      }
      
      setActividades((prev) =>
        prev.map((a) =>
          a.idActividad === updated.idActividad ? updated : a
        )
      );

      setActiveCards((prev) =>
        prev.map((a) =>
          a.idActividad === updated.idActividad ? updated : a
        )
      );

      setOpenForm(false);
      setEditActividad(null);
      setFormData({});
      setEditMode(false);
      
      if (showSnackbar) {
        showSnackbar("Actividad actualizada correctamente", "success", "Éxito");
      }
    } catch (error) {
      console.error("Error al actualizar actividad:", error);
      
      let errorMessage = "Error al actualizar actividad";
      if (error.response?.status === 404) {
        errorMessage = "La actividad no fue encontrada";
      } else if (error.response?.status === 400) {
        errorMessage = "Datos inválidos para actualizar";
      }
      
      if (showSnackbar) {
        showSnackbar(errorMessage, "error", "Error");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAll = () => {
    setAllExpanded(!allExpanded);
    setActiveCards(allExpanded ? [] : actividades);
  };

  const handleSelectCard = (item) => {
    if (!activeCards.some((a) => a.idActividad === item.idActividad)) {
      setActiveCards([...activeCards, item]);
    }
  };

  const handleCloseCard = (item) => {
    setActiveCards(activeCards.filter((a) => a.idActividad !== item.idActividad));
  };

  const handleDeleteActividad = (actividad) => {
    setSelectedActividad(actividad);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedActividad) return;
    
    try {
      await axios.delete(`http://localhost:8000/api/actividadcontrol/${selectedActividad.idActividad}`);
      
      setActividades((prev) =>
        prev.filter((a) => a.idActividad !== selectedActividad.idActividad)
      );
      setActiveCards((prev) =>
        prev.filter((a) => a.idActividad !== selectedActividad.idActividad)
      );
      setSelectedActividad(null);
      
      if (showSnackbar) {
        showSnackbar("Actividad eliminada correctamente", "success", "Éxito");
      }
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
      
      let errorMessage = "Error al eliminar actividad";
      if (error.response?.status === 404) {
        errorMessage = "La actividad no fue encontrada";
      }
      
      if (showSnackbar) {
        showSnackbar(errorMessage, "error", "Error");
      }
    } finally {
      setConfirmDeleteOpen(false);
    }
  };

  // Estados de carga y error
  if (loading) {
    return (
      <Box sx={{ 
        p: 4, 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "50vh",
        flexDirection: "column",
        gap: 2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Cargando actividades...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        p: 4, 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "50vh",
        flexDirection: "column",
        gap: 3
      }}>
        <Alert severity="error" sx={{ mb: 2, maxWidth: 500 }}>
          {error}
        </Alert>
        <CustomButton
          type="guardar"
          onClick={cargarActividades}
          variant="outlined"
        >
          Reintentar
        </CustomButton>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, display: "flex", minHeight: "100vh", flexDirection: "column", paddingTop: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        {/* Botón "Desplegar Todo" a la izquierda */}
        <CustomButton
          type="generar"
          onClick={handleToggleAll}
          startIcon={allExpanded ? <ExpandLess /> : <ExpandMore />}
          sx={{ minWidth: '140px' }}
          disabled={actividades.length === 0}
        >
          {allExpanded ? "Cerrar Todo" : "Desplegar Todo"}
        </CustomButton>

        {/* Título centrado */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#0056b3",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)"
          }}
        >
          Actividades de Control
        </Typography>

        {/* Espacio a la derecha para balancear */}
        <Box sx={{ minWidth: '140px' }}></Box>
      </Box>

      {/* Mensaje cuando no hay actividades */}
      {actividades.length === 0 && !loading && !error && (
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            No hay actividades de control registradas
          </Alert>
          <Typography variant="body1" color="text.secondary">
            {soloLectura 
              ? "No hay actividades disponibles para mostrar." 
              : "Puede agregar actividades usando el botón 'Añadir Actividad'."
            }
          </Typography>
        </Box>
      )}

      {/* Actividades expandidas */}
      {activeCards.length > 0 && (
        <Stack spacing={2}>
          {activeCards.map((item) => (
            <ActividadCard
              key={item.idActividad}
              actividad={item}
              isActive
              onClose={handleCloseCard}
              onEdit={handleEditActividad}
              onDelete={handleDeleteActividad}
              soloLectura={soloLectura}
            />
          ))}
        </Stack>
      )}

      {/* Actividades en vista compacta */}
      {actividades.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
          }}
        >
          {actividades
            .filter((a) => a && a.idActividad && !activeCards.some((ac) => ac.idActividad === a.idActividad))
            .map((item) => (
              <ActividadCard
                key={item.idActividad}
                actividad={item}
                onSelect={handleSelectCard}
                isSmall={activeCards.length > 0}
                onDelete={handleDeleteActividad}
                onEdit={handleEditActividad}
                soloLectura={soloLectura}
              />
            ))}
        </Box>
      )}

      {/* Botón Añadir Actividad */}
      {!soloLectura && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <CustomButton
            type="guardar"
            startIcon={<Add />}
            onClick={() => {
              setFormData({ año: new Date().getFullYear() });
              setEditMode(false);
              setOpenForm(true);
            }}
          >
            Añadir Actividad
          </CustomButton>
        </Box>
      )}

      {/* Modal de formulario */}
      <FormDialogActividad
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedActividad(null);
          setEditMode(false);
          setEditActividad(null);
          setFormData({});
        }}
        onSave={editMode ? handleUpdateActividad : handleAddActividad}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        modo={editMode ? "editar" : "crear"}
        saving={saving}
        showSnackbar={showSnackbar}
      />

      {/* Confirmación de eliminación */}
      <ConfirmDelete
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        entityType="actividad"
        entityName={selectedActividad?.nombreActividad}
        onConfirm={confirmDelete}
      />

      {/* Confirmación de edición */}
      <ConfirmEdit
        open={confirmEditOpen}
        onClose={() => setConfirmEditOpen(false)}
        entityType="actividad"
        entityName={selectedActividad?.nombreActividad}
        onConfirm={confirmEdit}
      />
    </Box>
  );
}

export default ProcessMapView;