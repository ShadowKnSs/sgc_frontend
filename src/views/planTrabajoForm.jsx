import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom"; // Para extraer idRegistro desde la URL
import { Box, Button, Switch, FormControlLabel, Typography } from "@mui/material";
import axios from "axios";
import PTForm from "../components/Forms/PTForm";
import TablaRegistros from "../components/TablaRegistros";
import CardRegistros from "../components/CardRegistros";
import ModalForm from "../components/Modals/ModalForm";
import DetailsModal from "../components/Modals/DetailsModal";

const PlanTrabajoFormV = () => {
  // Extraemos idRegistro de la URL
  const { idRegistro } = useParams();
  console.log("ID Registro recibido:", idRegistro);
  const location = useLocation();
  const soloLectura = location.state?.soloLectura ?? true;
  const puedeEditar = location.state?.puedeEditar ?? false;

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
        if (plan) {
          setFormData({
            responsable: plan.responsable || "",
            fechaElaboracion: plan.fechaElaboracion || new Date().toISOString().slice(0, 10),
            objetivo: plan.objetivo || "",
            revisadoPor: plan.revisadoPor || ""
          });
          if (plan.fuentes && plan.fuentes.length > 0) {
            setRecords(plan.fuentes);
          }
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
    Object.values(formData).every((value) => value.trim() !== "");
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
  const handleSubmit = () => {
    if (!isFormValid()) {
      alert("Complete el formulario principal.");
      console.log("Error: formulario principal incompleto");
      return;
    }
    if (records.length === 0) {
      alert("Agregue al menos un registro de fuente.");
      console.log("Error: no se han agregado fuentes");
      return;
    }

    const payload = {
      planTrabajo: {
        responsable: formData.responsable, // Se agrega el responsable aquí
        fechaElaboracion: formData.fechaElaboracion,
        objetivo: formData.objetivo,
        revisadoPor: formData.revisadoPor,
        actividadMejora: {
          idRegistro: idRegistro // Se utiliza el idRegistro recibido de la vista Carpetas
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
      .post("http://127.0.0.1:8000/api/plantrabajo", payload)
      .then((response) => {
        console.log("Respuesta del backend:", response.data);
        alert("Plan de trabajo guardado exitosamente");
        // Reiniciar formulario principal y fuentes
        setFormData({
          responsable: "",
          fechaElaboracion: new Date().toISOString().slice(0, 10),
          objetivo: "",
          revisadoPor: ""
        });
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
