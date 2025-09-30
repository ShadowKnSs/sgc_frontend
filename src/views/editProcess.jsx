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

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ProcessForm from "../components/Forms/ProcesoForm";
import axios from "axios";

const EditProcess = () => {
  const { idProceso } = useParams();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2002 }, (_, i) => 2003 + i);
  
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
    icono:'',
  });
  const [leaders, setLeaders] = useState([]);
  const [macroprocesos, setMacroprocesos] = useState([]);
  const [entidades, setEntidades] = useState([]);

  useEffect(() => {
    // Consulta el proceso a editar
    axios.get(`http://127.0.0.1:8000/api/procesos/${idProceso}`)
      .then(response => {
        const proc = response.data.proceso || response.data;
        setInitialValues({
          nombreProceso: proc.nombreProceso,
          idUsuario: proc.idUsuario, // Si es numérico, asegúrate de que coincida con el select
          objetivo: proc.objetivo,
          alcance: proc.alcance,
          norma: proc.norma,
          idMacroproceso: proc.idMacroproceso,
          estado: proc.estado,
          idEntidad: proc.idEntidad,
          anioCertificado: proc.anioCertificado.toString(),
          icono: proc.icono
        });
      })
      .catch(error => console.error("Error al cargar el proceso:", error));
      
    // Consulta datos para selects (leaders, macroprocesos, entidades)
    axios.get("http://127.0.0.1:8000/api/lideres-2")
      .then(response => setLeaders(response.data.leaders || []))
      .catch(error => console.error("Error al obtener líderes:", error));

    axios.get("http://127.0.0.1:8000/api/macroprocesos")
      .then(response => setMacroprocesos(response.data.macroprocesos || []))
      .catch(error => console.error("Error al obtener macroprocesos:", error));

    axios.get("http://127.0.0.1:8000/api/entidades")
      .then(response => setEntidades(response.data.entidades || []))
      .catch(error => console.error("Error al obtener entidades:", error));
  }, [idProceso]);

  const handleSubmit = async (formData) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/procesos/${idProceso}`, formData);
      navigate("/procesos");
    } catch (error) {
      console.error("Error al actualizar el proceso:", error);
      alert("Error al actualizar el proceso.");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <ProcessForm
        initialValues={initialValues}
        leaders={leaders}
        macroprocesos={macroprocesos}
        entidades={entidades}
        years={years}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/procesos")}
        title="Editar Proceso"
      />
    </Box>
  );
};

export default EditProcess;
