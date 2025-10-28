import { useState } from "react";
import { Box, Typography, Divider, Alert, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TablaRegistros from "../components/TablaRegistros";
import ModalForm from "../components/Modals/ModalForm";
// import DetailsModal from "../components/Modals/DetailsModal";
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

const FuentesManager = ({ records, setRecords, soloLectura, showSnackbar }) => {
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  // const [selectedRecord, setSelectedRecord] = useState(null);
  const [form, setForm] = useState(initForm());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShowMessage = (message, type = "info", title = "") => {
    if (showSnackbar) {
      showSnackbar(message, type, title);
    }
  };

  const validateForm = () => {
    const missingFields = camposObligatorios.filter(campo => !form[campo]?.trim());

    if (missingFields.length > 0) {
      const fieldNames = {
        responsable: "Responsable",
        fechaInicio: "Fecha de inicio",
        fechaTermino: "Fecha de término",
        estado: "Estado",
        nombreFuente: "Nombre de la fuente",
        elementoEntrada: "Elemento de entrada",
        descripcion: "Descripción",
        entregable: "Entregable"
      };

      const missingNames = missingFields.map(field => fieldNames[field]).join(", ");
      handleShowMessage(
        `Los siguientes campos son obligatorios: ${missingNames}`,
        "error",
        "Campos requeridos"
      );
      return false;
    }

    // Validar fechas
    if (form.fechaInicio && form.fechaTermino) {
      const inicio = new Date(form.fechaInicio);
      const termino = new Date(form.fechaTermino);

      if (termino < inicio) {
        handleShowMessage(
          "La fecha de término no puede ser anterior a la fecha de inicio",
          "error",
          "Error de fechas"
        );
        return false;
      }
    }

    return true;
  };

  const handleOpenModal = (index = null) => {
    try {
      if (index !== null) {
        const record = records[index];
        if (!record) {
          handleShowMessage("No se encontró el registro a editar", "error", "Error");
          return;
        }
        setEditIndex(index);
        setForm({
          ...record,
          numero: record.numero || index + 1,
          noActividad: record.noActividad ?? record.numero ?? (index + 1),
        });
      } else {
        setEditIndex(null);
        const sig = Math.max(0, ...records.map(r => Number(r.noActividad ?? r.numero ?? 0))) + 1;
        setForm(initForm(sig));
      } setShowModal(true);
    } catch (err) {
      handleShowMessage("Error al abrir el formulario", "error", "Error");
    }
  };

  const handleAddOrUpdate = () => {
    if (!validateForm()) return;

    try {
      const updatedRecords = editIndex !== null
        ? records.map((r, i) => (i === editIndex ? form : r))
        : [...records, form];

      setRecords(updatedRecords);
      setShowModal(false);

      // Mostrar mensaje de éxito
      const message = editIndex !== null
        ? "Fuente actualizada correctamente"
        : "Fuente agregada correctamente";
      handleShowMessage(message, "success", "Éxito");
    } catch (err) {
      console.error("Error al guardar fuente:", err);
      handleShowMessage("Error al guardar la fuente", "error", "Error");
    }
  };

  const handleDelete = (index) => {
    try {
      const recordToDelete = records[index];
      if (!recordToDelete) {
        handleShowMessage("No se encontró el registro a eliminar", "error", "Error");
        return;
      }

      const updated = records.filter((_, idx) => idx !== index);
      setRecords(updated);
      handleShowMessage("Fuente eliminada correctamente", "success", "Eliminado");
    } catch (err) {
      console.error("Error al eliminar fuente:", err);
      handleShowMessage("Error al eliminar la fuente", "error", "Error");
    }
  };

  // ✅ Renderizado de contenido
  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Cargando fuentes...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          <Typography variant="h6" gutterBottom>
            Error al cargar
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      );
    }

    if (records.length === 0) {
      return (
        <Alert severity="info" sx={{ my: 2 }}>
          <Typography variant="h6" gutterBottom>
            No hay fuentes registradas
          </Typography>
          <Typography variant="body2">
            {!soloLectura
              ? "Puede agregar una fuente haciendo clic en 'Agregar Fuente'."
              : "No tiene permisos para agregar fuentes."
            }
          </Typography>
        </Alert>
      );
    }

    return (
      <TablaRegistros
        records={records}
        handleOpenModal={handleOpenModal}
        handleDeleteRecord={handleDelete}
        soloLectura={soloLectura}
      />
    );
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

      {renderContent()}

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

      {/* <DetailsModal
        selectedRecord={selectedRecord}
        handleCloseCardModal={() => setSelectedRecord(null)}
      /> */}
    </>
  );
};

export default FuentesManager;