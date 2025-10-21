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

import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import BreadcrumbNav from "../components/BreadcrumbNav";
import { Box, Typography } from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Title from "../components/Title";
import CircularProgress from '@mui/material/CircularProgress';
import CustomButton from '../components/Button';
import FeedbackSnackbar from '../components/Feedback';
import AuditoriaCalendar from "../components/AuditoriaCalendar";
import AuditoriaForm from "../components/Forms/AddAuditoriaForm";
import DetallesAuditoriaDialog from "../components/Modals/DetallesAuditoriaDialog";
import useAuditoriaData from "../hooks/useAuditoriaData";
import useAuditoriaForm from "../hooks/useAuditoriaForm";

function Cronograma() {
  // Se obtiene el usuario y el rol activo desde el localStorage.
  // Se asume que "usuario" posee la propiedad "idUsuario" y
  // que "rolActivo" es un objeto con "nombreRol" y un arreglo "permisos".
  const usuario = useMemo(() => JSON.parse(localStorage.getItem("usuario") || "null"), []);
  const rolActivo = useMemo(() => JSON.parse(localStorage.getItem("rolActivo") || "null"), []);

  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const { idProceso } = useParams();
  const [openForm, setOpenForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleCloseForm = () => setOpenForm(false);
  const {
    events,
    setEvents,
    entidades,
    procesos,
    auditores,
    procesosCE,
    loadingList,
    snackbar,
    setSnackbar,
    handleCloseSnackbar,
    obtenerProcesosPorEntidad,
    fetchAuditorias,
    hasError
  } = useAuditoriaData(usuario, rolActivo, idProceso);

  const {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    handleEditOpen,
    saving
  } = useAuditoriaForm({
    isEditing,
    selectedEvent,
    auditores,
    setEvents,
    handleCloseForm,
    setSnackbar,
    procesosCE
  });

  const LegendItem = ({ color, label }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: color }} />
      <Typography variant="caption">{label}</Typography>
    </Box>
  );
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const startOfWeek = (d) => {
    const sd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dow = sd.getDay(); // 0=Dom
    sd.setDate(sd.getDate() - dow);
    sd.setHours(0, 0, 0, 0);
    return sd;
  };
  const endOfWeek = (d) => {
    const s = startOfWeek(d);
    const e = new Date(s);
    e.setDate(s.getDate() + 6);
    e.setHours(23, 59, 59, 999);
    return e;
  };
  const monthRange = (d) => {
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    // Rango visible completo (semanas completas)
    const from = startOfWeek(first);
    const to = endOfWeek(last);
    return { from: fmt(from), to: fmt(to) };
  };
  const weekRange = (d) => ({ from: fmt(startOfWeek(d)), to: fmt(endOfWeek(d)) });
  const dayRange = (d) => ({ from: fmt(d), to: fmt(d) });
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
      procesoId: "",
      fecha: "",
      hora: "",
      tipo: "",
      estado: "pendiente",
      descripcion: "",
      auditorLider: "",
      auditoresAdicionales: []
    });
    setOpenForm(true);
  };

  // Función para abrir el modal de detalles de una auditoría
  const handleOpenDetails = (event) => {
    console.log("Evento seleccionado:", event);
    setSelectedEvent(event);
    setOpenDetails(true);
  };


  const handleEdit = () => {
    if (selectedEvent?.entidad) {
      obtenerProcesosPorEntidad(selectedEvent.entidad);
    }
    handleEditOpen();
    setOpenDetails(false);
    setIsEditing(true);
    setOpenForm(true);
  };


  const handleCloseDetails = () => setOpenDetails(false);

  const handleEntidadChange = (nombreEntidad) => {
    obtenerProcesosPorEntidad(nombreEntidad);
  };

  // 1) Estados controlados de vista y fecha
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (!usuario || !rolActivo?.nombreRol) return;

    const r =
      view === 'month' ? monthRange(date) :
        view === 'week' ? weekRange(date) :
          dayRange(date);

    fetchAuditorias(r).then(() => {
      // Marcar que la carga inicial está completa
      if (!initialLoadComplete) {
        setInitialLoadComplete(true);
      }
    });
  }, [view, date, usuario, rolActivo, fetchAuditorias]);

  const safeEvents = Array.isArray(events) ? events : [];

  return (
    <Box
      sx={{
        p: 1,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        paddingTop: "20px",
        position: "relative",
      }}
    >
      <BreadcrumbNav items={[{ label: "Cronograma", icon: CalendarMonthIcon }]} />
      <Title text="Cronograma de Auditorías" mode="sticky" />

      {loadingList && (
        <Box sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(255,255,255,0.6)",
          zIndex: 10,
        }}
        >
          <Box role="status" aria-live="polite" sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Cargando auditorías…
            </Typography>
          </Box>
        </Box>
      )}

      {/* Estado de error - solo mostrar cuando hay error de conexión */}
      {hasError && !loadingList && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            flexDirection: "column",
            gap: 2,
            mb: 2
          }}
        >
          <Typography variant="h6" color="error" textAlign="center">
            Error al cargar auditorías
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No se pudieron cargar las auditorías. Por favor, intente nuevamente.
          </Typography>
          <CustomButton
            type="generar"
            onClick={() => {
              const r = view === 'month' ? monthRange(date) :
                view === 'week' ? weekRange(date) : dayRange(date);
              fetchAuditorias(r);
            }}
          >
            Reintentar
          </CustomButton>
        </Box>
      )}
      {/* Estado sin datos */}
      {!loadingList && !hasError && safeEvents.length === 0 && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 2, gap: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            No se encontraron auditorías para este mes.
          </Typography>
        </Box>
      )}


      {/* EL CALENDARIO SIEMPRE SE MUESTRA - incluso si no hay eventos o hay error */}
      {/* Solo ocultar si está cargando por primera vez y hay error */}
      {!(loadingList && hasError) && (
        <AuditoriaCalendar
          events={safeEvents}
          view={view}
          date={date}
          setView={setView}
          setDate={setDate}
          onSelectEvent={handleOpenDetails}
          // Prop adicional para mostrar estado vacío dentro del calendario
          isEmpty={!loadingList && safeEvents.length === 0}
        />
      )}

      {/* Se muestra el botón "Crear Auditoría" si el usuario tiene el permiso "Cronograma" */}
      <Box
        sx={{
          position: "absolute",
          bottom: 470,
          right: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 1.25,
          zIndex: 20,
        }}
      >
        {/* Botón visible solo para usuarios con permisos */}
        {permiteAcciones() && (
          <CustomButton type="generar" onClick={handleOpenForm}>
            Crear Auditoría
          </CustomButton>
        )}

        {/* Leyenda visible para todos */}
        <Box
          component="aside"
          aria-label="Leyenda de estados"
          sx={{
            p: 1,
            marginTop: 1,
            borderRadius: 1,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: 1,
            minWidth: 125,
          }}
        >
          <Typography variant="overline" sx={{ color: "text.secondary" }}>
            Estados
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 0.5 }}>
            <LegendItem color="#0288d1" label="Pendiente" />
            <LegendItem color="#2e7d32" label="Finalizada" />
            <LegendItem color="#c62828" label="Cancelada" />
          </Box>
        </Box>
      </Box>



      <AuditoriaForm
        open={openForm}
        onClose={handleCloseForm}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        entidades={entidades}
        procesos={procesos}
        auditores={auditores}
        isEditing={isEditing}
        onEntidadChange={handleEntidadChange}
        procesosCE={procesosCE}
        saving={saving}
      />


      <DetallesAuditoriaDialog
        open={openDetails}
        onClose={handleCloseDetails}
        event={selectedEvent}
        onEdit={handleEdit}
        auditores={auditores}
        puedeEditar={permiteAcciones()}
      />

      <FeedbackSnackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        type={snackbar.severity}
        message={snackbar.message}
        autoHideDuration={3000}
      />
    </Box >
  );
}

export default Cronograma;