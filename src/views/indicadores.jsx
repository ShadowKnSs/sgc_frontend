// src/views/indicadores.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Grid, Typography } from "@mui/material";
import IndicatorCard from "../components/CardHorizontal";
import NewIndicatorButton from "../components/NewCardButtom";
import ResultModal from "../components/Modals/ResultModal";
import ResultModalEncuesta from "../components/Modals/ResultModalEncuesta";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import AddIndicatorForm from "../components/Forms/AddIndicatorForm";
import ResultModalRetroalimentacion from "../components/Modals/ResultModalRetroalimentacion";
import IrGraficasBoton from "../components/Modals/BotonGraficas";
import ConfirmEditDialog from "../components/ConfirmEditDialog";

const IndicatorPage = ({ userType }) => {
  const [indicators, setIndicators] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [results, setResults] = useState({});
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

  const handleEdit = useCallback((id) => {
    console.log("Editar indicador:", id);
  }, []);

  const handleDeleteClick = useCallback((indicator) => {
    setIndicatorToDelete(indicator);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    const idToDelete = indicatorToDelete.id;
    setIndicators((prev) => prev.filter(ind => ind.id !== idToDelete));
    setResults((prev) => {
      const updated = { ...prev };
      delete updated[idToDelete];
      return updated;
    });
    setDeleteDialogOpen(false);
  }, [indicatorToDelete]);

  const handleCardClick = useCallback((indicator) => {
    setSelectedIndicator(indicator);
    setModalOpen(true);
  }, []);

  const handleResultRegister = useCallback((id, resultValue) => {
    setResults((prev) => ({ ...prev, [id]: resultValue }));
  }, []);

  const handleAddIndicator = useCallback(() => {
    setFormOpen(true);
  }, []);

  const handleSaveNewIndicator = useCallback((newIndicatorData) => {
    const newIndicator = {
      id: Date.now(),
      name: newIndicatorData.nombre,
      ...newIndicatorData,
    };
    setIndicators(prev => [...prev, newIndicator]);
  }, []);

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
    <div style={{ textAlign: "center", paddingBottom: "100px", maxWidth: "800px", margin: "0 auto" }}>
      <Typography variant="h1" sx={{ fontSize: "2rem", marginBottom: 2, marginTop: 3 }}>
        Indicadores
      </Typography>
      <Grid container spacing={2}>
        {indicators.map((indicator) => (
          <Grid item xs={12} sm={6} key={indicator.id} style={{ display: "flex", justifyContent: "flex-start" }}>
            <IndicatorCard
              indicator={indicator}
              userType={userType}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onCardClick={handleCardClick}
              isResultRegistered={userType !== "admin" && results.hasOwnProperty(indicator.id)}
            />
          </Grid>
        ))}
      </Grid>
      {userType === "admin" && <NewIndicatorButton onClick={handleAddIndicator} />}
      {userType === "user" && <IrGraficasBoton />}
      {renderModal()}
      {deleteDialogOpen && indicatorToDelete && (
        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          indicatorName={indicatorToDelete.name}
        />
      )}
      <AddIndicatorForm open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSaveNewIndicator} />
    </div>
  );
};

export default IndicatorPage;
