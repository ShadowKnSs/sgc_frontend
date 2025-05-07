import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/es";
import axios from "axios";

moment.locale("es");
const localizer = momentLocalizer(moment);

function Cronograma() {
  // Se obtiene el usuario y el rol activo desde el localStorage.
  // Se asume que "usuario" posee la propiedad "idUsuario" y
  // que "rolActivo" es un objeto con "nombreRol" y un arreglo "permisos".
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const idUsuario = usuario?.idUsuario || 0;
  const rolActivo = JSON.parse(localStorage.getItem("rolActivo") || "null");
  // Se derivan los permisos del rolActivo; por ejemplo, si se debe tener acceso al módulo "Cronograma"
  const permisos = rolActivo?.permisos?.map(p => p.modulo) || [];

  const [events, setEvents] = useState([ ]);
  const [entidades, setEntidades] = useState([]);
  const [procesos, setProcesos] = useState([]);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    console.log("🔐 Enviando ID y rol al backend:", idUsuario, rolActivo);
    axios
      .post("http://127.0.0.1:8000/api/cronograma/filtrar", {
        idUsuario,
        // Se envía el nombre del rol, por ejemplo: rolActivo.nombreRol o, alternativamente, podrías enviar directamente el arreglo de permisos
        rolActivo: rolActivo?.nombreRol || ""
      })
      .then((response) => {
        console.log("📊 Auditorías recibidas:", response.data);
        const auditorias = response.data.map((auditoria) => ({
          id: auditoria.idAuditoria,
          title: `${auditoria.nombreProceso} - ${auditoria.tipoAuditoria}`,
          start: new Date(`${auditoria.fechaProgramada}T${auditoria.horaProgramada}`),
          end: new Date(`${auditoria.fechaProgramada}T${auditoria.horaProgramada}`),
          descripcion: auditoria.descripcion,
          estado: auditoria.estado,
          tipo: auditoria.tipoAuditoria,
          proceso: auditoria.nombreProceso,
          entidad: auditoria.nombreEntidad,
          hora: auditoria.horaProgramada,
        }));
        setEvents(auditorias);
      })
      .catch((error) => {
        console.error("❌ Error al obtener las auditorías:", error);
      });
  }, [idUsuario, rolActivo]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/entidad-nombres")
      .then((response) => {
        setEntidades(response.data.nombres);
      })
      .catch((error) => {
        console.error("Error al obtener las entidades:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/procesos-nombres")
      .then((response) => {
        setProcesos(response.data.procesos);
      })
      .catch((error) => {
        console.error("Error al obtener los nombres de los procesos:", error);
      });
  }, []);

  const formats = {
    monthHeaderFormat: (date) =>
      capitalizeFirstLetter(moment(date).format("MMMM YYYY")),
    dayHeaderFormat: (date) =>
      capitalizeFirstLetter(moment(date).format("dddd, D")),
    dayRangeHeaderFormat: ({ start, end }) =>
      `${capitalizeFirstLetter(moment(start).format("D MMMM"))} - ${capitalizeFirstLetter(moment(end).format("D MMMM"))}`,
  };

  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    entidad: "",
    proceso: "",
    fecha: "",
    hora: "",
    tipo: "",
    estado: "",
    descripcion: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const permiteAcciones = () => {
    if (rolActivo?.permisos) {
      // Filtra todos los permisos asignados al módulo "Cronograma"
      const permisosModulo = rolActivo.permisos.filter(p => p.modulo === "Cronograma");
      // Si no hay permisos para ese módulo, no se permiten acciones
      if (!permisosModulo.length) return false;
      // Permite acciones si alguno de esos permisos tiene un tipoAcceso distinto a "Lectura"
      return permisosModulo.some(p => p.tipoAcceso.toLowerCase() !== "lectura");
    }
    return false;
  };
  // Función para abrir el formulario en modo creación
  const handleOpenForm = () => {
    setIsEditing(false);
    setFormData({
      entidad: "",
      proceso: "",
      fecha: "",
      hora: "",
      tipo: "",
      estado: "",
      descripcion: "",
    });
    setOpenForm(true);
  };

  // Función para abrir el modal de detalles de una auditoría
  const handleOpenDetails = (event) => {
    console.log("Evento seleccionado:", event);
    setSelectedEvent(event);
    setOpenDetails(true);
  };

  // Función para abrir el formulario en modo edición
  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      entidad: selectedEvent.entidad,
      proceso: selectedEvent.proceso,
      fecha: moment(selectedEvent.start).format("YYYY-MM-DD"),
      hora: moment(selectedEvent.start).format("HH:mm"),
      tipo: selectedEvent.tipo,
      estado: selectedEvent.estado,
      descripcion: selectedEvent.descripcion,
    });
    setOpenDetails(false);
    setOpenForm(true);
  };

  const handleCloseForm = () => setOpenForm(false);
  const handleCloseDetails = () => setOpenDetails(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Guarda nueva auditoría o actualiza la existente
  const handleSubmit = async () => {
    if (
      formData.entidad &&
      formData.proceso &&
      formData.fecha &&
      formData.hora &&
      formData.tipo &&
      formData.estado &&
      formData.descripcion
    ) {
      try {
        if (isEditing) {
          await axios.put(`http://127.0.0.1:8000/api/cronograma/${selectedEvent.id}`, {
            fechaProgramada: formData.fecha,
            horaProgramada: formData.hora,
            tipoAuditoria: formData.tipo,
            estado: formData.estado,
            descripcion: formData.descripcion,
            nombreProceso: formData.proceso,
            nombreEntidad: formData.entidad,
          });
          setEvents(
            events.map((event) =>
              event.id === selectedEvent.id
                ? {
                  ...event,
                  start: new Date(`${formData.fecha}T${formData.hora}`),
                  end: new Date(`${formData.fecha}T${formData.hora}`),
                  descripcion: formData.descripcion,
                  estado: formData.estado,
                  tipo: formData.tipo,
                  proceso: formData.proceso,
                  entidad: formData.entidad,
                  hora: formData.hora,
                }
                : event
            )
          );
          alert("Auditoría actualizada correctamente.");
        } else {
          const response = await axios.post("http://127.0.0.1:8000/api/cronograma", {
            fechaProgramada: formData.fecha,
            horaProgramada: formData.hora,
            tipoAuditoria: formData.tipo,
            estado: formData.estado,
            descripcion: formData.descripcion,
            nombreProceso: formData.proceso,
            nombreEntidad: formData.entidad,
          });
          const nuevaAuditoria = {
            id: response.data.auditoria.idAuditoria,
            title: `${response.data.auditoria.nombreProceso} - ${response.data.auditoria.tipoAuditoria}`,
            start: new Date(`${response.data.auditoria.fechaProgramada}T${response.data.auditoria.horaProgramada}`),
            end: new Date(`${response.data.auditoria.fechaProgramada}T${response.data.auditoria.horaProgramada}`),
            descripcion: response.data.auditoria.descripcion,
            estado: response.data.auditoria.estado,
            tipo: response.data.auditoria.tipoAuditoria,
            proceso: response.data.auditoria.nombreProceso,
            entidad: response.data.auditoria.nombreEntidad,
            hora: response.data.auditoria.horaProgramada,
          };
          setEvents([...events, nuevaAuditoria]);
          alert("Auditoría creada exitosamente.");
        }
        setFormData({
          entidad: "",
          proceso: "",
          fecha: "",
          hora: "",
          tipo: "",
          estado: "",
          descripcion: "",
        });
        handleCloseForm();
      } catch (error) {
        console.error("Error al guardar la auditoría:", error.response ? error.response.data : error.message);
        alert("Hubo un error al guardar la auditoría.");
      }
    } else {
      alert("Todos los campos son obligatorios.");
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#f4f4f4",
        paddingTop: "20px",
        position: "relative",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontFamily: "'Roboto', sans-serif",
          color: "#004A98",
        }}
      >
        Cronograma de Auditorías
      </h1>
      <div style={{ height: "600px", width: "100%", maxWidth: "1000px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={["month", "week", "day"]}
          messages={{
            today: "Hoy",
            previous: "Anterior",
            next: "Siguiente",
            month: "Mes",
            week: "Semana",
            day: "Día",
          }}
          formats={formats}
          onSelectEvent={handleOpenDetails}
        />
      </div>

      {/* Se muestra el botón "Crear Auditoría" si el usuario tiene el permiso "Cronograma" */}
      {permiteAcciones() && (
        <Box sx={{ position: "absolute", bottom: "40px", right: "40px" }}>
          <Button variant="contained" color="primary" onClick={handleOpenForm}>
            Crear Auditoría
          </Button>
        </Box>
      )}

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? "Editar Auditoría" : "Crear Auditoría"}</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="space-between" gap={3} sx={{ width: "100%" }}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Entidad</InputLabel>
              <Select name="entidad" value={formData.entidad} onChange={handleChange}>
                {entidades.length > 0 ? (
                  entidades.map((entidad, index) => (
                    <MenuItem key={index} value={entidad}>
                      {entidad}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">Cargando...</MenuItem>
                )}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Proceso</InputLabel>
              <Select name="proceso" value={formData.proceso} onChange={handleChange}>
                {procesos.length > 0 ? (
                  procesos.map((proceso, index) => (
                    <MenuItem key={index} value={proceso}>
                      {proceso}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">Cargando...</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
          <Box display="flex" justifyContent="space-between" gap={3} sx={{ width: "100%", mt: 2 }}>
            <TextField
              margin="dense"
              label="Fecha"
              name="fecha"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.fecha}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Hora"
              name="hora"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.hora}
              onChange={handleChange}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" gap={3} sx={{ width: "100%", mt: 2 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Tipo de Auditoría</InputLabel>
              <Select name="tipo" value={formData.tipo} onChange={handleChange}>
                <MenuItem value="interna">Interna</MenuItem>
                <MenuItem value="externa">Externa</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Estado</InputLabel>
              <Select name="estado" value={formData.estado} onChange={handleChange}>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="Finalizada">Finalizada</MenuItem>
                <MenuItem value="Cancelada">Cancelada</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            margin="dense"
            label="Descripción"
            name="descripcion"
            fullWidth
            multiline
            rows={3}
            value={formData.descripcion}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {isEditing ? "Guardar Cambios" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDetails} onClose={handleCloseDetails}>
        <DialogTitle>Detalles de la Auditoría</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <>
              <Typography><strong>Entidad:</strong> {selectedEvent.entidad}</Typography>
              <Typography><strong>Proceso:</strong> {selectedEvent.proceso}</Typography>
              <Typography><strong>Fecha:</strong> {moment(selectedEvent.start).format("LL")}</Typography>
              <Typography><strong>Hora:</strong> {selectedEvent.hora}</Typography>
              <Typography><strong>Tipo:</strong> {selectedEvent.tipo}</Typography>
              <Typography><strong>Estado:</strong> {selectedEvent.estado}</Typography>
              <Typography><strong>Descripción:</strong> {selectedEvent.descripcion || "Sin descripción"}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="secondary">
            Cerrar
          </Button>
          {/* Se muestra el botón "Editar" si el usuario tiene el permiso "Cronograma".
              Ajusta la condición según la política de permisos para editar */}
          {permiteAcciones() && (
            <Button onClick={handleEdit} color="primary">
              Editar
            </Button>
          )}

        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Cronograma;
