import React, { useState, useEffect } from "react";
import { useParams} from "react-router-dom";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import axios from "axios";

const FormularioAnalisis = () => {
  const { idRegistro } = useParams();
    console.log("AnalisisDatos - idRegistro recibido:", idRegistro);
   
  const [formData, setFormData] = useState({
    entidad: "Empresa XYZ",
    macroproceso: "Gestión de Calidad",
    proceso: "Evaluación de Desempeño",
    periodoEvaluacion: "2024 - Primer Trimestre",
  });

  const [indicadores, setIndicadores] = useState({
    conformidad: [],
    desempeno: [],
    eficacia: [],
    encuesta: [],
    retroalimentacion: [],
    evaluacion: [],
  });

  const [necesidadInterpretacion, setNecesidadInterpretacion] = useState({
    conformidad: { necesidad: "", interpretacion: "" },
    desempeno: { necesidad: "", interpretacion: "" },
    eficacia: { necesidad: "", interpretacion: "" },
    encuesta: { necesidad: "", interpretacion: "" },
    retroalimentacion: { necesidad: "", interpretacion: "" },
    evaluacion: { necesidad: "", interpretacion: "" },
  });

  const [selectedTab, setSelectedTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Función para manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para mostrar notificaciones
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Cerrar notificación
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Obtener datos de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/analisisDatos/1/analisis");
        const data = response.data;

        // Filtrar indicadores por origen
        const conformidad = data.Indicadores.filter((ind) => ind.origenIndicador === "ActividadControl");
        const desempeno = data.Indicadores.filter((ind) => ind.origenIndicador === "MapaProceso");
        const eficacia = data.Indicadores.filter((ind) => ind.origenIndicador === "GestionRiesgo");

        // Asignar datos de Encuesta y Retroalimentación
        const encuesta = data.Encuesta;
        const retroalimentacion = data.Retroalimentacion;

        // Asignar datos de Evaluación a Desempeño de Proveedores
        const evaluacion = data.Evaluacion;

        setIndicadores({
          conformidad,
          desempeno,
          eficacia,
          encuesta,
          retroalimentacion,
          evaluacion,
        });

        // Asignar valores de necesidad e interpretación desde NeceInter
        const neceInterData = data.NeceInter;
        const newNecesidadInterpretacion = {
          conformidad: { necesidad: "", interpretacion: "" },
          desempeno: { necesidad: "", interpretacion: "" },
          eficacia: { necesidad: "", interpretacion: "" },
          encuesta: { necesidad: "", interpretacion: "" },
          retroalimentacion: { necesidad: "", interpretacion: "" },
          evaluacion: { necesidad: "", interpretacion: "" },
        };

        neceInterData.forEach((item) => {
          switch (item.pestana) {
            case "Conformidad":
              newNecesidadInterpretacion.conformidad = {
                necesidad: item.Necesidad || "",
                interpretacion: item.Interpretacion || "",
              };
              break;
            case "Desempeno":
              newNecesidadInterpretacion.desempeno = {
                necesidad: item.Necesidad || "",
                interpretacion: item.Interpretacion || "",
              };
              break;
            case "Eficacia":
              newNecesidadInterpretacion.eficacia = {
                necesidad: item.Necesidad || "",
                interpretacion: item.Interpretacion || "",
              };
              break;
            case "Satisfaccion":
              newNecesidadInterpretacion.encuesta = {
                necesidad: item.Necesidad || "",
                interpretacion: item.Interpretacion || "",
              };
              break;
            case "Evaluacion":
              newNecesidadInterpretacion.evaluacion = {
                necesidad: item.Necesidad || "",
                interpretacion: item.Interpretacion || "",
              };
              break;
            default:
              break;
          }
        });

        setNecesidadInterpretacion(newNecesidadInterpretacion);
      } catch (error) {
        console.error("Error fetching data: ", error);
        showSnackbar("Error al cargar los datos", "error");
      }
    };

    fetchData();
  }, []);

  // Función para actualizar necesidad e interpretación en el backend
  const updateNecesidadInterpretacion = async (pestana, campo, valor) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/analisisDatos/1/necesidad-interpretacion`,
        {
          pestana,
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

  // Manejar cambios en los campos de necesidad e interpretación
  const handleNecesidadInterpretacionChange = (pestana, campo, valor) => {
    setNecesidadInterpretacion((prev) => ({
      ...prev,
      [pestana]: {
        ...prev[pestana],
        [campo]: valor,
      },
    }));
  };

  // Guardar cambios en necesidad e interpretación
  const handleSaveNecesidadInterpretacion = async (pestana) => {
    const { necesidad, interpretacion } = necesidadInterpretacion[pestana];
    await updateNecesidadInterpretacion(pestana, "necesidad", necesidad);
    await updateNecesidadInterpretacion(pestana, "interpretacion", interpretacion);
  };

  // Obtener los indicadores actuales según la pestaña seleccionada
  const getCurrentIndicators = () => {
    switch (selectedTab) {
      case 0:
        return indicadores.conformidad;
      case 1:
        return indicadores.desempeno;
      case 2:
        return indicadores.eficacia;
      case 3:
        return indicadores.encuesta;
      case 4:
        return indicadores.retroalimentacion;
      case 5:
        return indicadores.evaluacion;
      default:
        return [];
    }
  };

  // Obtener las columnas de la tabla según la pestaña seleccionada
  const getTableHeaders = () => {
    switch (selectedTab) {
      case 0: // Conformidad
      case 1: // Desempeño
        return ["Descripción", "Meta", "Periodo Ene-Jun", "Periodo Jul-Ago"];
      case 2: // Eficacia
        return ["Descripción", "Meta", "ResultadoSemestral2"];
      case 3: // Encuesta
        return ["Malo", "Regular", "Bueno", "Excelente", "No Encuestas"];
      case 4: // Retroalimentación
        return ["Método", "Felicitaciones", "Sugerencias", "Quejas"];
      case 5: // Desempeño de Proveedores
        return ["Confiable", "No Confiable", "Condicionado"];
      default:
        return [];
    }
  };

  // Renderizar una fila de la tabla
  const renderTableRow = (indicator, index) => {
    switch (selectedTab) {
      case 0: // Conformidad
      case 1: // Desempeño
        return (
          <TableRow key={index}>
            <TableCell>{indicator.descripcionIndicador || "N/A"}</TableCell>
            <TableCell align="center">{indicator.meta || "N/A"}</TableCell>
            <TableCell align="center">{indicator.resultadoSemestral1 || "N/A"}</TableCell>
            <TableCell align="center">{indicator.resultadoSemestral2 || "N/A"}</TableCell>
          </TableRow>
        );
      case 2: // Eficacia
        return (
          <TableRow key={index}>
            <TableCell>{indicator.descripcionIndicador || "N/A"}</TableCell>
            <TableCell align="center">{indicator.meta || "N/A"}</TableCell>
            <TableCell align="center">{indicator.resultadoSemestral2 || "N/A"}</TableCell>
          </TableRow>
        );
      case 3: // Encuesta
        return (
          <TableRow key={index}>
            <TableCell align="center">{indicator.malo || "N/A"}</TableCell>
            <TableCell align="center">{indicator.regular || "N/A"}</TableCell>
            <TableCell align="center">{indicator.bueno || "N/A"}</TableCell>
            <TableCell align="center">{indicator.excelente || "N/A"}</TableCell>
            <TableCell align="center">{indicator.noEncuestas || "N/A"}</TableCell>
          </TableRow>
        );
      case 4: // Retroalimentación
        return (
          <TableRow key={index}>
            <TableCell>{indicator.metodo || "N/A"}</TableCell>
            <TableCell align="center">{indicator.cantidadFelicitacion || "N/A"}</TableCell>
            <TableCell align="center">{indicator.cantidadSugerencia || "N/A"}</TableCell>
            <TableCell align="center">{indicator.cantidadQueja || "N/A"}</TableCell>
          </TableRow>
        );
      case 5: // Desempeño de Proveedores
        return (
          <TableRow key={index}>
            <TableCell align="center">{indicator.confiable || "N/A"}</TableCell>
            <TableCell align="center">{indicator.noConfiable || "N/A"}</TableCell>
            <TableCell align="center">{indicator.condicionado || "N/A"}</TableCell>
          </TableRow>
        );
      default:
        return null;
    }
  };

  // Obtener el nombre de la pestaña actual
  const getCurrentPestana = () => {
    switch (selectedTab) {
      case 0:
        return "conformidad";
      case 1:
        return "desempeno";
      case 2:
        return "eficacia";
      case 3:
        return "encuesta";
      case 4:
        return "retroalimentacion";
      case 5:
        return "evaluacion";
      default:
        return "";
    }
  };

  return (
    <Box sx={{ width: "80%", margin: "auto", mt: 5, p: 3, borderRadius: 3, boxShadow: 3, bgcolor: "background.paper" }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#0056b3" }}>
        Formulario de Análisis de Datos
      </Typography>

      {/* Formulario con valores preestablecidos */}
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

      {/* Tabs de Secciones */}
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

      {/* Tabla de Indicadores */}
      <Box sx={{ mt: 3 }}>
        {selectedTab === 3 ? ( // Satisfacción del Cliente
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
                  {indicadores.encuesta.map((encuesta, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{encuesta.malo || "N/A"}</TableCell>
                      <TableCell align="center">{encuesta.regular || "N/A"}</TableCell>
                      <TableCell align="center">{encuesta.bueno || "N/A"}</TableCell>
                      <TableCell align="center">{encuesta.excelente || "N/A"}</TableCell>
                      <TableCell align="center">{encuesta.noEncuestas || "N/A"}</TableCell>
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
                    {["Método", "Felicitaciones", "Sugerencias", "Quejas"].map((header, i) => (
                      <TableCell key={i} sx={{ fontWeight: "bold", textAlign: "center", bgcolor: "#0056b3", color: "white" }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {indicadores.retroalimentacion.map((retro, index) => (
                    <TableRow key={index}>
                      <TableCell>{retro.metodo || "N/A"}</TableCell>
                      <TableCell align="center">{retro.cantidadFelicitacion || "N/A"}</TableCell>
                      <TableCell align="center">{retro.cantidadSugerencia || "N/A"}</TableCell>
                      <TableCell align="center">{retro.cantidadQueja || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          // Otras secciones
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
        )}
      </Box>

      {/* Campos de Necesidad e Interpretación */}
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
              value={necesidadInterpretacion[getCurrentPestana()].necesidad}
              onChange={(e) =>
                handleNecesidadInterpretacionChange(getCurrentPestana(), "necesidad", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Interpretación"
              fullWidth
              multiline
              rows={4}
              value={necesidadInterpretacion[getCurrentPestana()].interpretacion}
              onChange={(e) =>
                handleNecesidadInterpretacionChange(getCurrentPestana(), "interpretacion", e.target.value)
              }
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          sx={{ mt: 2, backgroundColor: "#F9B800", color: "#000000" }}
          onClick={() => handleSaveNecesidadInterpretacion(getCurrentPestana())}
        >
          Guardar
        </Button>
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