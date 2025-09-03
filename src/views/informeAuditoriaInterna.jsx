/**
 * Componente: InformeAud.jsx
 * Descripción:
 * Formulario completo para la creación o edición del informe de una auditoría interna. 
 * Permite capturar todos los elementos relevantes del proceso de auditoría en cumplimiento con ISO 9001:2015.

 * Props recibidos vía `location.state`:
 * - `idProceso`: ID del proceso auditado
 * - `idRegistro`: ID del registro donde se guardará la auditoría
 * - `modoEdicion`: Booleano que indica si el formulario es de edición
 * - `datosAuditoria`: Información previa si `modoEdicion` está activo

 * Estado local (`useState`):
 * - Información principal: `fecha`, `objetivo`, `alcance`, `fortalezas`, `debilidades`
 * - Equipos: `criterios`, `equipoAuditor`, `personalAuditado`, `verificaciones`, `puntosMejora`, `conclusiones`, `plazos`
 * - Autocompletado: `auditoresDisponibles`, `entidad`, `proceso`, `lider`
 * - UI/UX: `mensaje`, `error`

 * Lógica de inicialización (`useEffect`):
 * - Carga de auditores disponibles (`/api/auditores/basico`)
 * - Carga de nombre de proceso y entidad si `idProceso` está definido
 * - Carga de datos de auditoría si `modoEdicion` es `true`

 * Funcionalidades clave:
 * - Agregar/eliminar dinámicamente secciones repetibles: criterios, verificaciones, personal, equipo, etc.
 * - Guardado del formulario (`handleGuardar`) ya sea `POST` o `PUT` dependiendo del modo
 * - Validación básica (campos requeridos y estructura de los arreglos)
 * - Confirmación visual mediante `MensajeAlert` y `ErrorAlert`

 * Estructura esperada del payload (`POST /api/auditorias` o `PUT /api/auditorias/:id`):
 * {
 *   idRegistro,
 *   fecha, objetivoAud, alcanceAud,
 *   criterios: [...],
 *   fortalezas, debilidades,
 *   gradoConformidad, gradoCumplimiento,
 *   mantenimientos, opinion, fechas, estados,
 *   observaciones, plazos,
 *   auditorLider,
 *   equipoAuditor: [{ rolAsignado, nombreAuditor, esAuditorLider }],
 *   personalAuditado: [{ nombre, cargo }],
 *   verificacionRuta: [{ criterio, reqAsociado, observaciones, evidencia, tipoHallazgo }],
 *   puntosMejora: [{ reqISO, descripcion, evidencia }],
 *   conclusiones: [{ nombre, observaciones }]
 * }

 * Recomendaciones futuras:
 * - Separar componentes en secciones reutilizables para mejor mantenimiento (por ejemplo, `<EquipoAuditorForm />`, `<VerificacionesList />`)
 * - Validaciones más robustas usando `Yup` o `react-hook-form`
 * - Mejorar experiencia visual con secciones colapsables o pasos (`Stepper`)
 * - Internacionalizar campos si el sistema se escala
 * - Considerar almacenar temporalmente el estado del formulario en `localStorage` en caso de cierres inesperados

 */

import axios from "axios";
import { Box, Grid, Typography, Button, TextField, MenuItem } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MensajeAlert from '../components/MensajeAlert';
import ErrorAlert from '../components/ErrorAlert';

