import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Grid,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Fab,
  Snackbar
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

// Componentes reutilizados
import IndicatorCard from "../components/CardIndicador";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import ConfirmEditDialog from "../components/ConfirmEditDialog";
import AddIndicatorForm from "../components/Forms/AddIndicatorForm";
import IrGraficasBoton from "../components/Modals/BotonGraficas";
// Modales para registrar resultados según el origen
import ResultModalSimple from "../components/Modals/ResultModalSimple";
import ResultModalEncuesta from "../components/Modals/ResultModalEncuesta";
import ResultModalRetroalimentacion from "../components/Modals/ResultModalRetroalimentacion";
import ResultModalSemestralDual from "../components/Modals/ResultModalSemestralDual";
import ResultModalEvaluaProveedores from "../components/Modals/ResultModalEvaluacion";

const UnifiedIndicatorPage = () => {
  const { idRegistro } = useParams();
  const { state } = useLocation();
  const rolActivo = state?.rolActivo || "";
  const soloLectura = rolActivo === "Auditor";
  console.log("UnifiedIndicatorPage - idRegistro:", idRegistro);

  // Estados principales
  const [indicators, setIndicators] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  // Estados para modales
  const [formOpen, setFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editIndicator, setEditIndicator] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [indicatorToDelete, setIndicatorToDelete] = useState(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  // Estado para filtrar por estado
  const [selectedState, setSelectedState] = useState("noRecord");

  // Snackbar para errores
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // Mapeo de estados para filtro y asignación de colores
  const stateMap = {
    noRecord: { label: "Sin registrar", items: [], color: "white" },
    incomplete: { label: "Incompleto", items: [], color: "yellow" },
    complete: { label: "Completo", items: [], color: "lightGreen" },
  };

  // Cargar indicadores
  useEffect(() => {
    if (!idRegistro) return;

    setLoading(true);

    // 1️⃣ Obtener el idProceso desde la API
    axios.get(`http://127.0.0.1:8000/api/registros/${idRegistro}`)
      .then(response => {
        if (!response.data || !response.data.idProceso) {
          throw new Error("No se pudo obtener idProceso");
        }
        const idProceso = response.data.idProceso;
        console.log("📌 idProceso obtenido:", idProceso);

        // Ahora hacemos la solicitud de los indicadores con idRegistro e idProceso
        return axios.get(`http://127.0.0.1:8000/api/indicadoresconsolidados`, {
          params: {
            idRegistro: idRegistro,
            idProceso: idProceso
          }
        });
      })
      .then(response => {
        const data = response.data.indicadores || [];
        console.log("📌 Indicadores obtenidos:", data);
        setIndicators(data);
      })
      .catch(error => {
        console.error("❌ Error en la carga de datos:", error);
      })
      .finally(() => setLoading(false));
  }, [idRegistro]);



  // Obtener resultados para cada indicador, según su origen
  useEffect(() => {
    if (indicators.length > 0) {
      setLoading(true);
      Promise.all(
        indicators.map((ind) => {
          let endpoint = `http://127.0.0.1:8000/api/indicadoresconsolidados/${ind.idIndicador}/resultados`;
          if (ind.origenIndicador === "Encuesta") {
            endpoint = `http://127.0.0.1:8000/api/encuesta/${ind.idIndicador}/resultados`;
          } else if (ind.origenIndicador === "Retroalimentacion") {
            endpoint = `http://127.0.0.1:8000/api/retroalimentacion/${ind.idIndicador}/resultados`;
          } else if (ind.origenIndicador === "EvaluaProveedores") {
            endpoint = `http://127.0.0.1:8000/api/evalua-proveedores/${ind.idIndicador}/resultados`;
          }
          return axios.get(endpoint)
            .then((response) => response.data)
            .catch((error) => {
              console.error(`Error fetching result for ${ind.idIndicador}:`, error);
              return null;
            });
        })
      ).then((resultsArray) => {
        const newResults = {};
        indicators.forEach((ind, index) => {
          if (resultsArray[index]) {
            newResults[ind.idIndicador] = resultsArray[index];
          }
        });
        setResults(newResults);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [indicators]);


  // Función para determinar el estado del indicador
  function getStatus(indicator) {
    const res = results[indicator?.idIndicador];

    if (!res || Object.keys(res).length === 0) {
      console.warn(`⚠️ No hay datos en resultados para el indicador ${indicator?.idIndicador}.`);
      return "noRecord";
    }

    const origen = indicator.origenIndicador?.toLowerCase().trim();
    const periodicidad = indicator.periodicidad?.toLowerCase().trim() || "";

    console.log(`📌 Evaluando estado del indicador ${indicator.idIndicador} (${origen})`, res);

    // 🟢 Encuesta
    if (origen === "encuesta" && res.encuesta) {
      const { malo, regular, bueno, excelente, noEncuestas } = res.encuesta;
      const fields = [malo, regular, bueno, excelente, noEncuestas];

      if (fields.every(val => val !== null && val !== undefined)) {
        return "complete";
      }
      return fields.some(val => val !== null && val !== undefined) ? "incomplete" : "noRecord";
    }

    // 🟠 Evaluación de Proveedores (Semestral)
    if (origen === "evaluaproveedores" && res.resultado) {
      const {
        resultadoConfiableSem1, resultadoConfiableSem2,
        resultadoCondicionadoSem1, resultadoCondicionadoSem2,
        resultadoNoConfiableSem1, resultadoNoConfiableSem2
      } = res.resultado;

      const fields = [
        resultadoConfiableSem1, resultadoConfiableSem2,
        resultadoCondicionadoSem1, resultadoCondicionadoSem2,
        resultadoNoConfiableSem1, resultadoNoConfiableSem2
      ];

      const filledFields = fields.filter(val => val !== null && val !== undefined);
      return filledFields.length === fields.length ? "complete" : (filledFields.length > 0 ? "incomplete" : "noRecord");
    }

    // 🔴 Retroalimentación
    if (origen === "retroalimentacion" && res.resultado) {
      const { cantidadFelicitacion, cantidadSugerencia, cantidadQueja } = res.resultado;
      const f = cantidadFelicitacion ?? 0;
      const s = cantidadSugerencia ?? 0;
      const q = cantidadQueja ?? 0;

      if (f === 0 && s === 0 && q === 0) return "noRecord";
      return (f > 0 && s > 0 && q > 0) ? "complete" : "incomplete";
    }

    // 🔵 Indicadores de Actividad de Control, Mapa de Proceso y Gestión de Riesgos
    if (["actividadcontrol", "mapaproceso", "gestionriesgo"].includes(origen) && res.resultado) {
      const { resultadoAnual, resultadoSemestral1, resultadoSemestral2 } = res.resultado;

      if (periodicidad === "anual") {
        return resultadoAnual !== null && resultadoAnual !== undefined ? "complete" : "noRecord";
      } else if (periodicidad === "semestral") {
        const hasR1 = resultadoSemestral1 !== null && resultadoSemestral1 !== undefined;
        const hasR2 = resultadoSemestral2 !== null && resultadoSemestral2 !== undefined;
        return hasR1 && hasR2 ? "complete" : (hasR1 || hasR2 ? "incomplete" : "noRecord");
      }
    }

    return "noRecord";
  }




  stateMap.noRecord.items = indicators.filter(ind => getStatus(ind) === "noRecord");
  stateMap.incomplete.items = indicators.filter(ind => getStatus(ind) === "incomplete");
  stateMap.complete.items = indicators.filter(ind => getStatus(ind) === "complete");

  const handleStateChange = (event, newState) => {
    if (newState !== null) {
      setSelectedState(newState);
    }
  };

  const handleEdit = useCallback((id) => {
    const found = indicators.find(i => i.idIndicador === id);
    if (found) {
      setEditIndicator(found);
      setEditFormOpen(true);
    }
  }, [indicators]);

  const handleDelete = useCallback((ind) => {
    setIndicatorToDelete(ind);
    setDeleteDialogOpen(true);
  }, []);

  const handleRegisterResult = useCallback((id) => {
    const found = indicators.find(i => i.idIndicador === id);
    if (found) {
      console.log("Abriendo modal para el indicador:", found);
      setEditIndicator(found);
      setResultModalOpen(true);
    } else {
      console.warn("No se encontró el indicador con ID:", id);
    }
  }, [indicators]);



  const handleResultRegister = useCallback((idIndicador, resultValue) => {
    let endpoint = `http://127.0.0.1:8000/api/indicadoresconsolidados/${idIndicador}/resultados`;

    if (editIndicator.origenIndicador === "Encuesta") {
      endpoint = `http://127.0.0.1:8000/api/encuesta/${idIndicador}/resultados`;
    } else if (editIndicator.origenIndicador === "Retroalimentacion") {
      endpoint = `http://127.0.0.1:8000/api/retroalimentacion/${idIndicador}/resultados`;
    } else if (editIndicator.origenIndicador === "EvaluaProveedores") {
      endpoint = `http://127.0.0.1:8000/api/evalua-proveedores/${idIndicador}/resultados`;
    }

    console.log("📌 Enviando datos al backend:", endpoint, "Payload:", resultValue);

    axios.post(endpoint, resultValue)
      .then((resp) => {
        // 🔥 Después de guardar, obtener los datos actualizados
        axios.get(endpoint)
          .then((newData) => {
            console.log("✅ Datos actualizados obtenidos:", newData.data);
            setResults(prev => ({
              ...prev,
              [idIndicador]: newData.data.resultado
            }));
          })
          .catch((error) => {
            console.error("❌ Error al obtener datos actualizados:", error);
          });

        setResultModalOpen(false);
      })
      .catch((error) => {
        console.error("❌ Error al registrar el resultado:", error);
        setSnackbar({ open: true, message: "Error al registrar el resultado" });
      });
  }, [editIndicator]);


  const renderResultModal = () => {
    if (!resultModalOpen || !editIndicator) return null;

    console.log("🔍 Abriendo modal para indicador:", editIndicator);

    if (!editIndicator.idIndicador) {
      console.error("❌ Error: idIndicador es undefined.");
      return null;
    }
    const savedResult = results[editIndicator.idIndicador] || {}; // ✅ Asegurar que no sea undefined

    const periodicidad = editIndicator.periodicidad?.toLowerCase().trim();
    const tipoIndicador = editIndicator.origenIndicador?.toLowerCase().trim();

    console.log("Abriendo modal para:", editIndicator.name, "Tipo:", tipoIndicador, "Periodicidad:", periodicidad);

    if (tipoIndicador === "encuesta") {
      return (
        <ResultModalEncuesta
          open={resultModalOpen}
          onClose={() => setResultModalOpen(false)}
          indicator={editIndicator}
          savedResult={results[editIndicator.idIndicador] || {}}
          onSave={handleResultRegister}
        />
      );
    }

    if (tipoIndicador === "retroalimentacion") {
      return (
        <ResultModalRetroalimentacion
          open={resultModalOpen}
          onClose={() => setResultModalOpen(false)}
          indicator={editIndicator}
          savedResult={results[editIndicator.idIndicador] || {}}
          onSave={handleResultRegister}
        />
      );
    }

    if (tipoIndicador === "evaluaproveedores") {
      return (
        <ResultModalEvaluaProveedores
          open={resultModalOpen}
          onClose={() => setResultModalOpen(false)}
          indicator={editIndicator}
          savedResult={savedResult}
          onSave={handleResultRegister}
        />
      );
    }

    if (tipoIndicador === "actividadcontrol" || tipoIndicador === "mapaproceso") {
      return (
        <ResultModalSemestralDual
          open={resultModalOpen}
          onClose={() => setResultModalOpen(false)}
          indicator={editIndicator}
          savedResult={results[editIndicator.idIndicador] || {}}
          onSave={handleResultRegister}
          fields={[{ name: "resultado", label: "Resultado" }]}
        />
      );
    }

    if (tipoIndicador === "gestionriesgo") {
      return (
        <ResultModalSimple
          open={resultModalOpen}
          onClose={() => setResultModalOpen(false)}
          indicator={editIndicator}
          savedResult={results[editIndicator.idIndicador] || {}}
          onSave={handleResultRegister}
        />
      );
    }

    return (
      <ResultModalSimple
        open={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        indicator={editIndicator}
        savedResult={results[editIndicator.idIndicador] || {}}
        onSave={handleResultRegister}
      />
    );
  };


  return (
    <Box sx={{ padding: "16px", margin: "0 auto", maxWidth: "1200px" }}>
      {/* Header: Título y botón de gráficas en la esquina superior derecha */}
      <Box sx={{ position: "relative", mb: 3 }}>
        <Typography variant="h3" color="primary.main">
          Indicadores
        </Typography>
        <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 999 }}>
          <IrGraficasBoton
            encuestaId={
              indicators.find(ind => ind.origenIndicador?.toLowerCase() === "encuesta")
                ?.idIndicador || null
            }
            retroVirtualId={
              indicators.find(ind => ind.nombreIndicador?.includes("Buzon Virtual"))
                ?.idIndicador || null
            }
            retroEncuestaId={
              indicators.find(ind => ind.nombreIndicador?.includes("Encuesta"))
                ?.idIndicador || null
            }
            retroFisicaId={
              indicators.find(ind => ind.nombreIndicador?.includes("Buzon Fisico"))
                ?.idIndicador || null
            }
            evaluacionId={
              indicators.find(ind => ind.origenIndicador?.toLowerCase() === "evaluaproveedores")
                ?.idIndicador || null
            }
            idRegistro={idRegistro}
          />
        </Box>
      </Box>
      {/* Filtro de estados */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <ToggleButtonGroup
          exclusive
          value={selectedState}
          onChange={handleStateChange}
          aria-label="Filtro de indicadores"
          sx={{
            gap: "100px",
            borderRadius: "20px",
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
          <ToggleButton value="noRecord">Sin registrar</ToggleButton>
          <ToggleButton value="incomplete">Incompleto</ToggleButton>
          <ToggleButton value="complete">Completo</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {/* Listado de tarjetas */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} columnSpacing={12}>
          {stateMap[selectedState].items.map((ind) => (
            <Grid item key={ind.idIndicador} xs={12} sm={6} md={3}>
              <IndicatorCard
                indicator={ind}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRegisterResult={() => handleRegisterResult(ind.idIndicador)}
                cardColor={stateMap[selectedState].color}
                soloLectura={soloLectura}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {/* Botón FAB para agregar indicador */}
      {!soloLectura && (
        <Box sx={{ position: "fixed", bottom: 40, right: 40 }}>
          <Fab color="primary" aria-label="Agregar" onClick={() => setFormOpen(true)}>
            <AddIcon />
          </Fab>
        </Box>
      )}
      {formOpen && (
        <AddIndicatorForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSave={(payload) => {
            axios.post("http://127.0.0.1:8000/api/indicadoresconsolidados", payload)
              .then((response) => {
                const newInd = response.data.indicador;
                newInd.name = newInd.nombreIndicador;
                setIndicators(prev => [...prev, newInd]);
                setFormOpen(false);
              })
              .catch((error) => {
                console.error("Error saving new indicator:", error);
                setSnackbar({ open: true, message: "Error al guardar el indicador" });
              });
          }}
          idRegistro={idRegistro} // Se pasa el idRegistro
          initialValues={{ idRegistro: idRegistro }}
        />
      )}
      {editFormOpen && editIndicator && (
        <AddIndicatorForm
          open={editFormOpen}
          onClose={() => {
            setEditFormOpen(false);
            setEditIndicator(null);
          }}
          onSave={(editedData) => {
            const id = editIndicator.idIndicador;

            // Corregir estructura del payload
            const payload = {
              nombreIndicador: editedData.origenIndicador, // Usar campo correcto
              meta: editedData.meta,
              periodicidad: editedData.periodicidad,
              idRegistro: parseInt(editedData.idRegistro), // Asegurar número
            };

            // Agregar método solo para Retroalimentación
            if (editedData.origenIndicador === 'Retroalimentacion') {
              payload.metodo = editedData.metodo;
            }

            axios.put(`http://127.0.0.1:8000/api/indicadoresconsolidados/${id}`, payload)
              .then((response) => {
                const updated = response.data.indicador;
                // Mapear correctamente las propiedades
                setIndicators(prev =>
                  prev.map(ind =>
                    ind.idIndicador === updated.idIndicador
                      ? {
                        ...updated,
                        nombreIndicador: updated.nombreIndicador,
                        origenIndicador: updated.nombreIndicador // Asignar según lógica de negocio
                      }
                      : ind
                  )
                );
                setEditFormOpen(false);
              })
              .catch((error) => {
                console.error("Error updating indicator:", error);
                setSnackbar({ open: true, message: "Error al actualizar el indicador" });
              });
          }}
          initialValues={{
            // Corregir mapeo de valores iniciales
            origenIndicador: editIndicator.nombreIndicador, // Campo correcto para el select
            meta: editIndicator.meta || "",
            periodicidad: editIndicator.periodicidad,
            metodo: editIndicator.metodo || "", // Agregar método si existe
            idRegistro: idRegistro // Valor ya viene como número desde params
          }}
          idRegistro={idRegistro}
        />
      )}
      {deleteDialogOpen && indicatorToDelete && (
        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={() => {
            axios.delete(`http://127.0.0.1:8000/api/indicadoresconsolidados/${indicatorToDelete.idIndicador}`)
              .then(() => {
                setIndicators(prev =>
                  prev.filter(ind => ind.idIndicador !== indicatorToDelete.idIndicador)
                );
                setResults(prev => {
                  const updated = { ...prev };
                  delete updated[indicatorToDelete.idIndicador];
                  return updated;
                });
                setDeleteDialogOpen(false);
              })
              .catch((error) => {
                console.error("Error deleting indicator:", error);
                setSnackbar({ open: true, message: "Error al eliminar el indicador" });
              });
          }}
          itemName={indicatorToDelete.nombreIndicador}
        />
      )}
      {renderResultModal()}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default UnifiedIndicatorPage;
