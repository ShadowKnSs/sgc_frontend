/**
 * Componente: Cronograma
 * Ubicación: src/views/Cronograma.jsx
 *
 * Descripción:
 * Vista principal del calendario de auditorías. Utiliza `react-big-calendar` para mostrar
 * eventos correspondientes a auditorías planeadas, con posibilidad de crearlas, editarlas y
 * visualizarlas dependiendo del tipo de usuario y sus permisos.
 *
 * Funcionalidades:
 * 1. Visualiza un calendario de auditorías con eventos coloreados según su estado (Pendiente, Finalizada, Cancelada).
 * 2. Modal de creación y edición de auditorías (formulario reactivo).
 * 3. Modal de detalles de auditoría (visualización).
 * 4. Soporte para asignar auditores líderes y auditores adicionales.
 * 5. Validación de permisos con `permiteAcciones()` para restringir acciones según rol.
 * 6. Obtención de datos del backend para auditorías, entidades, procesos y auditores.
 *
 * Librerías usadas:
 * - `react-big-calendar`: para renderizar el calendario.
 * - `moment`: para manipulación de fechas.
 * - `axios`: para llamadas al backend.
 * - `@mui/material`: para diseño visual y componentes de UI.
 *
 * Estado:
 * - `events`: arreglo de auditorías formateadas como eventos para el calendario.
 * - `formData`: datos del formulario de auditoría (crear/editar).
 * - `entidades`, `procesos`, `auditores`: catálogos para el formulario.
 * - `snackbar`: control de alertas visuales.
 * - `openForm`, `openDetails`: control de modales.
 * - `isEditing`: determina si el formulario está en modo edición.
 * - `view`, `date`: vista activa y fecha activa del calendario.
 *
 * Comportamiento:
 * - Cuando se monta el componente:
 *    1. Se cargan auditorías mediante `POST /api/cronograma/filtrar`.
 *    2. Se obtienen auditores adicionales por auditoría desde `/api/auditores-asignados/:id`.
 *    3. Se cargan catálogos (`entidad-nombres`, `procesos-nombres`, `auditores`).
 *
 * - El evento al hacer click en el calendario llama a `handleOpenDetails`.
 * - El botón "Crear Auditoría" abre el formulario si el rol tiene permisos.
 * - Al guardar una auditoría nueva o editarla:
 *    - Se usa `POST /api/cronograma` o `PUT /api/cronograma/:id`.
 *    - Se guarda la asignación de auditores adicionales mediante `POST /api/auditores-asignados`.
 *
 * Custom Components:
 * - `CustomButton`: botón personalizado para acciones principales.
 * - `Title`, `DialogTitleCustom`: título general y título de modales.
 * - `FeedbackSnackbar`: notificaciones de éxito, error o advertencia.
 * - `CustomCalendarToolbar`: barra superior del calendario con botones personalizados.
 *
 * Consideraciones técnicas:
 * - Eventos se colorean con `eventPropGetter`:
 *    - Azul: pendiente
 *    - Verde: finalizada
 *    - Rojo: cancelada
 * - Se limita a vista mensual/semanal/diaria.
 * - Usa `Tooltip` para futuras mejoras (ej. descripción rápida en eventos).
 * - `auditorLider` e `auditoresAdicionales` son gestionados como IDs y nombres.
 *
 * Mejoras recomendadas:
 * - Soporte para eliminación de auditorías.
 * - Validaciones más estrictas en el formulario (formato, fechas futuras, etc.).
 * - Agrupamiento o filtros por entidad/proceso en el calendario.
 * - Exportación de eventos a PDF o Excel.
 * - Modo solo lectura para usuarios sin permisos sin mostrar botón "Crear".
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Dialog, DialogActions, DialogContent,  ListItemText, TextField, Typography, MenuItem, Select, InputLabel, FormControl, Tooltip, Chip, Checkbox } from "@mui/material";
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
  
    // Carga las auditorías
    const fetchAuditorias = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/cronograma/filtrar", {
          idUsuario: usuario.idUsuario,
          rolActivo: rolActivo.nombreRol
        });
        
        const auditorias = await Promise.all(response.data.map(async (auditoria) => {
          const auditorLider = auditores.find(a => a.idUsuario === auditoria.auditorLider);
          const nombreLider = auditorLider 
            ? `${auditorLider.nombre} ${auditorLider.apellidoPat} ${auditorLider.apellidoMat}`
            : "No asignado";
    
          let auditoresAdicionales = [];
          try {
            const resAdicionales = await axios.get(`http://127.0.0.1:8000/api/auditores-asignados/${auditoria.idAuditoria}`);
            auditoresAdicionales = resAdicionales.data.map(auditor => ({
              id: auditor.id,
              nombre: auditor.nombre,
            }));
          } catch (error) {
            console.error("Error al obtener auditores adicionales:", error);
          }
    
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
            auditorLider: nombreLider,
            auditorLiderId: auditoria.auditorLider,
            auditoresAdicionales: auditoresAdicionales
          };
        }));
        
        setEvents(auditorias);
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
    auditoresAdicionales: []
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
      auditoresAdicionales: selectedEvent.auditoresAdicionales?.map(a => a.id) || []
    });
    setOpenDetails(false);
    setOpenForm(true);
  };

  const handleCloseForm = () => setOpenForm(false);
  const handleCloseDetails = () => setOpenDetails(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'auditoresAdicionales') {
      setFormData({
        ...formData,
        [name]: Array.isArray(value) ? value : [value]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
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
      formData.descripcion &&
      formData.auditorLider
    ) {
      setLoading(true);
  
      try {
        if (isEditing) {
          // Edición de un evento existente
          try {
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
        
            await axios.post("http://127.0.0.1:8000/api/auditores-asignados", {
              idAuditoria: selectedEvent.id,
              auditores: formData.auditoresAdicionales
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
                      auditoresAdicionales: formData.auditoresAdicionales.map(id => {
                        const auditor = auditores.find(a => a.idUsuario === id);
                        return {
                          id,
                          nombre: auditor ? `${auditor.nombre} ${auditor.apellidoPat}` : 'Desconocido'
                        };
                      })
                    }
                  : event
              )
            );
        
            setSnackbar({ open: true, message: "Auditoría actualizada correctamente.", severity: "success" });
          } catch (error) {
            console.error("Error al actualizar auditoría:", error);
            setSnackbar({ open: true, message: "Error al actualizar auditoría", severity: "error" });
          }
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

          const auditoresAdicionales = formData.auditoresAdicionales?.length > 0 
            ? formData.auditoresAdicionales.map(id => {
                const auditor = auditores.find(a => a.idUsuario === id);
                return {
                  id,
                  nombre: auditor ? `${auditor.nombre} ${auditor.apellidoPat}` : 'Desconocido'
                };
              })
            : [];

          if (formData.auditoresAdicionales?.length > 0) {
            await axios.post("http://127.0.0.1:8000/api/auditores-asignados", {
              idAuditoria: response.data.auditoria.idAuditoria,
              auditores: formData.auditoresAdicionales
            });
          }

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
            auditorLiderId: response.data.auditoria.auditorLider,
            auditoresAdicionales: auditoresAdicionales
          };

          setEvents(prev => [...prev, nuevaAuditoria]);
          setSnackbar({ 
            open: true, 
            message: formData.auditoresAdicionales?.length > 0 
              ? "Auditoría creada con auditores asignados correctamente" 
              : "Auditoría creada correctamente", 
            severity: "success" 
          });
        }
  
        // Reiniciar el formulario
        setFormData({
          entidad: "",
          proceso: "",
          fecha: "",
          hora: "",
          tipo: "",
          estado: "Pendiente",
          descripcion: "",
          auditorLider: "",
          auditoresAdicionales: []
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
          <Select 
            name="auditorLider" 
            value={formData.auditorLider} 
            onChange={handleChange}
            required
          >
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

        <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
          <InputLabel>Auditores Adicionales (Opcional)</InputLabel>
          <Select
            multiple
            name="auditoresAdicionales"
            value={formData.auditoresAdicionales || []}
            onChange={handleChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected || []).map((id) => {
                  const auditor = auditores.find(a => a.idUsuario === id);
                  return auditor ? (
                    <Chip 
                      key={id} 
                      label={`${auditor.nombre} ${auditor.apellidoPat}`} 
                      size="small"
                      sx={{ margin: '2px' }}
                    />
                  ) : null;
                })}
              </Box>
            )}
          >
            {auditores
              .filter(a => formData.auditorLider ? a.idUsuario !== formData.auditorLider : true)
              .map((auditor) => (
                <MenuItem key={auditor.idUsuario} value={auditor.idUsuario}>
                  <Checkbox 
                    checked={(formData.auditoresAdicionales || []).includes(auditor.idUsuario)} 
                  />
                  <ListItemText 
                    primary={`${auditor.nombre} ${auditor.apellidoPat} ${auditor.apellidoMat}`} 
                  />
                </MenuItem>
              ))}
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

    <Dialog open={openDetails} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <DialogTitleCustom 
          title="Detalles de la Auditoría"
        />
      </Box>
      <DialogContent dividers>
        {selectedEvent && (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'max-content 1fr', 
            gap: 2,
            alignItems: 'center'
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Entidad:</Typography>
            <Typography>{selectedEvent.entidad}</Typography>
            
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Proceso:</Typography>
            <Typography>{selectedEvent.proceso}</Typography>
            
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Fecha:</Typography>
            <Typography>{moment(selectedEvent.start).format("LL")}</Typography>
            
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Hora:</Typography>
            <Typography>{selectedEvent.hora}</Typography>
            
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Tipo:</Typography>
            <Typography textTransform="capitalize">{selectedEvent.tipo}</Typography>
            
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Estado:</Typography>
            <Typography sx={{ 
              color: selectedEvent.estado === 'Finalizada' ? 'success.main' : 
                    selectedEvent.estado === 'Cancelada' ? 'error.main' : 'info.main',
              fontWeight: 500
            }}>
              {selectedEvent.estado}
            </Typography>
            
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Auditor Líder:
            </Typography>
            <Typography>
              {typeof selectedEvent.auditorLider === 'number'
                ? (() => {
                    const auditor = auditores.find(a => a.idUsuario === selectedEvent.auditorLider);
                    return auditor 
                      ? `${auditor.nombre} ${auditor.apellidoPat} ${auditor.apellidoMat}` 
                      : "No asignado";
                  })()
                : selectedEvent.auditorLider || "No asignado"}
            </Typography>

            {selectedEvent.auditoresAdicionales?.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', alignSelf: 'start' }}>Auditores Adicionales:</Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {selectedEvent.auditoresAdicionales.map((auditor, index) => (
                    <Typography component="li" key={index}>
                      {auditor.nombre}
                    </Typography>
                  ))}
                </Box>
              </>
            )}
            
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', alignSelf: 'start' }}>Descripción:</Typography>
            <Typography sx={{ whiteSpace: 'pre-line' }}>
              {selectedEvent.descripcion || "Sin descripción"}
            </Typography>
          </Box>
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