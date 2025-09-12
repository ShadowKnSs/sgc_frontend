import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

const useAuditoriaData = (usuario, rolActivo, idProceso = null) => {
  const [events, setEvents] = useState([]);
  const [entidades, setEntidades] = useState([]);
  const [procesos, setProcesos] = useState([]);
  const [procesosCE, setProcesosCE] = useState([]);
  const [auditores, setAuditores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const nombreCompleto = (p) =>
    [p?.nombre, p?.apellidoPat, p?.apellidoMat].filter(Boolean).join(" ");

  const auditoresMap = useMemo(() => {
    return new Map(auditores.map(a => [a.idUsuario, a]));
  }, [auditores]);

  const fetchAuditorias = useCallback(async () => {
    if (!usuario || !rolActivo?.nombreRol) return;

    try {
      setLoading(true);
      let response;

      if (["Administrador", "Coordinador"].includes(rolActivo.nombreRol)) {
        response = await axios.get("http://localhost:8000/api/auditorias/todas", {
          params: { rol: rolActivo.nombreRol }
        });
      } else if (["Lider", "Líder"].includes(rolActivo.nombreRol)) {
        // ⬇️ NUEVO: auditorías de todos los procesos del líder (dueño)
        response = await axios.get(`http://localhost:8000/api/auditorias/lider/${usuario.idUsuario}`);
      } else if (rolActivo.nombreRol === "Auditor") {
        // ⬇️ NUEVO: auditorías donde el usuario está asignado
        response = await axios.get(`http://localhost:8000/api/auditorias/auditor/${usuario.idUsuario}`);
      } else if (rolActivo.nombreRol === "Supervisor") {
        response = await axios.get(`http://localhost:8000/api/auditorias/supervisor/${usuario.idUsuario}`);
      } else if (idProceso) {
        // Filtro por proceso específico (p.ej. vista /cronograma/:idProceso)
        response = await axios.post("http://localhost:8000/api/cronograma/filtrar", { idProceso });
      } else {
        setEvents([]);
        return;
      }

      const auditoriasRaw = response.data;
      if (!Array.isArray(auditoriasRaw) || auditoriasRaw.length === 0) {
        setEvents([]);
        return;
      }

      const auditorias = await Promise.all(
        auditoriasRaw.map(async (auditoria) => {
          const start = new Date(`${auditoria.fechaProgramada}T${auditoria.horaProgramada}`);
          const end = new Date(start.getTime() + 60 * 60 * 1000);

          const lider = auditoresMap.get(auditoria.auditorLider);
          const nombreLider = lider ? nombreCompleto(lider) : (auditoria.nombreAuditorLider || "No asignado");

          let auditoresAdicionales = [];
          try {
            const res = await axios.get(`http://localhost:8000/api/auditores-asignados/${auditoria.idAuditoria}`);
            auditoresAdicionales = (Array.isArray(res.data) ? res.data : [])
              .filter(a => Number(a.idAuditor) !== Number(auditoria.auditorLider))
              .map(a => ({
                idAuditor: Number(a.idAuditor),
                nombre: a.nombreCompleto,
                rol: a.rol || "Auditor"
              }));
          } catch (err) {
            console.warn(`No se pudieron cargar auditores adicionales para auditoría ${auditoria.idAuditoria}`);
          }

          return {
            id: auditoria.idAuditoria,
            title: `${auditoria.nombreProceso ?? ''} - ${auditoria.tipoAuditoria}`,
            start, end,
            descripcion: auditoria.descripcion,
            estado: auditoria.estado,
            tipo: (auditoria.tipoAuditoria || "").toLowerCase() === "externa" ? "Externa" : "Interna",
            proceso: auditoria.nombreProceso ?? '',
            entidad: auditoria.nombreEntidad ?? '',
            hora: auditoria.horaProgramada,
            auditorLider: { idAuditor: auditoria.auditorLider, nombre: nombreLider },
            auditorLiderId: auditoria.auditorLider,
            auditoresAdicionales
          };
        })
      );

      setEvents(auditorias);
    } catch (error) {
      console.error("❌ Error al obtener auditorías", error);
      setSnackbar({ open: true, message: "Error al cargar auditorías", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [usuario, rolActivo, idProceso, auditoresMap]);

  useEffect(() => {
    if (auditores.length > 0) fetchAuditorias();
  }, [fetchAuditorias, auditores]);

  useEffect(() => {
    const cargarDatosBase = async () => {
      try {
        const [resEntidades, resAuditores, resProcesosCE] = await Promise.all([
          axios.get("http://localhost:8000/api/entidad-nombres"),
          axios.get("http://localhost:8000/api/auditores"),
          axios.get("http://localhost:8000/api/procesos-con-entidad"),
        ]);
        setEntidades(resEntidades.data.nombres);
        setAuditores(resAuditores.data.data);
        console.log("📥 Respuesta ENTIDADES cruda:", resEntidades.data);
        console.log("📥 Respuesta AUDITORES cruda:", resAuditores.data);

        const ce = (resProcesosCE.data?.procesos || []).map(p => ({
          id: Number(p.idProceso),
          nombre: p.nombreCompleto,         // "Entidad - Proceso"
          nombreEntidad: p.nombreEntidad,
          nombreProceso: p.nombreProceso,
        }));
        setProcesosCE(ce);
      } catch (err) {
        console.error("❌ Error al cargar datos base:", err);
      }
    };
    cargarDatosBase();
  }, []);

  const obtenerProcesosPorEntidad = async (entidadNombre) => {
    try {
      const res = await axios.get("http://localhost:8000/api/procesos-por-nombre-entidad", {
        params: { nombre: entidadNombre }
      });
      // ✅ ahora mantenemos id + nombre
      const opts = (res.data.procesos || []).map(p => ({
        id: Number(p.idProceso),
        nombre: p.nombreProceso
      }));
      setProcesos(opts);
    } catch (err) {
      console.error("❌ Error al obtener procesos:", err);
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
    loading,
    setLoading,
    snackbar,
    setSnackbar,
    handleCloseSnackbar,
    obtenerProcesosPorEntidad
  };
};

export default useAuditoriaData;
