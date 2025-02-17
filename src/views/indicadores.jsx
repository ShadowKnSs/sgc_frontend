import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import IndicatorCard from "../components/CardHorizontal";
import NewIndicatorButton from "../components/NewCardButtom";
import ResultModal from "../components/ResultModal";
import ResultModalEncuesta from "../components/ModuloIndicadores/ResultModalEncuesta";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import AddIndicatorForm from "../components/formularioAddIndicador";
import ResultModalRetroalimentacion from "../components/ModuloIndicadores/ResultModalRetroalimentacion";
import ConfirmEditDialog from "../components/ConfirmEditDialog";

const IndicatorPage = ({ userType }) => {
  const [indicators, setIndicators] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [results, setResults] = useState({}); // Guarda: { [indicatorId]: result }
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [indicatorToDelete, setIndicatorToDelete] = useState(null);

  useEffect(() => {
    // Simulación de carga de indicadores
    setIndicators([
      { id: 1, name: "Indicador de Calidad" },
      { id: 2, name: "Indicador de Desempeño" },
    ]);
  }, []);

  const handleEdit = (id) => {
    console.log("Editar indicador:", id);
    // Lógica de edición
  };
  const handleDeleteClick = (indicator) => {
    console.log(
      "handleDeleteClick: Se seleccionó el indicador para eliminar:",
      indicator
    );
    setIndicatorToDelete(indicator);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    const idToDelete =
      typeof indicatorToDelete === "object"
        ? indicatorToDelete.id
        : indicatorToDelete;
    setIndicators((prevIndicators) =>
      prevIndicators.filter((ind) => ind.id !== idToDelete)
    );
    setResults((prevResults) => {
      const updated = { ...prevResults };
      delete updated[idToDelete];
      return updated;
    });
    setDeleteDialogOpen(false);
  };
  const handleCardClick = (indicator) => {
    setSelectedIndicator(indicator);
    setModalOpen(true);
  };

  const handleResultRegister = (id, resultValue) => {
    console.log("Resultado registrado para indicador:", id, resultValue);
    setResults((prev) => ({ ...prev, [id]: resultValue }));
  };

  // const handleAddIndicator = () => {
  //   const newIndicator = { id: Date.now(), name: 'Nuevo Indicador' };
  //   setIndicators([...indicators, newIndicator]);
  // };

  const handleAddIndicator = () => {
    setFormOpen(true);
  };

  const handleSaveNewIndicator = (newIndicatorData) => {
    // Asigna un id nuevo y agrega el indicador a la lista
    const newIndicator = {
      id: Date.now(),
      name: newIndicatorData.nombre,
      ...newIndicatorData,
    };
    setIndicators([...indicators, newIndicator]);
  };

  const renderModal = () => {
    if (!selectedIndicator) return null;

    const props = {
      open: modalOpen,
      onClose: () => setModalOpen(false),
      onSave: handleResultRegister,
      indicator: selectedIndicator,
    };

    switch (selectedIndicator.tipo) {
      case "Encuesta de Satisfacción":
        return <ResultModalEncuesta {...props} />;
        case "Retroalimentación":
          return <ResultModalRetroalimentacion {...props} />;
      default:
        return <ResultModal {...props} />;
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        paddingBottom: "100px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <Typography
        variant="h1"
        sx={{ fontSize: "2rem", marginBottom: 2, marginTop: 3 }}
      >
        Indicadores
      </Typography>
      <Grid container spacing={2}>
        {indicators.map((indicator) => (
          <Grid
            item
            xs={12}
            sm={6}
            key={indicator.id}
            style={{ display: "flex", justifyContent: "flex-start" }}
          >
            <IndicatorCard
              indicator={indicator}
              userType={(userType = "user")}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onCardClick={handleCardClick}
              // Solo para usuarios no admin se cambia a verde si se registró el resultado
              isResultRegistered={
                userType !== "admin" && results.hasOwnProperty(indicator.id)
              }
            />
          </Grid>
        ))}
      </Grid>
      {/* El botón de agregar se muestra únicamente si el usuario es admin */}
      {userType === "admin" && (
        <NewIndicatorButton onClick={handleAddIndicator} />
      )}

      {renderModal()}
      {deleteDialogOpen && indicatorToDelete && (
        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          indicatorName={indicatorToDelete.name}
        />
      )}
      <AddIndicatorForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveNewIndicator}
      />
    </div>
  );
};

export default IndicatorPage;
