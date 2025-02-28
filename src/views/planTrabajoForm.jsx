import React, { useState } from "react";
import { Box, Button, Switch, FormControlLabel, Typography } from "@mui/material";
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
        handleSave={handleSave}
        handleClear={handleClear}
        isFormValid={isFormValid}
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
      <Box sx={{ mt: 2, display: "flex", marginLeft: "auto", padding:"5"}}>
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
            '&:hover': {
              backgroundColor: "#0099C3", 
            },
          }}
        >
          +
        </Button>
      </Box>
    </Box>
  );
};

export default PlanTrabajoFormV;