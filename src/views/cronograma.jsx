import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, MenuItem, Select, InputLabel, FormControl, Tooltip, Snackbar, Alert } from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/es";
import axios from "axios";
import Title from "../components/Title";
import CustomCalendarToolbar from "../components/BarraCalendario";
import CircularProgress from '@mui/material/CircularProgress';
import CustomButton from '../components/Button';
import DialogTitleCustom from '../components/TitleDialog';
import FeedbackSnackbar from '../components/Feedback';

moment.locale("es");
const localizer = momentLocalizer(moment);

function Cronograma() {
  // Se obtiene el usuario y el rol activo desde el localStorage.
  // Se asume que "usuario" posee la propiedad "idUsuario" y
  // que "rolActivo" es un objeto con "nombreRol" y un arreglo "permisos".
  const usuario = useMemo(() => JSON.parse(localStorage.getItem("usuario") || "null"), []);
  const rolActivo = useMemo(() => JSON.parse(localStorage.getItem("rolActivo") || "null"), []);

  const idUsuario = usuario?.idUsuario || 0;
  // Se derivan los permisos del rolActivo; por ejemplo, si se debe tener acceso al módulo "Cronograma"
  const permisos = rolActivo?.permisos?.map(p => p.modulo) || [];

  const [events, setEvents] = useState([ ]);
  const [entidades, setEntidades] = useState([]);
  const [procesos, setProcesos] = useState([]);
  const [auditores, setAuditores] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    if (!usuario || !rolActivo?.nombreRol) return;
  
    // En tu useEffect que carga las auditorías
    const fetchAuditorias = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/cronograma/filtrar", {
          idUsuario: usuario.idUsuario,
          rolActivo: rolActivo.nombreRol
        });
        
        const auditorias = response.data.map((auditoria) => {
          // Encuentra el auditor correspondiente
          const auditor = auditores.find(a => a.idUsuario === auditoria.auditorLider);
          const nombreAuditor = auditor 
            ? `${auditor.nombre} ${auditor.apellidoPat} ${auditor.apellidoMat}`
            : "No asignado";

          return {
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
            auditorLider: nombreAuditor, // Usamos el nombre en lugar del ID
            auditorLiderId: auditoria.auditorLider // Guardamos el ID por si lo necesitas
          };
        });
        
        setEvents([...auditorias]);
      } catch (error) {
        console.error("❌ Error al obtener las auditorías:", error);
      }
    };
  
    fetchAuditorias();
  }, [usuario, rolActivo, auditores]);

  // Obtener Entidades
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

  // Obtener Procesos
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

  // Obtener Auditores
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/auditores")
      .then((response) => {
        setAuditores(response.data.data);
      })
      .catch((error) => {
        console.error("Error al obtener los auditores:", error);
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
    auditorLider: "",
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

  const customEventStyleGetter = (event) => {
    let backgroundColor = "#1976d2";
    if (event.estado === "finalizada") backgroundColor = "#2e7d32";
    if (event.estado === "cancelada") backgroundColor = "#c62828";

    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        opacity: 0.95,
        color: "white",
        border: "1px solid white",
        paddingLeft: "6px",
        fontWeight: "500",
      },
    };
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // Función para abrir el formulario en modo creación
  const handleOpenForm = () => {
    setIsEditing(false);
    setFormData({
      entidad: "",
      proceso: "",
      fecha: "",
      hora: "",
      tipo: "",
      estado: "Pendiente",
      descripcion: "",
      auditorLider: "",
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
      auditorLider: selectedEvent.auditorLiderId || "",
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
    // Verificación de que todos los campos sean llenados
    if (
      formData.entidad &&
      formData.proceso &&
      formData.fecha &&
      formData.hora &&
      formData.tipo &&
      formData.estado &&
      formData.descripcion &&
      formData.auditorLider
    ) {
      setLoading(true);
  
      try {
        if (isEditing) {
          // Edición de un evento existente
          await axios.put(`http://127.0.0.1:8000/api/cronograma/${selectedEvent.id}`, {
            fechaProgramada: formData.fecha,
            horaProgramada: formData.hora,
            tipoAuditoria: formData.tipo,
            estado: formData.estado,
            descripcion: formData.descripcion,
            nombreProceso: formData.proceso,
            nombreEntidad: formData.entidad,
            auditorLider: formData.auditorLider,
          });
  
          setEvents(prevEvents =>
            prevEvents.map(event =>
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
                    auditorLider: formData.auditorLider,
                  }
                : event
            )
          );
  
          setSnackbar({ open: true, message: "Auditoría actualizada correctamente.", severity: "success" });
        } else {
          // Creación de una nueva auditoría
          const response = await axios.post("http://127.0.0.1:8000/api/cronograma", {
            fechaProgramada: formData.fecha,
            horaProgramada: formData.hora,
            tipoAuditoria: formData.tipo,
            estado: formData.estado,
            descripcion: formData.descripcion,
            nombreProceso: formData.proceso,
            nombreEntidad: formData.entidad,
            auditorLider: formData.auditorLider, 
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
            auditorLider: response.data.auditoria.auditorLider,
          };
  
          setEvents(prev => [...prev, nuevaAuditoria]);
          setSnackbar({ open: true, message: "Auditoría creada correctamente.", severity: "success" });
        }
  
        // Reiniciar el formulario
        setFormData({
          entidad: "",
          proceso: "",
          fecha: "",
          hora: "",
          tipo: "",
          estado: "",
          descripcion: "",
          auditorLider: "",
        });
  
        handleCloseForm();
      } catch (error) {
        console.error("Error al guardar la auditoría:", error.response ? error.response.data : error.message);
        setSnackbar({ open: true, message: "Hubo un error al guardar la auditoría.", severity: "error" });
      } finally {
        setLoading(false);
      }
    } else {
      setSnackbar({ open: true, message: "Todos los campos son obligatorios.", severity: "warning" });
    }
  };

  // 1) Estados controlados de vista y fecha
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());

  // 2) Handlers para que el Calendar te diga cuándo cambiar
  const handleView = useCallback((newView) => {
    setView(newView);
  }, []);

  const handleNavigate = useCallback((newDate) => {
    setDate(newDate);
  }, []);
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
      <Title text="Cronograma de Auditorías" />

      {loading && (
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <CircularProgress />
        </Box>
      )}

      <div style={{ height: "600px", width: "100%", maxWidth: "1000px" }}>
        <Calendar
          localizer={localizer}
          events={Array.isArray(events) ? events : []}
          view={view}
          date={date}
          onView={handleView}
          onNavigate={handleNavigate}
          startAccessor="start"
          endAccessor="end"
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
          eventPropGetter={customEventStyleGetter}
          components={{
            toolbar: CustomCalendarToolbar,
            event: ({ event }) => (
              <Tooltip /* … */>
                <span>{event.title}</span>
              </Tooltip>
            )
          }}
        />
      </div>

      {/* Se muestra el botón "Crear Auditoría" si el usuario tiene el permiso "Cronograma" */}
      {permiteAcciones() && (
        <Box sx={{ position: "absolute", bottom: "40px", right: "40px" }}>
          <CustomButton type="generar" onClick={handleOpenForm}>
            Crear Auditoría
          </CustomButton>
        </Box>
      )}

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <DialogTitleCustom 
            title={isEditing ? "Editar Auditoría" : "Crear Auditoría"} 
            subtitle=""
          />
        </Box>
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
              <Select name="estado" value={formData.estado} onChange={handleChange} disabled={!isEditing}>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="Finalizada">Finalizada</MenuItem>
                <MenuItem value="Cancelada">Cancelada</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <FormControl fullWidth margin="dense">
            <InputLabel>Líder Auditor</InputLabel>
            <Select name="auditorLider" value={formData.auditorLider} onChange={handleChange}>
              {auditores.length > 0 ? (
                auditores.map((auditor) => (
                  <MenuItem key={auditor.idUsuario} value={auditor.idUsuario}>
                    {`${auditor.nombre} ${auditor.apellidoPat} ${auditor.apellidoMat}`}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">Cargando...</MenuItem>
              )}
            </Select>
          </FormControl>

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
          <CustomButton type="cancelar" onClick={handleCloseForm} disabled={loading}>
            Cancelar
          </CustomButton>
          <CustomButton type="guardar" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              isEditing ? "Guardar Cambios" : "Agregar"
            )}
          </CustomButton>
        </DialogActions>
      </Dialog>

      <Dialog open={openDetails} onClose={handleCloseDetails}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <DialogTitleCustom 
            title="Detalles de la Auditoría"
            subtitle=""
          />
        </Box>
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
              <Typography><strong>Auditor Líder:</strong> {selectedEvent.auditorLider || "No asignado"}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <CustomButton type="cancelar" onClick={handleCloseDetails}>
            Cerrar
          </CustomButton>
          {permiteAcciones() && (
            <CustomButton type="aceptar" onClick={handleEdit}>
              Editar
            </CustomButton>
          )}
        </DialogActions>
      </Dialog>

      <FeedbackSnackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        type={snackbar.severity} 
        message={snackbar.message}
        autoHideDuration={3000}
      />
    </Box>
  );
}

export default Cronograma;