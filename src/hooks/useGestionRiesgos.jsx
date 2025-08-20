// src/hooks/useGestionRiesgos.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const useGestionRiesgos = (idRegistro, mostrarSnackbar) => {
  const [gestionRiesgo, setGestionRiesgo] = useState({
    idGesRies: null,
    idRegistro,
    entidad: "",
    macroproceso: "",
    proceso: "",
    elaboro: "",
    fechaelaboracion: new Date().toISOString().split("T")[0],
  });

  const [tieneGesRies, setTieneGesRies] = useState(false);
  const [riesgos, setRiesgos] = useState([]);
  const [savedData, setSavedData] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const id = await fetchIdRegistro();
      if (id) fetchFormData(id);
    };
    loadData();
  }, [idRegistro]);

  
  

  const fetchIdRegistro = async () => {
    try {
      const { data } = await axios.get("http://127.0.0.1:8000/api/getIdRegistroGR", {
        params: { idRegistro },
      });
      if (data.idRegistro && data.proceso) {
        setGestionRiesgo((prev) => ({
          ...prev,
          entidad: data.entidad || prev.entidad,
          macroproceso: data.macro || prev.macroproceso,
          proceso: data.proceso.nombreProceso || prev.proceso,
        }));
      }
      return data.idRegistro;
    } catch (error) {
      console.error("[useGestionRiesgos] Error al obtener idRegistro:", error);
      return null;
    }
  };

  // En la función fetchFormData
  const fetchFormData = async (idRegistro) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/gestionriesgos/${idRegistro}`);

      if (res?.data) {
        setGestionRiesgo(prev => ({
          ...prev,
          idGesRies: res.data.idGesRies,
          elaboro: res.data.elaboro,
          fechaelaboracion: res.data.fechaelaboracion || prev.fechaelaboracion,
        }));
        setTieneGesRies(true);
        cargarRiesgos(res.data.idGesRies);
      }
    } catch (error) {
      // Manejar solo errores que no sean 404
      if (error.response?.status !== 404) {
        console.error("[useGestionRiesgos] Error al obtener gestionriesgos:", error);
      }
    }
  };

  const cargarRiesgos = async (idGesRies) => {
    try {
      const { data } = await axios.get(`http://127.0.0.1:8000/api/gestionriesgos/${idGesRies}/riesgos`);
      const lista = data.riesgos || [];
      setRiesgos(lista);
      setSavedData(organizarRiesgos(lista));
    } catch (err) {
      console.error("[useGestionRiesgos] Error al cargar riesgos:", err);
    }
  };

  const organizarRiesgos = (lista) => ({
    0: lista.map((r, i) => ({ Riesgo: i + 1, fuente: r.fuente, tipoRiesgo: r.tipoRiesgo, descripcion: r.descripcion })),
    1: lista.map((r, i) => ({ idRiesgo: i + 1, consecuencias: r.consecuencias, valorSeveridad: r.valorSeveridad, valorOcurrencia: r.valorOcurrencia, valorNRP: r.valorNRP })),
    2: lista.map((r, i) => ({ idRiesgo: i + 1, actividades: r.actividades, accionMejora: r.accionMejora, fechaImp: r.fechaImp, fechaEva: r.fechaEva, responsable: r.responsable })),
    3: lista.map((r, i) => ({ idRiesgo: i + 1, reevaluacionSeveridad: r.reevaluacionSeveridad, reevaluacionOcurrencia: r.reevaluacionOcurrencia, reevaluacionNRP: r.reevaluacionNRP, reevaluacionEfectividad: r.reevaluacionEfectividad, analisisEfectividad: r.analisisEfectividad })),
  });

  const handleGuardarGestionRiesgos = async (dataOverride = null) => {
    try {
      const url = tieneGesRies && gestionRiesgo.idGesRies
        ? `http://127.0.0.1:8000/api/gestionriesgos/${gestionRiesgo.idGesRies}`
        : `http://127.0.0.1:8000/api/gestionriesgos`;
      const method = tieneGesRies ? "PUT" : "POST";

      const payload = dataOverride || {
        idRegistro,
        elaboro: gestionRiesgo.elaboro,
        fechaelaboracion: new Date().toISOString().split("T")[0],
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error al guardar gestionriesgos");
      const result = await response.json();

      setGestionRiesgo((prev) => ({
        ...prev,
        idGesRies: result.idGesRies,
        fechaelaboracion: result.fechaelaboracion,
      }));

      setTieneGesRies(true);
      if (!tieneGesRies) cargarRiesgos(result.idGesRies);
      mostrarSnackbar("success", "Guardado", "Datos generales guardados correctamente.");
    } catch (err) {
      console.error("[useGestionRiesgos] Error al guardar info general:", err);
      mostrarSnackbar("error", "Error", "No se pudo guardar la información general.");
    }
  };

  return {
    gestionRiesgo,
    setGestionRiesgo,
    tieneGesRies,
    riesgos,
    savedData,
    handleGuardarGestionRiesgos,
    setRiesgos,
    setSavedData,
    cargarRiesgos
    
  };
};

export default useGestionRiesgos;
