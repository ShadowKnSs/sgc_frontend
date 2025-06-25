import { useState } from "react";
import moment from "moment";
import axios from "axios";

const useAuditoriaForm = ({ isEditing, selectedEvent, auditores, setEvents, handleCloseForm, setSnackbar, setLoading }) => {
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
    setFormData((prev) => ({
      ...prev,
      [name]: name === "auditoresAdicionales" ? (Array.isArray(value) ? value : [value]) : value,
    }));
  };

  const handleEditOpen = () => {
    if (!selectedEvent) return;
    setFormData({
      entidad: selectedEvent.entidad,
      proceso: selectedEvent.proceso,
      fecha: moment(selectedEvent.start).format("YYYY-MM-DD"),
      hora: moment(selectedEvent.start).format("HH:mm"),
      tipo: selectedEvent.tipo,
      estado: selectedEvent.estado,
      descripcion: selectedEvent.descripcion,
      auditorLider: selectedEvent.auditorLiderId || "",
      auditoresAdicionales: selectedEvent.auditoresAdicionales?.map(a => a.id) || []
    });
  };

  const resetForm = () => setFormData(initialFormData);

  const handleSubmit = async () => {
    const {
      entidad, proceso, fecha, hora, tipo, estado,
      descripcion, auditorLider, auditoresAdicionales
    } = formData;

    if (!entidad || !proceso || !fecha || !hora || !tipo || !estado || !descripcion) {
      setSnackbar({ open: true, message: "Todos los campos son obligatorios.", severity: "warning" });
      return;
    }

    setLoading(true);

    try {
      if (isEditing && selectedEvent) {
        await axios.put(`http://127.0.0.1:8000/api/cronograma/${selectedEvent.id}`, {
          fechaProgramada: fecha,
          horaProgramada: hora,
          tipoAuditoria: tipo,
          estado,
          descripcion,
          nombreProceso: proceso,
          nombreEntidad: entidad,
          auditorLider: auditorLider || null,

        });

        await axios.post("http://127.0.0.1:8000/api/auditores-asignados", {
          idAuditoria: selectedEvent.id,
          auditores: auditoresAdicionales
        });

        const nuevosAuditores = auditoresAdicionales.map(id => {
          const auditor = auditores.find(a => a.idUsuario === id);
          return {
            id,
            nombre: auditor ? `${auditor.nombre} ${auditor.apellidoPat}` : 'Desconocido'
          };
        });

        setEvents(prev => prev.map(event =>
          event.id === selectedEvent.id
            ? {
              ...event, start: new Date(`${fecha}T${hora}`), end: new Date(`${fecha}T${hora}`),
              descripcion, estado, tipo, proceso, entidad, hora, auditorLider, auditoresAdicionales: nuevosAuditores
            }
            : event
        ));

        setSnackbar({ open: true, message: "Auditoría actualizada correctamente.", severity: "success" });
      } else {
        const res = await axios.post("http://127.0.0.1:8000/api/cronograma", {
          fechaProgramada: fecha,
          horaProgramada: hora,
          tipoAuditoria: tipo,
          estado,
          descripcion,
          nombreProceso: proceso,
          nombreEntidad: entidad,
          auditorLider: auditorLider || null,
        });

        const idNueva = res.data.auditoria.idAuditoria;

        if (auditoresAdicionales?.length > 0) {
          await axios.post("http://127.0.0.1:8000/api/auditores-asignados", {
            idAuditoria: idNueva,
            auditores: auditoresAdicionales
          });
        }

        const nuevaAuditoria = {
          id: idNueva,
          title: `${res.data.auditoria.nombreProceso} - ${res.data.auditoria.tipoAuditoria}`,
          start: new Date(`${res.data.auditoria.fechaProgramada}T${res.data.auditoria.horaProgramada}`),
          end: new Date(`${res.data.auditoria.fechaProgramada}T${res.data.auditoria.horaProgramada}`),
          descripcion,
          estado,
          tipo,
          proceso,
          entidad,
          hora,
          auditorLider,
          auditorLiderId: auditorLider,
          auditoresAdicionales: auditoresAdicionales.map(id => {
            const auditor = auditores.find(a => a.idUsuario === id);
            return {
              id,
              nombre: auditor ? `${auditor.nombre} ${auditor.apellidoPat}` : 'Desconocido'
            };
          })
        };

        setEvents(prev => [...prev, nuevaAuditoria]);

        setSnackbar({
          open: true,
          message: auditoresAdicionales.length > 0
            ? "Auditoría creada con auditores asignados correctamente"
            : "Auditoría creada correctamente",
          severity: "success"
        });


      }

      resetForm();
      handleCloseForm();
    } catch (error) {
      console.error("Error al guardar la auditoría:", error.response ? error.response.data : error.message);
      setSnackbar({ open: true, message: "Hubo un error al guardar la auditoría.", severity: "error" });
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
