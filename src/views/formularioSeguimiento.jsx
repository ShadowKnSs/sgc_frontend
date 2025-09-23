/**
 * Componente: FormularioSeguimiento
 * Ubicación: src/views/FormularioSeguimiento.jsx
 *
 * Descripción:
 * Formulario multisección en 4 pasos (Stepper) para **crear o editar una Minuta** de seguimiento asociada a un `idRegistro`.
 * Cada sección del formulario corresponde a un conjunto de datos: 
 * 1. Datos Generales
 * 2. Asistentes
 * 3. Actividades
 * 4. Compromisos
 *
 * Props:
 * - `idRegistro`: ID del registro asociado al cual se relaciona esta minuta.
 * - `initialData`: Si se proporciona, el formulario entra en modo edición y rellena los campos.
 * - `onClose`: Función de cierre del formulario, se ejecuta tras guardar o cancelar.
 *
 * Funcionalidades:
 * - Soporte para creación (`POST /minutasAdd`) y edición (`PUT /minutas/{id}`).
 * - Validación por sección antes de permitir avanzar al siguiente paso.
 * - Registro de asistentes, actividades y compromisos con campos dinámicos (agregar/remover).
 * - Snackbar de retroalimentación para informar el éxito o fallo de la operación.
 *
 * Estructura del `payload` al guardar:
 * - `lugar`, `fecha`, `duracion`: Datos generales.
 * - `asistentes`: Arreglo de strings o `{ idAsistente, nombre }` si es edición.
 * - `actividades`: Arreglo de strings o `{ idActividadMin, descripcion }`.
 * - `compromisos`: `{ descripcion, responsables, fecha }` o con IDs si es edición.
 *
 * Componentes utilizados:
 * - `Stepper`: Navegación de pasos.
 * - `FeedbackSnackbar`: Retroalimentación de éxito o error.
 * - `CustomButton`: Botón personalizado para acción final.
 * - `@mui/material` y `@mui/icons-material` para inputs y layout.
 *
 * Consideraciones:
 * - Se controla la edición mediante `initialData` y se rellena el estado con `useEffect`.
 * - El campo duración solo permite números enteros positivos.
 * - La validación es estricta antes de permitir pasar de paso o guardar.
 * - El formulario se cierra automáticamente 1.2 segundos después de un guardado exitoso.
 *
 * Mejoras sugeridas:
 * - Mostrar nombre del registro o proceso como encabezado adicional.
 * - Uso de `react-hook-form` para simplificar validaciones y control de formularios.
 * - Validar fechas futuras en compromisos.
 */

import React, { useState, useEffect } from "react";
import { TextField, Button, Box, IconButton, Typography, Stepper, Step, StepLabel } from "@mui/material";
import { Remove } from "@mui/icons-material";
import axios from "axios";
import CustomButton from "../components/Button";
import FeedbackSnackbar from "../components/Feedback";

