import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Para obtener idRegistro desde la URL
import { Box, Button, Switch, FormControlLabel, Typography } from "@mui/material";
import axios from "axios";
import PTForm from "../components/Forms/PTForm";
import TablaRegistros from "../components/TablaRegistros";
import CardRegistros from "../components/CardRegistros";
import ModalForm from "../components/Modals/ModalForm";
import DetailsModal from "../components/Modals/DetailsModal";

const PlanTrabajoFormV = () => {
  // Extraemos el idRegistro desde la URL
  const { idRegistro } = useParams();
  console.log("ID Registro recibido:", idRegistro);

  // Datos principales para planTrabajo; inicializamos con valores predeterminados
  const [formData, setFormData] = useState({
    responsable: "Juan Pérez", // Puedes modificar este valor por defecto si lo deseas
    fechaElaboracion: "",
    objetivo: "Mejorar la productividad en el departamento.",
    revisadoPor: "Ana Gómez"
  });
  const [formSaved, setFormSaved] = useState(false);

  // Asignar la fecha actual automáticamente en el campo fechaElaboracion
  useEffect(() => {
    if (!formData.fechaElaboracion) {
      const currentDate = new Date().toISOString().slice(0, 10);
      console.log("Asignando fecha de elaboración:", currentDate);
      setFormData(prev => ({ ...prev, fechaElaboracion: currentDate }));
    }
  }, [formData.fechaElaboracion]);

  // Estado para controlar el modal de fuente
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Datos para cada fuente (tabla fuentept)
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

  // Arreglo de registros (fuentes) agregados localmente
  const [records, setRecords] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Manejo del formulario principal
  const handleChange = (e) => {
    console.log("Cambio en formulario principal:", e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejo de cambios en el formulario de fuentes
  const handleAdditionalChange = (e) => {
    console.log("Cambio en fuente:", e.target.name, e.target.value);
    setAdditionalFormData({ ...additionalFormData, [e.target.name]: e.target.value });
  };

  // Validación del formulario principal
  const isFormValid = () =>
    Object.values(formData).every((value) => value.trim() !== "");
  // Validación de los campos de fuente; se ignora "numero" que es autoasignado
  const isAdditionalFormValid = () =>
    additionalFormData.responsable.trim() !== "" &&
    additionalFormData.fechaInicio.trim() !== "" &&
    additionalFormData.fechaTermino.trim() !== "" &&
    additionalFormData.estado.trim() !== "" &&
    additionalFormData.nombreFuente.trim() !== "" &&
    additionalFormData.elementoEntrada.trim() !== "" &&
    additionalFormData.descripcion.trim() !== "" &&
    additionalFormData.entregable.trim() !== "";

  const handleSave = () => {
    if (!isFormValid()) {
      console.log("El formulario principal no es válido");
      return;
    }
    setFormSaved(true);
    console.log("Formulario principal guardado");
  };

  const handleClear = () => {
    console.log("Limpiando formulario principal");
    setFormData({
      responsable: "",
      fechaElaboracion: "",
      objetivo: "",
      revisadoPor: ""
    });
    setFormSaved(false);
  };

  // Abre el modal para agregar o editar una fuente
  const handleOpenModal = (index = null) => {
    if (index !== null) {
      console.log("Editando registro en el índice:", index);
      setEditIndex(index);
      setAdditionalFormData(records[index]);
    } else {
      console.log("Agregando nuevo registro de fuente");
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

  // Agrega o actualiza la fuente en la lista local
  const handleAddOrUpdateRecord = () => {
    if (!isAdditionalFormValid()) {
      console.log("El formulario de fuente no es válido");
      return;
    }

    if (editIndex !== null) {
      console.log("Actualizando registro de fuente en el índice:", editIndex, additionalFormData);
      const updatedRecords = [...records];
      updatedRecords[editIndex] = additionalFormData;
      setRecords(updatedRecords);
    } else {
      console.log("Agregando nueva fuente:", additionalFormData);
      setRecords([...records, additionalFormData]);
    }

    setShowModal(false);
  };

  // Elimina una fuente de la lista local
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

  // Función para enviar el plan de trabajo completo al backend
  const handleSubmit = () => {
    if (!isFormValid()) {
      alert("Complete el formulario principal.");
      console.log("Error: formulario principal incompleto");
      return;
    }
    if (records.length === 0) {
      alert("Agregue al menos un registro de fuente.");
      console.log("Error: No se han agregado fuentes");
      return;
    }

    const payload = {
      planTrabajo: {
        fechaElaboracion: formData.fechaElaboracion,
        objetivo: formData.objetivo,
        revisadoPor: formData.revisadoPor,
        actividadMejora: {
          idRegistro: idRegistro
        }
      },
      fuentes: records.map((record) => ({
        responsable: record.responsable,
        fechaInicio: record.fechaInicio,
        fechaTermino: record.fechaTermino,
        estado: record.estado,
        nombreFuente: record.nombreFuente,
        elementoEntrada: record.elementoEntrada,
        descripcion: record.descripcion,
        entregable: record.entregable
      }))
    };

    console.log("Enviando payload al backend:", payload);
    axios
      .post("/api/plantrabajo", payload)
      .then((response) => {
        console.log("Respuesta del backend:", response.data);
        alert("Plan de trabajo guardado exitosamente");
        handleClear();
        setRecords([]);
      })
      .catch((error) => {
        console.error("Error al guardar:", error);
        alert("Hubo un error al guardar el plan de trabajo");
      });
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

      <PTForm
        formData={formData}
        handleChange={handleChange}
      />

      {records.length > 0 && viewMode === "table" && (
        <TablaRegistros
          records={records}
          handleOpenModal={handleOpenModal}
          handleDeleteRecord={handleDeleteRecord}
        />
      )}

      {records.length > 0 && viewMode === "cards" && (
        <CardRegistros
          records={records}
          handleOpenModal={handleOpenModal}
          handleDeleteRecord={handleDeleteRecord}
          handleOpenCardModal={handleOpenCardModal}
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
      />

      <DetailsModal
        selectedRecord={selectedRecord}
        handleCloseCardModal={handleCloseCardModal}
      />

      <Box sx={{ mt: 2, display: "flex", marginLeft: "auto", padding: "5px" }}>
        <Button
          variant="contained"
          onClick={() => {
            console.log("Abriendo modal para agregar fuente");
            handleOpenModal();
          }}
          sx={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            fontSize: 30,
            minWidth: "auto",
            backgroundColor: "#00B2E3",
            "&:hover": { backgroundColor: "#0099C3" },
          }}
        >
          +
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ ml: 2 }}>
          Enviar
        </Button>
      </Box>
    </Box>
  );
};

export default PlanTrabajoFormV;
