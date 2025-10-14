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
import { Box, Grid, Typography,TextField, Card, CardContent} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/Button";
import FeedbackSnackbar from "../components/Feedback";
import FolderIcon from '@mui/icons-material/Folder';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DescriptionIcon from "@mui/icons-material/Description";

import InformeAudText from '../components/InformeAudText';
import InformeAudCriterios from '../components/InformeAudCriterios';
import InformeAudEquipo from '../components/InformeAudEquipo';
import InformeAudVRA from '../components/InformeAudVRA';
import InformeAudPM from '../components/InformeAudPM';
import InformeAudConclusiones from '../components/InformeAudConclusiones';
import InformeAudPlazos from "../components/InformeAudPlazos";
import Title from "../components/Title";
import BreadcrumbNav from "../components/BreadcrumbNav";
import EditDocumentIcon from '@mui/icons-material/EditDocument';

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
  const [snackbar, setSnackbar] = useState({ open: false, type: "info", title: "", message: "" });

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

        // Formatear fecha a YYYY-MM-DD para el input date
        const rawFecha = data.fecha || '';
        const fechaFormateada = rawFecha ? new Date(rawFecha).toISOString().split('T')[0] : '';
        setFecha(fechaFormateada);

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

  const [puntosMejora, setPuntosMejora] = useState([
    { reqISO: "", descripcion: "", evidencia: "" }
  ]);

  const agregarPuntoMejora = () => {
    setPuntosMejora([
      ...puntosMejora,
      { reqISO: "", descripcion: "", evidencia: "" }
    ]);
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

  const showSnackbar = (type, title, message) => {
    setSnackbar({ open: true, type, title, message });
  };

  // Función para cancelar (regresa a la página anterior)
  const handleCancelar = () => {
    navigate(-1);
  };

  // Función para guardar con validación previa
  const handleGuardar = async () => {
    let errores = false;
  if (!fecha || fecha.trim() === "") {
    showSnackbar("error", "Error de validación", "La fecha de la auditoría es obligatoria.");
    return;
  }
    // Validar criterios
    criterios.forEach((c, i) => {
      if (!c.trim()) errores = true;
    });

    // Validar equipo auditor
    equipoAuditor.forEach((e, i) => {
      if (!e.rol.trim() || !e.auditor.trim()) errores = true;
    });

    // Validar personal auditado
    personalAuditado.forEach((p, i) => {
      if (!p.nombre.trim() || !p.cargo.trim()) errores = true;
    });

    // Validar verificaciones
    verificaciones.forEach((v, i) => {
      if (
        !v.criterio.trim() ||
        !v.reqAsociado.trim() ||
        !v.observaciones.trim() ||
        !v.evidencia.trim()
      ) errores = true;
    });

    // Validar puntos de mejora
    puntosMejora.forEach((p, i) => {
      if (
        !p.reqISO.trim() ||
        !p.descripcion.trim() ||
        !p.evidencia.trim()
      ) errores = true;
    });

    // Validar conclusiones
    conclusiones.forEach((c, i) => {
      if (!c.nombre.trim() || !c.observaciones.trim()) errores = true;
    });

    // Validar plazos
    plazos.forEach((p, i) => {
      if (!p.trim()) errores = true;
    });

    if (errores) {
      showSnackbar(
        "error",
        "Error de validación",
        "Todos los campos obligatorios deben estar completos antes de guardar."
      );
      return;
    }

    // Payload para guardar
    const payload = {
      idRegistro,
      fecha,
      objetivoAud: objetivo,
      alcanceAud: alcance,
      criterios: criterios.filter(c => c.trim() !== ""),
      fortalezas,
      debilidades,
      auditorLider: lider,
      equipoAuditor: equipoAuditor.map(item => ({
        rolAsignado: item.rol,
        nombreAuditor: item.auditor,
        esAuditorLider: item.rol?.toLowerCase().includes("líder") || false
      })),
      personalAuditado,
      verificacionRuta: verificaciones,
      puntosMejora,
      conclusiones,
      plazos
    };

    try {
      if (modoEdicion && datosAuditoria?.idAuditorialInterna) {
        await axios.put(`http://localhost:8000/api/auditorias/${datosAuditoria.idAuditorialInterna}`, payload);
      } else {
        await axios.post("http://localhost:8000/api/auditorias", payload);
      }

      showSnackbar("success", "Éxito", "La auditoría se guardó correctamente.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => navigate(-1), 2500);
    } catch (err) {
      console.error(err);
      showSnackbar("error", "Error", "Ocurrió un error al guardar la auditoría.");
    }
  };

  return (
    <Box sx={{ p: 2, backgroundColor: "#f7f7f7", minHeight: "100vh" }}>
      <BreadcrumbNav items={[{
        label: 'Estructura',
        to: idProceso ? `/estructura-procesos/${idProceso}` : '/estructura-procesos',
        icon: AccountTreeIcon
      },
      {
        label: 'Carpetas Auditoría',
        to: idProceso ? `/carpetas/${idProceso}/Auditoria` : undefined,
        icon: FolderIcon
      },
      { label: 'Auditorías', icon: DescriptionIcon, to: `/auditoria/${idRegistro}` },
      { label: 'Informe de Auditoría', icon: EditDocumentIcon } ]} />
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
        <Title text="Informe de Auditoría" mode="sticky" />
        <Box mt={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: "#f0f4f8", textAlign: "center" }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">Entidad</Typography>
                <Typography variant="body1" fontWeight="bold">{entidad}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: "#f0f4f8", textAlign: "center" }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">Proceso</Typography>
                <Typography variant="body1" fontWeight="bold">{proceso}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: "#f0f4f8", textAlign: "center" }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">Líder</Typography>
                <Typography variant="body1" fontWeight="bold">{liderProceso}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

        <Box mt={3} display="flex" alignItems="center">
          <Typography variant="body1" mr={2}><strong>Fecha:</strong></Typography>
          <TextField type="date" variant="outlined" size="small" sx={{ width: 200 }} value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </Box>

        <InformeAudText
          label="Objetivo"
          value={objetivo}
          onChange={(e) => setObjetivo(e.target.value)}
          maxChars={512}
          minRows={2}
          maxRows={10}
        />

        <InformeAudText
          label="Alcance"
          value={alcance}
          onChange={(e) => setAlcance(e.target.value)}
          maxChars={512}
          minRows={2}
          maxRows={10}
        />

        <InformeAudCriterios criterios={criterios} setCriterios={setCriterios} />

        <InformeAudEquipo
          equipoAuditor={equipoAuditor}
          setEquipoAuditor={setEquipoAuditor}
          auditoresDisponibles={auditoresDisponibles}
          personalAuditado={personalAuditado}
          setPersonalAuditado={setPersonalAuditado}
        />

        <InformeAudVRA verificaciones={verificaciones} setVerificaciones={setVerificaciones} />

        <InformeAudText
          label="Fortalezas"
          value={fortalezas}
          onChange={(e) => setFortalezas(e.target.value)}
          maxChars={512}
          minRows={2}
          maxRows={10}
        />

        <InformeAudText
          label="Debilidades"
          value={debilidades}
          onChange={(e) => setDebilidades(e.target.value)}
          maxChars={512}
          minRows={2}
          maxRows={10}
        />

        <InformeAudPM puntosMejora={puntosMejora} setPuntosMejora={setPuntosMejora} />

        <InformeAudConclusiones conclusiones={conclusiones} setConclusiones={setConclusiones} />

        <InformeAudPlazos plazos={plazos} setPlazos={setPlazos} />

        <Box display="flex" justifyContent="center" mt={4}>
          <CustomButton type="cancelar" sx={{ mr: 2 }} onClick={handleCancelar}>
            Cancelar
          </CustomButton>
          <CustomButton color="primary" onClick={handleGuardar}>
            Guardar
          </CustomButton>
        </Box>

        <FeedbackSnackbar
          open={snackbar.open}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          type={snackbar.type}
          title={snackbar.title}
          message={snackbar.message}
        />
      </Box>
    </Box>
  );
}

export default InformeAud;
