// src/views/AdminIndicatorPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Grid, Typography, Box } from "@mui/material";
import IndicatorCard from "../components/CardIndicador";
import NewIndicatorButton from "../components/NewCardButtom";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import ConfirmEditDialog from "../components/ConfirmEditDialog";
import AddIndicatorForm from "../components/Forms/AddIndicatorForm";
import axios from "axios";


const AdminIndicatorPage = () => {
  
  const [indicators, setIndicators] = useState([]);
  const [results, setResults] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editIndicator, setEditIndicator] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(null);


  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [indicatorToDelete, setIndicatorToDelete] = useState(null);

  // Cargar indicadores
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/indicadoresconsolidados")
      .then(response => {
        const data = response.data.indicadores || [];
        const transformed = data.map(ind => ({
          ...ind,
          name: ind.nombreIndicador,
          origen: ind.origenIndicador
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


  //Crear
  const handleAddIndicator = useCallback(() => {
    console.log("Abriendo formulario de creación");
    setFormOpen(true);
  }, []);
 
  //Guardar Indicador
  const handleSaveNewIndicator = useCallback((newIndicatorData) => {
    console.log("Guardando indicador nuevo:", newIndicatorData);
    axios.post("http://127.0.0.1:8000/api/indicadoresconsolidados", newIndicatorData)
      .then(response => {
        const newInd = response.data.indicador;
        newInd.name = newInd.nombreIndicador;
        setIndicators(prev => [...prev, newInd]);
        setFormOpen(false);
      })
      .catch(error => console.error("Error saving new indicator:", error));
  }, []);

  // Editar
   const handleEdit = useCallback((id) => {
    console.log("handleEdit -> ID:", id);
    const indicator = indicators.find(ind => ind.idIndicadorConsolidado === id);
    if (indicator) {
      setEditIndicator(indicator);
      setEditFormOpen(true);
    }
  }, [indicators]);

  const handleRequestEditIndicator = (editedData) => {
    console.log("handleRequestEditIndicator ->", editedData);
    // Guardamos la data que el usuario llenó
    setPendingChanges({
      ...editedData,
      idIndicadorConsolidado: editIndicator.idIndicadorConsolidado,
    });

    // Cerramos el form
    setEditFormOpen(false);

    console.log("Abriendo diálogo de confirmación de edición");

    // Abrimos el dialog de confirmación
    setEditDialogOpen(true);
  };

  const handleSaveEditedIndicator = (editedData) => {
    const indicadorId = editedData.idIndicadorConsolidado;

    axios.put(`http://127.0.0.1:8000/api/indicadoresconsolidados/${indicadorId}`, editedData)
      .then(response => {
        const updatedIndicator = response.data.indicador;
        updatedIndicator.name = updatedIndicator.nombreIndicador;
        setIndicators(prev =>
          prev.map(ind => ind.idIndicadorConsolidado === updatedIndicator.idIndicadorConsolidado ? updatedIndicator : ind)
        );
        setEditFormOpen(false);
      })
      .catch(error => console.error("Error updating indicator:", error));
  };

  const confirmEdit = () => {
    console.log("confirmEdit -> pendingChanges:", pendingChanges, "editIndicator:", editIndicator);
    if (!pendingChanges) return;

    // Llamamos a la lógica real de PUT
    handleSaveEditedIndicator(pendingChanges);

    // Cerramos el confirm
    setEditDialogOpen(false);
    setPendingChanges(null);
    setEditIndicator(null);

  };

  const handleDeleteClick = useCallback((indicator) => {
    setIndicatorToDelete(indicator);
    setDeleteDialogOpen(true);
  }, []);

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
          <Grid item xs={12} sm={6} md={3} key={ind.idIndicadorConsolidado}>
            <IndicatorCard
              indicator={ind}
              userType="admin"
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </Grid>
        ))}
      </Grid>

      <NewIndicatorButton onClick={handleAddIndicator} />

      {/* Form para Crear */}
      <AddIndicatorForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveNewIndicator}
      />

      {/* Form para Editar */}
      {editFormOpen && editIndicator && (
        <AddIndicatorForm
          open={editFormOpen}
          onClose={() => {
            setEditFormOpen(false);
            setEditIndicator(null);
          }}
          // En vez de "onSave={handleSaveEditedIndicator}", usamos "handleRequestEditIndicator"
          onSave={handleRequestEditIndicator}
          initialValues={{
            nombre: editIndicator.nombreIndicador,
            tipo: editIndicator.origenIndicador,
            periodicidad: editIndicator.periodicidad,
            meta: editIndicator.meta || "",
          }}
        />
      )}

      {/* Confirmar Eliminación */}
      {deleteDialogOpen && indicatorToDelete && (
        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          itemName={indicatorToDelete.nombreIndicador}
        />
      )}

      {/* Confirmar Edición */}
      {editDialogOpen && (
        <ConfirmEditDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onConfirm={confirmEdit}
          itemName={editIndicator?.nombreIndicador || "Este indicador"}
        />
      )}
    </Box>
  );
};

export default AdminIndicatorPage;
