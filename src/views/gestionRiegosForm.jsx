/**
 * Componente: FormularioGestionRiesgos
 * Ubicación: src/views/FormularioGestionRiesgos.jsx
 *
 * Descripción:
 * Este componente gestiona todo el flujo del módulo de "Gestión de Riesgos" asociado a un registro (`idRegistro`).
 * Permite registrar información general, añadir, editar y eliminar riesgos organizados por secciones.
 * El formulario se divide en tabs para cada una de las 4 etapas de la gestión del riesgo:
 *  - Identificación
 *  - Análisis
 *  - Tratamiento
 *  - Evaluación de la Efectividad
 *
 * Principales funcionalidades:
 * - Cargar o crear un registro en la tabla `gestionriesgos`.
 * - Consultar y manipular riesgos individuales.
 * - Modal dinámico para crear/editar riesgos paso a paso.
 * - Tabs para visualizar los riesgos agrupados por etapa.
 * - Permisos dinámicos basados en el rol activo (`soloLectura`, `puedeEditar`).
 * - Uso de snackbar y modales para confirmación y retroalimentación al usuario.

 * Hooks usados:
 * - `useParams`: para obtener `idRegistro` desde la URL.
 * - `useLocation`: para recuperar `rolActivo` enviado desde otra vista.
 * - `useEffect`: para cargar información al montar el componente.
 * - `useState`: para mantener todos los estados relacionados con la vista.

 * Componentes utilizados:
 * - `MenuNavegacionProceso`: barra de navegación lateral.
 * - `Title`, `TitleDialog`: componentes de encabezado estilizado.
 * - `FeedbackSnackbar`: muestra mensajes de éxito/error.
 * - `ConfirmDelete`, `ConfirmEdit`: modales de confirmación.
 * - `CustomButton`: botón personalizado reutilizable.

 * Estructura de secciones:
 * 1. Información general (`gestionriesgos`) con botón para guardar/editar.
 * 2. Tabla dinámica de riesgos dividida por etapa.
 * 3. Modal de creación/edición de riesgo paso a paso.
 * 4. Botón de agregar riesgo.
 *
 * Endpoints consumidos:
 * - `GET /api/gestionriesgos/{idRegistro}/datos-generales`: obtiene entidad, macroproceso y proceso.
 * - `GET /api/gestionriesgos/{idRegistro}`: consulta si ya existe un registro general.
 * - `GET /api/gestionriesgos/{idGesRies}/riesgos`: lista todos los riesgos asociados.
 * - `POST /api/gestionriesgos`: crear información general.
 * - `PUT /api/gestionriesgos/{idGesRies}`: actualizar información general.
 * - `POST /api/gestionriesgos/{idGesRies}/riesgos`: agregar nuevo riesgo.
 * - `PUT /api/gestionriesgos/{idGesRies}/riesgos/{idRiesgo}`: editar riesgo existente.
 * - `DELETE /api/gestionriesgos/{idGesRies}/riesgos/{idRiesgo}`: eliminar riesgo.

 * Datos calculados:
 * - NRP: Severidad × Ocurrencia
 * - Reevaluación NRP: Reevaluación Severidad × Reevaluación Ocurrencia
 * - Efectividad: compara el nuevo NRP con el anterior → “Mejoró” / “No mejoró”

 * Consideraciones:
 * - El diseño visual está optimizado para mostrar información estructurada.
 * - El modal de riesgos utiliza `sections[]` para navegar entre vistas paso a paso.
 * - La tabla de cada etapa se alimenta de `savedData[selectedTab]`.
 *
 * Posibles mejoras futuras:
 * - Validación con librerías como `Yup` o `Zod`.
 * - División del componente en subcomponentes (`FormSeccion`, `TablaRiesgos`, `ModalRiesgo`).
 * - Auto-guardado o borrador automático.
 * - Integración con análisis de riesgos históricos o comparativos.
 */

import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import {

  Box
} from "@mui/material";

import MenuNavegacionProceso from "../components/MenuProcesoEstructura";
import FeedbackSnackbar from "../components/Feedback";
import Title from "../components/Title";
import CustomButton from "../components/Button";
import ConfirmDelete from "../components/confirmDelete";
import ConfirmEdit from "../components/confirmEdit";
import useMenuProceso from "../hooks/useMenuProceso";
import Permiso from "../hooks/userPermiso";
import SectionTabs from "../components/SectionTabs";
import useGestionRiesgos from "../hooks/useGestionRiesgos";
import GestionRiesgosGeneral from "../components/GestionRiesgosGeneral";
import RiesgosTabs from "../components/RiesgosTabs";
import RiesgoModal from "../components/Modals/RiesgoModal";

