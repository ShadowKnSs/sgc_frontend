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
    fecha: "",
    hora: "",
    tipo: "",
    estado: "Pendiente",
    descripcion: "",
    auditorLider: "",
    auditoresAdicionales: []
  };

  const [formData, setFormData] = useState(initialFormData);

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
    hora: moment(selectedEvent.start).format("HH:mm"),
    tipo: selectedEvent.tipo || "",
    estado: selectedEvent.estado || "Pendiente",
    descripcion: selectedEvent.descripcion || "",
    auditorLider: selectedEvent.auditorLiderId || "",
    auditoresAdicionales: selectedEvent.auditoresAdicionales?.map((a) => a.idUsuario) || [],
    idAuditoria: selectedEvent.id // Añadir el ID de la auditoría
  });
};

  const resetForm = () => setFormData(initialFormData);

  const handleSubmit = async () => {
    const {
      entidad,
      proceso,
      fecha,
      hora,
      tipo,
      estado,
      descripcion,
      auditorLider,
      auditoresAdicionales,
    } = formData;

    // Asegurar array
    const audAdic = Array.isArray(auditoresAdicionales)
      ? auditoresAdicionales
      : [];

    if (
      !entidad ||
      !proceso ||
      !fecha ||
      !hora ||
      !tipo ||
      !estado ||
      !descripcion
    ) {
      setSnackbar({
        open: true,
        message: "Todos los campos son obligatorios.",
        severity: "erroR"
      });
      return;
    }

    setLoading(true);

    try {
      if (isEditing && selectedEvent) {
        // UPDATE
        await axios.put(
          `http://127.0.0.1:8000/api/cronograma/${selectedEvent.id}`,
          {
            fechaProgramada: fecha,
            horaProgramada: hora,
            // Si tu backend necesita minúsculas, deja toLowerCase:
            tipoAuditoria: (tipo || "").toLowerCase(),
            estado: (estado || "").toLowerCase(),
            descripcion,
            nombreProceso: proceso,
            nombreEntidad: entidad,
            auditorLider: auditorLider || null,
          }
        );

        // Guardar auditores adicionales
        await axios.post("http://127.0.0.1:8000/api/auditores-asignados", {
          idAuditoria: selectedEvent.id,
          auditores: audAdic,
        });

        const nuevosAuditores = audAdic.map((id) => {
          const auditor = auditores.find((a) => a.idUsuario === id);
          return {
            id,
            nombre: auditor
              ? `${auditor.nombre} ${auditor.apellidoPat}${auditor.apellidoMat ? ` ${auditor.apellidoMat}` : ""}`
              : "Desconocido",
          };
        });

        // Nombre del líder (para mostrar en el tooltip)
        const liderObj = auditores.find(a => a.idUsuario === Number(auditorLider));
        const nombreLider = liderObj
          ? `${liderObj.nombre} ${liderObj.apellidoPat}${liderObj.apellidoMat ? ` ${liderObj.apellidoMat}` : ""}`.trim()
          : "No asignado";

        setEvents((prev) =>
          prev.map((event) =>
            event.id === selectedEvent.id
              ? {
                ...event,
                start: new Date(`${fecha}T${hora}`),
                end: new Date(`${fecha}T${hora}`),
                descripcion,
                estado: (estado || "").toLowerCase(),
                tipo: (tipo || "").toLowerCase(),
                proceso,
                entidad,
                hora,
                auditorLider: nombreLider,     // << nombre para tooltip
                auditorLiderId: auditorLider,  // << id para lógica
                auditoresAdicionales: nuevosAuditores,
              }
              : event
          )
        );

        setSnackbar({
          open: true,
          message: "Auditoría actualizada correctamente.",
          severity: "success",
        });
      } else {
        // CREATE
        const res = await axios.post("http://127.0.0.1:8000/api/cronograma", {
          fechaProgramada: fecha,
          horaProgramada: hora,
          // Si tu backend espera mayúsculas, deja tal cual;
          // si espera minúsculas, cambia a (tipo || "").toLowerCase()
          tipoAuditoria: (tipo || ""),
          estado: (estado || ""),
          descripcion,
          nombreProceso: proceso,
          nombreEntidad: entidad,
          auditorLider: auditorLider || null,
        });

        // Respuesta robusta: intentar encontrar idAuditoria
        const auditoriaResp = res?.data?.auditoria ?? res?.data ?? {};
        const idNueva =
          auditoriaResp.idAuditoria ??
          auditoriaResp.id ??
          auditoriaResp?.data?.idAuditoria;

        // Si hay auditores adicionales, insertarlos
        if (audAdic.length > 0) {
          await axios.post("http://127.0.0.1:8000/api/auditores-asignados", {
            idAuditoria: idNueva,
            auditores: audAdic,
          });
        }

        // Nombre del líder (para mostrar en el tooltip)
        const liderObj = auditores.find(a => a.idUsuario === Number(auditorLider));
        const nombreLider = liderObj
          ? `${liderObj.nombre} ${liderObj.apellidoPat}${liderObj.apellidoMat ? ` ${liderObj.apellidoMat}` : ""}`.trim()
          : "No asignado";

        const nuevaAuditoria = {
          id: idNueva,
          title: `${auditoriaResp.nombreProceso} - ${auditoriaResp.tipoAuditoria}`,
          start: new Date(
            `${auditoriaResp.fechaProgramada}T${auditoriaResp.horaProgramada}`
          ),
          end: new Date(
            `${auditoriaResp.fechaProgramada}T${auditoriaResp.horaProgramada}`
          ),
          descripcion,
          estado: (estado || "").toLowerCase(),
          tipo: (tipo || "").toLowerCase(),
          proceso,
          entidad,
          hora,
          auditorLider: nombreLider,     // << nombre para tooltip
          auditorLiderId: auditorLider,  // << id para lógica
          auditoresAdicionales: audAdic.map((id) => {
            const auditor = auditores.find((a) => a.idUsuario === id);
            return {
              id,
              nombre: auditor
                ? `${auditor.nombre} ${auditor.apellidoPat}${auditor.apellidoMat ? ` ${auditor.apellidoMat}` : ""}`
                : "Desconocido",
            };
          }),
        };

        setEvents((prev) => [...prev, nuevaAuditoria]);

        setSnackbar({
          open: true,
          message:
            audAdic.length > 0
              ? "Auditoría creada con auditores asignados correctamente"
              : "Auditoría creada correctamente",
          severity: "success",
        });
      }

      resetForm();
      handleCloseForm();
    } catch (error) {
      console.error(
        "Error al guardar la auditoría:",
        error?.response ? error.response.data : error?.message
      );
      setSnackbar({
        open: true,
        message: "Hubo un error al guardar la auditoría.",
        severity: "error",
      });
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
