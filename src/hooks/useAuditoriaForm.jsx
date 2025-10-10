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

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Forzar array en auditoresAdicionales
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "auditoresAdicionales"
          ? Array.isArray(value)
            ? value
            : [value]
          : value,
    }));
  };

  const handleEditOpen = () => {
    if (!selectedEvent) return;

    const tipoUI = (selectedEvent.tipo || "").toLowerCase();
    const isExterna = tipoUI === "externa";

    // 1) Toma SIEMPRE el idUsuario del líder (o su fallback llano)
    const leaderIdUsuario = Number(
      selectedEvent.auditorLider?.idUsuario ??
      selectedEvent.auditorLider ??
      selectedEvent.auditorLiderId ??
      NaN
    );

    // 2) Normaliza IDs de adicionales y quita al líder si por error viene adentro
    const adicionalesIds = (selectedEvent.auditoresAdicionales || [])
      .map(a => Number(a.idUsuario ?? a.idAuditor ?? a.id))
      .filter(v => !Number.isNaN(v))
      .filter(v => v !== leaderIdUsuario);

    setFormData({
      entidad: selectedEvent.entidad || "",
      proceso: selectedEvent.proceso || "",
      fecha: moment(selectedEvent.start).format("YYYY-MM-DD"),
      procesoId: Number(selectedEvent.idProceso || ""),
      hora: moment(selectedEvent.start).format("HH:mm"),
      tipo: tipoUI,
      estado: (selectedEvent.estado || "Pendiente").toLowerCase(),
      descripcion: selectedEvent.descripcion || "",
      auditoresAdicionales: isExterna ? [] : adicionalesIds,
      auditorLider: isExterna ? "" : (Number.isNaN(leaderIdUsuario) ? "" : leaderIdUsuario),
      idAuditoria: selectedEvent.id
    });
  };

  const resetForm = () => setFormData(initialFormData);

  const handleSubmit = async (hasErrors = false) => {
    // Si el componente reporta errores, mostrar SnackBar general y salir
    if (hasErrors) {
      setSnackbar({
        open: true,
        message: "Se deben completar todos los campos obligatorios.",
        severity: "error"
      });
      return;
    }

    // Si llegamos aquí, no hay errores del componente, proceder con el envío
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

    // Validación mínima (defensiva del servidor)
    if (!entidad || !procesoId || !fecha || !hora || !tipo || !estado || !descripcion) {
      setSnackbar({ open: true, message: "Todos los campos son obligatorios.", severity: "error" });
      return;
    }

    // Validación horario SGC: entre 08:00 y 17:00 (inclusive)
    const horaParts = String(hora).split(':').map(Number);
    if (horaParts.length < 2 || isNaN(horaParts[0]) || isNaN(horaParts[1])) {
      setSnackbar({ open: true, message: "Formato de hora inválido.", severity: "error" });
      return;
    }
    const minutesOfDay = horaParts[0] * 60 + horaParts[1];
    const minAllowed = 8 * 60;   // 08:00
    const maxAllowed = 17 * 60;  // 17:00
    if (minutesOfDay < minAllowed || minutesOfDay > maxAllowed) {
      setSnackbar({ open: true, message: "La hora debe estar entre 08:00 y 17:00.", severity: "error" });
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
        });

        if (!isExterna) {
          const leaderId = isExterna ? null : Number(auditorLider);
          const ids = (audAdic || [])
            .map(Number)
            .filter((v) => !Number.isNaN(v))
            .filter((v) => leaderId == null || v !== leaderId);
          await axios.post("http://127.0.0.1:8000/api/auditores-asignados", {
            idAuditoria: selectedEvent.id,
            auditores: ids,
            auditorLider: auditorLider || null
          });
        }

        const start = isoFrom(fecha, hora);
        const end = add1h(start);

        const liderObj = !isExterna
          ? auditores.find(a => Number(a.idUsuario) === Number(auditorLider))
          : null;

        const nombreLider = liderObj
          ? [liderObj.nombre, liderObj.apellidoPat, liderObj.apellidoMat].filter(Boolean).join(" ")
          : (isExterna ? "No aplica" : "Auditor Externo");

        const nuevosAuditores = !isExterna
          ? (audAdic || [])
            .filter((id) => Number(id) !== Number(auditorLider))
            .map((id) => {
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
              proceso,
              entidad,
              hora,
              auditorLider: isExterna
                ? null
                : { idUsuario: Number(auditorLider || 0), idAuditor: Number(auditorLider || 0), nombre: nombreLider },

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
          ...(isExterna ? {} : { auditoresAdicionales: (audAdic || []).map(Number).filter(v => !Number.isNaN(v)) })
        });

        const auditoriaResp = res?.data?.auditoria ?? res?.data ?? {};
        const idNueva = auditoriaResp.idAuditoria ?? auditoriaResp.id ?? undefined;

        if (!isExterna && idNueva) {
          const leaderId = isExterna ? null : Number(auditorLider);
          const ids = (audAdic || [])
            .map(Number)
            .filter((v) => !Number.isNaN(v))
            .filter((v) => leaderId == null || v !== leaderId); if (ids.length > 0) {
              await axios.post("http://127.0.0.1:8000/api/auditores-asignados", {
                idAuditoria: idNueva,
                auditores: ids,
                auditorLider: leaderId || null
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
          proceso,
          entidad,
          hora,
          auditorLider: isExterna
            ? null
            : { idAuditor: auditorLider || null, nombre: nombreLider },
          auditoresAdicionales: isExterna
            ? []
            : (audAdic || []).filter(x => Number(x) !== Number(auditorLider)).map((id) => {
              const a = auditores.find((x) => Number(x.idUsuario) === Number(id));
              const nombre = a ? [a.nombre, a.apellidoPat, a.apellidoMat].filter(Boolean).join(" ") : "Desconocido";
              return { idUsuario: Number(id), idAuditor: Number(id), nombre };
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
