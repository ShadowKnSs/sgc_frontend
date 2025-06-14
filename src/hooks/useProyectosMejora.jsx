import { useState, useEffect, useCallback } from "react";
import axios from "axios";

/**
 * Hook: useProyectosMejora
 * Carga proyectos de mejora asociados a un idRegistro
 */
export const useProyectosMejora = (idRegistro) => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProyectos = useCallback(async () => {
    if (!idRegistro) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(`http://127.0.0.1:8000/api/proyectos-mejora/${idRegistro}`);

      if (Array.isArray(data)) {
        setProyectos(data);
      } else {
        console.warn("⚠️ Respuesta inesperada al obtener proyectos:", data);
        setProyectos([]);
      }

    } catch (err) {
      console.error("❌ Error al obtener proyectos de mejora:", err);
      setError("No se pudieron cargar los proyectos de mejora.");
      setProyectos([]);
    } finally {
      setLoading(false);
    }
  }, [idRegistro]);

  useEffect(() => {
    fetchProyectos();
  }, [fetchProyectos]);

  return {
    proyectos,
    loading,
    error,
    hasProyectos: proyectos.length > 0,
    refetch: fetchProyectos,
  };
};