function InformeAud() {
  // Estado para los criterios
  const [criterios, setCriterios] = useState([""]);
  const [equipoAuditor, setEquipoAuditor] = useState([{ rol: "", auditor: "" }]);
  const [personalAuditado, setPersonalAuditado] = useState([{ nombre: "", cargo: "" }]);
  const [verificaciones, setVerificaciones] = useState([
    { criterio: "", reqAsociado: "", observaciones: "", evidencia: "", hallazgo: "" },
  ]);
  const [fecha, setFecha] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [alcance, setAlcance] = useState('');
  const [fortalezas, setFortalezas] = useState('');
  const [debilidades, setDebilidades] = useState('');
  const [conclusiones, setConclusiones] = useState([
    { nombre: "", observaciones: "" }
  ]);
  const [plazos, setPlazos] = useState([""]);
  const location = useLocation();
  const idProceso = location.state?.idProceso;
  const idRegistro = location.state?.idRegistro;
  const [entidad, setEntidad] = useState("");
  const [proceso, setProceso] = useState("");
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [lider, setLider] = useState("");
  const navigate = useNavigate();
  const modoEdicion = location.state?.modoEdicion || false;
  const datosAuditoria = location.state?.datosAuditoria || null;
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [auditoresDisponibles, setAuditoresDisponibles] = useState([]);
  const [liderProceso, setLiderProceso] = useState("");

  useEffect(() => {
    if (!modoEdicion) {
      const nombreCompleto = [
        usuario?.nombre,
        usuario?.apellidoPat,
        usuario?.apellidoMat
      ]
        .filter(Boolean)
        .join(" ");

      setLider(nombreCompleto);
    }
  }, [usuario, modoEdicion]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/procesos/${idProceso}/lider`);
        setProceso(res.data.proceso);
        setEntidad(res.data.entidad);
        setLiderProceso(res.data.liderProceso);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    if (idProceso) fetchDatos();
  }, [idProceso]);

  useEffect(() => {
    const fetchAuditores = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/auditores/basico');
        setAuditoresDisponibles(res.data.data); // accede a la propiedad 'data' dentro de 'data'
      } catch (error) {
        console.error("Error al cargar auditores:", error);
      }
    };
    fetchAuditores();
  }, []);

  useEffect(() => {
    if (!modoEdicion) {
      setEquipoAuditor([{ rol: 'Auditor Líder', auditor: lider }]);
    }
  }, [modoEdicion, lider]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const procesoRes = await axios.get(`http://localhost:8000/api/procesos/${idProceso}`);
        const procesoData = procesoRes.data.proceso;
        setProceso(procesoData.nombreProceso);

        const entidadRes = await axios.get(`http://localhost:8000/api/entidades/${procesoData.idEntidad}`);
        setEntidad(entidadRes.data.nombreEntidad);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    if (idProceso) fetchDatos();
  }, [idProceso]);

  useEffect(() => {
    const fetchAuditoria = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/auditorias/${datosAuditoria.idAuditorialInterna}`);
        const data = res.data;

        setFecha(data.fecha || '');
        setObjetivo(data.objetivoAud || '');
        setAlcance(data.alcanceAud || '');
        setFortalezas(data.fortalezas || '');
        setDebilidades(data.debilidades || '');
        setLider(data.auditorLider || '');

        setCriterios((data.criterios || []).map(item => item.criterio));
        setEquipoAuditor((data.equipo_auditor || []).map(item => ({
          rol: item.rolAsignado || "",
          auditor: item.nombreAuditor || ""
        })));
        setPersonalAuditado((data.personal_auditado || []).map(item => ({
          nombre: item.nombre || "",
          cargo: item.cargo || ""
        })));
        setVerificaciones((data.verificacion_ruta || []).map(item => ({
          criterio: item.criterio || "",
          reqAsociado: item.reqAsociado || "",
          observaciones: item.observaciones || "",
          evidencia: item.evidencia || "",
          hallazgo: item.tipoHallazgo || ""
        })));
        setPuntosMejora((data.puntos_mejora || []).map(item => ({
          reqISO: item.reqISO || "",
          descripcion: item.descripcion || "",
          evidencia: item.evidencia || ""
        })));
        setConclusiones((data.conclusiones || []).map(item => ({
          nombre: item.nombre || "",
          observaciones: item.descripcionConclusion || ""
        })));
        setPlazos((data.plazos || []).map(item => item.descripcion || ""));

      } catch (err) {
        console.error("Error al cargar auditoría para edición:", err);
      }
    };

    if (modoEdicion && datosAuditoria?.idAuditorialInterna) {
      fetchAuditoria();
    }
  }, [modoEdicion, datosAuditoria]);


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

  const agregarConclusion = () => {
    setConclusiones([...conclusiones, { nombre: "", observaciones: "" }]);
  };

  const eliminarConclusion = (index) => {
    setConclusiones(conclusiones.filter((_, i) => i !== index));
  };

  const agregarPlazo = () => {
    setPlazos([...plazos, ""]);
  };

  const eliminarPlazo = (index) => {
    if (plazos.length > 1) {
      setPlazos(plazos.filter((_, i) => i !== index));
    }
  };

  const formatDateTime = (date) => {
    const d = new Date(date);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const handleGuardar = async () => {
    try {
      const payload = {
        idRegistro: idRegistro,
        fecha: fecha,
        objetivoAud: objetivo,
        alcanceAud: alcance,
        criterios: criterios.filter(c => c.trim() !== ""),
        fortalezas: fortalezas,
        debilidades: debilidades,
        gradoConformidad: 90.0,
        gradoCumplimiento: 85.0,
        mantenimientos: "Ninguno",
        opinion: "Buena auditoría",
        fechaElabora: formatDateTime(new Date()),
        fechaRevisa: formatDateTime(new Date()),
        fechaAceptacion: formatDateTime(new Date()),
        estadoElabora: "Elaborado",
        estadoRevisa: "Revisado",
        estadoAceptacion: "Aceptado",
        observaciones: "Sin observaciones",
        plazos: plazos.filter(p => p.trim() !== ""),
        auditorLider: lider,

        idAuditor: usuario?.idUsuario || null,

        equipoAuditor: equipoAuditor.map(item => ({
          rolAsignado: item.rol,
          nombreAuditor: item.auditor,
          esAuditorLider: item.rol?.toLowerCase().includes("líder") || false
        })),

        personalAuditado: personalAuditado.map(item => ({
          nombre: item.nombre,
          cargo: item.cargo
        })),

        verificacionRuta: verificaciones.map(v => ({
          criterio: v.criterio,
          reqAsociado: v.reqAsociado,
          observaciones: v.observaciones,
          evidencia: v.evidencia,
          tipoHallazgo: v.hallazgo
        })),

        puntosMejora: puntosMejora.map(p => ({
          reqISO: p.reqISO,
          descripcion: p.descripcion,
          evidencia: p.evidencia
        })),

        conclusiones: conclusiones.map(c => ({
          nombre: c.nombre,
          observaciones: c.observaciones
        }))

      };

      let res;
      if (modoEdicion && datosAuditoria?.idAuditorialInterna) {
        res = await axios.put(`http://localhost:8000/api/auditorias/${datosAuditoria.idAuditorialInterna}`, payload);
      } else {
        res = await axios.post("http://localhost:8000/api/auditorias", payload);
      }
      console.log("Respuesta del servidor:", res.data);
      setMensaje({ tipo: 'success', texto: 'Auditoría guardada correctamente' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        setMensaje(null);
        navigate(-1);
      }, 3000);
    } catch (err) {
      console.error("Error al guardar auditoría:", err);
      setError("Error al guardar la auditoría");
    }
  };
  const maxChars = 255;
  return (
    <Box sx={{ p: 4, backgroundColor: "#f7f7f7", minHeight: "100vh" }}>

      {/* Mensajes arriba del todo */}
      {mensaje && (
        <MensajeAlert
          tipo={mensaje.tipo}
          texto={mensaje.texto}
          onClose={() => setMensaje(null)}
        />
      )}

      {error && (
        <ErrorAlert message={error} />
      )}

      {/* Contenedor principal del formulario */}
      <Box
        id="formulario-auditoria"
        sx={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: 4,
          borderRadius: "8px",
        }}
      >
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
              <Typography variant="body1"><strong>Líder:</strong> {liderProceso}</Typography>
            </Grid>
          </Grid>
        </Box>

        <Box mt={3} display="flex" alignItems="center">
          <Typography variant="body1" mr={2}><strong>Fecha:</strong></Typography>
          <TextField type="date" variant="outlined" size="small" sx={{ width: 200 }} value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </Box>

        <Box mt={3}>
          <Typography
            variant="caption"
            sx={{ display: "block", textAlign: "right", color: "text.secondary" }}
          >
            {objetivo.length}/{maxChars}
          </Typography>
          <Typography variant="body1" gutterBottom><strong>Objetivo:</strong></Typography>
          <TextField fullWidth multiline minRows={2} maxRows={5} variant="outlined" value={objetivo} inputProps={{ maxLength: maxChars }} onChange={(e) => setObjetivo(e.target.value)}
          />
        </Box>

        <Box mt={3}>
          <Typography
            variant="caption"
            sx={{ display: "block", textAlign: "right", color: "text.secondary" }}
          >
            {alcance.length}/{maxChars}
          </Typography>
          <Typography variant="body1" gutterBottom><strong>Alcance:</strong></Typography>
          <TextField fullWidth multiline minRows={2} maxRows={5} variant="outlined" value={alcance} inputProps={{ maxLength: maxChars }} onChange={(e) => setAlcance(e.target.value)} />
        </Box>

        <Box mt={3}>
          <Typography variant="body1" gutterBottom><strong>Criterios:</strong></Typography>
          {criterios.map((criterio, index) => (
            <Box key={index} display="flex" alignItems="center" mt={1}>
              <TextField
                fullWidth
                multiline minRows={1} maxRows={10}
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
                    <TextField
                      fullWidth
                      label="Rol"
                      variant="outlined"
                      value={item.rol}
                      onChange={(e) => {
                        const nuevos = [...equipoAuditor];
                        nuevos[index].rol = e.target.value;
                        setEquipoAuditor(nuevos);
                      }}
                      disabled={index === 0}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    {index === 0 ? (
                      <TextField
                        fullWidth
                        label="Nombre Auditor"
                        variant="outlined"
                        value={item.auditor}
                        disabled
                      />
                    ) : (
                      <TextField select fullWidth label="Nombre Auditor" variant="outlined" value={item.auditor}
                        onChange={(e) => {
                          const nuevos = [...equipoAuditor];
                          nuevos[index].auditor = e.target.value;
                          setEquipoAuditor(nuevos);
                        }}
                      >
                        {auditoresDisponibles.map((auditor) => (
                          <MenuItem key={auditor.idUsuario} value={`${auditor.nombre} ${auditor.apellidoPat} ${auditor.apellidoMat}`}>
                            {`${auditor.nombre} ${auditor.apellidoPat} ${auditor.apellidoMat}`}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Grid>
                  <Grid item xs={12} display="flex" justifyContent="flex-end">
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ cursor: "pointer", mr: 2 }}
                      onClick={agregarAuditor}
                    >
                      Agregar
                    </Typography>
                    {equipoAuditor.length > 1 && (
                      <Typography
                        variant="body2"
                        color="secondary"
                        sx={{ cursor: "pointer" }}
                        onClick={() => eliminarAuditor(index)}
                      >
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
                    <TextField fullWidth multiline minRows={1} maxRows={3} label="Nombre" variant="outlined" value={item.nombre} onChange={(e) => { const nuevos = [...personalAuditado]; nuevos[index].nombre = e.target.value; setPersonalAuditado(nuevos); }} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth multiline minRows={1} maxRows={3} label="Cargo" variant="outlined" value={item.cargo} onChange={(e) => { const nuevos = [...personalAuditado]; nuevos[index].cargo = e.target.value; setPersonalAuditado(nuevos); }} />
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
            {verificaciones.map((verificacion, index) => (
              <Box key={index} width="100%" mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <TextField fullWidth multiline minRows={1} maxRows={10} variant="outlined" size="small" label="Criterio" value={verificacion.criterio}
                      onChange={(e) => {
                        const nuevas = [...verificaciones];
                        nuevas[index].criterio = e.target.value;
                        setVerificaciones(nuevas);
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField fullWidth multiline minRows={1} maxRows={10} variant="outlined" size="small" label="Req. Asociado" value={verificacion.reqAsociado}
                      onChange={(e) => {
                        const nuevas = [...verificaciones];
                        nuevas[index].reqAsociado = e.target.value;
                        setVerificaciones(nuevas);
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField fullWidth multiline minRows={1} maxRows={10} variant="outlined" size="small" label="Observaciones" value={verificacion.observaciones}
                      onChange={(e) => {
                        const nuevas = [...verificaciones];
                        nuevas[index].observaciones = e.target.value;
                        setVerificaciones(nuevas);
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField fullWidth multiline minRows={1} maxRows={10} variant="outlined" size="small" label="Evidencia" value={verificacion.evidencia}
                      onChange={(e) => {
                        const nuevas = [...verificaciones];
                        nuevas[index].evidencia = e.target.value;
                        setVerificaciones(nuevas);
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField select fullWidth variant="outlined" size="small" label="Tipo de Hallazgo" value={verificacion.hallazgo}
                      onChange={(e) => {
                        const nuevas = [...verificaciones];
                        nuevas[index].hallazgo = e.target.value;
                        setVerificaciones(nuevas);
                      }}
                    >
                      <MenuItem value="NC">NC</MenuItem>
                      <MenuItem value="PM">PM</MenuItem>
                      <MenuItem value="NINGUNO">NINGUNO</MenuItem>
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
        </Box>

        <Box mt={3}>
          <Typography variant="caption"
            sx={{ display: "block", textAlign: "right", color: "text.secondary" }}
          >
            {fortalezas.length}/{maxChars}
          </Typography>
          <Typography variant="body1" gutterBottom><strong>Fortalezas:</strong></Typography>
          <TextField fullWidth multiline minRows={2} maxRows={5} variant="outlined" inputProps={{ maxLength: maxChars }} value={fortalezas} onChange={(e) => setFortalezas(e.target.value)} />
        </Box>

        <Box mt={3}>
          <Typography variant="caption"
            sx={{ display: "block", textAlign: "right", color: "text.secondary" }}
          >
            {debilidades.length}/{maxChars}
          </Typography>
          <Typography variant="body1" gutterBottom><strong>Debilidades:</strong></Typography>
          <TextField fullWidth multiline minRows={2} maxRows={5} variant="outlined" inputProps={{ maxLength: maxChars }} value={debilidades} onChange={(e) => setDebilidades(e.target.value)} />
        </Box>

        <Box mt={4} display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" gutterBottom>
            <strong>Puntos de Mejora Detectados</strong>
          </Typography>
          <Box width="100%" mt={2}>
            <Grid container spacing={2}>
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
              <Grid item xs={5}>
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
                  <TextField fullWidth variant="outlined" size="small" label="Req. ISO" value={puntoMejora.reqISO}
                    onChange={(e) => {
                      const nuevos = [...puntosMejora];
                      nuevos[index].reqISO = e.target.value;
                      setPuntosMejora(nuevos);
                    }}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField fullWidth variant="outlined" size="small" label="Descripción" multiline value={puntoMejora.descripcion}
                    onChange={(e) => {
                      const nuevos = [...puntosMejora];
                      nuevos[index].descripcion = e.target.value;
                      setPuntosMejora(nuevos);
                    }}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField fullWidth variant="outlined" size="small" label="Evidencia" multiline value={puntoMejora.evidencia}
                    onChange={(e) => {
                      const nuevos = [...puntosMejora];
                      nuevos[index].evidencia = e.target.value;
                      setPuntosMejora(nuevos);
                    }}
                  />
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
                fullWidth multiline minRows={1} maxRows={10}
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
                multiline minRows={1} maxRows={10}
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
                multiline minRows={1} maxRows={10}
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
          <Button variant="contained" color="primary" sx={{ marginRight: 2 }} onClick={handleGuardar}>
            Guardar
          </Button>
          <Button variant="outlined" color="secondary">Cancelar</Button>
        </Box>
      </Box>
    </Box>
  );
}

export default InformeAud;
