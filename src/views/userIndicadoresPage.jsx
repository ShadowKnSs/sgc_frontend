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
  const [retroVirtualId, setRetroVirtualId] = useState(null);
  const [retroEncuestaId, setRetroEncuestaId] = useState(null);
  const [retroFisicaId, setRetroFisicaId] = useState(null);
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


  // Guardar el id del idicador de la encuesta

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
              if (ind.origenIndicador === "Encuesta") {
                return response.data.encuesta;
              }
              if (ind.origenIndicador === "Retroalimentacion") {
                return response.data.retroalimentacion;
              }
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


  useEffect(() => {

    if (indicators.length > 0) {
      // Filtrar indicadores de retroalimentación
      const retroIndicators = indicators.filter(
        ind => ind.origenIndicador?.toLowerCase().trim() === "retroalimentacion"
      );
      console.log("Indicadores de retroalimentación:", retroIndicators);

      const retroVirtualIndicator = indicators.find(
        ind => ind.nombreIndicador === "Retro Buzon Virtual"
      );
      const retroEncuestaIndicator = indicators.find(
        ind => ind.nombreIndicador === "Retro Encuesta"
      );
      const retroFisicaIndicator = indicators.find(
        ind => ind.nombreIndicador === "Retro Buzon Fisico"
      );

      console.log("Retro Virtual Indicator:", retroVirtualIndicator);
      console.log("Retro Encuesta Indicator:", retroEncuestaIndicator);
      console.log("Retro Física Indicator:", retroFisicaIndicator);


// Enviar directamente el idIndicadorConsolidado
      if (retroVirtualIndicator) {
        setRetroVirtualId(retroVirtualIndicator.idIndicadorConsolidado);
        console.log("ID Retro Virtual:", retroVirtualIndicator.idIndicadorConsolidado);
      }
      if (retroEncuestaIndicator) {
        setRetroEncuestaId(retroEncuestaIndicator.idIndicadorConsolidado);
        console.log("ID Retro Encuesta:", retroEncuestaIndicator.idIndicadorConsolidado);
      }
      if (retroFisicaIndicator) {
        setRetroFisicaId(retroFisicaIndicator.idIndicadorConsolidado);
        console.log("ID Retro Física:", retroFisicaIndicator.idIndicadorConsolidado);
      }
    }
  }, [indicators]);
  // Función para determinar el estado de registro del indicador
  function getStatus(indicator) {
    // resultsMap es tu estado global de resultados, 
    // con la forma: { [idConsolidado]: { ...result } }
    const res = results[indicator?.idIndicadorConsolidado];

    // Si no hay datos, retornamos 'noRecord'
    if (!res) return 'noRecord';

    // CASO: Encuesta
    if (indicator.origenIndicador === 'Encuesta') {
      // res = { malo, regular, excelenteBueno, noEncuestas }
      const { malo, regular, bueno, excelente, noEncuestas } = res;
      // Verificamos si cualquiera de ellos es null, undefined o ''
      const fields = [malo, regular, bueno, excelente, noEncuestas];
      const allFilled = fields.every((val) => val !== null && val !== undefined && val !== '');
      return allFilled ? 'complete' : 'incomplete';
    }

    // CASO: EvaluaProveedores
    if (indicator.origenIndicador === 'EvaluaProveedores') {
      // res = { confiable, condicionado, noConfiable }
      const { confiable, condicionado, noConfiable } = res;
      const fields = [confiable, condicionado, noConfiable];
      const allFilled = fields.every((val) => val !== null && val !== undefined && val !== '');
      return allFilled ? 'complete' : 'incomplete';
    }

    // CASO: Retroalimentacion
    if (indicator.origenIndicador === 'Retroalimentacion') {
      // res = { metodo, cantidadFelicitacion, cantidadSugerencia, cantidadQueja }
      const { cantidadFelicitacion, cantidadSugerencia, cantidadQueja } = res;
      const f = cantidadFelicitacion || 0;
      const s = cantidadSugerencia   || 0;
      const q = cantidadQueja        || 0;
      // Si quieres ignorar `metodo`, no lo incluyas en la lógica de “completo/incompleto”

      const isAllZero = (f === 0 && s === 0 && q === 0);
      const isAllNonZero = (f > 0 && s > 0 && q > 0);

      if (isAllZero) {
        return 'noRecord';
      } else if (isAllNonZero) {
        return 'complete';
      } else {
        return 'incomplete';
      }
      
    }

    // CASO: ActividadControl / MapaProceso / GestionRiesgo / etc.
    // Aquí asumimos que en res tenemos { resultadoSemestral1, resultadoSemestral2, ... }
    const period = indicator.periodicidad?.toLowerCase().trim() || '';
    const r1 = res.resultadoSemestral1 ?? '';
    const r2 = res.resultadoSemestral2 ?? '';

    if (period === 'anual') {
      // si con un solo semestral1 es "complete"
      return r1 ? 'complete' : 'noRecord';
    } else if (period === 'semestral') {
      // si hay dos semestres, ambos deben estar llenos
      const hasR1 = r1 !== null && r1 !== undefined && r1 !== '';
      const hasR2 = r2 !== null && r2 !== undefined && r2 !== '';
      if (hasR1 && hasR2) return 'complete';
      if (hasR1 || hasR2) return 'incomplete';
      return 'noRecord';
    }

    // Por defecto, si no matchea nada, asumimos que no hay datos
    return 'noRecord';
  }



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
  const handleResultRegister = useCallback(
    (idConsolidado, resultValue) => {

      let endpoint = `http://127.0.0.1:8000/api/indicadoresconsolidados/${idConsolidado}/resultados`;

      // Si es una Encuesta, redirigimos a /api/encuesta/{idConsolidado}/resultados
      if (selectedIndicator.origenIndicador === 'Encuesta') {
        endpoint = `http://127.0.0.1:8000/api/encuesta/${idConsolidado}/resultados`;
      } else if (selectedIndicator.origenIndicador === 'EvaluaProveedores') {
        endpoint = `http://127.0.0.1:8000/api/evalua-proveedores/${idConsolidado}/resultados`;
      } else if (selectedIndicator.origenIndicador === 'Retroalimentacion') {
        endpoint = `http://127.0.0.1:8000/api/retroalimentacion/${idConsolidado}/resultados`;
      }

      axios
        .post(endpoint, resultValue)
        .then((resp) => {

          if (selectedIndicator.origenIndicador === 'Encuesta') {
            // Guardamos en results
            setResults((prev) => ({
              ...prev,
              [idConsolidado]: resp.data.encuesta,
            }));
          } else if (selectedIndicator.origenIndicador === 'EvaluaProveedores') {
            setResults((prev) => ({
              ...prev,
              [idConsolidado]: resp.data.evaluacion, // sueles llamarle evaluacion
            }));
          } else if (selectedIndicator.origenIndicador === 'Retroalimentacion') {
            setResults((prev) => ({
              ...prev,
              [idConsolidado]: resp.data.retroalimentacion, // o la propiedad que devuelva tu backend
            }));
          } else {
            // ActividadControl, MapaProceso => analisis
            setResults((prev) => ({
              ...prev,
              [idConsolidado]: resp.data.analisis,
            }));
          }
          setModalOpen(false);

        })
        .catch((error) => {
          console.error('Error registering result:', error);
        });
    },
    [selectedIndicator]
  );

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

  //Funciones para enviar el id de la encuesta
  const encuestaIndicator = indicators.find(
    ind => ind.origenIndicador?.toLowerCase().trim() === "encuesta"
  );
  console.log("Encuesta indicator:", encuestaIndicator);

  const encuestaId = encuestaIndicator ? encuestaIndicator.idIndicadorConsolidado : null;
  console.log("ID del indicador de encuesta:", encuestaId);

  const evaluacionIndicator = indicators.find(
    ind => ind.origenIndicador?.toLowerCase().trim() === "evaluaproveedores"
  );
  console.log("Evaluacion indicator:", evaluacionIndicator);

  const evaluacionId = evaluacionIndicator ? evaluacionIndicator.idIndicadorConsolidado : null;
  console.log("ID del indicador de evaluacion:", evaluacionId);

  return (
    <Box sx={{ padding: "16px", margin: "0 auto", maxWidth: "1200px" }}>
      <Typography variant="h3" sx={{ mb: 3, textAlign: "center", color: "primary.main" }}>
        Indicadores - Usuario
      </Typography>

      {/* Botones de filtro (modo exclusivo) */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <ToggleButtonGroup
          exclusive
          value={selectedState}
          onChange={handleStateChange}
          aria-label="Filtro de indicadores"
          sx={{
            display: "flex",
            justifyContent: "space-around",
            gap: "100px",
            borderRadius: "20px",
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
      <IrGraficasBoton
        encuestaId={encuestaId}
        retroVirtualId={retroVirtualId}
        retroEncuestaId={retroEncuestaId}
        retroFisicaId={retroFisicaId}
        evaluacionId={evaluacionId}
      />
      {renderModal()}
    </Box>
  );
};

export default UserIndicatorPage;
