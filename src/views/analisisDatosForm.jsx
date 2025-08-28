/**
 * Componente: FormularioAnalisis
 * Descripción:
 * Vista encargada de mostrar y editar la sección de "Análisis de Datos" para un proceso específico.
 * Incluye información general, indicadores por secciones (conformidad, desempeño, eficacia, satisfacción, evaluación),
 * y permite registrar o actualizar la necesidad e interpretación del comportamiento del proceso.

 * Funcionalidades principales:
 * 1. ✅ Carga datos del proceso (entidad, macroproceso, nombre, año) a partir de un `idRegistro`.
 * 2. ✅ Carga indicadores clasificados por origen: ActividadControl, MapaProceso, Encuesta, Retroalimentación, EvaluaProveedores.
 * 3. ✅ Carga e inicializa la sección de "Necesidad e Interpretación" por cada pestaña.
 * 4. ✅ Permite modificar el periodo de evaluación y guardar los cambios si el usuario tiene permisos de edición.
 * 5. ✅ Permite actualizar de forma parcial los campos de necesidad e interpretación por sección.
 * 6. ✅ Utiliza pestañas (`Tabs`) para dividir las secciones del análisis.
 * 7. ✅ Incluye validación de carga, animaciones (`Fade`) y retroalimentación visual (`Snackbar`, `Alert`).
 * 8. ✅ Navega a la vista de indicadores del proceso mediante botón de acceso.

 * Estados:
 * - `formData`: datos generales del proceso.
 * - `indicadores`: indicadores agrupados por origen.
 * - `necesidadInterpretacion`: estado editable para cada sección.
 * - `selectedTab`: pestaña activa.
 * - `modoEdicion`: controla si se está editando el periodo.
 * - `loading`, `snackbar`, `datosProceso`: estados de carga y visualización.

 * Hooks utilizados:
 * - `useParams`, `useLocation`, `useNavigate` para routing.
 * - `useState`, `useEffect` para control de datos.
 * - `useMenuProceso`, `Permiso` para configuración dinámica según usuario.

 * Componentes reutilizables:
 * - `Title`: título estilizado general.
 * - `MenuNavegacionProceso`: navegación lateral del proceso.
 * - `ButtonInd`: botón customizado con tipos (`guardar`, `aceptar`, `cancelar`).
 * - `Snackbar`, `Alert`: retroalimentación de acciones del usuario.

 * Backend:
 * - Endpoints involucrados:
 *    - `/api/getIdRegistro`
 *    - `/api/analisisDatos/:idRegistro`
 *    - `/api/analisisDatos/:idRegistro/guardar-completo`
 *    - `/api/analisisDatos/:idRegistro/necesidad-interpretacion`
 *
 * Consideraciones:
 * - Modulariza cada sección para facilitar mantenimiento.
 * -  Puede escalarse para permitir edición individual por cada fila de indicadores si se requiere.
 * -  Asegurarse de que los valores `idProceso` y `anio` estén siempre disponibles para evitar navegación incorrecta.
 * -  Validar datos de entrada antes de envío masivo (periodo o necesidad vacíos).

 * Posibles mejoras futuras:
 * - Mostrar gráficas por cada sección con Chart.js.
 * - Exportar sección a PDF.
 * - Permitir comentarios o anotaciones por parte del usuario revisor.
 * - Agregar versión o historial de análisis.
 */

import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Tabs, Tab, Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Snackbar, Alert, Paper, CircularProgress } from "@mui/material";
import axios from "axios";
import ButtonInd from "../components/Button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Title from '../components/Title';
import MenuNavegacionProceso from "../components/MenuProcesoEstructura";
import useMenuProceso from "../hooks/useMenuProceso";
import Permiso from "../hooks/userPermiso";
import BusinessIcon from '@mui/icons-material/Business';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsIcon from '@mui/icons-material/Settings';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SectionTabs from "../components/SectionTabs";
import { Fade } from '@mui/material';




