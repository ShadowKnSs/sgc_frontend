import React, { useState } from "react";
import { TextField, Button, Box, IconButton } from "@mui/material";
import { Remove } from "@mui/icons-material";
import axios from "axios";

const FormularioSeguimiento = ({ idRegistro }) => {
  const [step, setStep] = useState(1);
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState("");
  const [duracion, setDuracion] = useState("");
  const [asistentes, setAsistentes] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [compromisos, setCompromisos] = useState([{ descripcion: "", responsable: "", fechaCompromiso: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Evita envíos dobles

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isSubmitting) return; // Evita doble envío
    setIsSubmitting(true);
  
    // Filtrar datos vacíos para evitar envíos incorrectos
    const data = {
      idRegistro: Number(idRegistro),
      lugar,
      fecha,
      duracion,
      asistentes: asistentes.filter(asistente => asistente.trim() !== ""),
      actividades: actividades
        .filter(actividad => actividad.trim() !== "")
        .map(desc => ({ descripcion: desc })),
      compromisos: compromisos.filter(c => c.descripcion.trim() !== ""), // Filtrar compromisos vacíos
    };
  
    console.log("Enviando datos:", data);
  
    try {
      const response = await axios.post("http://localhost:8000/api/minutas", data, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Minuta creada exitosamente");
      console.log(response.data);
    } catch (error) {
      console.error("Error al crear la minuta:", error);
      alert("Hubo un error al crear la minuta");
    } finally {
      setIsSubmitting(false);
    }
  };  

  return (
    <Box component="form" sx={{ padding: 2 }}>
      <Box display="flex" flexDirection="column" gap={2}>
        {step === 1 && (
          <>
            <TextField fullWidth label="Lugar" value={lugar} onChange={(e) => setLugar(e.target.value)} />
            <TextField fullWidth label="Fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth label="Duración" value={duracion} onChange={(e) => setDuracion(e.target.value)} />
          </>
        )}

        {step === 2 && (
          <>
            {asistentes.map((asistente, index) => (
              <Box key={index} display="flex" alignItems="center" gap={1}>
                <TextField fullWidth label="Nombre del asistente" value={asistente} onChange={(e) => {
                  const updated = [...asistentes];
                  updated[index] = e.target.value;
                  setAsistentes(updated);
                }} />
                <IconButton onClick={() => setAsistentes(asistentes.filter((_, idx) => idx !== index))}>
                  <Remove />
                </IconButton>
              </Box>
            ))}
            <Button onClick={() => setAsistentes([...asistentes, ""])} variant="outlined">Agregar asistente</Button>
          </>
        )}

        {step === 3 && (
          <>
            {actividades.map((actividad, index) => (
              <Box key={index} display="flex" alignItems="center" gap={1}>
                <TextField fullWidth label="Descripción de la actividad" value={actividad} onChange={(e) => {
                  const updated = [...actividades];
                  updated[index] = e.target.value;
                  setActividades(updated);
                }} />
                <IconButton onClick={() => setActividades(actividades.filter((_, idx) => idx !== index))}>
                  <Remove />
                </IconButton>
              </Box>
            ))}
            <Button onClick={() => setActividades([...actividades, ""])} variant="outlined">Agregar actividad</Button>
          </>
        )}

        {step === 4 && (
          <>
            {compromisos.map((compromiso, index) => (
              <Box key={index} display="flex" flexDirection="column" gap={1}>
                <TextField fullWidth label="Descripción" value={compromiso.descripcion} onChange={(e) => {
                  const updated = [...compromisos];
                  updated[index].descripcion = e.target.value;
                  setCompromisos(updated);
                }} />
                <TextField fullWidth label="Responsable" value={compromiso.responsable} onChange={(e) => {
                  const updated = [...compromisos];
                  updated[index].responsable = e.target.value;
                  setCompromisos(updated);
                }} />
                <TextField fullWidth type="date" label="Fecha de entrega" InputLabelProps={{ shrink: true }} value={compromiso.fechaCompromiso} onChange={(e) => {
                  const updated = [...compromisos];
                  updated[index].fechaCompromiso = e.target.value;
                  setCompromisos(updated);
                }} />
                <IconButton onClick={() => setCompromisos(compromisos.filter((_, idx) => idx !== index))}>
                  <Remove />
                </IconButton>
              </Box>
            ))}
            <Button onClick={() => setCompromisos([...compromisos, { descripcion: "", responsable: "", fechaCompromiso: "" }])} variant="outlined">Agregar compromiso</Button>
          </>
        )}

        <Box display="flex" justifyContent="space-between" mt={2}>
          {step > 1 && <Button onClick={() => setStep(step - 1)} variant="contained">Atrás</Button>}
          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)} variant="contained">Siguiente</Button>
          ) : (
            <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>Guardar Minuta</Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FormularioSeguimiento;

