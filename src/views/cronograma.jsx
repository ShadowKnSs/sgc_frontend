import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/es";

moment.locale("es");

const localizer = momentLocalizer(moment);

function Cronograma() {

  const [events, setEvents] = useState([ ]);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const formats = {
    monthHeaderFormat: (date) =>
      capitalizeFirstLetter(moment(date).format("MMMM YYYY")), 
    dayHeaderFormat: (date) =>
      capitalizeFirstLetter(moment(date).format("dddd, D")),
    dayRangeHeaderFormat: ({ start, end }) =>
      `${capitalizeFirstLetter(moment(start).format("D MMMM"))} - ${capitalizeFirstLetter(
        moment(end).format("D MMMM")
      )}`,
  };

  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ entidad: "", proceso: "", fecha: "", hora: "", tipo: "", estado: "", descripcion: "", });
  const [isEditing, setIsEditing] = useState(false);

  // Abrir modal de creación de auditoría
  const handleOpenForm = () => {
    setIsEditing(false);
    setFormData({ entidad: "", proceso: "", fecha: "", hora: "", tipo: "", estado: "", descripcion: "", });
    setOpenForm(true);
  };

  // Abrir modal de detalles
  const handleOpenDetails = (event) => {
    setSelectedEvent(event);
    setOpenDetails(true);
  };

  // Abrir modal de edición
  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      entidad: selectedEvent.entidad,
      proceso: selectedEvent.proceso,
      fecha: moment(selectedEvent.fecha).format("YYYY-MM-DD"),
      hora: selectedEvent.hora,
      tipo: selectedEvent.tipo,
      estado: selectedEvent.estado,
      descripcion: selectedEvent.descripcion,
    });
    setOpenDetails(false);
    setOpenForm(true);
  };

  // Cerrar modales
  const handleCloseForm = () => setOpenForm(false);
  const handleCloseDetails = () => setOpenDetails(false);

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Guardar nueva auditoría o actualizar existente
  const handleSubmit = () => {
    if (formData.entidad && formData.proceso && formData.fecha && formData.hora && formData.tipo && formData.estado && formData.descripcion) {
      const fechaHora = new Date(`${formData.fecha}T${formData.hora}`);
      const nuevoEvento = {
        title: `${formData.proceso} - ${formData.tipo}`,
        start: fechaHora,
        end: fechaHora,
        entidad: formData.entidad,
        proceso: formData.proceso,
        fecha: formData.fecha,
        hora: formData.hora,
        tipo: formData.tipo,
        estado: formData.estado,
        descripcion: formData.descripcion,
      };
      if (isEditing) {
        setEvents(events.map((ev) => (ev === selectedEvent ? nuevoEvento : ev)));
      } else {
        setEvents([...events, nuevoEvento]);
      }
      setFormData({ entidad: "", proceso: "", fecha: "", hora: "", tipo: "", estado: "", descripcion: "", });
      handleCloseForm();
    } else {
      alert("Todos los campos son obligatorios.");
    }
  };

  return (
    <Box
      sx={{ p: 4, height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", backgroundColor: "#f4f4f4", paddingTop: "20px", position: "relative", }}
    >
      <h1
        style={{ textAlign: "center", marginBottom: "20px", fontFamily: "'Roboto', sans-serif", color: "#004A98", }}
      >
        Cronograma de Auditorías
      </h1>
      <div style={{ height: "600px", width: "100%", maxWidth: "1000px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
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

      <Box sx={{ position: "absolute", bottom: "40px", right: "40px" }}>
        <Button variant="contained" color="primary" onClick={handleOpenForm}>
          Crear Auditoría
        </Button>
      </Box>

      {/* Formulario (Crear o Editar) */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? "Editar Auditoría" : "Crear Auditoría"}</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="space-between" gap={3} sx={{ width: '100%' }}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Entidad</InputLabel>
              <Select name="entidad" value={formData.entidad} onChange={handleChange}>
                <MenuItem value="Entidad 1">Entidad 1</MenuItem>
                <MenuItem value="Entidad 2">Entidad 2</MenuItem>
                <MenuItem value="Entidad 3">Entidad 3</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Proceso</InputLabel>
              <Select name="proceso" value={formData.proceso} onChange={handleChange}>
                <MenuItem value="Proceso 1">Proceso 1</MenuItem>
                <MenuItem value="Proceso 2">Proceso 2</MenuItem>
                <MenuItem value="Proceso 3">Proceso 3</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box display="flex" justifyContent="space-between" gap={3} sx={{ width: '100%', mt: 2 }}>
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
          <Box display="flex" justifyContent="space-between" gap={3} sx={{ width: '100%', mt: 2 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Tipo</InputLabel>
              <Select name="tipo" value={formData.tipo} onChange={handleChange}>
                <MenuItem value="Interna">Interna</MenuItem>
                <MenuItem value="Externa">Externa</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Estado</InputLabel>
              <Select name="estado" value={formData.estado} onChange={handleChange}>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="En proceso">En proceso</MenuItem>
                <MenuItem value="Finalizada">Finalizada</MenuItem>
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
              <Typography><strong>Fecha:</strong> {moment(selectedEvent.fecha).format("LL")}</Typography>
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
          <Button onClick={handleEdit} color="primary">
            Editar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Cronograma;