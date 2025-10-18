import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Grid,
  Box,
  CircularProgress,
  Typography
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Title from "../components/Title";
import BreadcrumbNav from "../components/BreadcrumbNav";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InsightsIcon from '@mui/icons-material/Insights';
import IndicatorCard from "../components/CardIndicador";
import ConfirmEdit from "../components/confirmEdit";
import IrGraficasBoton from "../components/Modals/BotonGraficas";
import FiltroOrigenIndicador from "../components/FiltroOrigenIndicador";
import FiltroEstadoIndicador from "../components/FiltroEstadoIndicador";
import FeedbackSnackbar from "../components/Feedback";
import ResultModalSimple from "../components/Modals/ResultModalSimple";
import ResultModalEncuesta from "../components/Modals/ResultModalEncuesta";
import ResultModalRetroalimentacion from "../components/Modals/ResultModalRetroalimentacion";
import ResultModalSemestralDual from "../components/Modals/ResultModalSemestralDual";
import ResultModalEvaluaProveedores from "../components/Modals/ResultModalEvaluacion";
import usePermiso from "../hooks/userPermiso";
import ProcesoEntidad from "../components/ProcesoEntidad";


function buildDatosGraficas(indicadores = [], results = {}) {
  const planControl = [], mapaProceso = [], riesgos = [], retroalimentacion = [];
  let encuesta = null, evaluacion = null;

  indicadores.forEach(ind => {
    const res = results[ind.idIndicador] || {};
    const origen = ind.origenIndicador;

    switch (origen) {
      case "Encuesta":
        if ((res.noEncuestas ?? 0) > 0) {
          encuesta = {
            malo: res.malo || 0,
            regular: res.regular || 0,
            bueno: res.bueno || 0,
            excelente: res.excelente || 0,
            noEncuestas: res.noEncuestas || 0
          };
        }
        break;

      case "Retroalimentacion":
        if ((res.cantidadFelicitacion ?? 0) > 0 || (res.cantidadSugerencia ?? 0) > 0 || (res.cantidadQueja ?? 0) > 0) {
          retroalimentacion.push({
            nombreIndicador: ind.nombreIndicador,
            cantidadFelicitacion: res.cantidadFelicitacion || 0,
            cantidadSugerencia: res.cantidadSugerencia || 0,
            cantidadQueja: res.cantidadQueja || 0
          });
        }
        break;

      case "EvaluaProveedores":
        evaluacion = {
          resultadoConfiableSem1: res.resultadoConfiableSem1 || 0,
          resultadoConfiableSem2: res.resultadoConfiableSem2 || 0,
          resultadoCondicionadoSem1: res.resultadoCondicionadoSem1 || 0,
          resultadoCondicionadoSem2: res.resultadoCondicionadoSem2 || 0,
          resultadoNoConfiableSem1: res.resultadoNoConfiableSem1 || 0,
          resultadoNoConfiableSem2: res.resultadoNoConfiableSem2 || 0
        };
        break;

      case "ActividadControl":
        planControl.push({
          nombreIndicador: ind.nombreIndicador,
          resultadoSemestral1: res.resultadoSemestral1 || 0,
          resultadoSemestral2: res.resultadoSemestral2 || 0,
          resultadoAnual: res.resultadoAnual || 0
        });
        break;

      case "MapaProceso":
        mapaProceso.push({
          nombreIndicador: ind.nombreIndicador,
          resultadoSemestral1: res.resultadoSemestral1 || 0,
          resultadoSemestral2: res.resultadoSemestral2 || 0,
          resultadoAnual: res.resultadoAnual || 0
        });
        break;

      case "GestionRiesgo":
        if (res.resultadoAnual != null) {
          riesgos.push({
            nombreIndicador: ind.nombreIndicador,
            resultadoAnual: res.resultadoAnual || 0
          });
        }
        break;
    }
  });

  return { planControl, mapaProceso, riesgos, encuesta, evaluacion, retroalimentacion };
}

