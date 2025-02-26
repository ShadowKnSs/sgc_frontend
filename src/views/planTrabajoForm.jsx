import React, { useState } from "react";
import { Box, Button, Switch, FormControlLabel } from "@mui/material";
import PTForm from "../components/Forms/PTForm";
import TablaRegistros from "../components/TablaRegistros";
import CardRegistros from "../components/CardRegistros";
import ModalForm from "../components/Modals/ModalForm";
import DetailsModal from "../components/Modals/DetailsModal";

const PlanTrabajoFormV = () => {
  const [formData, setFormData] = useState({
    responsable: "",
    fechaElaboracion: "",
    objetivo: "",
    revisadoPor: "",
  });
  const [formSaved, setFormSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [additionalFormData, setAdditionalFormData] = useState({
    numero: "",
    fuente: "",
    elementoEntrada: "",
    descripcionActividad: "",
    entregable: "",
    responsable: "",
    fechaInicio: "",
    fechaTermino: "",
    estado: "",
  });
  const [records, setRecords] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleAdditionalChange = (e) => setAdditionalFormData({ ...additionalFormData, [e.target.name]: e.target.value });

  const isFormValid = () => Object.values(formData).every((value) => value.trim() !== "");
  const isAdditionalFormValid = () => Object.values(additionalFormData).every((value) => value.trim() !== "");

  const handleSave = () => {
    if (!isFormValid()) return;
    setFormSaved(true);
  };

  const handleClear = () => {
    setFormData({ responsable: "", fechaElaboracion: "", objetivo: "", revisadoPor: "" });
    setFormSaved(false);
  };

  const handleOpenModal = (index = null) => {
    if (index !== null) {
      setEditIndex(index);
      setAdditionalFormData(records[index]);
    } else {
      setEditIndex(null);
      setAdditionalFormData({
        numero: "",
        fuente: "",
        elementoEntrada: "",
        descripcionActividad: "",
        entregable: "",
        responsable: "",
        fechaInicio: "",
        fechaTermino: "",
        estado: "",
      });
    }
    setShowModal(true);
  };

  const handleAddOrUpdateRecord = () => {
    if (!isAdditionalFormValid()) return;

    if (editIndex !== null) {
      const updatedRecords = [...records];
      updatedRecords[editIndex] = additionalFormData;
      setRecords(updatedRecords);
    } else {
      setRecords([...records, additionalFormData]);
    }

    setShowModal(false);
  };

  const handleDeleteRecord = (index) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
  };

  const handleViewModeChange = () => setViewMode(viewMode === "table" ? "cards" : "table");
  const handleOpenCardModal = (record) => setSelectedRecord(record);
  const handleCloseCardModal = () => setSelectedRecord(null);

  return (
    
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", mx: "auto" }}>
        <h1 style={{ textAlign: "center", color: "#1976d2", padding:5 }}>Plan de Trabajo</h1>
      <PTForm
        formData={formData}
        handleChange={handleChange}
        handleSave={handleSave}
        handleClear={handleClear}
        isFormValid={isFormValid}
      />

      {formSaved && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
            Agregar Registro
          </Button>
        </Box>
      )}

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <FormControlLabel
          control={<Switch checked={viewMode === "cards"} onChange={handleViewModeChange} />}
          label={viewMode === "cards" ? "Ver en Tarjetas" : "Ver en Tabla"}
        />
      </Box>

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
    </Box>
  );
};

export default PlanTrabajoFormV;