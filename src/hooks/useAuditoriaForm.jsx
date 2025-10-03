import { useState } from "react";
import moment from "moment";
import axios from "axios";

const useAuditoriaForm = ({
  isEditing,
  selectedEvent,
  auditores,
  setEvents,
  handleCloseForm,
  setSnackbar,
  procesosCE = []
}) => {

  const [saving, setSaving] = useState(false);

  const initialFormData = {
    entidad: "",
    proceso: "",
    procesoId: "",
    fecha: "",
    hora: "",
    tipo: "",
    estado: "pendiente",
    descripcion: "",
    auditorLider: "",
    auditoresAdicionales: []
  };

  const [formData, setFormData] = useState(initialFormData);

  // helpers
  const toApiTipo = (t) => (t || "").toLowerCase();                 // "interna" | "externa"
  const toApiEstado = (e) =>
    e ? e.charAt(0).toUpperCase() + e.slice(1).toLowerCase() : e;   // Pendiente|Finalizada|Cancelada
  const isoFrom = (fecha, hora) => new Date(`${fecha}T${hora}:00`);
  const add1h = (date) => new Date(date.getTime() + 60 * 60 * 1000);

  /**
   * Cambio controlado de inputs
   * - Normaliza auditoresAdicionales a array
   * - Si cambia a "externa", limpia líder y adicionales
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Cambio de tipo: si pasa a "externa", limpiar líder y adicionales
    if (name === "tipo") {
      const isExterna = String(value).toLowerCase() === "externa";
      setFormData((prev) => ({
        ...prev,
        tipo: value,
        ...(isExterna ? { auditorLider: "", auditoresAdicionales: [] } : {})
      }));
      return;
    }

    // Forzar array en auditoresAdicionales
    if (name === "auditoresAdicionales") {
      setFormData((prev) => ({
        ...prev,
        auditoresAdicionales: Array.isArray(value) ? value : [value]
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Carga en modo edición
   * - Si el evento es externa, fuerza líder="" y adicionales=[]
   */
  const handleEditOpen = () => {
    if (!selectedEvent) return;

    const tipoUI = (selectedEvent.tipo || "").toLowerCase(); // "interna"|"externa" o ya mapeado en UI
    const isExterna = tipoUI === "externa";

    setFormData({
      entidad: selectedEvent.entidad || "",
      proceso: selectedEvent.proceso || "",
      fecha: moment(selectedEvent.start).format("YYYY-MM-DD"),
      procesoId: Number(selectedEvent.idProceso || ""),
      hora: moment(selectedEvent.start).format("HH:mm"),
      tipo: tipoUI,
      estado: (selectedEvent.estado || "Pendiente").toLowerCase(),
      descripcion: selectedEvent.descripcion || "",
      auditoresAdicionales: isExterna
        ? []
        : (selectedEvent.auditoresAdicionales || [])
            .map(a => Number(a.idAuditor ?? a.idUsuario ?? a.id))
            .filter(v => !Number.isNaN(v)),
      auditorLider: isExterna
        ? ""
        : (typeof selectedEvent.auditorLider === "object"
            ? Number(selectedEvent.auditorLider.idAuditor)
            : Number(selectedEvent.auditorLider ?? selectedEvent.auditorLiderId ?? NaN)) || "",
      idAuditoria: selectedEvent.id
    });
  };

  const resetForm = () => setFormData(initialFormData);

  /**
   * Guardado
   * - Si es "externa": no envía líder, no envía adicionales, no llama /auditores-asignados
   * - Render optimista consistente con lo anterior
   */
  const handleSubmit = async () => {
    const {
      entidad,
      proceso,
      procesoId,
      fecha,
      hora,
      tipo,
      estado,
      descripcion,
      auditorLider,
      auditoresAdicionales,
    } = formData;

    const idProceso = Number(procesoId);
    const audAdic = Array.isArray(auditoresAdicionales) ? auditoresAdicionales : [];
    const tipoApi = toApiTipo(tipo);
    const isExterna = tipoApi === "externa";

    // Validación mínima
    if (!entidad || !procesoId || !fecha || !hora || !tipo || !estado || !descripcion) {
      setSnackbar({ open: true, message: "Todos los campos son obligatorios.", severity: "error" });
      return;
    }

    setSaving(true);

    try {
      if (isEditing && selectedEvent) {
        // UPDATE
        await axios.put(`http://127.0.0.1:8000/api/cronograma/${selectedEvent.id}`, {
          idProceso,
          fechaProgramada: fecha,
          horaProgramada: hora,
          tipoAuditoria: tipoApi,
          estado: toApiEstado(estado),
          descripcion,
          auditorLider: isExterna ? null : (auditorLider || null),
          // No enviar auditoresAdicionales aquí para externa; el backend ya tiene la invariante
        });

        // Asignación de adicionales: SOLO si no es externa
        if (!isExterna) {
          const ids = (audAdic || []).map(Number).filter(v => !Number.isNaN(v));
          await axios.post("http://127.0.0.1:8000/api/auditores-asignados", {
            idAuditoria: selectedEvent.id,
            auditores: ids,
            auditorLider: auditorLider || null
          });
        }

        // Render optimista
        const start = isoFrom(fecha, hora);
        const end = add1h(start);

        const liderObj = !isExterna
          ? auditores.find(a => Number(a.idUsuario) === Number(auditorLider))
          : null;

        const nombreLider = liderObj
          ? [liderObj.nombre, liderObj.apellidoPat, liderObj.apellidoMat].filter(Boolean).join(" ")
          : (isExterna ? "No aplica" : "Auditor Externo");

        const nuevosAuditores = !isExterna
          ? (audAdic || []).map((id) => {
              const a = auditores.find((x) => Number(x.idUsuario) === Number(id));
              return {
                idAuditor: id,
                nombre: a
                  ? [a.nombre, a.apellidoPat, a.apellidoMat].filter(Boolean).join(" ")
                  : "Desconocido"
              };
            })
          : [];

        setEvents(prev => prev.map(ev =>
          ev.id === selectedEvent.id
            ? {
                ...ev,
                idProceso,
                start,
                end,
                descripcion,
                estado: toApiEstado(estado),
                tipo: isExterna ? "Externa" : "Interna",
                proceso,        // UI
                entidad,        // UI
                hora,
                auditorLider: isExterna
                  ? null
                  : { idAuditor: auditorLider, nombre: nombreLider },
                auditoresAdicionales: nuevosAuditores
              }
            : ev
        ));

        setSnackbar({ open: true, message: "Auditoría actualizada correctamente.", severity: "success" });
      } else {
        // CREATE
        const res = await axios.post("http://127.0.0.1:8000/api/cronograma", {
          idProceso,
          fechaProgramada: fecha,
          horaProgramada: hora,
          tipoAuditoria: tipoApi,
          estado: toApiEstado(estado),
          descripcion,
          auditorLider: isExterna ? null : (auditorLider || null),
          // Para no externas podrías seguir enviando auditoresAdicionales si tu back lo procesa en store.
          ...(isExterna ? {} : { auditoresAdicionales: (audAdic || []).map(Number).filter(v => !Number.isNaN(v)) })
        });

        const auditoriaResp = res?.data?.auditoria ?? res?.data ?? {};
        const idNueva = auditoriaResp.idAuditoria ?? auditoriaResp.id ?? undefined;

        // Para externas NO llamar /auditores-asignados
        if (!isExterna && idNueva) {
          const ids = (audAdic || []).map(Number).filter(v => !Number.isNaN(v));
          if (ids.length > 0) {
            await axios.post("http://127.0.0.1:8000/api/auditores-asignados", {
              idAuditoria: idNueva,
              auditores: ids,
              auditorLider: auditorLider || null
            });
          }
        }

        const start = isoFrom(auditoriaResp.fechaProgramada || fecha, auditoriaResp.horaProgramada || hora);
        const end = add1h(start);

        const liderObj = !isExterna
          ? auditores.find(a => Number(a.idUsuario) === Number(auditorLider))
          : null;

        const nombreLider = liderObj
          ? [liderObj.nombre, liderObj.apellidoPat, liderObj.apellidoMat].filter(Boolean).join(" ")
          : (isExterna ? "No aplica" : "Auditor Externo");

        const nuevaAuditoria = {
          id: idNueva,
          idProceso,
          title: `${proceso} - ${isExterna ? "Externa" : "Interna"}`,
          start,
          end,
          descripcion,
          estado: auditoriaResp.estado || toApiEstado(estado),
          tipo: isExterna ? "Externa" : "Interna",
          proceso,   // UI
          entidad,   // UI
          hora,
          auditorLider: isExterna
            ? null
            : { idAuditor: auditorLider || null, nombre: nombreLider },
          auditoresAdicionales: isExterna
            ? []
            : (audAdic || []).map((id) => {
                const a = auditores.find((x) => Number(x.idUsuario) === Number(id));
                return {
                  idAuditor: id,
                  nombre: a
                    ? [a.nombre, a.apellidoPat, a.apellidoMat].filter(Boolean).join(" ")
                    : "Desconocido"
                };
              }),
        };

        setEvents(prev => [...prev, nuevaAuditoria]);

        setSnackbar({
          open: true,
          message: "Auditoría creada correctamente",
          severity: "success",
        });
      }

      resetForm();
      handleCloseForm();
    } catch (error) {
      const msg = error?.response?.data?.message || "Hubo un error al guardar la auditoría.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    resetForm,
    handleEditOpen,
    saving
  };
};

export default useAuditoriaForm;
