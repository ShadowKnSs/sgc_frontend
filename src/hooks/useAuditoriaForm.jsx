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
  setLoading
}) => {
  const initialFormData = {
    entidad: "",
    proceso: "",
    procesoId: "",
    fecha: "",
    hora: "",
    tipo: "",
    estado: "Pendiente",
    descripcion: "",
    auditorLider: "",
    auditoresAdicionales: []
  };

  const [formData, setFormData] = useState(initialFormData);
  // helpers
  const toApiTipo = (t) => (t || "").toLowerCase(); // "interna" | "externa"
  const toApiEstado = (e) => (e ? e.charAt(0).toUpperCase() + e.slice(1).toLowerCase() : e); // Pendiente|Finalizada|Cancelada
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

    console.log("Datos del evento para edición:", selectedEvent);

    setFormData({
      entidad: selectedEvent.entidad || "",
      proceso: selectedEvent.proceso || "",
      fecha: moment(selectedEvent.start).format("YYYY-MM-DD"),
      procesoId: Number(selectedEvent.idProceso || ""),
      hora: moment(selectedEvent.start).format("HH:mm"),
      tipo: (selectedEvent.tipo || "").toLowerCase(),
      estado: (selectedEvent.estado || "Pendiente").toLowerCase(),
      descripcion: selectedEvent.descripcion || "",
      auditoresAdicionales:
        (selectedEvent.auditoresAdicionales || [])
          .map(a => Number(a.idAuditor ?? a.idUsuario ?? a.id))
          .filter(v => !Number.isNaN(v)),
      auditorLider:
        typeof selectedEvent.auditorLider === "object"
          ? Number(selectedEvent.auditorLider.idAuditor)
          : Number(selectedEvent.auditorLider ?? selectedEvent.auditorLiderId ?? NaN) || "",
      idAuditoria: selectedEvent.id // Añadir el ID de la auditoría
    });
  };

  const resetForm = () => setFormData(initialFormData);

  const handleSubmit = async () => {
    const {
      entidad,
      proceso,
      procesoId,    // 👈
      fecha,
      hora,
      tipo,
      estado,
      descripcion,
      auditorLider,
      auditoresAdicionales,
    } = formData;


    const idProceso = Number(procesoId);
    // Asegurar array
    const audAdic = Array.isArray(auditoresAdicionales)
      ? auditoresAdicionales
      : [];

    if (!entidad || !procesoId || !fecha || !hora || !tipo || !estado || !descripcion) {
      setSnackbar({ open: true, message: "Todos los campos son obligatorios.", severity: "error" });
      return;
    }


    setLoading(true);

    try {
      if (isEditing && selectedEvent) {
        // UPDATE
        await axios.put(`http://127.0.0.1:8000/api/cronograma/${selectedEvent.id}`, {
          idProceso,                       // NUEVO: envía id si cambiaste de proceso
          fechaProgramada: fecha,
          horaProgramada: hora,
          tipoAuditoria: toApiTipo(tipo),
          estado: toApiEstado(estado),
          descripcion,
          auditorLider: auditorLider || null,
        });

        // Asignaciones (incluye líder automáticamente en back; aquí solo extras)
        await axios.post("http://127.0.0.1:8000/api/auditores-asignados", {
          idAuditoria: selectedEvent.id,
          auditores: audAdic,             // ids de usuario (≡ idAuditor en back)
          auditorLider                     // opcional, para marcar rol en este endpoint
        });

        const start = isoFrom(fecha, hora);
        const end = add1h(start);

        // Render optimista
        const liderObj = auditores.find(a => Number(a.idUsuario) === Number(auditorLider));
        const nombreLider = liderObj
          ? [liderObj.nombre, liderObj.apellidoPat, liderObj.apellidoMat].filter(Boolean).join(" ")
          : "No asignado";

        const nuevosAuditores = audAdic.map((id) => {
          const a = auditores.find((x) => Number(x.idUsuario) === Number(id));
          return { idAuditor: id, nombre: a ? [a.nombre, a.apellidoPat, a.apellidoMat].filter(Boolean).join(" ") : "Desconocido" };
        });

        setEvents(prev => prev.map(ev =>
          ev.id === selectedEvent.id
            ? {
              ...ev,
              start, end,
              descripcion,
              estado: toApiEstado(estado),
              tipo: toApiTipo(tipo) === "externa" ? "Externa" : "Interna",
              proceso,        // solo para UI
              entidad,        // solo para UI
              hora,
              auditorLider: { idAuditor: auditorLider, nombre: nombreLider },
              auditoresAdicionales: nuevosAuditores
            }
            : ev
        ));

        setSnackbar({ open: true, message: "Auditoría actualizada correctamente.", severity: "success" });
      } else {
        // CREATE
        const res = await axios.post("http://127.0.0.1:8000/api/cronograma", {
          idProceso,                       // NUEVO: base por id
          fechaProgramada: fecha,
          horaProgramada: hora,
          tipoAuditoria: toApiTipo(tipo),
          estado: toApiEstado(estado),
          descripcion,
          auditorLider: auditorLider || null,
          auditoresAdicionales: audAdic    // opcional en create
        });

        const auditoriaResp = res?.data?.auditoria ?? {};
        const idNueva = auditoriaResp.idAuditoria;

        // Nota: ya insertaste extras en store; si prefieres consolidar en un solo roundtrip,
        // puedes omitir la llamada a /auditores-asignados aquí.

        const start = isoFrom(auditoriaResp.fechaProgramada, auditoriaResp.horaProgramada);
        const end = add1h(start);

        const liderObj = auditores.find(a => Number(a.idUsuario) === Number(auditorLider));
        const nombreLider = liderObj
          ? [liderObj.nombre, liderObj.apellidoPat, liderObj.apellidoMat].filter(Boolean).join(" ")
          : "No asignado";

        const nuevaAuditoria = {
          id: idNueva,
          title: `${proceso} - ${toApiTipo(tipo) === "externa" ? "Externa" : "Interna"}`,
          start, end,
          descripcion,
          estado: auditoriaResp.estado,  // Pendiente|Finalizada|Cancelada
          tipo: toApiTipo(tipo) === "externa" ? "Externa" : "Interna",
          proceso,                       // UI
          entidad,                       // UI
          hora,
          auditorLider: { idAuditor: auditorLider, nombre: nombreLider },
          auditoresAdicionales: audAdic.map((id) => {
            const a = auditores.find((x) => Number(x.idUsuario) === Number(id));
            return { idAuditor: id, nombre: a ? [a.nombre, a.apellidoPat, a.apellidoMat].filter(Boolean).join(" ") : "Desconocido" };
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
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    resetForm,
    handleEditOpen,
  };
};

export default useAuditoriaForm;
