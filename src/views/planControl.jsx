import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Stack } from "@mui/material";
import { Add, ExpandMore, ExpandLess } from "@mui/icons-material";
import ActividadCard from "../components/ActividadCard";
import FormDialogActividad from "../components/Modals/FormDialogActividad";
import CustomButton from "../components/Button";
import ConfirmDelete from "../components/confirmDelete";
import ConfirmEdit from "../components/confirmEdit";
import FeedbackSnackbar from "../components/Feedback";




function ProcessMapView({ idProceso, soloLectura }) {
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
  const [feedback, setFeedback] = useState({ open: false, message: "", type: "success" });

  const showFeedback = (message, type = "success") => {
    setFeedback({ open: true, message, type });
  };
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

  useEffect(() => {
    if (!idProceso) return;
    axios
      .get(`http://localhost:8000/api/actividadcontrol/${idProceso}`)
      .then((res) => setActividades(res.data))
      .catch((err) => console.error("Error al obtener actividades:", err));

  }, [idProceso]);


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
    if (!validateFields()) return;

    setSaving(true); // ← Activar loading
    const payload = { ...formData, idProceso, año: new Date().getFullYear() };

    try {
      const res = await axios.post("http://localhost:8000/api/actividadcontrol", payload);
      setActividades((prev) => [...prev, res.data.actividad]);
      setOpenForm(false);
      setFormData({});
      showFeedback("Actividad agregada correctamente", "success");
    } catch (err) {
      console.error("Error al agregar actividad:", err);
      showFeedback("Error al agregar actividad", "error");
    } finally {
      setSaving(false); // ← Desactivar loading
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
  };


  const handleUpdateActividad = () => {
    if (!validateFields()) return;
    axios
      .put(`http://localhost:8000/api/actividadcontrol/${editActividad.idActividad}`, {
        ...formData,
        idProceso,
      })
      .then((res) => {
        const updated = res.data;
        console.log("Respuesta del backend:", res.data);
        if (!updated || !updated.idActividad) {
          console.error("No se recibió actividad actualizada correctamente:", res.data);
          showFeedback("Error al procesar la actividad actualizada", "error");
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
        showFeedback("Actividad actualizada correctamente", "success");
      })

      .catch((err) => console.error("Error al actualizar actividad:", err));
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

  const confirmDelete = () => {
    if (!selectedActividad) return;
    axios
      .delete(`http://localhost:8000/api/actividadcontrol/${selectedActividad.idActividad}`)
      .then(() => {
        setActividades((prev) =>
          prev.filter((a) => a.idActividad !== selectedActividad.idActividad)
        );
        setActiveCards((prev) =>
          prev.filter((a) => a.idActividad !== selectedActividad.idActividad)
        );
        setSelectedActividad(null);
        showFeedback("Actividad eliminada correctamente", "error");
      })

      .catch((err) => console.error("Error al eliminar actividad:", err));
  };

  return (
    <Box sx={{ p: 4, display: "flex", minHeight: "100vh", flexDirection: "column", paddingTop: 1 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#0056b3", mb: 2 }}>
        Actividades de Control
      </Typography>

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

            />
          ))}
        </Stack>
      )}

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
            />
          ))}

      </Box>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
        <CustomButton
          type="generar"
          onClick={handleToggleAll}
          startIcon={allExpanded ? <ExpandLess /> : <ExpandMore />}
        >
          {allExpanded ? "Cerrar Todo" : "Desplegar Todo"}
        </CustomButton>
        {!soloLectura && (
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
        )}
      </Box>


      <FormDialogActividad
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedActividad(null);
        }}
        onSave={editMode ? handleUpdateActividad : handleAddActividad}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        modo={editMode ? "editar" : "crear"}
        saving={saving}
      />

      <ConfirmDelete
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        entityType="actividad"
        entityName={selectedActividad?.nombreActividad}
        onConfirm={confirmDelete}
      />

      <ConfirmEdit
        open={confirmEditOpen}
        onClose={() => setConfirmEditOpen(false)}
        entityType="actividad"
        entityName={selectedActividad?.nombreActividad}
        onConfirm={confirmEdit}
      />

      <FeedbackSnackbar
        open={feedback.open}
        message={feedback.message}
        type={feedback.type}
        onClose={() => setFeedback({ ...feedback, open: false })}
      />

    </Box>
  );
}

export default ProcessMapView;
