import { useState } from "react";
import {
  Box,
  Typography,
  Divider
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TablaRegistros from "../components/TablaRegistros";
import ModalForm from "../components/Modals/ModalForm";
import DetailsModal from "../components/Modals/DetailsModal";
import CustomButton from "../components/Button";

const initForm = (numero = 1) => ({
  numero,
  responsable: "",
  fechaInicio: "",
  fechaTermino: "",
  estado: "En proceso",
  nombreFuente: "",
  elementoEntrada: "",
  descripcion: "",
  entregable: ""
});

const camposObligatorios = [
  "responsable",
  "fechaInicio",
  "fechaTermino",
  "estado",
  "nombreFuente",
  "elementoEntrada",
  "descripcion",
  "entregable"
];

const FuentesManager = ({ records, setRecords, soloLectura }) => {
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form, setForm] = useState(initForm());

  const handleOpenModal = (index = null) => {
    if (index !== null) {
      const record = records[index];
      setEditIndex(index);
      setForm({ ...record, numero: record.numero || index + 1 }); // ← asegurar que numero esté
    } else {
      setEditIndex(null);
      setForm(initForm(records.length + 1));
    }
    setShowModal(true);
  };

  const handleAddOrUpdate = () => {
    const isValid = camposObligatorios.every((campo) => form[campo]?.trim?.());
    if (!isValid) return;

    const updatedRecords = editIndex !== null
      ? records.map((r, i) => (i === editIndex ? form : r))
      : [...records, form];

    setRecords(updatedRecords);
    setShowModal(false);
  };

  const handleDelete = (i) => {
    const updated = records.filter((_, idx) => idx !== i);
    setRecords(updated);
  };

  return (
    <>
      <Box sx={{ width: "100%", mt: 3, mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1 }}>
          <Typography variant="h6" color="primary">
            Fuentes del Plan de Trabajo
          </Typography>
          {!soloLectura && (
            <CustomButton
              type="guardar"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
            >
              Agregar Fuente
            </CustomButton>
          )}
        </Box>
        <Divider sx={{ mt: 1 }} />
      </Box>

      <TablaRegistros
        records={records}
        handleOpenModal={handleOpenModal}
        handleDeleteRecord={handleDelete}
        soloLectura={soloLectura}
      />

      <ModalForm
        showModal={showModal}
        setShowModal={setShowModal}
        additionalFormData={form}
        handleAdditionalChange={(e) =>
          setForm({ ...form, [e.target.name]: e.target.value })
        }
        handleAddOrUpdateRecord={handleAddOrUpdate}
        isAdditionalFormValid={() => true}
        editIndex={editIndex}
        soloLectura={soloLectura}
      />

      <DetailsModal
        selectedRecord={selectedRecord}
        handleCloseCardModal={() => setSelectedRecord(null)}
      />
    </>
  );
};

export default FuentesManager;
