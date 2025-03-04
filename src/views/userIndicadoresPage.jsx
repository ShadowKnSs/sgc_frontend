// src/views/UserIndicatorPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Grid, Typography, Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import IndicatorCard from "../components/CardIndicador";
import IrGraficasBoton from "../components/Modals/BotonGraficas";
import ResultModalSimple from "../components/Modals/ResultModalSimple";
import ResultModalEncuesta from "../components/Modals/ResultModalEncuesta";
import ResultModalRetroalimentacion from "../components/Modals/ResultModalRetroalimentacion";
import ResultModalSemestralDual from "../components/Modals/ResultModalSemestralDual";
import ResultModalEvaluaProveedores from "../components/Modals/ResultModalEvaluacion";
import axios from "axios";

const UserIndicatorPage = () => {
  const [indicators, setIndicators] = useState([]);
  const [results, setResults] = useState({});
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Modo exclusivo: solo se puede elegir un estado
  const [selectedState, setSelectedState] = useState("noRecord");

  // Estados fijos y asignación de colores
  const stateMap = {
    noRecord: { label: "Sin registrar", items: [], color: "white" },
    incomplete: { label: "Incompleto", items: [], color: "yellow" },
    complete: { label: "Completo", items: [], color: "lightGreen" },
  };

  // Cargar indicadores desde el backend
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/indicadoresconsolidados")
      .then(response => {
        const data = response.data.indicadores || [];
        const transformed = data.map(ind => ({
          ...ind,
          name: ind.nombreIndicador,
        }));
        setIndicators(transformed);
      })
      .catch(error => console.error("Error fetching indicators:", error));
  }, []);

  // Obtener resultados para cada indicador
  useEffect(() => {
    if (indicators.length > 0) {
      Promise.all(
        indicators.map(ind => {
          let endpoint = `http://127.0.0.1:8000/api/indicadoresconsolidados/${ind.idIndicadorConsolidado}/resultados`;
          if (ind.origenIndicador === "Encuesta") {
            endpoint = `http://127.0.0.1:8000/api/encuesta/${ind.idIndicadorConsolidado}/resultados`;
          } else if (ind.origenIndicador === "Retroalimentacion") {
            endpoint = `http://127.0.0.1:8000/api/retroalimentacion/${ind.idIndicadorConsolidado}/resultados`;
          } else if (ind.origenIndicador === "EvaluaProveedores") {
            endpoint = `http://127.0.0.1:8000/api/evalua-proveedores/${ind.idIndicadorConsolidado}/resultados`;
          }
          return axios.get(endpoint)
            .then(response => {
              if (ind.origenIndicador === "EvaluaProveedores") {
                return response.data.evaluacion;
              }
              return response.data.analisis;
            })
            .catch(error => {
              console.error(`Error fetching result for ${ind.idIndicadorConsolidado}:`, error);
              return null;
            });
        })
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

  // Función para determinar el estado de registro del indicador
  const getStatus = (indicator) => {
    const res = results[indicator.idIndicadorConsolidado];
    if (!res || Object.keys(res).length === 0) return "noRecord";
    if (indicator.origenIndicador === "EvaluaProveedores") {
      const { confiable, condicionado, noConfiable } = res;
      return (confiable !== null && condicionado !== null && noConfiable !== null)
        ? "complete"
        : "incomplete";
    }
    const period = indicator.periodicidad.toLowerCase().trim();
    if (period === "anual") {
      return res.resultadoSemestral1 ? "complete" : "noRecord";
    } else if (period === "semestral") {
      const r1 = res.resultadoSemestral1;
      const r2 = res.resultadoSemestral2;
      const hasR1 = r1 !== null && r1 !== undefined && r1 !== "";
      const hasR2 = r2 !== null && r2 !== undefined && r2 !== "";
      if (hasR1 && hasR2) return "complete";
      if (hasR1 || hasR2) return "incomplete";
      return "noRecord";
    }
    return "noRecord";
  };

  // Actualizar stateMap con los indicadores filtrados
  stateMap.noRecord.items = indicators.filter(ind => getStatus(ind) === "noRecord");
  stateMap.incomplete.items = indicators.filter(ind => getStatus(ind) === "incomplete");
  stateMap.complete.items = indicators.filter(ind => getStatus(ind) === "complete");

  // Handler para el ToggleButtonGroup (modo exclusivo)
  const handleStateChange = (event, newState) => {
    if (newState !== null) {
      setSelectedState(newState);
    }
  };

  // Handler para abrir modal
  const handleCardClick = useCallback((indicator) => {
    setSelectedIndicator(indicator);
    setModalOpen(true);
  }, []);

  // Handler para registrar resultados (manteniendo la lógica anterior)
  const handleResultRegister = useCallback((id, resultValue) => {
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
    axios.post(endpoint, resultValue)
      .then(response => {
        setResults(prev => ({ ...prev, [id]: response.data.analisis || response.data.evaluacion }));
      })
      .catch(error => console.error("Error registering result:", error));
  }, [selectedIndicator]);

  // Renderizar columna única: cuando se selecciona un único estado, se muestra un grid de 4 columnas
  const renderColumn = () => {
    const items = stateMap[selectedState].items;
    return (
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
          {stateMap[selectedState].label}
        </Typography>
        <Grid container spacing={3} columnSpacing={12}>
          {items.map(ind => (
            <Grid item key={ind.idIndicadorConsolidado} xs={12} sm={6} md={3}>
              <IndicatorCard
                indicator={ind}
                userType="user"
                onCardClick={handleCardClick}
                cardColor={stateMap[selectedState].color}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  };

  // Render del modal para registrar resultados
  const renderModal = () => {
    if (!selectedIndicator) return null;
    const periodicidad = selectedIndicator.periodicidad ? selectedIndicator.periodicidad.toLowerCase().trim() : "";
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
    <Box sx={{ padding: "16px", margin: "0 auto", maxWidth: "1200px" }}>
      <Typography variant="h3" sx={{ mb: 3, textAlign: "center", color: "primary.main" }}>
        Indicadores - Usuario
      </Typography>

      {/* Botones de filtro (modo exclusivo) */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <ToggleButtonGroup
          exclusive
          value={selectedState}s
          onChange={handleStateChange}
          aria-label="Filtro de indicadores"
          sx={{
            border: "none",
            "& .MuiToggleButton-root": {
              border: "1px solid #ccc",
              borderRadius: "20px",
              textTransform: "none",
              fontWeight: "bold",
              color: "#555",
              "&.Mui-selected": {
                backgroundColor: "secondary.main",
                color: "white",
                border: "1px solid #1976d2",
              },
              "&:hover": {
                backgroundColor: "secondary.main",
                color: "white",
              },
            },
          }}
        >
          <ToggleButton value="noRecord" aria-label="Sin registrar">
            Sin registrar
          </ToggleButton>
          <ToggleButton value="incomplete" aria-label="Incompleto">
            Incompleto
          </ToggleButton>
          <ToggleButton value="complete" aria-label="Completo">
            Completo
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Render de la columna única */}
      <Grid container spacing={3} columnSpacing={18}>
        {renderColumn()}
      </Grid>
      <IrGraficasBoton />
      {renderModal()}
    </Box>
  );
};

export default UserIndicatorPage;