const FormularioAnalisis = () => {
  const { idRegistro } = useParams();

  const menuItems = useMenuProceso();
  const location = useLocation();
  const rolActivo = location.state?.rolActivo || JSON.parse(localStorage.getItem("rolActivo"));
  const { soloLectura, puedeEditar } = Permiso("Análisis de Datos");
  const [datosProceso, setDatosProceso] = useState({
    idProceso: null,
    anio: null
  });

  const [modoEdicion, setModoEdicion] = useState(false);


  const navigate = useNavigate();


  console.log("AnalisisDatos - idRegistro recibido:", idRegistro);

  const [formData, setFormData] = useState({
    entidad: "",
    macroproceso: "",
    proceso: "",
    periodoEvaluacion: "",
  });

  const [indicadores, setIndicadores] = useState({
    Conformidad: [],
    desempeno: [],
    eficacia: [],
    satisfaccion: { encuesta: [], retroalimentacion: [] },
    evaluacion: [],
  });

  const [necesidadInterpretacion, setNecesidadInterpretacion] = useState({
    Conformidad: { necesidad: "", interpretacion: "" },
    desempeno: { necesidad: "", interpretacion: "" },
    eficacia: { necesidad: "", interpretacion: "" },
    satisfaccion: { necesidad: "", interpretacion: "" },
    evaluacion: { necesidad: "", interpretacion: "" },
  });

  const [selectedTab, setSelectedTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(true);

  // Función para manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Función para obtener la info basica
  const fetchIdRegistro = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/getIdRegistro`, {
        params: {
          idRegistro
        }
      });

      if (response.data.idRegistro) {
        setDatosProceso({
          idProceso: response.data.proceso.idProceso,
          anio: response.data.anio
        });
        // Actualiza formData con los datos del proceso si vienen en la respuesta
        if (response.data.proceso) {
          setFormData(prev => ({
            ...prev,
            entidad: response.data.entidad || prev.entidad,
            macroproceso: response.data.macro || prev.macroproceso,
            proceso: response.data.proceso.nombreProceso || prev.proceso
          }));
        }
        console.log("Entidad:", response.data.proceso);
        return response.data.idRegistro;
      } else {
        showSnackbar("No se encontró un registro para el proceso y año especificados", "warning");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el idRegistro:", error);
      showSnackbar("Error al obtener el registro", "error");
      return null;
    }
  };

  // Función para cargar los datos del formulario
  const fetchFormData = async (registroId) => {
    try {
      console.log("Registro:", registroId);
      const response = await axios.get(`http://127.0.0.1:8000/api/analisisDatos/${registroId}`);
      const data = response.data;
      console.log("Respuesta de la API:", data);

      if (data.analisisDatos && data.analisisDatos.length > 0) {
        const periodo = data.analisisDatos[0].periodoEvaluacion;
        setFormData(prev => ({
          ...prev,
          periodoEvaluacion: periodo || prev.periodoEvaluacion
        }));
      }
      else {
        console.warn("No se encontró registro en formAnalisisDatos para el idRegistro:", registroId);
      }

      // Filtrar indicadores por origen
      const Conformidad = data.indicador?.filter(ind => ind.origenIndicador === "ActividadControl") || [];
      const desempeno = data.indicador?.filter(ind => ind.origenIndicador === "MapaProceso") || [];
      const eficacia = data.gestionRiesgo || [];

      // Procesar datos de encuesta
      const encuestaIndicador = data.indicador?.find(ind => ind.origenIndicador === "Encuesta");
      const encuesta = encuestaIndicador ? [{
        ...encuestaIndicador,
        ...(data.encuesta?.find(e => e.idIndicador === encuestaIndicador.idIndicador) || {})
      }] : [];

      // Procesar datos de evaluación
      const evaluacionIndicador = data.indicador?.find(ind => ind.origenIndicador === "EvaluaProveedores");
      const evaluacion = evaluacionIndicador ? [{
        ...evaluacionIndicador,
        ...(data.evaluacion?.find(e => e.idIndicador === evaluacionIndicador.idIndicador) || {})
      }] : [];

      // Procesar datos de retroalimentación
      const retroalimentacion = data.retroalimentacion?.map(retro => {
        const indicador = data.indicador?.find(ind => ind.idIndicador === retro.idIndicador);
        return indicador ? { ...indicador, ...retro } : retro;
      }) || [];

      setIndicadores({
        Conformidad,
        desempeno,
        eficacia,
        satisfaccion: {
          encuesta,
          retroalimentacion
        },
        evaluacion,
      });

      // Inicializar necesidad e interpretación con datos de analisisDatos
      const nuevaNecesidadInterpretacion = {
        Conformidad: { necesidad: "", interpretacion: "" },
        desempeno: { necesidad: "", interpretacion: "" },
        eficacia: { necesidad: "", interpretacion: "" },
        satisfaccion: { necesidad: "", interpretacion: "" },
        evaluacion: { necesidad: "", interpretacion: "" },
      };

      if (data.necesidadInterpretacion) {
        data.necesidadInterpretacion.forEach(item => {
          const seccionMap = {
            'Conformidad': 'Conformidad',
            'Desempeño': 'desempeno',
            'Desempeño Proveedores': 'evaluacion',
            'Eficacia': 'eficacia',
            'Satisfaccion': 'satisfaccion'
          };

          const key = seccionMap[item.seccion] || item.seccion.toLowerCase();
          if (nuevaNecesidadInterpretacion[key]) {
            nuevaNecesidadInterpretacion[key] = {
              necesidad: item.Necesidad || "",
              interpretacion: item.Interpretacion || ""
            };
          }
        });
      }

      setNecesidadInterpretacion(nuevaNecesidadInterpretacion);
      showSnackbar("Datos cargados correctamente", "success");
    } catch (error) {
      console.error("Error fetching data: ", error);
      showSnackbar("Error al cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const registroId = await fetchIdRegistro();
      if (registroId) {
        await fetchFormData(registroId);
      } else {
        setLoading(false);
      }
    };

    loadData();
  }, [idRegistro]);

  const updateNecesidadInterpretacion = async (seccion, campo, valor) => {
    try {
      // Mapear nuestras secciones internas a las de la API
      let seccionApi = seccion;
      if (seccion === "desempeno") seccionApi = "DesempeñoProceso";
      if (seccion === "evaluacion") seccionApi = "Evaluacion";
      if (seccion === "evaluacion") seccionApi = "DesempeñoProveedores";
      // Agrega más mapeos según sea necesario

      const response = await axios.put(
        `http://127.0.0.1:8000/api/analisisDatos/${idRegistro}/necesidad-interpretacion`,
        {
          seccion: seccionApi,
          campo,
          valor,
        }
      );
      console.log("Campo actualizado:", response.data);
      showSnackbar("Campo actualizado correctamente", "success");
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
      showSnackbar("Error al actualizar el campo", "error");
    }
  };

  const handleNecesidadInterpretacionChange = (pestana, campo, valor) => {
    setNecesidadInterpretacion((prev) => ({
      ...prev,
      [pestana]: {
        ...prev[pestana],
        [campo]: valor,
      },
    }));
  };

  const handleGuardarTodo = async () => {
    const seccionesMap = {
      Conformidad: "Conformidad",
      desempeno: "Desempeño",
      eficacia: "Eficacia",
      satisfaccion: "Satisfaccion",
      evaluacion: "Desempeño Proveedores"
    };

    const secciones = Object.entries(necesidadInterpretacion).map(([key, valor]) => ({
      seccion: seccionesMap[key],
      necesidad: valor.necesidad,
      interpretacion: valor.interpretacion
    }));

    try {
      console.log("🛠️ Enviando datos al backend: ", {
        periodoEvaluacion: formData.periodoEvaluacion,
        secciones
      });

      await axios.put(`http://localhost:8000/api/analisisDatos/${idRegistro}/guardar-completo`, {
        periodoEvaluacion: formData.periodoEvaluacion,
        secciones
      });

      console.log("✅ Datos guardados correctamente");

      // ✅ Actualizar localmente sin recargar
      setFormData(prev => ({
        ...prev,
        periodoEvaluacion: formData.periodoEvaluacion
      }));
      setModoEdicion(false);

      showSnackbar("Datos guardados correctamente");

    } catch (err) {
      showSnackbar("Error al guardar", "error");
      console.error(err);
    }
  };


  const handleSaveNecesidadInterpretacion = async (pestana) => {
    const { necesidad, interpretacion } = necesidadInterpretacion[pestana];
    await updateNecesidadInterpretacion(pestana, "necesidad", necesidad);
    await updateNecesidadInterpretacion(pestana, "interpretacion", interpretacion);
  };

  const getCurrentIndicators = () => {
    switch (selectedTab) {
      case 0: return indicadores.Conformidad;
      case 1: return indicadores.desempeno;
      case 2: return indicadores.eficacia;
      case 3: return indicadores.satisfaccion;
      case 4: return indicadores.evaluacion;
      default: return [];
    }
  };

  const getTableHeaders = () => {
    switch (selectedTab) {
      case 0: // Conformidad
        return ["Nombre del Indicador", "Meta", "Periodicidad"];
      case 1: // Desempeño
        return ["Nombre del Indicador", "Meta", "Periodicidad"];
      case 2: // Eficacia
        return ["Nombre del Indicador", "Meta", "Periodicidad"];
      case 3: // Satisfacción (manejo especial)
        return [];
      case 4: // Evaluación de Proveedores
        return ["Confiable", "No Confiable", "Condicionado", "Meta Confiable", "Meta No Confiable", "Meta Condicionado"];
      default:
        return [];
    }
  };

  const renderTableRow = (indicator, index) => {
    switch (selectedTab) {
      case 0: // Conformidad
      case 1: // Desempeño
      case 2: // Eficacia
        return (
          <TableRow key={index}>
            <TableCell>{indicator.nombreIndicador || "N/A"}</TableCell>
            <TableCell align="center">{indicator.meta ?? "N/A"}</TableCell>
            <TableCell align="center">{indicator.periodicidad || "N/A"}</TableCell>
          </TableRow>
        );
      case 4: // Evaluación de Proveedores
        return (
          <TableRow key={index}>
            <TableCell align="center">{indicator.confiable ?? "N/A"}</TableCell>
            <TableCell align="center">{indicator.noConfiable ?? "N/A"}</TableCell>
            <TableCell align="center">{indicator.condicionado ?? "N/A"}</TableCell>
            <TableCell align="center">{indicator.metaConfiable ?? "N/A"}</TableCell>
            <TableCell align="center">{indicator.metaNoConfiable ?? "N/A"}</TableCell>
            <TableCell align="center">{indicator.metaCondicionado ?? "N/A"}</TableCell>
          </TableRow>
        );
      default:
        return null;
    }
  };

  const getCurrentPestana = () => {
    switch (selectedTab) {
      case 0: return "Conformidad";
      case 1: return "desempeno";
      case 2: return "eficacia";
      case 3: return "satisfaccion";
      case 4: return "evaluacion";
      default: return "";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={80} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "80%", margin: "auto", mt: 5, p: 3, borderRadius: 3, boxShadow: 3, bgcolor: "background.paper" }}>
      <Title text="Análisis de Datos"></Title>
      <MenuNavegacionProceso items={menuItems} />
      <Fade in timeout={600}>
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#0056b3" }}>
            Información General
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {/* Entidad */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BusinessIcon color="primary" />
                <Typography variant="subtitle2" sx={{ color: "#68A2C9" }}>Entidad</Typography>
              </Box>
              <Typography sx={{ ml: 4 }}>{formData.entidad || "Sin asignar"}</Typography>
            </Box>

            {/* Macroproceso */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccountTreeIcon color="primary" />
                <Typography variant="subtitle2" sx={{ color: "#68A2C9" }}>Macroproceso</Typography>
              </Box>
              <Typography sx={{ ml: 4 }}>{formData.macroproceso || "Sin asignar"}</Typography>
            </Box>

            {/* Proceso */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SettingsIcon color="primary" />
                <Typography variant="subtitle2" sx={{ color: "#68A2C9" }}>Proceso</Typography>
              </Box>
              <Typography sx={{ ml: 4 }}>{formData.proceso || "Sin asignar"}</Typography>
            </Box>

            {/* Periodo de Evaluación */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EventNoteIcon color="primary" />
                <Typography variant="subtitle2" sx={{ color: "#68A2C9" }}>Período de Evaluación</Typography>
              </Box>
              {modoEdicion ? (
                <TextField
                  name="periodoEvaluacion"
                  value={formData.periodoEvaluacion}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mt: 1 }}
                />
              ) : (
                <Typography sx={{ ml: 4 }}>{formData.periodoEvaluacion || "Sin definir"}</Typography>
              )}
            </Box>
          </Box>

          {puedeEditar && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
              {!modoEdicion ? (
                <ButtonInd type="cancelar" onClick={() => setModoEdicion(true)}>
                  Editar
                </ButtonInd>
              ) : (
                <ButtonInd type="guardar" onClick={handleGuardarTodo}>
                  Guardar
                </ButtonInd>
              )}
            </Box>
          )}
        </Paper>
      </Fade>


      <SectionTabs
        sections={[
          "Conformidad del Producto o Servicio",
          "Desempeño del Proceso",
          "Eficacia de los riesgos y oportunidades",
          "Satisfacción del Cliente",
          "Desempeño de Proveedores",
        ]}
        selectedTab={selectedTab}
        onTabChange={(newValue) => setSelectedTab(newValue)}
      />

      <Box sx={{ mt: 3 }}>
        {selectedTab === 3 ? ( // Satisfacción del Cliente (mostrar ambas tablas)
          <>
            {/* Tabla de Encuesta */}
            <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: "bold", color: "#0056b3" }}>
              Encuesta
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3, mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {["Malo", "Regular", "Bueno", "Excelente", "No Encuestas"].map((header, i) => (
                      <TableCell key={i} sx={{ fontWeight: "bold", textAlign: "center", bgcolor: "#0056b3", color: "white" }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {indicadores.satisfaccion.encuesta.map((encuesta, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{encuesta.malo ?? "N/A"}</TableCell>
                      <TableCell align="center">{encuesta.regular ?? "N/A"}</TableCell>
                      <TableCell align="center">{encuesta.bueno ?? "N/A"}</TableCell>
                      <TableCell align="center">{encuesta.excelente ?? "N/A"}</TableCell>
                      <TableCell align="center">{encuesta.noEncuestas ?? "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Tabla de Retroalimentación */}
            <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: "bold", color: "#0056b3" }}>
              Retroalimentación
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {["Método", "Felicitaciones", "Sugerencias", "Quejas", "Total"].map((header, i) => (
                      <TableCell key={i} sx={{ fontWeight: "bold", textAlign: "center", bgcolor: "#0056b3", color: "white" }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {indicadores.satisfaccion.retroalimentacion.map((retro, index) => (
                    <TableRow key={index}>
                      <TableCell>{retro.metodo || "N/A"}</TableCell>
                      <TableCell align="center">{retro.cantidadFelicitacion ?? "N/A"}</TableCell>
                      <TableCell align="center">{retro.cantidadSugerencia ?? "N/A"}</TableCell>
                      <TableCell align="center">{retro.cantidadQueja ?? "N/A"}</TableCell>
                      <TableCell align="center">{retro.total ?? "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : selectedTab !== 3 ? ( // Otras secciones (tabla normal)
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {getTableHeaders().map((header, i) => (
                    <TableCell key={i} sx={{ fontWeight: "bold", textAlign: "center", bgcolor: "#0056b3", color: "white" }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {getCurrentIndicators().map((indicator, index) => renderTableRow(indicator, index))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: "bold", color: "#0056b3" }}>
          Necesidad e Interpretación
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              label="Necesidad"
              fullWidth
              multiline
              rows={4}
              value={necesidadInterpretacion[getCurrentPestana()]?.necesidad || ""}
              onChange={(e) =>
                handleNecesidadInterpretacionChange(getCurrentPestana(), "necesidad", e.target.value)
              }
              variant="outlined"
              disabled={soloLectura}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Interpretación"
              fullWidth
              multiline
              rows={4}
              value={necesidadInterpretacion[getCurrentPestana()]?.interpretacion || ""}
              onChange={(e) =>
                handleNecesidadInterpretacionChange(getCurrentPestana(), "interpretacion", e.target.value)
              }
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
        <ButtonInd
          type="aceptar"
          onClick={() => navigate(`/indicadores/${datosProceso.idProceso}/${datosProceso.anio}`)}
          startIcon={<ArrowForwardIosIcon />}
          disabled={!datosProceso.idProceso || !datosProceso.anio}

        >
          Ir a Indicadores
        </ButtonInd>

        {!soloLectura && (
          <ButtonInd
            type="guardar"
            onClick={handleGuardarTodo}
          >
            Guardar
          </ButtonInd>
        )}
      </Box>


      {/* Notificación (Snackbar) */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormularioAnalisis;