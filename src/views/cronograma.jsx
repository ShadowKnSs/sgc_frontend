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

import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import BreadcrumbNav from "../components/BreadcrumbNav";
import { Box } from "@mui/material";
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

  const idUsuario = usuario?.idUsuario || 0;
  // Se derivan los permisos del rolActivo; por ejemplo, si se debe tener acceso al módulo "Cronograma"
  const permisos = rolActivo?.permisos?.map(p => p.modulo) || [];
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
    loading,
    setLoading,
    snackbar,
    setSnackbar,
    handleCloseSnackbar,
    obtenerProcesosPorEntidad
  } = useAuditoriaData(usuario, rolActivo, idProceso);

  const {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    handleEditOpen,
    resetForm
  } = useAuditoriaForm({
    isEditing,
    selectedEvent,
    auditores,
    setEvents,
    handleCloseForm,
    setSnackbar,
    setLoading
  });

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


  const handleEdit = () => {
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

  return (
    <Box
      sx={{
        p: 1,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        backgroundColor: "#f4f4f4",
        paddingTop: "20px",
        position: "relative",
      }}
    >
      <BreadcrumbNav items={[{ label: "Cronograma", icon: CalendarMonthIcon }]} />
      <Title text="Cronograma de Auditorías" />

      {loading && (
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <CircularProgress />
        </Box>
      )}

      <AuditoriaCalendar
        events={events}
        view={view}
        date={date}
        setView={setView}
        setDate={setDate}
        onSelectEvent={handleOpenDetails}
      />

      {/* Se muestra el botón "Crear Auditoría" si el usuario tiene el permiso "Cronograma" */}
      {permiteAcciones() && (
        <Box sx={{ position: "absolute", bottom: "40px", right: "40px" }}>
          <CustomButton type="generar" onClick={handleOpenForm}>
            Crear Auditoría
          </CustomButton>
        </Box>
      )}

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
        loading={loading}
        onEntidadChange={handleEntidadChange}
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
    </Box>
  );
}

export default Cronograma;