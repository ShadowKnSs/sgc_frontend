import React, { useState, useEffect } from "react";
import { TextField, Button, Box, IconButton, Typography, Stepper, Step, StepLabel, Snackbar, Alert } from "@mui/material";
import { Remove } from "@mui/icons-material";
import axios from "axios";
import CustomButton from "../components/Button";

const FormularioSeguimiento = ({ idRegistro, initialData, onClose }) => {
  const [step, setStep] = useState(1);
  const [lugar, setLugar] = useState(initialData?.lugar || "");
  const [fecha, setFecha] = useState(initialData?.fecha || "");
  const [duracion, setDuracion] = useState(initialData?.duracion || "");
  const [asistentes, setAsistentes] = useState(initialData?.asistentes?.map(b => b.nombre) || []);
  const [actividades, setActividades] = useState(initialData?.actividades?.map(a => a.descripcion) || []);
  const [compromisos, setCompromisos] = useState(initialData?.compromisos || [{ descripcion: "", responsables: "", fecha: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const steps = ["Datos Generales", "Asistentes", "Actividades", "Compromisos"];

  useEffect(() => {
    if (initialData) {
      setLugar(initialData.lugar || "");
      setFecha(initialData.fecha || "");
      setDuracion(initialData.duracion || "");
      setAsistentes(initialData.asistentes?.map(b => b.nombre) || []);
      setActividades(initialData.actividades?.map(a => a.descripcion) || []);
      setCompromisos(initialData.compromisos || [{ descripcion: "", responsables: "", fecha: "" }]);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const isEditing = !!initialData; // Determina si es edición o creación

    let data;

    if (isEditing) {
      // Datos para cuando está en modo edición
      data = {
        idSeguimiento: initialData.idSeguimiento,
        idRegistro: Number(idRegistro),
        lugar,
        fecha,
        duracion,
        actividades: actividades
          .filter(actividad => actividad.trim() !== "")
          .map((desc, index) => ({
            idActividadMin: initialData.actividades[index]?.idActividadMin || null,
            idSeguimiento: initialData.idSeguimiento,
            descripcion: desc
          })),
        asistentes: asistentes
          .filter(asistente => asistente.trim() !== "")
          .map((asistente, index) => ({
            idAsistente: initialData.asistentes[index]?.idAsistente || null,
            idSeguimiento: initialData.idSeguimiento,
            nombre: asistente
          })),
        compromisos: compromisos
          .filter(c => c.descripcion.trim() !== "")
          .map((c, index) => ({
            idCompromiso: initialData.compromisos[index]?.idCompromiso || null,
            idSeguimiento: initialData.idSeguimiento,
            descripcion: c.descripcion,
            responsables: c.responsables,
            fecha: c.fecha
          }))
      };
    } else {
      // Datos para cuando está en modo creación
      data = {
        idRegistro: Number(idRegistro),
        lugar,
        fecha,
        duracion,
        actividades: actividades
          .filter(actividad => actividad.trim() !== "")
          .map((desc) => ({
            descripcion: desc
          })),
        asistentes: asistentes
          .filter(asistente => asistente.trim() !== ""),
        compromisos: compromisos
          .filter(c => c.descripcion.trim() !== "")
          .map((c) => ({
            descripcion: c.descripcion,
            responsable: c.responsables,
            fechaCompromiso: c.fecha
          }))
      };
    }

    console.log("Enviando datos:", data);

    try {
      let response;
      if (isEditing) {
        // Si está en modo edición, hacer un PUT con el formato adecuado
        response = await axios.put(`http://localhost:8000/api/minutas/${initialData.idSeguimiento}`, data, {
          headers: { "Content-Type": "application/json" },
        });
        alert("Minuta actualizada exitosamente");

      } else {
        // Si está en modo creación, hacer un POST con el formato de la base de datos
        response = await axios.post("http://localhost:8000/api/minutasAdd", data, {
          headers: { "Content-Type": "application/json" },
        });
        alert("Minuta creada exitosamente");
      }
      console.log(response.data);
      onClose(); // Cerrar el formulario después de guardar
    } catch (error) {
      console.error("Error al guardar la minuta:", error);
      alert("Hubo un error al guardar la minuta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" sx={{ padding: 4, maxWidth: 600, margin: "auto", backgroundColor: "#f5f5f5", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" textAlign="center" color="#004A98" mb={2}>Registro de Minuta</Typography>
      <Stepper activeStep={step - 1} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box mt={4}>
        <Typography variant="h6" color="#004A98" mb={2}>{steps[step - 1]}</Typography>

        {step === 1 && (
          <>
            <TextField
              fullWidth
              label="Lugar"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Duración en minutos"
              value={duracion}
              onChange={(e) => {
                // Aseguramos que solo se permita la entrada de números enteros
                const value = e.target.value;
                if (/^\d+$/.test(value) || value === "") {
                  setDuracion(value);
                }
              }}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }} // Asegura que solo números sean aceptados
            />
          </>
        )}

        {step === 2 && (
          <>
            {asistentes.map((asistente, index) => (
              <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                <TextField
                  fullWidth
                  label="Nombre del asistente"
                  value={asistente}
                  onChange={(e) => {
                    const updated = [...asistentes];
                    updated[index] = e.target.value;
                    setAsistentes(updated);
                  }}
                />
                <IconButton onClick={() => setAsistentes(asistentes.filter((_, idx) => idx !== index))}>
                  <Remove />
                </IconButton>
              </Box>
            ))}
            <Button onClick={() => setAsistentes([...asistentes, ""])} variant="outlined" color="primary">Agregar asistente</Button>
          </>
        )}

        {step === 3 && (
          <>
            {actividades.map((actividad, index) => (
              <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                <TextField
                  fullWidth
                  label="Descripción de la actividad"
                  value={actividad}
                  onChange={(e) => {
                    const updated = [...actividades];
                    updated[index] = e.target.value;
                    setActividades(updated);
                  }}
                />
                <IconButton onClick={() => setActividades(actividades.filter((_, idx) => idx !== index))}>
                  <Remove />
                </IconButton>
              </Box>
            ))}
            <Button onClick={() => setActividades([...actividades, ""])} variant="outlined" color="primary">Agregar actividad</Button>
          </>
        )}

        {step === 4 && (
          <>
            {compromisos.map((compromiso, index) => (
              <Box key={index} display="flex" flexDirection="column" gap={1} mb={2}>
                <TextField
                  fullWidth
                  label="Descripción"
                  value={compromiso.descripcion}
                  onChange={(e) => {
                    const updated = [...compromisos];
                    updated[index].descripcion = e.target.value;
                    setCompromisos(updated);
                  }}
                />
                <TextField
                  fullWidth
                  label="Responsable"
                  value={compromiso.responsables}
                  onChange={(e) => {
                    const updated = [...compromisos];
                    updated[index].responsables = e.target.value;
                    setCompromisos(updated);
                  }}
                />
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de entrega"
                  InputLabelProps={{ shrink: true }}
                  value={compromiso.fecha}
                  onChange={(e) => {
                    const updated = [...compromisos];
                    updated[index].fecha = e.target.value;
                    setCompromisos(updated);
                  }}
                />
                <IconButton onClick={() => setCompromisos(compromisos.filter((_, idx) => idx !== index))}>
                  <Remove />
                </IconButton>
              </Box>
            ))}
            <Button onClick={() => setCompromisos([...compromisos, { descripcion: "", responsable: "", fechaCompromiso: "" }])} variant="outlined" color="primary">Agregar compromiso</Button>
          </>
        )}
      </Box>

      <Box display="flex" justifyContent="space-between" mt={4}>
        {step > 1 && <Button onClick={() => setStep(step - 1)} variant="contained" color="secondary">Atrás</Button>}
        {step < 4 ? (
          <Button
            onClick={() => setStep(step + 1)}
            variant="contained"
            color="primary"
            disabled={
              step === 1 && (!lugar || !fecha || !duracion || !/^\d+$/.test(duracion)) || // Validación de duración (solo números enteros)
              step === 2 && (asistentes.length === 0 || asistentes.some(asistente => !asistente)) || // Validación de asistentes
              step === 3 && (actividades.length === 0 || actividades.some(actividad => !actividad)) || // Validación de actividades
              step === 4 && (compromisos.length === 0 || compromisos.some(compromiso => !compromiso.descripcion || !compromiso.responsables || !compromiso.fecha))
            }
          >
            Siguiente
          </Button>
        ) : (
          <CustomButton
            type="Guardar"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {initialData ? "Actualizar Minuta" : "Guardar"}
          </CustomButton>
        )}
      </Box>
    </Box>
  );
}
export default FormularioSeguimiento;

