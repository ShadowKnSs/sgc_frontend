// src/views/AdminIndicatorPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Grid, Typography, Box } from "@mui/material";
import IndicatorCard from "../components/CardIndicador";
import NewIndicatorButton from "../components/NewCardButtom";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import AddIndicatorForm from "../components/Forms/AddIndicatorForm";
import axios from "axios";

const AdminIndicatorPage = () => {
  const [indicators, setIndicators] = useState([]);
  const [results, setResults] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editIndicator, setEditIndicator] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [indicatorToDelete, setIndicatorToDelete] = useState(null);

  // Cargar indicadores
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/indicadoresconsolidados")
      .then(response => {
        const data = response.data.indicadores || [];
        const transformed = data.map(ind => ({
          ...ind,
          name: ind.nombreIndicador
        }));
        setIndicators(transformed);
      })
      .catch(error => console.error("Error fetching indicators:", error));
  }, []);

  // Obtener resultados (si es necesario para mostrar el color)
  useEffect(() => {
    if (indicators.length > 0) {
      Promise.all(
        indicators.map(ind =>
          axios.get(`http://127.0.0.1:8000/api/indicadoresconsolidados/${ind.idIndicadorConsolidado}/resultados`)
            .then(response => response.data.analisis)
            .catch(error => {
              console.error(`Error fetching result for ${ind.idIndicadorConsolidado}:`, error);
              return null;
            })
        )
      ).then(resultsArray => {
        const newResults = {};
        indicators.forEach((ind, index) => {
          if (resultsArray[index]) {
            newResults[ind.idIndicadorConsolidado] = resultsArray[index];
          }
        });
        setResults(newResults);
      });
    }
  }, [indicators]);

  const getCardBackgroundColor = (indicator) => {
    // Para admin, dejamos el fondo neutro
    return "#f5f5f5";
  };

  const handleEdit = useCallback((id) => {
    const indicator = indicators.find(ind => ind.idIndicadorConsolidado === id);
    if (indicator) {
      setEditIndicator(indicator);
      setEditFormOpen(true);
    }
  }, [indicators]);

  const handleDeleteClick = useCallback((indicator) => {
    setIndicatorToDelete(indicator);
    setDeleteDialogOpen(true);
  }, []);

  const handleAddIndicator = useCallback(() => {
    setFormOpen(true);
  }, []);

  const handleSaveNewIndicator = useCallback((newIndicatorData) => {
    axios.post("http://127.0.0.1:8000/api/indicadoresconsolidados", newIndicatorData)
      .then(response => {
        const newInd = response.data.indicador;
        newInd.name = newInd.nombreIndicador;
        setIndicators(prev => [...prev, newInd]);
        setFormOpen(false);
      })
      .catch(error => console.error("Error saving new indicator:", error));
  }, []);

  const handleSaveEditedIndicator = useCallback((editedData) => {
    axios.put(`http://127.0.0.1:8000/api/indicadoresconsolidados/${editIndicator.idIndicadorConsolidado}`, editedData)
      .then(response => {
        const updatedIndicator = response.data.indicador;
        updatedIndicator.name = updatedIndicator.nombreIndicador;
        setIndicators(prev =>
          prev.map(ind => ind.idIndicadorConsolidado === updatedIndicator.idIndicadorConsolidado ? updatedIndicator : ind)
        );
        setEditFormOpen(false);
        setEditIndicator(null);
      })
      .catch(error => console.error("Error updating indicator:", error));
  }, [editIndicator]);

  const confirmDelete = useCallback(() => {
    axios.delete(`http://127.0.0.1:8000/api/indicadoresconsolidados/${indicatorToDelete.idIndicadorConsolidado}`)
      .then(response => {
        setIndicators(prev => prev.filter(ind => ind.idIndicadorConsolidado !== indicatorToDelete.idIndicadorConsolidado));
        setResults(prev => {
          const updated = { ...prev };
          delete updated[indicatorToDelete.idIndicadorConsolidado];
          return updated;
        });
        setDeleteDialogOpen(false);
      })
      .catch(error => console.error("Error deleting indicator:", error));
  }, [indicatorToDelete]);

  return (
    <Box sx={{ padding: "16px", margin: "0 auto", maxWidth: "1200px" }}>
      <Typography variant="h3" sx={{ mb: 3, textAlign: "center", color: "primary.main" }}>
        Indicadores - Administración
      </Typography>
      <Grid container spacing={4} columnSpacing={10}>
        {indicators.map(ind => (
          <Grid item xs={12} sm={6} md={4} key={ind.idIndicadorConsolidado}>
            <IndicatorCard
              indicator={ind}
              userType="admin"
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              cardColor={getCardBackgroundColor(ind)}
        
            />
          </Grid>
        ))}
      </Grid>
      <NewIndicatorButton onClick={handleAddIndicator} />
      {deleteDialogOpen && indicatorToDelete && (
        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          indicatorName={indicatorToDelete.nombreIndicador}
        />
      )}
      <AddIndicatorForm 
        open={formOpen} 
        onClose={() => setFormOpen(false)} 
        onSave={handleSaveNewIndicator} 
      />
      {editFormOpen && editIndicator && (
        <AddIndicatorForm
          open={editFormOpen}
          onClose={() => { setEditFormOpen(false); setEditIndicator(null); }}
          onSave={handleSaveEditedIndicator}
          initialValues={{
            nombre: editIndicator.nombreIndicador,
            tipo: editIndicator.origenIndicador,
            periodicidad: editIndicator.periodicidad,
            meta: editIndicator.meta || "",
          }}
        />
      )}
    </Box>
  );
};

export default AdminIndicatorPage;
