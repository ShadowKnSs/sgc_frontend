// src/views/indicadores.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Grid, Typography } from "@mui/material";
import IndicatorCard from "../components/CardHorizontal";
import NewIndicatorButton from "../components/NewCardButtom";
import ResultModalSimple from "../components/Modals/ResultModalSimple";
import ResultModalEncuesta from "../components/Modals/ResultModalEncuesta";
import ResultModalRetroalimentacion from "../components/Modals/ResultModalRetroalimentacion";
import ResultModalSemestralDual from "../components/Modals/ResultModalSemestralDual";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import AddIndicatorForm from "../components/Forms/AddIndicatorForm";
import IrGraficasBoton from "../components/Modals/BotonGraficas";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import ResultModalEvaluaProveedores from "../components/Modals/ResultModalEvaluacion";

const IndicatorPage = ({ userType }) => {
  const [indicators, setIndicators] = useState([]);
  const [results, setResults] = useState({}); // Clave: idIndicadorConsolidado -> objeto analisis
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [indicatorToDelete, setIndicatorToDelete] = useState(null);
  //const navigate = useNavigate();

  // Cargar indicadores desde el backend
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/indicadoresconsolidados`)
      .then(response => {
        const data = response.data.indicadores || [];
        const transformed = data.map(ind => ({
          ...ind,
          name: ind.nombreIndicador
        }));
        setIndicators(transformed);
      })
      .catch(error => {
        console.error("Error fetching indicators:", error);
      });
  }, []);

  // Para cada indicador, consultar sus resultados
  useEffect(() => {
    if (indicators.length > 0) {
      Promise.all(
        indicators.map(ind =>
          axios.get(`http://127.0.0.1:8000/api/indicadoresconsolidados/${ind.idIndicadorConsolidado}/resultados`)
            .then(response => response.data.analisis)
            .catch(error => {
              console.error("Error fetching result for ${ind.idIndicadorConsolidado}:", error);
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

  // Función para determinar el color de la tarjeta según el resultado
  const getCardBackgroundColor = (indicator) => {
    if (userType === "admin") return "#f5f5f5";
    const res = results[indicator.idIndicadorConsolidado] || {};
    if (!res || Object.keys(res).length === 0) return "#f5f5f5";
    // Si el indicador es de evaluación de proveedores, chequeamos que existan todos los valores
  if (indicator.origenIndicador === "EvaluaProveedores") {
    // Suponiendo que los valores guardados sean nulos si no se han registrado y tengan algún valor (incluyendo 0) si están completos.
    // Si consideras que 0 es un valor válido, puedes usar una comprobación específica
    const { confiable, condicionado, noConfiable } = res;
    if (confiable !== null && condicionado !== null && noConfiable !== null) {
      return "lightgreen";
    }
    return "#f5f5f5";
  }
    const period = indicator.periodicidad.toLowerCase().trim();
    if (period === "anual") {
      return res.resultadoSemestral1 ? "lightgreen" : "#f5f5f5";
    } else if (period === "semestral") {
      let r1 = "";
      let r2 = "";
      if (res["Ene-Jun"]) {
        r1 = res["Ene-Jun"].resultado !== undefined ? res["Ene-Jun"].resultado.toString() : "";
      } else {
        r1 = res.resultadoSemestral1 !== null && res.resultadoSemestral1 !== undefined
          ? res.resultadoSemestral1.toString()
          : "";
      }
      if (res["Jul-Dic"]) {
        r2 = res["Jul-Dic"].resultado !== undefined ? res["Jul-Dic"].resultado.toString() : "";
      } else {
        r2 = res.resultadoSemestral2 !== null && res.resultadoSemestral2 !== undefined
          ? res.resultadoSemestral2.toString()
          : "";
      }
      if (r1 !== "" && r2 !== "") return "lightgreen";
      if (r1 !== "" && r2 === "") return "yellow";
      return "#f5f5f5";
    }
    return "#f5f5f5";
  };

  // Abrir modal para registrar resultados (modo usuario)
  const handleCardClick = useCallback((indicator) => {
    if (userType !== "admin") {
      setSelectedIndicator(indicator);
      setModalOpen(true);
    }
  }, [userType]);

  // Registrar resultado (se usa idIndicadorConsolidado)
  // Dentro de IndicatorPage.jsx

  const handleResultRegister = useCallback((id, resultValue) => {
    if (!selectedIndicator) return;
    // Dependiendo del origenIndicador, se llama a distintos endpoints
    let endpoint = `http://127.0.0.1:8000/api/indicadoresconsolidados/${id}/resultados`;
    
    if (selectedIndicator.origenIndicador === "Encuesta") {
      endpoint = `http://127.0.0.1:8000/api/encuesta/${id}/resultados`;
    } else if (selectedIndicator.origenIndicador === "EvaluaProveedores") {
      return axios.post(`http://127.0.0.1:8000/api/evalua-proveedores/${id}/resultados`, resultValue)
        .then(response => {
          setResults(prev => ({ ...prev, [id]: response.data.evaluacion }));
        })
        .catch(error => console.error("Error registering evaluacion result:", error));
    } else if (selectedIndicator.origenIndicador === "Retroalimentacion") {
      endpoint = `http://127.0.0.1:8000/api/retroalimentacion/${id}/resultados`;
    }
    
    console.log(`Guardando resultado para indicador ${id} en ${endpoint} con payload:`, resultValue);
    axios.post(endpoint, resultValue)
      .then(response => {
        setResults(prev => ({ ...prev, [id]: response.data.analisis || response.data.evaluacion }));
      })
      .catch(error => console.error("Error registering result:", error));
  }, [selectedIndicator]);
  


  // Función para agregar nuevo indicador (modal de creación)
  const handleAddIndicator = useCallback(() => {
    setFormOpen(true);
  }, []);

  const handleSaveNewIndicator = useCallback((newIndicatorData) => {
    axios.post(`http://127.0.0.1:8000/api/indicadoresconsolidados`, newIndicatorData)
      .then(response => {
        const newInd = response.data.indicador;
        newInd.name = newInd.nombreIndicador;
        setIndicators(prev => [...prev, newInd]);
        setFormOpen(false);
      })
      .catch(error => console.error("Error saving new indicator:", error));
  }, []);

  // Función para editar indicador (modo admin)
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editIndicator, setEditIndicator] = useState(null);
  const handleEdit = useCallback((id) => {
    const indicator = indicators.find(ind => ind.idIndicadorConsolidado === id);
    if (indicator) {
      setEditIndicator(indicator);
      setEditFormOpen(true);
    }
  }, [indicators]);

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

  // Función para eliminar indicador
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

  // Render del modal para registrar resultados
  const renderModal = () => {
    if (!selectedIndicator) return null;
    const periodicidad = selectedIndicator.periodicidad
      ? selectedIndicator.periodicidad.toLowerCase().trim()
      : "";
    const savedResult =
      periodicidad === "semestral"
        ? results[selectedIndicator.idIndicadorConsolidado] || { "Ene-Jun": {}, "Jul-Dic": {} }
        : results[selectedIndicator.idIndicadorConsolidado] || {};

    const modalProps = {
      open: modalOpen,
      onClose: () => setModalOpen(false),
      onSave: handleResultRegister,
      indicator: selectedIndicator,
      savedResult,
    };

    switch (selectedIndicator.origenIndicador) {
      case "Encuesta":
        return <ResultModalEncuesta {...modalProps} />;
      case "Retroalimentacion":
        return <ResultModalRetroalimentacion {...modalProps} />;
      case "EvaluaProveedores":
        return <ResultModalEvaluaProveedores {...modalProps} />;
      case "ActividadControl":
      case "MapaProceso":
      case "GestionRiesgo":
        if (periodicidad === "semestral") {
          return (
            <ResultModalSemestralDual
              {...modalProps}
              fields={[{ name: "resultado", label: "Resultado" }]}
            />
          );
        }
        return <ResultModalSimple {...modalProps} />;
      default:
        return <ResultModalSimple {...modalProps} />;
    }
  };

  return (
    <div style={{ textAlign: "center", paddingBottom: "100px", maxWidth: "800px", margin: "0 auto" }}>
      <Typography variant="h1" sx={{ fontSize: "2rem", marginBottom: 2, marginTop: 3, color: "primary.main" }}>
        Indicadores
      </Typography>
      <Grid container spacing={2}>
        {indicators.map((ind) => {
          const cardColor = getCardBackgroundColor(ind);
          return (
            <Grid item xs={12} sm={6} key={ind.idIndicadorConsolidado} style={{ display: "flex", justifyContent: "flex-start" }}>
              <IndicatorCard
                indicator={ind}
                userType={userType}
                onEdit={() => {
                  if (userType === "admin") {
                    handleEdit(ind.idIndicadorConsolidado);
                  }
                }}
                onDelete={() => handleDeleteClick(ind)}
                onCardClick={handleCardClick}
                cardColor={cardColor}
                isResultRegistered={userType !== "admin" && !!results[ind.idIndicadorConsolidado]}
              />
            </Grid>
          );
        })}
      </Grid>
      {userType === "admin" && <NewIndicatorButton onClick={handleAddIndicator} />}
      {userType === "user" && <IrGraficasBoton />}
      {renderModal()}
      {deleteDialogOpen && indicatorToDelete && (
        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          indicatorName={indicatorToDelete.nombreIndicador}
        />
      )}
      <AddIndicatorForm open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSaveNewIndicator} />
      {/* Modal de edición (se reutiliza el mismo formulario de agregar) */}
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
    </div>
  );
};

export default IndicatorPage;