// Las secciones del formulario de riesgos
const sections = ["IDENTIFICACIÓN", "ANÁLISIS", "TRATAMIENTO", "EVALUACIÓN DE LA EFECTIVIDAD"];

function FormularioGestionRiesgos() {
  // 1) Tomamos el idRegistro desde la URL
  const { idRegistro } = useParams();
  const location = useLocation();
  const yaGuardadoRef = useRef(false);

  const rolActivo = location.state?.rolActivo || JSON.parse(localStorage.getItem("rolActivo"));
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const userName = `${usuario?.nombre || ""} ${usuario?.apellidoPat || ""} ${usuario?.apellidoMat || ""}`.trim();
  const fechaHoy = new Date().toISOString().split("T")[0];
  const { soloLectura, puedeEditar } = Permiso("Gestión de Riesgo");
  const [modoEdicion, setModoEdicion] = useState(false);
  const menuItems = useMenuProceso();
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [confirmadoEditar, setConfirmadoEditar] = useState(false);

  // Estructura local para mostrar en la tabla “por secciones”

  // 5) Control de tabs (para la tabla de riesgos)
  const [selectedTab, setSelectedTab] = useState(0);

  // 6) Modal para crear/editar un riesgo
  const [openModal, setOpenModal] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRiesgo, setEditingRiesgo] = useState(null);



  // 7) Nuevo riesgo
  const [nuevoRiesgo, setNuevoRiesgo] = useState({
    idRiesgo: null,
    responsable: "",
    fuente: "",
    tipoRiesgo: "",
    descripcion: "",
    consecuencias: "",
    valorSeveridad: "",
    valorOcurrencia: "",
    actividades: "",
    accionMejora: "",
    fechaImp: "",
    fechaEva: "",
    reevaluacionSeveridad: "",
    reevaluacionOcurrencia: "",
    analisisEfectividad: "",
  });

  // 8) Confirmar eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);



  // Funcion para mostrar snackbar (FeedBack)
  const mostrarSnackbar = (type, title, message) => {
    setSnackbar({ open: true, type, title, message });
  };

  const cerrarSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const {
    gestionRiesgo,
    setGestionRiesgo,
    tieneGesRies,
    riesgos,
    savedData,
    handleGuardarGestionRiesgos,
    cargarRiesgos,
  } = useGestionRiesgos(idRegistro, mostrarSnackbar);

  useEffect(() => {
    // Solo ejecutar si es Líder y aún no se ha guardado
    if (rolActivo?.nombreRol !== "Líder" || yaGuardadoRef.current) return;

    // Solo ejecutar si ya tenemos la información de si existe o no el registro
    if (tieneGesRies !== null) {
      const actualizado = {
        ...gestionRiesgo,
        elaboro: userName,
        fechaelaboracion: fechaHoy,
      };

      handleGuardarGestionRiesgos(actualizado);
      yaGuardadoRef.current = true; // Marcar como guardado
    }
  }, [rolActivo, tieneGesRies, gestionRiesgo, userName, fechaHoy, handleGuardarGestionRiesgos]);



  // --------------------------------------------------------------------------
  // Handler de tabs (para la tabla de riesgos)
  // --------------------------------------------------------------------------
  const handleTabChange = (newIndex) => {
    console.log("[LOG] Cambio de tab a:", newIndex);
    setSelectedTab(newIndex);
  };


  // --------------------------------------------------------------------------
  // Handler para abirir modal
  // --------------------------------------------------------------------------
  const handleRequestEditRiesgo = () => {
    if (isEditing && !confirmadoEditar) {
      setConfirmEditOpen(true);
    } else {
      handleGuardarRiesgo();
    }

  };


  // --------------------------------------------------------------------------
  // Handler para CREAR/EDITAR un riesgo
  // --------------------------------------------------------------------------
  const handleGuardarRiesgo = async () => {
    if (!gestionRiesgo.idGesRies) {
      mostrarSnackbar("warning", "Falta información general", "Primero guarda los datos generales.");
      return;
    }

    if (!nuevoRiesgo.tipoRiesgo || !nuevoRiesgo.descripcion) {
      mostrarSnackbar("warning", "Campos requeridos", "Tipo de Riesgo y Descripción son obligatorios.");
      return;
    }

    const valorSeveridad = parseInt(nuevoRiesgo.valorSeveridad, 10) || 0;
    const valorOcurrencia = parseInt(nuevoRiesgo.valorOcurrencia, 10) || 0;
    const valorNRP = valorSeveridad * valorOcurrencia;

    const reevaluacionSeveridad = parseInt(nuevoRiesgo.reevaluacionSeveridad, 10) || 0;
    const reevaluacionOcurrencia = parseInt(nuevoRiesgo.reevaluacionOcurrencia, 10) || 0;
    const reevaluacionNRP = reevaluacionSeveridad * reevaluacionOcurrencia;

    const reevaluacionEfectividad = reevaluacionNRP < valorNRP ? "Mejoró" : "No mejoró";

    const payload = {
      ...nuevoRiesgo,
      valorNRP,
      reevaluacionNRP,
      reevaluacionEfectividad,
    };

    const url = isEditing
      ? `http://127.0.0.1:8000/api/gestionriesgos/${gestionRiesgo.idGesRies}/riesgos/${editingRiesgo.idRiesgo}`
      : `http://127.0.0.1:8000/api/gestionriesgos/${gestionRiesgo.idGesRies}/riesgos`;

    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        try {
          const errorJson = await response.json();
          console.error("[ERROR]", errorJson);
          throw new Error(errorJson.message || "Error al guardar el riesgo.");
        } catch {
          const text = await response.text();
          throw new Error(text || "Error desconocido al guardar el riesgo.");
        }
      }

      await cargarRiesgos(gestionRiesgo.idGesRies);

      mostrarSnackbar("success", "Riesgo guardado", isEditing ? "Riesgo actualizado correctamente." : "Riesgo agregado correctamente.");

      setOpenModal(false);
      setCurrentSection(0);
      setIsEditing(false);
      setEditingRiesgo(null);
      setNuevoRiesgo(nuevoRiesgo);
    } catch (err) {
      console.error("[ERROR] al crear/editar el riesgo:", err);
      mostrarSnackbar("error", "Error", "Ocurrió un problema al guardar el riesgo.");
    }
  };


  // --------------------------------------------------------------------------
  // Handler para editar
  // --------------------------------------------------------------------------
  const handleEditRiesgo = (riesgo) => {
    console.log("[LOG] handleEditRiesgo -> riesgo a editar:", riesgo);
    setEditingRiesgo(riesgo);
    setConfirmEditOpen(true);
  };

  // --------------------------------------------------------------------------
  // Handler para eliminar
  // --------------------------------------------------------------------------
  const handleDeleteRiesgo = (riesgo) => {
    console.log("[LOG] handleDeleteRiesgo -> riesgo a eliminar:", riesgo);
    setRowToDelete(riesgo);
    setDeleteDialogOpen(true);
  };
  const confirmDeleteRiesgo = async () => {
    if (!gestionRiesgo.idGesRies || !rowToDelete) {
      console.log("[LOG] Falta idGesRies o rowToDelete. No se puede eliminar.");
      setDeleteDialogOpen(false);
      return;
    }
    const url = `http://127.0.0.1:8000/api/gestionriesgos/${gestionRiesgo.idGesRies}/riesgos/${rowToDelete.idRiesgo}`;
    console.log("[LOG] Eliminando riesgo con:", url);

    try {
      const response = await fetch(url, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar el riesgo.");

      // Filtrar del state
      await cargarRiesgos(gestionRiesgo.idGesRies);
      mostrarSnackbar("success", "Eliminado", "Riesgo eliminado correctamente.");
    } catch (err) {
      console.error("[ERROR] al eliminar riesgo:", err);
      mostrarSnackbar("error", "Error", "Ocurrió un problema al eliminar el riesgo.");
    } finally {
      setDeleteDialogOpen(false);
      setRowToDelete(null);
    }
  };

  // --------------------------------------------------------------------------
  // Lógica para las secciones del modal de Riesgos
  // --------------------------------------------------------------------------
  const handleNextSection = () => {
    if (currentSection < 3) setCurrentSection(currentSection + 1);
  };
  const handlePreviousSection = () => {
    if (currentSection > 0) setCurrentSection(currentSection - 1);
  };

  const handleRiesgoChange = (e) => {
    const { name, value } = e.target;
    setNuevoRiesgo({ ...nuevoRiesgo, [name]: value });
  };

  return (

    <Box sx={{ width: "90%", margin: "auto", mt: 5, borderRadius: 3, boxShadow: 3, p: 3 }}>
      <Title text="Gestión de Riesgos"></Title>

      <MenuNavegacionProceso items={menuItems} />

      {/* === Sección de Info General (gestionriesgos) === */}

      <GestionRiesgosGeneral
        data={gestionRiesgo}
        onChange={(key, value) => setGestionRiesgo(prev => ({ ...prev, [key]: value }))}
        onSave={handleGuardarGestionRiesgos}
        puedeEditar={puedeEditar}
        modoEdicion={modoEdicion}
        setModoEdicion={setModoEdicion}
        tieneGesRies={tieneGesRies}
      />


      {/* === Tabs para los riesgos (solo si ya existe idGesRies) === */}
      {tieneGesRies && gestionRiesgo.idGesRies && (
        <>
          <SectionTabs
            sections={sections}
            selectedTab={selectedTab}
            onTabChange={handleTabChange}
          />

          <RiesgosTabs
            selectedTab={selectedTab}
            savedData={savedData}
            riesgos={riesgos}
            soloLectura={soloLectura}
            onEdit={handleEditRiesgo}
            onDelete={handleDeleteRiesgo}
            sections={sections}
          />

          {/* Botón para abrir el modal y agregar un riesgo nuevo */}
          {!soloLectura && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <CustomButton
                onClick={() => {
                  setOpenModal(true);
                  setIsEditing(false);
                  setEditingRiesgo(null);
                  setNuevoRiesgo({
                    idRiesgo: null,
                    responsable: "",
                    fuente: "",
                    tipoRiesgo: "",
                    descripcion: "",
                    consecuencias: "",
                    valorSeveridad: "",
                    valorOcurrencia: "",
                    actividades: "",
                    accionMejora: "",
                    fechaImp: "",
                    fechaEva: "",
                    reevaluacionSeveridad: "",
                    reevaluacionOcurrencia: "",
                    analisisEfectividad: "",
                  });
                }}

              >
                Añadir Riesgo
              </CustomButton>
            </Box>
          )}
        </>
      )}

      {/* Modal para crear/editar riesgo */}
      <RiesgoModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setCurrentSection(0);
          setIsEditing(false);
          setEditingRiesgo(null);
        }}
        isEditing={isEditing}
        currentSection={currentSection}
        onAnterior={handlePreviousSection}
        onSiguiente={handleNextSection}
        onGuardar={handleRequestEditRiesgo}
        nuevoRiesgo={nuevoRiesgo}
        onChange={handleRiesgoChange}
        sections={sections}
      />


      {/* SnackBars */}
      < FeedbackSnackbar
        open={snackbar.open}
        onClose={cerrarSnackbar}
        type={snackbar.type}
        title={snackbar.title}
        message={snackbar.message}
      />

      {/* Diálogo de confirmación para eliminar */}
      < ConfirmDelete
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)
        }
        entityType="riesgo"
        entityName={`el riesgo ${rowToDelete?.fuente}`}
        onConfirm={confirmDeleteRiesgo}
      />

      <ConfirmEdit
        open={confirmEditOpen}
        onClose={() => setConfirmEditOpen(false)}
        entityType="riesgo"
        entityName={` el riesgo ${editingRiesgo?.fuente}`}
        onConfirm={() => {
          setNuevoRiesgo({
            ...editingRiesgo,
            fechaImp: editingRiesgo.fechaImp ? editingRiesgo.fechaImp.slice(0, 10) : "",
            fechaEva: editingRiesgo.fechaEva ? editingRiesgo.fechaEva.slice(0, 10) : "",
          });
          setIsEditing(true);
          setCurrentSection(0);
          setOpenModal(true);
          setConfirmEditOpen(false); // opcional pero recomendable para limpiar estado
          setConfirmadoEditar(true);

        }}
      />

    </Box >

  );
}

export default FormularioGestionRiesgos;
