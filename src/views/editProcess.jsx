/**
 * Componente: EditProcess
 * Ubicación: src/views/EditProcess.jsx
 *
 * Descripción:
 * Vista de edición de un proceso del Sistema de Gestión de Calidad (SGC).
 * Permite modificar información previamente registrada como nombre, objetivo, líder, macroproceso, estado, etc.
 *
 * Funcionalidad principal:
 * - Recupera la información de un proceso existente a partir del parámetro `idProceso` en la URL.
 * - Obtiene datos auxiliares necesarios para los campos select:
 *   - Líderes de proceso (`idUsuario`)
 *   - Macroprocesos (`idMacroproceso`)
 *   - Entidades (`idEntidad`)
 * - Rellena el formulario `ProcessForm` con los valores actuales del proceso.
 * - Permite actualizar la información del proceso mediante una petición `PUT`.
 *
 * Estados:
 * - `initialValues`: Objeto que contiene los valores iniciales del formulario.
 * - `leaders`: Lista de usuarios con rol de líder de proceso.
 * - `macroprocesos`: Lista de macroprocesos registrados.
 * - `entidades`: Lista de entidades disponibles.
 *
 * Hooks:
 * - `useEffect`: Se ejecuta al montar el componente para cargar los datos iniciales.
 * - `useParams`: Obtiene `idProceso` desde la URL.
 * - `useNavigate`: Permite redireccionar al usuario una vez actualizado el proceso.
 *
 * Componente usado:
 * - `ProcessForm`: Formulario modular y reutilizable con campos y lógica de validación.
 *
 * Navegación:
 * - Al enviar el formulario con éxito → redirige a `/procesos`.
 * - Al cancelar → también redirige a `/procesos`.
 *
 * Consideraciones:
 * - `anioCertificado` se convierte a string para asegurar compatibilidad con componentes `<select>`.
 * - Si el proceso no se encuentra o hay errores de red, se muestran errores en consola y alertas.
 * - No se incluyen iconos visuales ni componentes externos innecesarios para mantener simplicidad.
 *
 * Posibles mejoras:
 * - Agregar validación visual para cada campo del formulario.
 * - Mostrar feedback visual de éxito o error tras la edición (ej. Snackbar).
 * - Manejar `loading` mientras se cargan los datos del proceso y selects.
 */

import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import ProcessForm from "../components/Forms/ProcesoForm";
import BreadcrumbNav from "../components/BreadcrumbNav";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import FeedbackSnackbar from "../components/Feedback";

const EditProcess = () => {
  const { idProceso } = useParams();
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2002 }, (_, i) => 2003 + i);

  const API_BASE = "http://127.0.0.1:8000/api";

  // Estado del formulario inicial
  const [initialValues, setInitialValues] = useState({
    nombreProceso: "",
    idUsuario: "",
    objetivo: "",
    alcance: "",
    norma: "",
    idMacroproceso: "",
    estado: "",
    idEntidad: "",
    anioCertificado: "",
    icono: "",
  });

  // Catálogos
  const [leaders, setLeaders] = useState([]);
  const [macroprocesos, setMacroprocesos] = useState([]);
  const [entidades, setEntidades] = useState([]);

  // Para insertar el líder actual si no está en catálogo
  const [currentLeader, setCurrentLeader] = useState(null);

  // Feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "info", // success | info | warning | error
    title: "",
    message: "",
  });
  const showFeedback = (type, message, title = "") =>
    setSnackbar({ open: true, type, message, title });
  const closeFeedback = () => setSnackbar((s) => ({ ...s, open: false }));

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      // Carga en paralelo: proceso y catálogos
      const reqProceso = axios.get(`${API_BASE}/procesos/${idProceso}`);
      const reqLeaders = axios.get(`${API_BASE}/lideres-2`);
      const reqMacro = axios.get(`${API_BASE}/macroprocesos`);
      const reqEntidades = axios.get(`${API_BASE}/entidades`);

      const [pRes, lRes, mRes, eRes] = await Promise.allSettled([
        reqProceso,
        reqLeaders,
        reqMacro,
        reqEntidades,
      ]);

      // Proceso
      if (pRes.status === "fulfilled") {
        const proc = pRes.value.data?.proceso || pRes.value.data;
        if (!proc) {
          if (isMounted) {
            showFeedback("warning", "No se encontró el proceso solicitado.", "Atención");
          }
        } else if (isMounted) {
          if (proc.usuario) setCurrentLeader(proc.usuario);
          setInitialValues({
            nombreProceso: proc.nombreProceso || "",
            idUsuario: proc.idUsuario || "",
            objetivo: proc.objetivo || "",
            alcance: proc.alcance || "",
            norma: proc.norma || "",
            idMacroproceso: proc.idMacroproceso || "",
            estado: proc.estado || "",
            idEntidad: proc.idEntidad || "",
            anioCertificado: proc.anioCertificado ? String(proc.anioCertificado) : "",
            icono: proc.icono || "",
          });
        }
      } else if (isMounted) {
        const status = pRes.reason?.response?.status;
        if (status === 404) {
          showFeedback("warning", "El proceso no existe (404).", "Atención");
        } else {
          showFeedback("error", "Error al cargar el proceso.", "Error");
        }
      }

      // Leaders
      if (lRes.status === "fulfilled") {
        if (isMounted) setLeaders(lRes.value.data?.leaders || []);
      } else if (isMounted) {
        setLeaders([]);
        showFeedback("error", "No se pudieron cargar los líderes.", "Error");
      }

      // Macroprocesos
      if (mRes.status === "fulfilled") {
        if (isMounted) setMacroprocesos(mRes.value.data?.macroprocesos || []);
      } else if (isMounted) {
        setMacroprocesos([]);
        showFeedback("error", "No se pudieron cargar los macroprocesos.", "Error");
      }

      // Entidades
      if (eRes.status === "fulfilled") {
        if (isMounted) setEntidades(eRes.value.data?.entidades || []);
      } else if (isMounted) {
        setEntidades([]);
        showFeedback("error", "No se pudieron cargar las entidades.", "Error");
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [API_BASE, idProceso]);

  // Unir líder actual si no está en catálogo
  const combinedLeaders = useMemo(() => {
    if (!currentLeader) return leaders;
    const exists = leaders.some((l) => l.idUsuario === currentLeader.idUsuario);
    return exists ? leaders : [currentLeader, ...leaders];
  }, [leaders, currentLeader]);

  // Submit
  const handleSubmit = async (formData) => {
    try {
      await axios.put(`${API_BASE}/procesos/${idProceso}`, formData);
      showFeedback("success", "Proceso actualizado correctamente.");
      setTimeout(() => navigate("/procesos"), 1200);
    } catch (error) {
      const msg =
        error?.response?.status === 422
          ? error.response.data?.error || "Datos inválidos."
          : "Error al actualizar el proceso. Intente nuevamente.";
      showFeedback("error", msg, "Error");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <BreadcrumbNav
        items={[
          { label: "Procesos", to: "/procesos", icon: AccountTreeIcon },
          { label: "Editar Proceso", icon: AccountTreeIcon },
        ]}
      />

      <ProcessForm
        initialValues={initialValues}
        leaders={combinedLeaders}
        macroprocesos={macroprocesos}
        entidades={entidades}
        years={years}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/procesos")}
        title="Editar Proceso"
      />

      <FeedbackSnackbar
        open={snackbar.open}
        onClose={closeFeedback}
        type={snackbar.type}
        title={snackbar.title}
        message={snackbar.message}
        autoHideDuration={4000}
      />
    </Box>
  );
};

export default EditProcess;

