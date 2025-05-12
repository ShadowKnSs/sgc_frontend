import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Grid,
  Box,
  CircularProgress,
  Snackbar,
  Typography
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion"; // al inicio del archivo
import axios from "axios";

// Componentes reutilizados
import Title from "../components/Title";
import IndicatorCard from "../components/CardIndicador";
import ConfirmEdit from "../components/confirmEdit";
import IrGraficasBoton from "../components/Modals/BotonGraficas";
import FiltroOrigenIndicador from "../components/FiltroOrigenIndicador";
import FiltroEstadoIndicador from "../components/FiltroEstadoIndicador";

// Modales para registrar resultados según el origen
import ResultModalSimple from "../components/Modals/ResultModalSimple";
import ResultModalEncuesta from "../components/Modals/ResultModalEncuesta";
import ResultModalRetroalimentacion from "../components/Modals/ResultModalRetroalimentacion";
import ResultModalSemestralDual from "../components/Modals/ResultModalSemestralDual";
import ResultModalEvaluaProveedores from "../components/Modals/ResultModalEvaluacion";
import usePermiso from "../hooks/userPermiso";
import ProcesoEntidad from "../components/ProcesoEntidad"


const UnifiedIndicatorPage = () => {
  const { idProceso: paramProceso, anio } = useParams();
  const { state } = useLocation();
  const permisosHook = usePermiso("Indicadores");

  const soloLectura = state?.soloLectura ?? permisosHook.soloLectura;

  const [origenSeleccionado, setOrigenSeleccionado] = useState("Todos");
  const [idRegistro, setidRegistro] = useState(null);
  const [results, setResults] = useState({});
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editIndicator, setEditIndicator] = useState(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState(null);

  const [selectedState, setSelectedState] = useState("noRecord");
  const [indicadoresRiesgo, setIndicadoresRiesgo] = useState([]);

  // Ajuste 2: manejamos un snackbar global
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const stateMap = {
    noRecord: { label: "Sin registrar", items: [], color: "white" },
    incomplete: { label: "Incompleto", items: [], color: "yellow" },
    complete: { label: "Completo", items: [], color: "lightGreen" },
  };

  const confirmEdit = () => {
    setEditIndicator(selectedIndicator);
    setResultModalOpen(true);
    setConfirmEditOpen(false);
  };

  // 1️ Obtener idRegistro
  useEffect(() => {
    if (!paramProceso || !anio) return;

    axios
      .get(`http://localhost:8000/api/registros/idRegistro`, {
        params: { idProceso: paramProceso, año: anio, apartado: "Análisis de Datos" }
      })
      .then(res => setidRegistro(res.data.idRegistro))

      .catch(err => {
        console.error("No se pudo obtener el idRegistro:", err);
        setSnackbar({ open: true, message: "Error al obtener registro de indicadores" });
      });
  }, [paramProceso, anio]);

  // 2️ Traer indicadores de origens Gestion de Riesgo
  useEffect(() => {
    if (!paramProceso || !anio) return;

    axios.get(`http://localhost:8000/api/indicadores-riesgo`, {
      params: { idProceso: paramProceso, año: anio }
    })
    .then(response => {
      const nuevos = response.data.indicadores || [];
      setIndicators(prev => {
        const existentes = prev.map(i => i.idIndicador);
        const sinDuplicados = nuevos.filter(n => !existentes.includes(n.idIndicador));
        return [...prev, ...sinDuplicados];
      });
    })    
      .catch(err => {
        console.error("Error al cargar indicadores de riesgo:", err);
        setSnackbar({ open: true, message: "Error al cargar indicadores de riesgo" });
      });
  }, [paramProceso, anio]);


  useEffect(() => {
    if (!idRegistro) return;
    setLoading(true);

    axios
      .get(`http://localhost:8000/api/indicadoresconsolidados`, {
        params: { idRegistro }
      })
      .then(response => setIndicators(response.data.indicadores || []))
      .catch(error => {
        console.error("Error al cargar indicadores:", error);
        setSnackbar({ open: true, message: "Error al cargar indicadores" });
      })
      .finally(() => setLoading(false));
  }, [idRegistro]);

  // 4 Obtener resultados de cada indicador
  useEffect(() => {
    if (indicators.length === 0) return;
    setLoading(true);

    Promise.all(
      indicators.map(ind => {
        let url = `http://localhost:8000/api/indicadoresconsolidados/${ind.idIndicador}/resultados`;
        const origen = ind.origenIndicador?.toLowerCase().trim();
        if (origen === "encuesta")
          url = `http://localhost:8000/api/encuesta/${ind.idIndicador}/resultados`;
        else if (origen === "retroalimentacion")
          url = `http://localhost:8000/api/retroalimentacion/${ind.idIndicador}/resultados`;
        else if (origen === "evaluaproveedores")
          url = `http://localhost:8000/api/evalua-proveedores/${ind.idIndicador}/resultados`;

        return axios.get(url)
          .then(res => {
            const data = res.data.resultado || res.data.encuesta || res.data;
            return { id: ind.idIndicador, data: { ...data } };

          })
          .catch(err => {
            console.error(`Error fetching resultados de ${ind.idIndicador}:`, err);
            // setSnackbar({ open: true, message: `Error al cargar resultados de ${ind.nombreIndicador}` });
            return null;
          });
      })
    ).then(arr => {
      const byId = {};
      arr.forEach(item => item && (byId[item.id] = item.data));
      setResults(prev => ({ ...prev, ...byId }));
    }).finally(() => setLoading(false));
  }, [indicators]);

  function getStatus(ind) {
    const origen = ind.origenIndicador?.toLowerCase().trim();
    const res = results[ind.idIndicador] || {};

    switch (origen) {
      case "encuesta": {
        const { malo, regular, bueno, excelente, noEncuestas } = res || {};
        const values = [malo, regular, bueno, excelente, noEncuestas];
        const filled = values.filter(v => v != null);
        if (filled.length === 0) return "noRecord";
        if (filled.length < 5) return "incomplete";
        return "complete";
      }

      case "evaluaproveedores": {
        const r = res || {};
        const values = [
          r.resultadoConfiableSem1, r.resultadoConfiableSem2,
          r.resultadoCondicionadoSem1, r.resultadoCondicionadoSem2,
          r.resultadoNoConfiableSem1, r.resultadoNoConfiableSem2
        ];
        const filled = values.filter(v => v != null);
        if (filled.length === 0) return "noRecord";
        if (filled.length < 6) return "incomplete";
        return "complete";
      }

      case "retroalimentacion": {
        const r = res || {};
        const { cantidadFelicitacion, cantidadSugerencia, cantidadQueja } = r;
        const values = [cantidadFelicitacion, cantidadSugerencia, cantidadQueja];
        const filled = values.filter(v => v != null);
        if (filled.length === 0) return "noRecord";
        if (filled.length < 3) return "incomplete";
        return "complete";
      }

      case "mapaproceso":
      case "actividadcontrol": {
        const r = res || {};
        const hasSem1 = r.resultadoSemestral1 != null;
        const hasSem2 = r.resultadoSemestral2 != null;
        if (!hasSem1 && !hasSem2) return "noRecord";
        if (hasSem1 && hasSem2) return "complete";
        return "incomplete";
      }

      case "gestionriesgo": {
        const r = res || {};
        if (r.resultadoAnual == null) return "noRecord";
        return "complete";
      }

      default:
        return "noRecord";
    }
  }



  const categorizedIndicators = useMemo(() => {
    const map = {
      noRecord: [],
      incomplete: [],
      complete: [],
    };

    indicators.forEach(ind => {
      const status = getStatus(ind);
      if (map[status]) {
        map[status].push(ind);
      }
    });

    return map;
  }, [indicators, results]);

  const handleStateChange = (_, newState) => newState && setSelectedState(newState);
  const handleEdit = useCallback((id) => {
    const found = indicators.find(i => i.idIndicador === id);
    if (found) {
      setSelectedIndicator(found);
      setConfirmEditOpen(true);
    }
  }, [indicators]);


  const handleRegisterResult = useCallback(id => {
    const found = indicators.find(i => i.idIndicador === id);
    if (found) { setEditIndicator(found); setResultModalOpen(true); }
  }, [indicators]);

  const handleResultRegister = useCallback(async (idIndicador, resultValue) => {
    if (!editIndicator) return;

    const url = `http://localhost:8000/api/indicadoresconsolidados/${idIndicador}/resultados`;

    try {
      await axios.post(url, resultValue);
      const res = await axios.get(url);
      const nuevoResultado = res.data.resultado || res.data;

      setResults(prev => ({
        ...prev,
        [idIndicador]: nuevoResultado,
      }));

      setResultModalOpen(false);
      setSnackbar({ open: true, message: "Resultado guardado exitosamente" });

    } catch (err) {
      console.error("Error al registrar resultado:", err);
      // setSnackbar({ open: true, message: "Error al registrar resultado" });
    }
  }, [editIndicator]);


  const renderResultModal = () => {
    if (!resultModalOpen || !editIndicator) return null;
    const tipo = editIndicator.origenIndicador?.toLowerCase();
    const saved = results[editIndicator.idIndicador] || {};

    switch (tipo) {
      case "encuesta":
        return <ResultModalEncuesta open onClose={() => setResultModalOpen(false)} indicator={editIndicator} savedResult={saved} onSave={handleResultRegister} />;
      case "retroalimentacion":
        return <ResultModalRetroalimentacion open onClose={() => setResultModalOpen(false)} indicator={editIndicator} savedResult={saved} onSave={handleResultRegister} />;
      case "evaluaproveedores":
        return <ResultModalEvaluaProveedores open onClose={() => setResultModalOpen(false)} indicator={editIndicator} savedResult={saved} onSave={handleResultRegister} />;
      case "mapaproceso":
      case "actividadcontrol":
        return <ResultModalSemestralDual open onClose={() => setResultModalOpen(false)} indicator={editIndicator} savedResult={saved} onSave={handleResultRegister} fields={[{ name: "resultado", label: "Resultado", percent: true }]} />;
      case "gestionriesgo":
        return <ResultModalSimple open onClose={() => setResultModalOpen(false)} indicator={editIndicator} savedResult={saved} onSave={handleResultRegister} />;
      default:
        return <ResultModalSimple open onClose={() => setResultModalOpen(false)} indicator={editIndicator} savedResult={saved} onSave={handleResultRegister} />;
    }
  };

  const indicadoresFiltrados = useMemo(() => {
    const origenValido = origenSeleccionado === "Todos"
      ? () => true
      : (ind) => ind.origenIndicador === origenSeleccionado;

    return categorizedIndicators[selectedState]?.filter(origenValido) || [];
  }, [categorizedIndicators, selectedState, origenSeleccionado]);

  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ position: "relative", mb: 3 }}>
        <Title text="Indicadores" />
        <ProcesoEntidad idProceso={paramProceso} />
        <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 999 }}>
          <IrGraficasBoton
            encuestaId={indicators.find(i => i.origenIndicador === "Encuesta")?.idIndicador || null}
            retroVirtualId={indicators.find(i => i.nombreIndicador.includes("Buzon Virtual"))?.idIndicador || null}
            retroEncuestaId={indicators.find(i => i.nombreIndicador.includes("Encuesta"))?.idIndicador || null}
            retroFisicaId={indicators.find(i => i.nombreIndicador.includes("Buzon Fisico"))?.idIndicador || null}
            evaluacionId={indicators.find(i => i.origenIndicador === "EvaluaProveedores")?.idIndicador || null}
            idRegistro={idRegistro}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >
        <FiltroOrigenIndicador
          origenSeleccionado={origenSeleccionado}
          onChange={setOrigenSeleccionado}
        />
        <FiltroEstadoIndicador
          estadoSeleccionado={selectedState}
          onChange={setSelectedState}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : categorizedIndicators[selectedState]?.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron indicadores
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} component={motion.div} layout>
          <AnimatePresence>
            {indicadoresFiltrados.map(ind => (
              <Grid
                item
                key={ind.idIndicador}
                xs={12}
                sm={6}
                md={3}
                component={motion.div}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <IndicatorCard
                  indicator={ind}
                  onEdit={() => handleEdit(ind.idIndicador)}
                  onRegisterResult={() => handleRegisterResult(ind.idIndicador)}
                  onClickCard={handleRegisterResult}
                  cardColor={stateMap[selectedState].color}
                  soloLectura={soloLectura}
                />
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      <ConfirmEdit
        open={confirmEditOpen}
        onClose={() => setConfirmEditOpen(false)}
        entityType="indicador"
        entityName={selectedIndicator?.nombreIndicador || ""}
        onConfirm={confirmEdit}
      />

      {renderResultModal()}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        message={snackbar.message}
      />
    </Box>
  );
};

export default UnifiedIndicatorPage;
