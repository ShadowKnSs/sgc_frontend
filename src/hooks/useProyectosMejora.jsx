import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: { "Content-Type": "application/json" },
});

export const useProyectosMejora = (idRegistro, showSnackbar) => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasProyectos, setHasProyectos] = useState(false);

  // Estabiliza la función de notificación
  const notifyRef = useRef(showSnackbar);
  useEffect(() => {
    notifyRef.current = showSnackbar;
  }, [showSnackbar]);

  const handleMessage = (message, type = "info", title = "") => {
    if (typeof notifyRef.current === "function") {
      notifyRef.current(message, type, title);
    }
  };

  // Carga con soporte de cancelación
  const fetchProyectos = useCallback(
    async ({ signal } = {}) => {
      if (!idRegistro) {
        setError("No se proporcionó un ID de registro válido");
        setLoading(false);
        setProyectos([]);
        setHasProyectos(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const { data } = await api.get(`/proyectos-mejora/${idRegistro}`, {
          signal,
        });

        if (Array.isArray(data)) {
          setProyectos(data);
          const tiene = data.length > 0;
          setHasProyectos(tiene);

          if (!tiene) {
            handleMessage(
              "No hay proyectos de mejora registrados",
              "info",
              "Información"
            );
          } else {
            handleMessage(
              `${data.length} proyecto(s) de mejora cargado(s)`,
              "success",
              "Éxito"
            );
          }
        } else {
          setProyectos([]);
          setHasProyectos(false);
          handleMessage(
            "No hay proyectos de mejora registrados",
            "info",
            "Información"
          );
        }
      } catch (err) {
        // Si la petición fue abortada, no tocar estado ni disparar mensajes
        if (
          err?.name === "CanceledError" ||
          err?.code === "ERR_CANCELED" ||
          err?.message === "canceled"
        ) {
          return;
        }

        let errorMessage = "No se pudieron cargar los proyectos de mejora";
        if (err.response) {
          if (err.response.status === 404) {
            errorMessage =
              "No se encontraron proyectos de mejora para este registro";
            setHasProyectos(false);
          } else if (err.response.status >= 500) {
            errorMessage = "Error del servidor al cargar proyectos";
          }
        } else if (err.request) {
          errorMessage = "Error de conexión. Verifique su internet";
        }

        setError(errorMessage);
        handleMessage(errorMessage, "error", "Error");
        setProyectos([]);
        setHasProyectos(false);
      } finally {
        // Evita tocar loading si ya se abortó
        if (!signal || !signal.aborted) setLoading(false);
      }
    },
    [idRegistro] // <- estable, no depende de showSnackbar
  );

  // Eliminar y recargar
  const deleteProyecto = useCallback(
    async (idProyectoMejora) => {
      try {
        await api.delete(`/proyectos-mejora/${idProyectoMejora}`);
        handleMessage("Proyecto eliminado correctamente", "success", "Eliminado");
        await fetchProyectos();
        return true;
      } catch (err) {
        let errorMessage = "Error al eliminar el proyecto";
        if (err.response?.status >= 500)
          errorMessage = "Error del servidor al eliminar";
        else if (err.request) errorMessage = "Error de conexión al eliminar";
        handleMessage(errorMessage, "error", "Error");
        return false;
      }
    },
    [fetchProyectos]
  );

  // Carga inicial + cleanup
  useEffect(() => {
    const controller = new AbortController();
    fetchProyectos({ signal: controller.signal });
    return () => controller.abort();
  }, [fetchProyectos]);

  return {
    proyectos,
    loading,
    error,
    hasProyectos,
    refetch: () => fetchProyectos(),
    deleteProyecto,
  };
};
