/**
 * Vista: PlanTrabajoFormV
 * Descripción:
 * Permite crear, visualizar y editar un Plan de Trabajo relacionado con un `idRegistro` de un proceso.
 * El formulario principal recoge datos del plan y se complementa con múltiples registros llamados "fuentes",
 * que se pueden añadir, editar y eliminar mediante un modal.

 * Funcionalidades clave:
 * - Carga el plan de trabajo existente desde el backend, si ya fue registrado.
 * - Permite llenar datos del plan de trabajo: responsable, objetivo, fechas, revisado por, etc.
 * - Permite agregar múltiples fuentes relacionadas con el plan, cada una con campos detallados.
 * - Las fuentes pueden visualizarse en vista tipo tabla o tipo tarjeta (toggle con `Switch`).
 * - Modal reutilizable para agregar/editar fuentes (`ModalForm`) y ver detalles (`DetailsModal`).
 * - Guarda el plan de trabajo (`POST /api/plantrabajo`) y luego las fuentes (`POST /api/plantrabajo/:id/fuentes`).
 * - Verificación y validación de formularios antes del envío.
 * - Componente adaptable a modos de solo lectura (`soloLectura`) y permisos de edición (`puedeEditar`).

 * Navegación:
 * - El `idRegistro` se obtiene desde la URL utilizando `useParams`.

 * Estado local:
 * - `formData`: Datos del formulario principal.
 * - `records`: Lista de fuentes añadidas al plan de trabajo.
 * - `viewMode`: Vista activa ("table" o "cards").
 * - `selectedRecord`: Fuente seleccionada para ver en detalle.
 * - `showModal`, `editIndex`: Control del formulario modal de fuentes.

 * Componentes personalizados:
 * - `PTForm`: Formulario principal del plan de trabajo.
 * - `TablaRegistros` y `CardRegistros`: Vista de las fuentes en tabla o tarjeta.
 * - `ModalForm`: Modal para crear o editar una fuente.
 * - `DetailsModal`: Modal para ver el detalle de una fuente.
 * - `Title`, `Switch`, `Snackbar`, `Button`, etc. (Material UI)
 *
 * Endpoints utilizados:
 * - `GET /api/plantrabajo/registro/:idRegistro` → obtener plan de trabajo existente.
 * - `POST /api/plantrabajo` → guardar el plan principal.
 * - `POST /api/plantrabajo/:idPlanTrabajo/fuentes` → guardar fuentes relacionadas.
 */

import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom"; // Para extraer idRegistro desde la URL
import { Box, Button, Switch, FormControlLabel, Typography } from "@mui/material";
import axios from "axios";
import PTForm from "../components/Forms/PTForm";
import TablaRegistros from "../components/TablaRegistros";
import CardRegistros from "../components/CardRegistros";
import ModalForm from "../components/Modals/ModalForm";
import DetailsModal from "../components/Modals/DetailsModal";

