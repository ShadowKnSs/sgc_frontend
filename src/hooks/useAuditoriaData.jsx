import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios";

const useAuditoriaData = (usuario, rolActivo, idProceso = null) => {
  const [events, setEvents] = useState([]);
  const [entidades, setEntidades] = useState([]);
  const [procesos, setProcesos] = useState([]);
  const [procesosCE, setProcesosCE] = useState([]);
  const [auditores, setAuditores] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [hasError, setHasError] = useState(false);
  const [lastFetchParams, setLastFetchParams] = useState(null)
  const emptySnackShown = useRef(false);


  const nombreCompleto = (p) =>
    [p?.nombre, p?.apellidoPat, p?.apellidoMat].filter(Boolean).join(" ");

  const auditoresIndex = useMemo(() => {
    const byUsuario = new Map();
    const byAuditor = new Map();
    for (const a of auditores) {
      if (a?.idUsuario != null) byUsuario.set(Number(a.idUsuario), a);
      if (a?.idAuditor != null) byAuditor.set(Number(a.idAuditor), a);
      // compat: algunos endpoints usan "id" para el registro en tabla auditores
      if (a?.id != null && !byAuditor.has(Number(a.id))) byAuditor.set(Number(a.id), a);
    }
    return { byUsuario, byAuditor };
  }, [auditores]);

  const fetchAuditorias = useCallback(async ({ from, to }) => {
    if (!usuario || !rolActivo?.nombreRol) return;

    setLastFetchParams({ from, to, view: 'auto' });

    try {
      setLoadingList(true);
      setHasError(false);
      setEvents([]);
      emptySnackShown.current = false;
      //cerrar un snackbar informativo previo
      setSnackbar(prev => (prev.open && prev.severity === 'info' ? { ...prev, open: false } : prev))
      let response;

      if (["Administrador", "Coordinador de Calidad"].includes(rolActivo.nombreRol)) {
        response = await axios.get("http://localhost:8000/api/auditorias/todas", {
          params: { rol: rolActivo.nombreRol, from, to }
        });
      } else if (["Lider", "Líder"].includes(rolActivo.nombreRol)) {
        response = await axios.get(`http://localhost:8000/api/auditorias/lider/${usuario.idUsuario}`);
      } else if (rolActivo.nombreRol === "Auditor") {
        response = await axios.get(`http://localhost:8000/api/auditorias/auditor/${usuario.idUsuario}`);
      } else if (rolActivo.nombreRol === "Supervisor") {
        response = await axios.get(`http://localhost:8000/api/auditorias/supervisor/${usuario.idUsuario}`);
      } else if (idProceso) {
        response = await axios.post("http://localhost:8000/api/cronograma/filtrar", { idProceso, from, to });
      } else {
        setEvents([]);
        return;
      }

      let auditoriasRaw = response.data;

      // Validar que la respuesta sea un array
      if (!Array.isArray(auditoriasRaw)) {
        auditoriasRaw = [];
      }

      // Si no hay auditorías, establecer array vacío y continuar
      if (auditoriasRaw.length === 0) {
        setEvents([]);
        if (!emptySnackShown.current) {
          emptySnackShown.current = true;
          setTimeout(() => {
            setSnackbar({
              open: true,
              message: "No se encontraron auditorías para este mes/semana/día.",
              severity: "info",
              autoHideDuration: 3500,
            });
          }, 0);
        }
        setLoadingList(false);
        return;
      }

      // Filtrado client-side si el endpoint no soporta rango (roles ≠ Admin/Coord)
      const between = (d, a, b) => !!d && d >= a && d <= b;
      if (!["Administrador", "Coordinador"].includes(rolActivo.nombreRol)) {
        auditoriasRaw = auditoriasRaw.filter(r => between(String(r.fechaProgramada), from, to));
      }

      const auditorias = await Promise.all(
        auditoriasRaw.map(async (auditoria) => {
          try {
            const fecha = String(auditoria.fechaProgramada || '').trim();
            const hora = String(auditoria.horaProgramada || '').trim();
            const start = new Date(`${fecha}T${hora}`);
            if (isNaN(start.getTime())) {
              // registro inválido, lo saltamos
              return null;
            }
            const end = new Date(start.getTime() + 60 * 60 * 1000);

            const rawLiderId = Number(auditoria.auditorLider);
            const liderRec =
              auditoresIndex.byUsuario.get(rawLiderId) ||
              auditoresIndex.byAuditor.get(rawLiderId);
            const nombreLider =
              liderRec ? nombreCompleto(liderRec) : (auditoria.nombreAuditorLider || "No asignado");
            let auditoresAdicionales = [];
            try {
              const res = await axios.get(`http://localhost:8000/api/auditores-asignados/${auditoria.idAuditoria}`);
              const rows = Array.isArray(res.data) ? res.data : [];

              auditoresAdicionales = rows
                // 1) Descarta explícitamente la fila de líder si viene marcada como tal
                .filter(r => String(r.rol || '').toLowerCase() !== 'lider')
                .map(a => {
                  // 2) Normaliza SIEMPRE ambos IDs; en tu esquema actual idAuditor ≡ idUsuario
                  const idU = Number(a.idUsuario ?? a.idAuditor ?? a.id);
                  const meta =
                    auditoresIndex.byUsuario.get(idU) ||
                    auditoresIndex.byAuditor.get(idU);
                  return {
                    idUsuario: idU,
                    idAuditor: idU, // espejo; evita divergencias posteriores
                    nombre: a.nombreCompleto || (meta ? nombreCompleto(meta) : "Desconocido"),
                    rol: a.rol || "Auditor",
                  };
                })
                // 3) Redundancia de seguridad: excluye contra el líder por cualquiera de los dos campos
                .filter(a => Number(a.idUsuario) !== Number(rawLiderId) && Number(a.idAuditor) !== Number(rawLiderId));
            } catch (err) {
              auditoresAdicionales = [];
            }

            return {
              id: auditoria.idAuditoria,
              title: `${auditoria.nombreProceso ?? ''} - ${auditoria.tipoAuditoria}`,
              start,
              end,
              descripcion: auditoria.descripcion,
              estado: auditoria.estado,
              tipo: (auditoria.tipoAuditoria || "").toLowerCase() === "externa" ? "Externa" : "Interna",
              proceso: auditoria.nombreProceso ?? '',
              entidad: auditoria.nombreEntidad ?? '',
              hora: auditoria.horaProgramada,
              idProceso: Number(auditoria.idProceso) || undefined,
              auditorLider: { idUsuario: Number(auditoria.auditorLider), idAuditor: Number(auditoria.auditorLider), nombre: nombreLider },
              auditorLiderId: Number(auditoria.auditorLider),
              auditoresAdicionales
            };
          } catch (error) {
            return null; // Retornar null para filtrar después
          }
        })
      );

      // Filtrar auditorías nulas (que fallaron en el procesamiento)
      const auditoriasFiltradas = auditorias.filter(a => a && !isNaN(a.start?.getTime()) && !isNaN(a.end?.getTime()));
      setEvents(auditoriasFiltradas);
      setLoadingList(false);

    } catch (error) {
      setHasError(true);

      // Mensaje más específico según el tipo de error
      let errorMessage = "Error al cargar auditorías";

      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        errorMessage = "Error de conexión. Verifique su internet e intente nuevamente.";
      } else if (error.response?.status === 404) {
        errorMessage = "No se pudo encontrar el recurso solicitado.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Error del servidor. Por favor, intente más tarde.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error"
      });
      setEvents([]); // Limpiar eventos en caso de error
      setLoadingList(false);
    } finally {
      setLoadingList(false);
    }
  }, [usuario, rolActivo, idProceso, auditoresIndex]);

  // Función para recargar con los mismos parámetros
  const refetch = useCallback(() => {
    if (lastFetchParams) {
      fetchAuditorias(lastFetchParams);
    }
  }, [lastFetchParams, fetchAuditorias]);

  useEffect(() => {
    const cargarDatosBase = async () => {
      try {
        const [resEntidades, resAuditores, resProcesosCE] = await Promise.all([
          axios.get("http://localhost:8000/api/entidad-nombres"),
          axios.get("http://localhost:8000/api/auditores"),
          axios.get("http://localhost:8000/api/procesos-con-entidad"),
        ]);

        setEntidades(resEntidades.data?.nombres || []);

        setAuditores(resAuditores.data?.data || []);

        const ce = (resProcesosCE.data?.procesos || []).map(p => ({
          id: Number(p.idProceso),
          nombre: p.nombreCompleto,
          nombreEntidad: p.nombreEntidad,
          nombreProceso: p.nombreProceso,
        }));
        setProcesosCE(ce);
      } catch (err) {
        // Nunca bloquear pantalla
        setEntidades([]);
        setAuditores([]);
        setProcesosCE([]);
      } finally {
        // Cierra loader SIEMPRE
        setLoadingList(false);
      }
    };

    cargarDatosBase();
  }, []);

  const obtenerProcesosPorEntidad = async (entidadNombre) => {
    try {
      const res = await axios.get("http://localhost:8000/api/procesos-por-nombre-entidad", {
        params: { nombre: entidadNombre }
      });
      const opts = (res.data.procesos || []).map(p => p.nombreProceso);
      setProcesos(opts)
    } catch (err) {
      setProcesos([]);
    }
  };


  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  return {
    events,
    setEvents,
    entidades,
    procesos,
    procesosCE,
    auditores,
    loadingList,
    snackbar,
    setSnackbar,
    handleCloseSnackbar,
    obtenerProcesosPorEntidad,
    fetchAuditorias,
    hasError,
    refetch,
  };
};

export default useAuditoriaData;
