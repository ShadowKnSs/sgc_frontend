/**
 * Vista: NewProcess
 * Descripción:
 * Página que permite registrar un nuevo proceso dentro del sistema de gestión de calidad.
 * Proporciona un formulario con campos como nombre del proceso, líder, entidad, macroproceso, año, entre otros.

 * Funcionalidades principales:
 * -  Obtiene y muestra datos necesarios para el formulario desde el backend:
 *   - Lista de líderes (`/api/lideres`)
 *   - Lista de macroprocesos (`/api/macroprocesos`)
 *   - Lista de entidades o dependencias (`/api/entidades`)
 * -  Genera una lista de años desde 2003 hasta el año actual para el campo de certificación.
 * -  Envía los datos del formulario al endpoint `/api/procesos` para crear un nuevo proceso.
 * - Redirecciona al listado de procesos (`/procesos`) después de guardar exitosamente.

 * Props del componente ProcessForm:
 * - `initialValues`: estado inicial del formulario con todos los campos vacíos.
 * - `leaders`: opciones para el select de líder del proceso.
 * - `macroprocesos`: opciones para el select de macroproceso.
 * - `entidades`: opciones para el select de entidad/dependencia.
 * - `years`: opciones de años generadas dinámicamente desde 2003.
 * - `onSubmit`: función ejecutada al enviar el formulario, realiza el POST.
 * - `onCancel`: función que redirige al listado si el usuario cancela.

 * Consideraciones:
 * -  El campo `icono` está presente en el `initialValues` pero no debe utilizarse visualmente aquí.
 * -  El componente `ProcessForm` debe encargarse del diseño, validación y manejo de errores.
 * -  Esta vista no contiene validación directa, pero maneja errores de red con `try/catch`.

 * Flujo de uso:
 * 1. El usuario accede a `/nuevo-proceso`.
 * 2. El sistema carga líderes, entidades y macroprocesos.
 * 3. El usuario llena el formulario.
 * 4. Al enviarlo, se guarda el proceso y se redirige automáticamente a `/procesos`.
 */

import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProcessForm from "../components/Forms/ProcesoForm";
import axios from "axios";

const NewProcess = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2002 }, (_, i) => 2003 + i);

  // Estados para almacenar datos de selects
  const [leaders, setLeaders] = useState([]);
  const [macroprocesos, setMacroprocesos] = useState([]);
  const [entidades, setEntidades] = useState([]);

  useEffect(() => {
    // Obtener líderes
    axios
      .get("http://127.0.0.1:8000/api/lideres")
      .then((response) => {
        setLeaders(response.data.leaders || []);
      })
      .catch((error) => {
        console.error("Error al obtener líderes:", error);
      });

    // Obtener macroprocesos
    axios
      .get("http://127.0.0.1:8000/api/macroprocesos")
      .then((response) => {
        setMacroprocesos(response.data.macroprocesos || []);
      })
      .catch((error) => {
        console.error("Error al obtener macroprocesos:", error);
      });

    // Obtener entidades/dependencias
    axios
      .get("http://127.0.0.1:8000/api/entidades")
      .then((response) => {
        setEntidades(response.data.entidades || []);
      })
      .catch((error) => {
        console.error("Error al obtener entidades:", error);
      });
  }, []);

  const handleSubmit = async (formData) => {
    try {
      await axios.post("http://127.0.0.1:8000/api/procesos", formData);
      navigate("/procesos");
    } catch (error) {
      console.error("Error al crear el proceso:", error);
      alert("Error al crear el proceso.");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <ProcessForm
        initialValues={{
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
        }}
        leaders={leaders}
        macroprocesos={macroprocesos}
        entidades={entidades}
        years={years}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/procesos")}
        title="Nuevo Proceso"
      />
    </Box>
  );
};

export default NewProcess;
