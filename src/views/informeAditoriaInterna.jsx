import { Box, Grid, Typography, Button, TextField, MenuItem } from "@mui/material";
import React, { useState } from "react";

function InformeAud() {
  const entidad = "Nombre de la Entidad";
  const proceso = "Nombre del Proceso";
  const lider = "Nombre del Líder";
  
  // Estado para los criterios
  const [criterios, setCriterios] = useState([""]);
  const [equipoAuditor, setEquipoAuditor] = useState([{ rol: "", auditor: "" }]);
  const [personalAuditado, setPersonalAuditado] = useState([{ nombre: "", cargo: "" }]);
  const [verificaciones, setVerificaciones] = useState([
    { criterio: "", reqAsociado: "", observaciones: "", evidencia: "", hallazgo: "" },
  ]);

  // Funciones para los criterios
  const agregarCriterio = () => setCriterios([...criterios, ""]);
  const eliminarCriterio = (index) => {
    if (criterios.length > 1) {
      setCriterios(criterios.filter((_, i) => i !== index));
    }
  };

  // Funciones para el equipo auditor
  const agregarAuditor = () => setEquipoAuditor([...equipoAuditor, { rol: "", auditor: "" }]);
  const eliminarAuditor = (index) => {
    if (equipoAuditor.length > 1) {
      setEquipoAuditor(equipoAuditor.filter((_, i) => i !== index));
    }
  };

  // Funciones para el personal auditado
  const agregarPersonal = () => setPersonalAuditado([...personalAuditado, { nombre: "", cargo: "" }]);
  const eliminarPersonal = (index) => {
    if (personalAuditado.length > 1) {
      setPersonalAuditado(personalAuditado.filter((_, i) => i !== index));
    }
  };

  // Funciones para las verificaciones
  const agregarVerificacion = () => {
    setVerificaciones([...verificaciones, { criterio: "", reqAsociado: "", observaciones: "", evidencia: "", hallazgo: "" }]);
  };
  const eliminarVerificacion = (index) => {
    if (verificaciones.length > 1) {
      setVerificaciones(verificaciones.filter((_, i) => i !== index));
    }
  };

  const [puntosMejora, setPuntosMejora] = useState([{ id: 1 }]);

  const agregarPuntoMejora = () => {
    setPuntosMejora([...puntosMejora, { numero: "", reqISO: "", descripcion: "", evidencia: "" }]);
  };
  
  const eliminarPuntoMejora = (index) => {
    if (puntosMejora.length > 1) {
      setPuntosMejora(puntosMejora.filter((_, i) => i !== index));
    }
  };

  const [conclusiones, setConclusiones] = useState([{ id: 1 }]);

  const agregarConclusion = () => {
    setConclusiones([...conclusiones, { nombre: "", observaciones: "" }]);
  };

  const eliminarConclusion = (index) => {
    setConclusiones(conclusiones.filter((_, i) => i !== index));
  };

  // Estado para Plazos y Consideraciones
  const [plazos, setPlazos] = useState([""]);

  const agregarPlazo = () => {
    setPlazos([...plazos, ""]); 
  };

  const eliminarPlazo = (index) => {
    if (plazos.length > 1) {
      setPlazos(plazos.filter((_, i) => i !== index));
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f7f7f7", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: "100%", maxWidth: "900px", backgroundColor: "white", padding: 4, borderRadius: "8px" }}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "32px",
            fontFamily: "'Roboto', sans-serif",
            color: "#004A98",
          }}
        >
          Informe de Auditoría
        </h1>
        
        <Box>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="body1"><strong>Entidad:</strong> {entidad}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1"><strong>Proceso:</strong> {proceso}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1"><strong>Líder:</strong> {lider}</Typography>
            </Grid>
          </Grid>
        </Box>
        
        <Box mt={3} display="flex" alignItems="center">
          <Typography variant="body1" mr={2}><strong>Fecha:</strong></Typography>
          <TextField type="date" variant="outlined" size="small" sx={{ width: 200 }} />
        </Box>
        
        <Box mt={3}>
          <Typography variant="body1" gutterBottom><strong>Objetivo:</strong></Typography>
          <TextField fullWidth multiline rows={2} variant="outlined" />
        </Box>

        <Box mt={3}>
          <Typography variant="body1" gutterBottom><strong>Alcance:</strong></Typography>
          <TextField fullWidth multiline rows={1} variant="outlined" />
        </Box>
        
        <Box mt={3}>
          <Typography variant="body1" gutterBottom><strong>Criterios:</strong></Typography>
          {criterios.map((criterio, index) => (
            <Box key={index} display="flex" alignItems="center" mt={1}>
              <TextField 
                fullWidth 
                multiline 
                rows={1} 
                variant="outlined" 
                value={criterio} 
                onChange={(e) => {
                  const nuevosCriterios = [...criterios];
                  nuevosCriterios[index] = e.target.value;
                  setCriterios(nuevosCriterios);
                }}
              />
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ cursor: "pointer", ml: 2 }} 
                onClick={agregarCriterio}
              >
                Agregar
              </Typography>
              {criterios.length > 1 && (
                <Typography 
                  variant="body2" 
                  color="secondary" 
                  sx={{ cursor: "pointer", ml: 2 }} 
                  onClick={() => eliminarCriterio(index)}
                >
                  Eliminar
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        <Box mt={3}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom><strong>Equipo Auditor:</strong></Typography>
              {equipoAuditor.map((item, index) => (
                <Grid container spacing={2} alignItems="center" mt={1} key={index}>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Rol" variant="outlined" />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField select fullWidth label="Nombre Auditor" variant="outlined">
                      <MenuItem value="Auditor 1">Auditor 1</MenuItem>
                      <MenuItem value="Auditor 2">Auditor 2</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} display="flex" justifyContent="flex-end">
                    <Typography variant="body2" color="primary" sx={{ cursor: "pointer", mr: 2 }} onClick={agregarAuditor}>
                      Agregar
                    </Typography>
                    {equipoAuditor.length > 1 && (
                      <Typography variant="body2" color="secondary" sx={{ cursor: "pointer" }} onClick={() => eliminarAuditor(index)}>
                        Eliminar
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom><strong>Personal Auditado:</strong></Typography>
              {personalAuditado.map((item, index) => (
                <Grid container spacing={2} alignItems="center" mt={1} key={index}>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Nombre" variant="outlined" />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Cargo" variant="outlined" />
                  </Grid>
                  <Grid item xs={12} display="flex" justifyContent="flex-end">
                    <Typography variant="body2" color="primary" sx={{ cursor: "pointer", mr: 2 }} onClick={agregarPersonal}>
                      Agregar
                    </Typography>
                    {personalAuditado.length > 1 && (
                      <Typography variant="body2" color="secondary" sx={{ cursor: "pointer" }} onClick={() => eliminarPersonal(index)}>
                        Eliminar
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Box>

        <Box mt={4} display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" gutterBottom>
            <strong>Verificación de Ruta de Auditoría</strong>
          </Typography>
          <Box width="100%" mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Typography variant="body1" gutterBottom><strong>Criterio</strong></Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1" gutterBottom><strong>Req. Asociado</strong></Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body1" gutterBottom><strong>Observaciones</strong></Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body1" gutterBottom><strong>Evidencia Objetiva</strong></Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1" gutterBottom><strong>Tipo de Hallazgo</strong></Typography>
              </Grid>
            </Grid>
          </Box>
          {verificaciones.map((verificacion, index) => (
            <Box key={index} width="100%" mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  <TextField fullWidth variant="outlined" size="small" />
                </Grid>
                <Grid item xs={2}>
                  <TextField fullWidth variant="outlined" size="small" />
                </Grid>
                <Grid item xs={3}>
                  <TextField fullWidth variant="outlined" size="small" />
                </Grid>
                <Grid item xs={3}>
                  <TextField fullWidth variant="outlined" size="small" />
                </Grid>
                <Grid item xs={2}>
                  <TextField select fullWidth variant="outlined" size="small">
                    <MenuItem value="Menor">Opción</MenuItem>
                    <MenuItem value="Mayor">Opción</MenuItem>
                    <MenuItem value="Oportunidad">Opción</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="flex-end" mt={1}>
                <Typography 
                  variant="body2" 
                  color="primary" 
                  sx={{ cursor: "pointer", mr: 2 }} 
                  onClick={agregarVerificacion}
                >
                  Agregar
                </Typography>
                {verificaciones.length > 1 && (
                  <Typography 
                    variant="body2" 
                    color="secondary" 
                    sx={{ cursor: "pointer" }} 
                    onClick={() => eliminarVerificacion(index)}
                  >
                    Eliminar
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>

        <Box mt={3}>
          <Typography variant="body1" gutterBottom><strong>Fortalezas:</strong></Typography>
          <TextField fullWidth multiline rows={2} variant="outlined" />
        </Box>

        <Box mt={3}>
          <Typography variant="body1" gutterBottom><strong>Debilidades:</strong></Typography>
          <TextField fullWidth multiline rows={2} variant="outlined" />
        </Box>

        <Box mt={4} display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" gutterBottom>
            <strong>Puntos de Mejora Detectados</strong>
          </Typography>
          <Box width="100%" mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Typography variant="body1" gutterBottom sx={{ fontSize: "0.875rem", whiteSpace: "nowrap", textAlign: "center" }}>
                  <strong>No.</strong>
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1" gutterBottom sx={{ fontSize: "0.875rem", whiteSpace: "nowrap", textAlign: "center" }}>
                  <strong>Req. ISO 9001:2015</strong>
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="body1" gutterBottom sx={{ fontSize: "0.875rem", whiteSpace: "nowrap", textAlign: "center" }}>
                  <strong>Descripción del Punto de Mejora</strong>
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body1" gutterBottom sx={{ fontSize: "0.875rem", whiteSpace: "nowrap", textAlign: "center" }}>
                  <strong>Evidencia Objetiva</strong>
                </Typography>
              </Grid>
            </Grid>
          </Box>
          {puntosMejora.map((puntoMejora, index) => (
            <Box key={index} width="100%" mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  <TextField fullWidth variant="outlined" size="small" />
                </Grid>
                <Grid item xs={2}>
                  <TextField fullWidth variant="outlined" size="small" />
                </Grid>
                <Grid item xs={5}>
                  <TextField fullWidth variant="outlined" size="small" />
                </Grid>
                <Grid item xs={3}>
                  <TextField fullWidth variant="outlined" size="small" />
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="flex-end" mt={1}>
                <Typography 
                  variant="body2" 
                  color="primary" 
                  sx={{ cursor: "pointer", mr: 2 }} 
                  onClick={agregarPuntoMejora}
                >
                  Agregar
                </Typography>
                {puntosMejora.length > 1 && (
                  <Typography 
                    variant="body2" 
                    color="secondary" 
                    sx={{ cursor: "pointer" }} 
                    onClick={() => eliminarPuntoMejora(index)}
                  >
                    Eliminar
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>

        <Box mt={3}>
          <Typography variant="body1" gutterBottom>
            <strong>Conclusiones Generales:</strong>
          </Typography>

          {conclusiones.map((conclusion, index) => (
            <Box key={index} mt={2} p={2} sx={{ border: "1px solid #ccc", borderRadius: "8px" }}>
              <TextField
                fullWidth
                label="Nombre de la conclusión"
                variant="outlined"
                size="small"
                value={conclusion.nombre}
                onChange={(e) => {
                  const nuevasConclusiones = [...conclusiones];
                  nuevasConclusiones[index].nombre = e.target.value;
                  setConclusiones(nuevasConclusiones);
                }}
              />

              <TextField
                fullWidth
                label="Observaciones"
                variant="outlined"
                size="small"
                multiline
                rows={3}
                sx={{ mt: 2 }}
                value={conclusion.observaciones}
                onChange={(e) => {
                  const nuevasConclusiones = [...conclusiones];
                  nuevasConclusiones[index].observaciones = e.target.value;
                  setConclusiones(nuevasConclusiones);
                }}
              />
              {conclusiones.length > 1 && (
                <Box display="flex" justifyContent="flex-end" mt={1}>
                  <Typography
                    variant="body2"
                    color="secondary"
                    sx={{ cursor: "pointer" }}
                    onClick={() => eliminarConclusion(index)}
                  >
                    Eliminar
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={agregarConclusion}
            >
              Agregar Conclusión
            </Typography>
          </Box>
        </Box>

        <Box mt={3}>
          <Typography variant="body1" gutterBottom><strong>Plazos y Consideraciones:</strong></Typography>

          {plazos.map((plazo, index) => (
            <Box key={index} display="flex" alignItems="center" mt={1}>
              <TextField 
                fullWidth 
                multiline 
                rows={1} 
                variant="outlined" 
                value={plazo} 
                onChange={(e) => {
                  const nuevosPlazos = [...plazos];
                  nuevosPlazos[index] = e.target.value;
                  setPlazos(nuevosPlazos);
                }}
              />
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ cursor: "pointer", ml: 2 }} 
                onClick={agregarPlazo}
              >
                Agregar
              </Typography>

              {plazos.length > 1 && (
                <Typography 
                  variant="body2" 
                  color="secondary" 
                  sx={{ cursor: "pointer", ml: 2 }} 
                  onClick={() => eliminarPlazo(index)}
                >
                  Eliminar
                </Typography>
              )}
            </Box>
          ))}
        </Box>
        
        <Box display="flex" justifyContent="center" mt={3}>
          <Button variant="contained" color="primary" sx={{ marginRight: 2 }}>
            Guardar
          </Button>
          <Button variant="outlined" color="secondary">Cancelar</Button>
        </Box>
      </Box>
    </Box>
  );
}

export default InformeAud;
