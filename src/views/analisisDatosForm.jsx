import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Tabs, Tab, Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Snackbar, Alert, Paper, CircularProgress } from "@mui/material";
import axios from "axios";
import ButtonInd from "../components/Button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Title from '../components/Title';


const FormularioAnalisis = () => {
  const { idRegistro } = useParams();


  const location = useLocation();
  const soloLectura = location.state?.soloLectura ?? true;
  const puedeEditar = location.state?.puedeEditar ?? false;
  const [datosProceso, setDatosProceso] = useState({
    idProceso: null,
    anio: null
  });


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
      console.log({
        periodoEvaluacion: formData.periodoEvaluacion,
        secciones
      });
      await axios.put(`http://localhost:8000/api/analisisDatos/${idRegistro}/guardar-completo`, {
        periodoEvaluacion: formData.periodoEvaluacion,
        secciones
      });
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

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            label="Entidad"
            name="entidad"
            value={formData.entidad}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nombre del Macroproceso"
            name="macroproceso"
            value={formData.macroproceso}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Nombre del Proceso"
            name="proceso"
            value={formData.proceso}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Período de Evaluación"
            name="periodoEvaluacion"
            value={formData.periodoEvaluacion}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid>
      </Grid>

      <AppBar position="static" sx={{ bgcolor: "#0056b3", borderRadius: 3, mt: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          centered
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {[
            "Conformidad del Producto o Servicio",
            "Desempeño del Proceso",
            "Eficacia de los riesgos y oportunidades",
            "Satisfacción del Cliente",
            "Desempeño de Proveedores",
          ].map((section, index) => (
            <Tab
              key={index}
              label={section}
              sx={{
                color: "white",
                flex: 1,
                textAlign: "center",
                "&.Mui-selected": { bgcolor: "#F9B800", color: "black" },
                borderRadius: 3,
                m: 0.5,
                textTransform: "none",
                fontSize: "1rem",
              }}
            />
          ))}
        </Tabs>
      </AppBar>

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
        {!soloLectura && (
          <ButtonInd
            type="guardar"
            sx={{ mt: 2, "&:hover": { backgroundColor: "#e6a700" } }}
            onClick={handleGuardarTodo}          >
            Guardar
          </ButtonInd>
        )}
      </Box>

      <ButtonInd
        type="secundario"
        sx={{ mt: 2, ml: 2 }}
        onClick={() => navigate(`/indicadores/${datosProceso.idProceso}/${datosProceso.anio}`)}
        startIcon={<ArrowForwardIosIcon />}
        disabled={!datosProceso.idProceso || !datosProceso.anio}
      >
        Ir a Indicadores
      </ButtonInd>

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