const PlanTrabajoFormV = ({soloLectura, puedeEditar}) => {
  // Extraemos idRegistro de la URL
  const { idRegistro } = useParams();
  console.log("ID Registro recibido:", idRegistro);
  const location = useLocation();
  

  // Estado del formulario principal (se llenará con datos desde el backend)
  const [formData, setFormData] = useState({
    responsable: "", // Vacío, se llenará con los datos de la base
    fechaElaboracion: "",
    objetivo: "",
    revisadoPor: ""
  });
  const [formSaved, setFormSaved] = useState(false);

  // Consulta el backend para traer el plan de trabajo existente para este idRegistro
  useEffect(() => {
    const fetchPlanTrabajo = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/plantrabajo/registro/${idRegistro}`);
        console.log("Plan de trabajo obtenido del backend:", response.data);
        const plan = response.data;
        if (plan.fuentes && plan.fuentes.length > 0) {
          // Agrega el número al volver a cargar
          const fuentesConNumero = plan.fuentes.map((fuente, i) => ({
            ...fuente,
            numero: i + 1
          }));
          setRecords(fuentesConNumero);
        }
        
        if (plan) {
          setFormData({
            responsable: plan.responsable || "",
            fechaElaboracion: plan.fechaElaboracion || new Date().toISOString().slice(0, 10),
            objetivo: plan.objetivo || "",
            revisadoPor: plan.revisadoPor || "",
            fechaRevision: plan.fechaRevision || "",
            elaboradoPor: plan.elaboradoPor || ""
          });
          
        } else {
          // Si no existe plan, asigna la fecha actual
          const currentDate = new Date().toISOString().slice(0, 10);
          setFormData(prev => ({ ...prev, fechaElaboracion: currentDate }));
        }
      } catch (error) {
        console.error("Error al obtener el plan de trabajo:", error);
        const currentDate = new Date().toISOString().slice(0, 10);
        setFormData(prev => ({ ...prev, fechaElaboracion: currentDate }));
      }
    };

    if (idRegistro) {
      fetchPlanTrabajo();
    }
  }, [idRegistro]);

  // Estados para el modal y fuentes
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [additionalFormData, setAdditionalFormData] = useState({
    numero: "",
    responsable: "",
    fechaInicio: "",
    fechaTermino: "",
    estado: "En proceso",
    nombreFuente: "",
    elementoEntrada: "",
    descripcion: "",
    entregable: ""
  });
  const [records, setRecords] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleChange = (e) => {
    console.log("Cambio en formulario principal:", e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdditionalChange = (e) => {
    console.log("Cambio en fuente:", e.target.name, e.target.value);
    setAdditionalFormData({ ...additionalFormData, [e.target.name]: e.target.value });
  };

  const isFormValid = () =>
    formData.responsable.trim() !== "" &&
    formData.fechaElaboracion.trim() !== "" &&
    formData.objetivo.trim() !== "";
  const isAdditionalFormValid = () =>
    additionalFormData.responsable.trim() !== "" &&
    additionalFormData.fechaInicio.trim() !== "" &&
    additionalFormData.fechaTermino.trim() !== "" &&
    additionalFormData.estado.trim() !== "" &&
    additionalFormData.nombreFuente.trim() !== "" &&
    additionalFormData.elementoEntrada.trim() !== "" &&
    additionalFormData.descripcion.trim() !== "" &&
    additionalFormData.entregable.trim() !== "";

  const handleOpenModal = (index = null) => {
    if (index !== null) {
      console.log("Editando fuente en el índice:", index);
      setEditIndex(index);
      setAdditionalFormData(records[index]);
    } else {
      console.log("Agregando nueva fuente");
      setEditIndex(null);
      setAdditionalFormData({
        numero: records.length + 1,
        responsable: "",
        fechaInicio: "",
        fechaTermino: "",
        estado: "En proceso",
        nombreFuente: "",
        elementoEntrada: "",
        descripcion: "",
        entregable: ""
      });
    }
    setShowModal(true);
  };

  const handleAddOrUpdateRecord = () => {
    if (!isAdditionalFormValid()) {
      console.log("El formulario de fuente no es válido");
      return;
    }
    if (editIndex !== null) {
      console.log("Actualizando fuente en el índice:", editIndex, additionalFormData);
      const updatedRecords = [...records];
      updatedRecords[editIndex] = additionalFormData;
      setRecords(updatedRecords);
    } else {
      console.log("Agregando nueva fuente:", additionalFormData);
      setRecords([...records, additionalFormData]);
    }
    setShowModal(false);
  };

  const handleDeleteRecord = (index) => {
    console.log("Eliminando fuente en el índice:", index);
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
  };

  const handleViewModeChange = () => {
    const newMode = viewMode === "table" ? "cards" : "table";
    setViewMode(newMode);
    console.log("Cambiando modo de vista a:", newMode);
  };

  const handleOpenCardModal = (record) => {
    console.log("Abriendo modal de detalles para:", record);
    setSelectedRecord(record);
  };

  const handleCloseCardModal = () => {
    console.log("Cerrando modal de detalles");
    setSelectedRecord(null);
  };

  // Construye el payload y lo envía al backend
  const guardarPlanTrabajo = async () => {
    try {
      const payload = {
        idRegistro,
        idActividadMejora: formData.idActividadMejora || undefined,
        responsable: formData.responsable,
        fechaElaboracion: formData.fechaElaboracion,
        objetivo: formData.objetivo,
      };
      
      // Agregar campos opcionales solo si existen
      if (formData.revisadoPor?.trim()) payload.revisadoPor = formData.revisadoPor;
      if (formData.fechaRevision?.trim()) payload.fechaRevision = formData.fechaRevision;
      if (formData.elaboradoPor?.trim()) payload.elaboradoPor = formData.elaboradoPor;
      console.log("Payload enviado:", payload);
      const response = await axios.post("http://localhost:8000/api/plantrabajo", payload);
      console.log("Plan guardado:", response.data);
  
      return response.data.planTrabajo.idPlanTrabajo;
    } catch (error) {
      console.error("Error al guardar plan de trabajo:", error);
      alert("Error al guardar el plan de trabajo.");
      throw error;
    }
  };

  const guardarFuentes = async (idPlanTrabajo) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/plantrabajo/${idPlanTrabajo}/fuentes`, {
        fuentes: records.map(({ numero, ...rest }) => rest)
      });
      console.log("Fuentes guardadas:", response.data);
      return true;
    } catch (error) {
      console.error("Error al guardar fuentes:", error);
      alert("Error al guardar las fuentes.");
      throw error;
    }
  };
  
  const handleSubmit = async () => {
    if (!isFormValid() && records.length === 0) {
      alert("Debes llenar al menos el formulario principal o agregar una fuente.");
      return;
    }
    
    try {
      const idPlanTrabajo = await guardarPlanTrabajo();
      await guardarFuentes(idPlanTrabajo);
  
      alert("Plan de trabajo y fuentes guardados exitosamente.");
      // Opcional: reset
      setRecords([]);
      setFormData({ responsable: "", fechaElaboracion: "", objetivo: "", revisadoPor: "" });
    } catch (error) {
      console.error("Error en el proceso de guardado:", error);
    }
  };


  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", width: "100%", padding: 2 }}>
        <Typography variant="h4" sx={{ color: "#1976d2", flex: 1, textAlign: "center" }}>
          Plan de Trabajo
        </Typography>
      </Box>
      <Box sx={{ marginLeft: "auto" }}>
        <FormControlLabel
          control={<Switch checked={viewMode === "cards"} onChange={handleViewModeChange} />}
          label={viewMode === "cards" ? "Ver en Tarjetas" : "Ver en Tabla"}
        />
      </Box>

      <PTForm formData={formData} handleChange={handleChange} soloLectura={soloLectura}
      />

      {records.length > 0 && viewMode === "table" && (
        <TablaRegistros records={records} handleOpenModal={handleOpenModal} handleDeleteRecord={handleDeleteRecord} soloLectura={soloLectura}
        />
      )}

      {records.length > 0 && viewMode === "cards" && (
        <CardRegistros
          records={records}
          handleOpenModal={handleOpenModal}
          handleDeleteRecord={handleDeleteRecord}
          handleOpenCardModal={handleOpenCardModal}
          soloLectura={soloLectura}

        />
      )}

      <ModalForm
        showModal={showModal}
        setShowModal={setShowModal}
        additionalFormData={additionalFormData}
        handleAdditionalChange={handleAdditionalChange}
        handleAddOrUpdateRecord={handleAddOrUpdateRecord}
        isAdditionalFormValid={isAdditionalFormValid}
        editIndex={editIndex}
        soloLectura={soloLectura}

      />

      <DetailsModal selectedRecord={selectedRecord} handleCloseCardModal={handleCloseCardModal} />

      {!soloLectura && puedeEditar && (
        <Box sx={{ mt: 2, display: "flex", marginLeft: "auto", padding: "5px" }}>
          <Button
            variant="contained"
            onClick={() => handleOpenModal()}
            sx={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              fontSize: 30,
              minWidth: "auto",
              backgroundColor: "#00B2E3",
              "&:hover": { backgroundColor: "#0099C3" }
            }}
          >
            +
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ ml: 2 }}>
            Enviar
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PlanTrabajoFormV;
