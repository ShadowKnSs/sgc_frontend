import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function Cronograma() {
  const [events, setEvents] = useState([
    {
      title: "Auditoría 1",
      start: new Date(2025, 9, 25, 10, 0),
      end: new Date(2025, 9, 25, 12, 0),
      proceso: "Proceso A",
      entidad: "Entidad X",
      auditor: "Juan Pérez",
      observaciones: "Revisión de documentación.",
    },
    {
      title: "Auditoría 2",
      start: new Date(2025, 9, 26, 14, 0),
      end: new Date(2025, 9, 26, 16, 0),
      proceso: "Proceso B",
      entidad: "Entidad Y",
      auditor: "María López",
      observaciones: "Verificación de cumplimiento.",
    },
  ]);

  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    proceso: "",
    entidad: "",
    fecha: "",
    auditor: "",
    observaciones: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Abrir modal de creación de auditoría
  const handleOpenForm = () => {
    setIsEditing(false);
    setFormData({ proceso: "", entidad: "", fecha: "", auditor: "", observaciones: "" });
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
      proceso: selectedEvent.proceso,
      entidad: selectedEvent.entidad,
      fecha: moment(selectedEvent.start).format("YYYY-MM-DDTHH:mm"),
      auditor: selectedEvent.auditor,
      observaciones: selectedEvent.observaciones,
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
    if (formData.proceso && formData.entidad && formData.fecha && formData.auditor) {
      const fecha = new Date(formData.fecha);
      const nuevoEvento = {
        title: `${formData.proceso} - ${formData.auditor}`,
        start: fecha,
        end: new Date(fecha.getTime() + 2 * 60 * 60 * 1000), // Duración de 2 horas
        proceso: formData.proceso,
        entidad: formData.entidad,
        auditor: formData.auditor,
        observaciones: formData.observaciones,
      };

      if (isEditing) {
        // Editar evento existente
        setEvents(events.map((ev) => (ev === selectedEvent ? nuevoEvento : ev)));
      } else {
        // Crear nuevo evento
        setEvents([...events, nuevoEvento]);
      }

      setFormData({ proceso: "", entidad: "", fecha: "", auditor: "", observaciones: "" });
      handleCloseForm();
    } else {
      alert("Todos los campos son obligatorios excepto Observaciones.");
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
          onSelectEvent={handleOpenDetails} // Al hacer clic en una auditoría, muestra detalles
        />
      </div>

      <Box sx={{ position: "absolute", bottom: "40px", right: "40px" }}>
        <Button variant="contained" color="primary" onClick={handleOpenForm}>
          Crear Auditoría
        </Button>
      </Box>

      {/* Modal de formulario (Crear o Editar) */}
      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>{isEditing ? "Editar Auditoría" : "Crear Auditoría"}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Proceso" name="proceso" fullWidth value={formData.proceso} onChange={handleChange} />
          <TextField margin="dense" label="Entidad" name="entidad" fullWidth value={formData.entidad} onChange={handleChange} />
          <TextField
            margin="dense"
            label="Fecha"
            name="fecha"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.fecha}
            onChange={handleChange}
          />
          <TextField margin="dense" label="Auditor" name="auditor" fullWidth value={formData.auditor} onChange={handleChange} />
          <TextField margin="dense" label="Observaciones" name="observaciones" fullWidth multiline rows={3} value={formData.observaciones} onChange={handleChange} />
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

      {/* Modal para ver detalles de la auditoría */}
      <Dialog open={openDetails} onClose={handleCloseDetails}>
        <DialogTitle>Detalles de la Auditoría</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <>
              <Typography><strong>Proceso:</strong> {selectedEvent.proceso}</Typography>
              <Typography><strong>Entidad:</strong> {selectedEvent.entidad}</Typography>
              <Typography><strong>Fecha:</strong> {moment(selectedEvent.start).format("LLL")}</Typography>
              <Typography><strong>Auditor:</strong> {selectedEvent.auditor}</Typography>
              <Typography><strong>Observaciones:</strong> {selectedEvent.observaciones || "Sin observaciones"}</Typography>
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