const UnifiedIndicatorPage = () => {
  const { idProceso: paramProceso, anio } = useParams();
  const { state } = useLocation();
  const permisosHook = usePermiso("Indicadores");

  const soloLectura = state?.soloLectura ?? permisosHook.soloLectura;

  const [origenSeleccionado, setOrigenSeleccionado] = useState("Todos");
  const [results, setResults] = useState({});
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIndicator, setEditIndicator] = useState(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [selectedIndicator] = useState(null);
  const [selectedState, setSelectedState] = useState("noRecord");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [registrosPorApartado, setRegistrosPorApartado] = useState({});
  const datosGraficas = useMemo(
    () => buildDatosGraficas(indicators, results),
    [indicators, results]
  );
  const stateMap = useMemo(() => ({
    noRecord: { label: "Sin registrar", items: [], color: "white" },
    incomplete: { label: "Incompleto", items: [], color: "yellow" },
    complete: { label: "Completo", items: [], color: "lightGreen" },
  }), []);

  const confirmEdit = () => {
    setEditIndicator(selectedIndicator);
    setResultModalOpen(true);
    setConfirmEditOpen(false);
  };

  // En UnifiedIndicatorPage, modifica el useEffect que carga los indicadores
  useEffect(() => {
    if (!paramProceso || !anio) return;

    const getRegistro = apartado =>
      axios.get(`http://localhost:8000/api/registros/idRegistro`, {
        params: { idProceso: paramProceso, año: anio, apartado }
      }).then(res => ({ apartado, idRegistro: res.data.idRegistro })).catch(() => null);

    const fetchAll = async () => {
      const resultados = await Promise.all([
        getRegistro("Análisis de Datos"),
        getRegistro("Gestion de Riesgo")
      ]);

      const registros = resultados.reduce((acc, r) => {
        if (r) acc[r.apartado] = r.idRegistro;
        return acc;
      }, {});

      setRegistrosPorApartado(registros);

      try {
        const [resAnalisis, resGestion, resEstructura] = await Promise.all([
          registros["Análisis de Datos"] ?
            axios.get(`http://localhost:8000/api/indicadoresconsolidados/detalles`, {
              params: { idRegistro: registros["Análisis de Datos"] }
            }) : { data: { indicadores: [] } },
          registros["Gestion de Riesgo"] ?
            axios.get(`http://localhost:8000/api/indicadoresconsolidados/detalles`, {
              params: { idRegistro: registros["Gestion de Riesgo"] }
            }) : { data: { indicadores: [] } },
          axios.get(`http://localhost:8000/api/indicadoresconsolidados/detalles`, {
            params: { idProceso: paramProceso, tipo: "estructura" }
          })
        ]);

        // Combinar todos los indicadores
        const indicadores = [
          ...resAnalisis.data.indicadores,
          ...resGestion.data.indicadores,
          ...resEstructura.data.indicadores
        ];

        setIndicators(indicadores);

        // Inicializar estructuras para gráficas
        const resultadosMap = {};

        // Procesar cada indicador
        indicadores.forEach(ind => {
          // Guardar resultado para este indicador
          resultadosMap[ind.idIndicador] = ind;

        });

        setResults(resultadosMap);


      } catch (err) {
        console.error("Error al cargar indicadores:", err);
        setSnackbar({
          open: true,
          type: "error",
          title: "Error",
          message: "No se pudieron cargar los indicadores."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [paramProceso, anio]);

  const getIndicatorStatus = (ind, results) => {
    const origen = ind.origenIndicador?.toLowerCase().trim();
    const res = results[ind.idIndicador] || {};
    const isNullOrZero = v => v == null || Number(v) === 0;

    switch (origen) {
      case "encuesta": {
        const vals = [res.malo, res.regular, res.bueno, res.excelente, res.noEncuestas];
        if (vals.every(isNullOrZero)) return "noRecord";
        if (vals.some(v => v == null)) return "incomplete";
        return "complete";
      }
      case "retroalimentacion": {
        const vals = [res.cantidadFelicitacion, res.cantidadSugerencia, res.cantidadQueja];
        if (vals.every(isNullOrZero)) return "noRecord";
        if (vals.some(v => v == null)) return "incomplete";
        return "complete";
      }
      case "evaluaproveedores": {
        const vals = [
          res.resultadoConfiableSem1, res.resultadoConfiableSem2,
          res.resultadoCondicionadoSem1, res.resultadoCondicionadoSem2,
          res.resultadoNoConfiableSem1, res.resultadoNoConfiableSem2
        ];
        if (vals.every(isNullOrZero)) return "noRecord";
        if (vals.some(v => v == null)) return "incomplete";
        return "complete";
      }
      case "mapaproceso":
      case "actividadcontrol":
        return !res.resultadoSemestral1 && !res.resultadoSemestral2 ? "noRecord" : res.resultadoSemestral1 && res.resultadoSemestral2 ? "complete" : "incomplete";
      case "gestionriesgo":
        return res.resultadoAnual == null ? "noRecord" : "complete";
      default:
        return "noRecord";
    }
  };

  const categorizedIndicators = useMemo(() => {
    const map = { noRecord: [], incomplete: [], complete: [] };
    indicators.forEach(ind => {
      const status = getIndicatorStatus(ind, results);
      if (map[status]) map[status].push(ind);
    });
    return map;
  }, [indicators, results]);

  const handleRegisterResult = useCallback(id => {
    const found = indicators.find(i => i.idIndicador === id);
    if (found) { setEditIndicator(found); setResultModalOpen(true); }
  }, [indicators]);

  const handleResultRegister = useCallback(async (idIndicador, resultValue) => {
    if (!editIndicator) return;
    const url = `http://localhost:8000/api/indicadoresconsolidados/${idIndicador}/resultados`;
    try {
      const res = await axios.post(url, resultValue);
      const nuevoResultado = res.data.resultado;
      setResults(prev => ({ ...prev, [idIndicador]: nuevoResultado }));
      setResultModalOpen(false);
      setSnackbar({ open: true, type: "success", title: "Éxito", message: "Resultado guardado correctamente." });
    } catch (err) {
      setSnackbar({ open: true, type: "error", title: "Error", message: "Error al guardar resultado." });
    }
  }, [editIndicator]);

  const renderResultModal = () => {
    if (!resultModalOpen || !editIndicator) return null;
    const tipo = editIndicator.origenIndicador?.toLowerCase();
    const saved = results[editIndicator.idIndicador] || {};
    const commonProps = {
      open: true,
      onClose: () => setResultModalOpen(false),
      indicator: editIndicator,
      savedResult: saved,
      onSave: handleResultRegister,
      anio
    };
    switch (tipo) {
      case "encuesta": return <ResultModalEncuesta {...commonProps} />;
      case "retroalimentacion": return <ResultModalRetroalimentacion {...commonProps} />;
      case "evaluaproveedores": return <ResultModalEvaluaProveedores {...commonProps} />;
      case "mapaproceso":
      case "actividadcontrol": return <ResultModalSemestralDual {...commonProps} fields={[{ name: "resultado", label: "Resultado", percent: true }]} />;
      case "gestionriesgo": return <ResultModalSimple {...commonProps} />;
      default: return <ResultModalSimple {...commonProps} />;
    }
  };

  const indicadoresFiltrados = useMemo(() => {
    const origenValido = origenSeleccionado === "Todos" ? () => true : (ind) => ind.origenIndicador === origenSeleccionado;
    return categorizedIndicators[selectedState]?.filter(origenValido) || [];
  }, [categorizedIndicators, selectedState, origenSeleccionado]);


  const idRegistroAnalisis = registrosPorApartado["Análisis de Datos"];
  const breadcrumbItems = [
    {
      label: 'Estructura',
      to: paramProceso ? `/estructura-procesos/${paramProceso}` : '/procesos',
      icon: AccountTreeIcon
    },
    {
      label: 'Análisis de Datos',
      to: idRegistroAnalisis ? `/analisis-datos/${idRegistroAnalisis}` : '/analisis-datos',
      icon: AssessmentIcon
    },
    {
      label: 'Indicadores',
      to: (paramProceso && anio) ? `/indicadores/${paramProceso}/${anio}` : '/indicadores',
      icon: InsightsIcon
    }
  ];

  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: "auto", position: 'relative' }}>
      <Box sx={{
        ml: -16,
        mb: 2
      }}>
        <BreadcrumbNav items={breadcrumbItems} />
      </Box>
      <Box sx={{ position: "relative", mb: 2 }}>
        <Box sx={{ textAlign: "center" }}>
          <Title text="Indicadores" />
          <ProcesoEntidad idProceso={paramProceso} />
        </Box>
        <Box sx={{ position: "absolute", top: 10, right: -150 }}>
          <IrGraficasBoton
            idRegistro={registrosPorApartado["Análisis de Datos"] ?? null}
            datosGraficas={datosGraficas}
            idProceso={paramProceso}
            anio={anio}
            loading={loading}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 2, mb: 6 }}>
        <FiltroOrigenIndicador origenSeleccionado={origenSeleccionado} onChange={setOrigenSeleccionado} />
        <FiltroEstadoIndicador estadoSeleccionado={selectedState} onChange={setSelectedState} />
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}><CircularProgress /></Box>
      ) : categorizedIndicators[selectedState]?.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 5 }}><Typography variant="h6" color="text.secondary">No se encontraron indicadores</Typography></Box>
      ) : (
        <Grid container spacing={3} component={motion.div} layout>
          <AnimatePresence>
            {indicadoresFiltrados.map(ind => (
              <Grid item key={ind.idIndicador} xs={12} sm={6} md={3} component={motion.div} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} sx={{ display: "flex", flexDirection: "column", height: '100%' }}>
                <IndicatorCard indicator={ind} savedResult={results[ind.idIndicador]} onRegisterResult={() => handleRegisterResult(ind.idIndicador)} onClickCard={handleRegisterResult} cardColor={stateMap[selectedState].color} soloLectura={soloLectura} />
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}
      <ConfirmEdit open={confirmEditOpen} onClose={() => setConfirmEditOpen(false)} entityType="indicador" entityName={selectedIndicator?.nombreIndicador || ""} onConfirm={confirmEdit} />
      {renderResultModal()}
      <FeedbackSnackbar open={snackbar.open} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} type={snackbar.type || "info"} title={snackbar.title || ""} message={snackbar.message} />
    </Box>
  );
};

export default UnifiedIndicatorPage;