const FormularioSeguimiento = ({ idRegistro, initialData, onClose, modoEdicion = false }) => {
  const [step, setStep] = useState(1);
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState("");
  const [duracion, setDuracion] = useState("");
  const [asistentes, setAsistentes] = useState([""]);
  const [actividades, setActividades] = useState([""]);
  const [compromisos, setCompromisos] = useState([{ descripcion: "", responsable: "", fechaCompromiso: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const steps = ["Datos Generales", "Asistentes", "Actividades", "Compromisos"];

  const [openInfo, setOpenInfo] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("info");

  useEffect(() => {
    if (initialData) {
      console.log("Datos iniciales recibidos:", initialData);
      console.log("Compromisos recibidos:", initialData.compromisos);
      
      setLugar(initialData.lugar || "");
      setFecha(initialData.fecha || "");
      setDuracion(initialData.duracion || "");
      setAsistentes(initialData.asistentes?.map(b => b.nombre) || [""]);
      setActividades(initialData.actividades?.map(a => a.descripcion) || [""]);
      
      setCompromisos(
        initialData.compromisos?.length > 0
          ? initialData.compromisos.map(c => ({
              descripcion: c.descripcion || "",
              responsable: c.responsable || c.responsables || "",
              fechaCompromiso: c.fechaCompromiso || c.fecha || ""
            }))
          : [{ descripcion: "", responsable: "", fechaCompromiso: "" }]
      );
    } else {
      setLugar("");
      setFecha("");
      setDuracion("");
      setAsistentes([""]);
      setActividades([""]);
      setCompromisos([{ descripcion: "", responsable: "", fechaCompromiso: "" }]);
    }
  }, [initialData]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const data = {
      idRegistro: Number(idRegistro),
      lugar,
      fecha,
      duracion,
      actividades: actividades
        .filter(actividad => actividad.trim() !== "")
        .map(desc => ({ descripcion: desc })),
      asistentes: asistentes.filter(asistente => asistente.trim() !== ""),
      compromisos: compromisos
        .filter(c => c.descripcion.trim() !== "")
        .map(c => ({
          descripcion: c.descripcion,
          responsables: c.responsable,
          fecha: c.fechaCompromiso
        }))
    };

    if (modoEdicion && initialData) {
      data.idSeguimiento = initialData.idSeguimiento;

      data.actividades = actividades
        .filter(actividad => actividad.trim() !== "")
        .map((desc, index) => ({
          idActividadMin: initialData.actividades[index]?.idActividadMin || null,
          idSeguimiento: initialData.idSeguimiento,
          descripcion: desc
        }));

      data.asistentes = asistentes
        .filter(asistente => asistente.trim() !== "")
        .map((nombre, index) => ({
          idAsistente: initialData.asistentes[index]?.idAsistente || null,
          idSeguimiento: initialData.idSeguimiento,
          nombre
        }));

      data.compromisos = compromisos
        .filter(c => c.descripcion.trim() !== "")
        .map((c, index) => ({
          idCompromiso: initialData.compromisos[index]?.idCompromiso || null,
          idSeguimiento: initialData.idSeguimiento,
          descripcion: c.descripcion,
          responsables: c.responsable,
          fecha: c.fechaCompromiso
        }));
    }

    console.log("Enviando datos:", data);

    try {
      let response;
      let minutaCreada;

      if (modoEdicion) {
        response = await axios.put(
          `http://localhost:8000/api/minutas/${initialData.idSeguimiento}`,
          data,
          { headers: { "Content-Type": "application/json" } }
        );
        minutaCreada = response.data;
        setSnackbarMessage("Minuta actualizada exitosamente");
        setSnackbarType("success");
      } else {
        response = await axios.post("http://localhost:8000/api/minutasAdd", data, {
          headers: { "Content-Type": "application/json" }
        });
        minutaCreada = response.data;
        setSnackbarMessage("Minuta creada exitosamente");
        setSnackbarType("success");
      }

      setOpenInfo(true);
      console.log("Respuesta del servidor:", response.data);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (error) {
      console.error("Error al guardar la minuta:", error);
      setSnackbarMessage("Hubo un error al guardar la minuta");
      setSnackbarType("error");
      setOpenInfo(true);
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        padding: 4,
        maxWidth: 600,
        margin: "auto",
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      <Typography variant="h4" textAlign="center" color="#004A98" mb={2}>
        {modoEdicion ? "Editar Minuta" : "Registro de Minuta"}
      </Typography>

      <Stepper activeStep={step - 1} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box mt={4}>
        <Typography variant="h6" color="#004A98" mb={2}>
          {steps[step - 1]}
        </Typography>

        {/* Paso 1: Datos Generales */}
        {step === 1 && (
          <>
            <TextField
              fullWidth
              label="Lugar"
              value={lugar}
              onChange={e => setLugar(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Fecha"
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Duración en minutos"
              type="number"
              value={duracion}
              onChange={e => {
                const value = e.target.value;
                if (/^\d+$/.test(value) || value === "") {
                  setDuracion(value);
                }
              }}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              required
            />
          </>
        )}

        {/* Paso 2: Asistentes */}
        {step === 2 && (
          <>
            {asistentes.map((asistente, index) => (
              <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                <TextField
                  fullWidth
                  label="Nombre del asistente"
                  value={asistente}
                  onChange={e => {
                    const updated = [...asistentes];
                    updated[index] = e.target.value;
                    setAsistentes(updated);
                  }}
                />
                {asistentes.length > 1 && (
                  <IconButton onClick={() => setAsistentes(asistentes.filter((_, idx) => idx !== index))}>
                    <Remove />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button onClick={() => setAsistentes([...asistentes, ""])} variant="outlined" color="primary">
              Agregar asistente
            </Button>
          </>
        )}

        {/* Paso 3: Actividades */}
        {step === 3 && (
          <>
            {actividades.map((actividad, index) => (
              <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                <TextField
                  fullWidth
                  label="Descripción de la actividad"
                  value={actividad}
                  onChange={e => {
                    const updated = [...actividades];
                    updated[index] = e.target.value;
                    setActividades(updated);
                  }}
                />
                {actividades.length > 1 && (
                  <IconButton onClick={() => setActividades(actividades.filter((_, idx) => idx !== index))}>
                    <Remove />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button onClick={() => setActividades([...actividades, ""])} variant="outlined" color="primary">
              Agregar actividad
            </Button>
          </>
        )}

        {/* Paso 4: Compromisos */}
        {step === 4 && (
          <>
            {compromisos.map((compromiso, index) => (
              <Box key={index} display="flex" flexDirection="column" gap={1} mb={2}>
                <TextField
                  fullWidth
                  label="Descripción"
                  value={compromiso.descripcion}
                  onChange={e => {
                    const updated = [...compromisos];
                    updated[index].descripcion = e.target.value;
                    setCompromisos(updated);
                  }}
                />
                <TextField
                  fullWidth
                  label="Responsable"
                  value={compromiso.responsable}
                  onChange={e => {
                    const updated = [...compromisos];
                    updated[index].responsable = e.target.value;
                    setCompromisos(updated);
                  }}
                />
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de entrega"
                  InputLabelProps={{ shrink: true }}
                  value={compromiso.fechaCompromiso}
                  onChange={e => {
                    const updated = [...compromisos];
                    updated[index].fechaCompromiso = e.target.value;
                    setCompromisos(updated);
                  }}
                />
                {compromisos.length > 1 && (
                  <IconButton onClick={() => setCompromisos(compromisos.filter((_, idx) => idx !== index))}>
                    <Remove />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              onClick={() => setCompromisos([...compromisos, { descripcion: "", responsable: "", fechaCompromiso: "" }])}
              variant="outlined"
              color="primary"
            >
              Agregar compromiso
            </Button>
          </>
        )}
      </Box>

      <Box display="flex" justifyContent="space-between" mt={4}>
        {step > 1 && (
          <Button onClick={() => setStep(step - 1)} variant="contained" color="secondary">
            Atrás
          </Button>
        )}

        {step < 4 ? (
          <Button
            onClick={() => setStep(step + 1)}
            variant="contained"
            color="primary"
            disabled={
              (step === 1 && (!lugar || !fecha || !duracion || !/^\d+$/.test(duracion))) ||
              (step === 2 && asistentes.some(asistente => !asistente.trim())) ||
              (step === 3 && actividades.some(actividad => !actividad.trim())) ||
              (step === 4 &&
                compromisos.some(compromiso => !compromiso.descripcion.trim() || !compromiso.responsable.trim() || !compromiso.fechaCompromiso))
            }
          >
            Siguiente
          </Button>
        ) : (
          <CustomButton type="Guardar" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : modoEdicion ? "Actualizar Minuta" : "Guardar Minuta"}
          </CustomButton>
        )}
      </Box>

      <FeedbackSnackbar
        open={openInfo}
        onClose={() => setOpenInfo(false)}
        type={snackbarType}
        title={snackbarType === "success" ? "Éxito" : "Error"}
        message={snackbarMessage}
        autoHideDuration={5000}
      />
    </Box>
  );
};

export default FormularioSeguimiento;