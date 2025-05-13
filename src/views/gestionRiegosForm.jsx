import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,

  DialogActions,
} from "@mui/material";
import axios from "axios";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuNavegacionProceso from "../components/MenuProcesoEstructura";
import useMenuProceso from "../hooks/useMenuProceso";
import Permiso from "../hooks/userPermiso";

// Las secciones del formulario de riesgos
const sections = ["IDENTIFICACIÓN", "ANÁLISIS", "TRATAMIENTO", "EVALUACIÓN DE LA EFECTIVIDAD"];

function FormularioGestionRiesgos() {
  // 1) Tomamos el idRegistro desde la URL
  const { idRegistro } = useParams();
  const location = useLocation();
  const rolActivo = location.state?.rolActivo || JSON.parse(localStorage.getItem("rolActivo"));
  const { soloLectura, puedeEditar } = Permiso("Gestión de Riesgo");
  const [modoEdicion, setModoEdicion] = useState(false);
  const menuItems = useMenuProceso();


  // 2) Estado para la información general que se mostrará/guardará en la tabla gestionriesgos
  const [gestionRiesgo, setGestionRiesgo] = useState({
    idGesRies: null,        // se llena cuando ya exista en la BD
    idRegistro: idRegistro, // por si lo necesitas almacenar
    entidad: "",
    macroproceso: "",
    proceso: "",
    elaboro: "",
    fechaelaboracion: new Date().toISOString().split("T")[0],
  });

  // 3) Saber si ya existe un registro en la tabla gestionriesgos (idGesRies)
  const [tieneGesRies, setTieneGesRies] = useState(false);

  // 4) Lista de riesgos
  const [riesgos, setRiesgos] = useState([]);
  // Estructura local para mostrar en la tabla “por secciones”
  const [savedData, setSavedData] = useState({});

  // 5) Control de tabs (para la tabla de riesgos)
  const [selectedTab, setSelectedTab] = useState(0);

  // 6) Modal para crear/editar un riesgo
  const [openModal, setOpenModal] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRiesgo, setEditingRiesgo] = useState(null);

  // 7) Nuevo riesgo
  const [nuevoRiesgo, setNuevoRiesgo] = useState({
    idRiesgo: null,
    responsable: "",
    fuente: "",
    tipoRiesgo: "",
    descripcion: "",
    consecuencias: "",
    valorSeveridad: "",
    valorOcurrencia: "",
    valorNRP: "",
    actividades: "",
    accionMejora: "",
    fechaImp: "",
    fechaEva: "",
    reevaluacionSeveridad: "",
    reevaluacionOcurrencia: "",
    reevaluacionNRP: "",
    reevaluacionEfectividad: "",
    analisisEfectividad: "",
  });

  // 8) Confirmar eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const fetchIdRegistro = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/getIdRegistroGR`, {
        params: {
          idRegistro
        }
      });

      if (response.data.idRegistro) {

        // Actualiza formData con los datos del proceso si vienen en la respuesta
        if (response.data.proceso) {
          setGestionRiesgo(prev => ({
            ...prev,
            entidad: response.data.entidad || prev.entidad,
            macroproceso: response.data.macro || prev.macroproceso,
            proceso: response.data.proceso.nombreProceso || prev.proceso
          }));
        }
        console.log(response.data);
        return response.data.idRegistro;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el idRegistro:", error);
      return null;
    }
  };

  // --------------------------------------------------------------------------
  // useEffect #1: Al montar, cargamos la info general y/o chequeamos si existe un row en gestionriesgos
  // --------------------------------------------------------------------------


  const fetchFormData = async (idRegistro) => {
    console.log("[LOG] useEffect -> idRegistro =", idRegistro); // [LOG] Muestra el idRegistro recibido

    if (!idRegistro) {
      console.log("[LOG] No se recibió idRegistro. No se puede cargar datos de gestión de riesgos.");
      return;
    }

    // 1) Cargar datos de la “entidad, macroproceso, proceso”
    const urlDatosGenerales = `http://127.0.0.1:8000/api/gestionriesgos/${idRegistro}/datos-generales`;
    console.log("[LOG] Solicitando datos generales a:", urlDatosGenerales);

    fetch(urlDatosGenerales)
      .then((res) => res.json())
      .then((info) => {
        console.log("[LOG] Datos Generales recibidos:", info);
        // Ajusta la forma según devuelva tu backend
      })
      .catch((err) => console.error("[ERROR] al cargar datos generales:", err));

    // 2) Checar si ya existe un row en la tabla gestionriesgos
    const urlShowByRegistro = `http://127.0.0.1:8000/api/gestionriesgos/${idRegistro}`;
    console.log("[LOG] Verificando si existe gestionriesgos con:", urlShowByRegistro);

    fetch(urlShowByRegistro)
      .then((res) => {
        if (!res.ok) {
          console.log("[LOG] No existe un registro en gestionriesgos para idRegistro =", idRegistro);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          console.log("[LOG] Ya existe un registro en gestionriesgos:", data);
          setGestionRiesgo((prev) => ({
            ...prev,
            idGesRies: data.idGesRies,
            elaboro: data.elaboro,
            fechaelaboracion: data.fechaelaboracion?.split("T")[0] || prev.fechaelaboracion,
          }));
          setTieneGesRies(true);

          // Cargar riesgos
          cargarRiesgos(data.idGesRies);
        }
      })
      .catch((err) => {
        console.log("[LOG] Posiblemente no exista gestionriesgos. Error:", err);
      });
  };


  useEffect(() => {
    const loadData = async () => {
      const registroId = await fetchIdRegistro();
      if (registroId) {
        await fetchFormData(registroId);
      } else {

      }
    };

    loadData();
  }, [idRegistro]);

  // --------------------------------------------------------------------------
  // Función para cargar la lista de riesgos cuando tengamos idGesRies
  // --------------------------------------------------------------------------
  const cargarRiesgos = (idGesRies) => {
    if (!idGesRies) return;

    const urlRiesgos = `http://127.0.0.1:8000/api/gestionriesgos/${idGesRies}/riesgos`;
    console.log("[LOG] Cargando riesgos desde:", urlRiesgos);

    fetch(urlRiesgos)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener riesgos");
        return res.json();
      })
      .then((apiData) => {
        // apiData debe contener { gestionRiesgos: {...}, riesgos: [...] }
        console.log("[LOG] Respuesta al cargarRiesgos:", apiData);
        const lista = apiData.riesgos || [];
        setRiesgos(lista);
        setSavedData(organizarRiesgos(lista));
      })
      .catch((err) => console.error("[ERROR] al cargar riesgos:", err));
  };

  // --------------------------------------------------------------------------
  // Función para organizar la data de riesgos por secciones
  // --------------------------------------------------------------------------
  const organizarRiesgos = (lista) => {
    console.log("[LOG] organizando riesgos en secciones. Cantidad:", lista.length);

    return {
      0: lista.map((item, index) => ({
        Riesgo: index + 1, // Usamos index + 1 para que empiece en 1
        fuente: item.fuente,
        tipoRiesgo: item.tipoRiesgo,
        descripcion: item.descripcion,
      })),
      1: lista.map((item, index) => ({
        idRiesgo: index + 1,
        consecuencias: item.consecuencias,
        valorSeveridad: item.valorSeveridad,
        valorOcurrencia: item.valorOcurrencia,
        valorNRP: item.valorNRP,
      })),
      2: lista.map((item, index) => ({
        idRiesgo: index + 1,
        actividades: item.actividades,
        accionMejora: item.accionMejora,
        fechaImp: item.fechaImp,
        fechaEva: item.fechaEva,
        responsable: item.responsable,
      })),
      3: lista.map((item, index) => ({
        idRiesgo: index + 1,
        reevaluacionSeveridad: item.reevaluacionSeveridad,
        reevaluacionOcurrencia: item.reevaluacionOcurrencia,
        reevaluacionNRP: item.reevaluacionNRP,
        reevaluacionEfectividad: item.reevaluacionEfectividad,
        analisisEfectividad: item.analisisEfectividad,
      })),
    };
  };

  // --------------------------------------------------------------------------
  // Handler para GUARDAR la info general en la tabla gestionriesgos
  // --------------------------------------------------------------------------
  const handleGuardarGestionRiesgos = async () => {
    console.log("[LOG] handleGuardarGestionRiesgos -> gestionRiesgo actual:", gestionRiesgo);

    if (!idRegistro) {
      alert("No hay idRegistro, no se puede guardar en gestionriesgos.");
      return;
    }

    try {
      let url = `http://127.0.0.1:8000/api/gestionriesgos`;
      let method = "POST";

      if (tieneGesRies && gestionRiesgo.idGesRies) {
        url = `http://127.0.0.1:8000/api/gestionriesgos/${gestionRiesgo.idGesRies}`;
        method = "PUT";
      }

      const payload = {
        idRegistro: idRegistro,
        elaboro: gestionRiesgo.elaboro,
        fechaelaboracion: gestionRiesgo.fechaelaboracion,
      };

      console.log(`[LOG] Enviando ${method} a ${url} con payload:`, payload);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("[ERROR] Respuesta no OK al guardar gestionriesgos:", response);
        throw new Error("Error al guardar/actualizar gestionriesgos.");
      }

      const result = await response.json();
      console.log("[LOG] gestionriesgos guardado/actualizado:", result);

      setGestionRiesgo((prev) => ({
        ...prev,
        idGesRies: result.idGesRies,
      }));
      setTieneGesRies(true);

      if (!tieneGesRies) {
        // Significa que era la primera vez
        console.log("[LOG] Primera vez que se crea gestionriesgos. Cargando riesgos (vacío).");
        cargarRiesgos(result.idGesRies);
      }

      alert("Datos generales guardados correctamente.");
    } catch (err) {
      console.error("[ERROR] al guardar la información general:", err);
      alert("Error al guardar la información general.");
    }
  };

  // --------------------------------------------------------------------------
  // Handler de tabs (para la tabla de riesgos)
  // --------------------------------------------------------------------------
  const handleTabChange = (_, newValue) => {
    console.log("[LOG] Cambio de tab a:", newValue);
    setSelectedTab(newValue);
  };

  // --------------------------------------------------------------------------
  // Handler para CREAR/EDITAR un riesgo
  // --------------------------------------------------------------------------
  const handleGuardarRiesgo = async () => {
    console.log("[LOG] handleGuardarRiesgo -> idGesRies:", gestionRiesgo.idGesRies);
    console.log("[LOG] handleGuardarRiesgo -> nuevoRiesgo actual:", nuevoRiesgo);

    if (!gestionRiesgo.idGesRies) {
      alert("No se ha guardado la información general (idGesRies es null).");
      return;
    }

    // Validar campos mínimos
    if (!nuevoRiesgo.tipoRiesgo || !nuevoRiesgo.descripcion) {
      alert("Faltan campos obligatorios (tipoRiesgo, descripción).");
      return;
    }

    try {
      let url = `http://127.0.0.1:8000/api/gestionriesgos/${gestionRiesgo.idGesRies}/riesgos`;
      let method = "POST";

      if (isEditing && editingRiesgo) {
        url = `http://127.0.0.1:8000/api/gestionriesgos/${gestionRiesgo.idGesRies}/riesgos/${editingRiesgo.idRiesgo}`;
        method = "PUT";
      }

      console.log(`[LOG] Enviando ${method} a ${url} con nuevoRiesgo:`, nuevoRiesgo);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoRiesgo),
      });

      if (!response.ok) {
        console.error("[ERROR] Respuesta no OK al crear/editar riesgo:", response);
        throw new Error("Error al crear/editar riesgo.");
      }

      const result = await response.json();
      console.log("[LOG] Respuesta al crear/editar riesgo:", result);

      // Si es edición, actualizamos la lista
      if (isEditing) {
        const updated = riesgos.map((r) => (r.idRiesgo === editingRiesgo.idRiesgo ? result : r));
        setRiesgos(updated);
        setSavedData(organizarRiesgos(updated));
      } else {
        // Agregar nuevo
        const newList = [...riesgos, result];
        setRiesgos(newList);
        setSavedData(organizarRiesgos(newList));
      }

      // Reset modal
      setOpenModal(false);
      setCurrentSection(0);
      setIsEditing(false);
      setEditingRiesgo(null);
      setNuevoRiesgo(nuevoRiesgo);
      cargarRiesgos(gestionRiesgo.idGesRies);
    } catch (err) {
      console.error("[ERROR] al crear/editar el riesgo:", err);
      alert("Error al crear/editar el riesgo.");
    }
  };

  // --------------------------------------------------------------------------
  // Handler para editar
  // --------------------------------------------------------------------------
  const handleEditRiesgo = (riesgo) => {
    console.log("[LOG] handleEditRiesgo -> riesgo a editar:", riesgo);
    setIsEditing(true);
    setEditingRiesgo(riesgo);
    setNuevoRiesgo(riesgo);
    setCurrentSection(0);
    setOpenModal(true);
  };

  // --------------------------------------------------------------------------
  // Handler para eliminar
  // --------------------------------------------------------------------------
  const handleDeleteRiesgo = (riesgo) => {
    console.log("[LOG] handleDeleteRiesgo -> riesgo a eliminar:", riesgo);
    setRowToDelete(riesgo);
    setDeleteDialogOpen(true);
  };
  const confirmDeleteRiesgo = async () => {
    if (!gestionRiesgo.idGesRies || !rowToDelete) {
      console.log("[LOG] Falta idGesRies o rowToDelete. No se puede eliminar.");
      setDeleteDialogOpen(false);
      return;
    }
    const url = `http://127.0.0.1:8000/api/gestionriesgos/${gestionRiesgo.idGesRies}/riesgos/${rowToDelete.idRiesgo}`;
    console.log("[LOG] Eliminando riesgo con:", url);

    try {
      const response = await fetch(url, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar el riesgo.");

      // Filtrar del state
      const updated = riesgos.filter((r) => r.idRiesgo !== rowToDelete.idRiesgo);
      setRiesgos(updated);
      setSavedData(organizarRiesgos(updated));
    } catch (err) {
      console.error("[ERROR] al eliminar riesgo:", err);
      alert("No se pudo eliminar el riesgo.");
    } finally {
      setDeleteDialogOpen(false);
      setRowToDelete(null);
    }
  };

  // --------------------------------------------------------------------------
  // Lógica para las secciones del modal de Riesgos
  // --------------------------------------------------------------------------
  const handleNextSection = () => {
    if (currentSection < 3) setCurrentSection(currentSection + 1);
  };
  const handlePreviousSection = () => {
    if (currentSection > 0) setCurrentSection(currentSection - 1);
  };

  const handleRiesgoChange = (e) => {
    const { name, value } = e.target;
    setNuevoRiesgo({ ...nuevoRiesgo, [name]: value });
  };

  const renderModalSection = () => {

    switch (currentSection) {
      case 0:
        return (
          <>
            <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#0056b3" }}>
              Identificación
            </Typography>
            <TextField
              label="Fuente"
              name="fuente"
              value={nuevoRiesgo.fuente}
              onChange={handleRiesgoChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Tipo de Riesgo"
              name="tipoRiesgo"
              value={nuevoRiesgo.tipoRiesgo}
              onChange={handleRiesgoChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Descripción"
              name="descripcion"
              value={nuevoRiesgo.descripcion}
              onChange={handleRiesgoChange}
              fullWidth
              sx={{ mb: 2 }}
            />
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#0056b3" }}>
              Análisis
            </Typography>
            <TextField
              label="Consecuencias"
              name="consecuencias"
              value={nuevoRiesgo.consecuencias}
              onChange={handleRiesgoChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Severidad"
              name="valorSeveridad"
              value={nuevoRiesgo.valorSeveridad}
              onChange={handleRiesgoChange}
              type="number"
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Ocurrencia"
              name="valorOcurrencia"
              value={nuevoRiesgo.valorOcurrencia}
              onChange={handleRiesgoChange}
              type="number"
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="NRP"
              name="valorNRP"
              value={nuevoRiesgo.valorNRP = (nuevoRiesgo.valorOcurrencia * nuevoRiesgo.valorSeveridad)}
              onChange={handleRiesgoChange}
              type="number"
              fullWidth
              sx={{ mb: 2 }}
              disabled
            />
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#0056b3" }}>
              Tratamiento
            </Typography>
            <TextField
              label="Actividades"
              name="actividades"
              value={nuevoRiesgo.actividades}
              onChange={handleRiesgoChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Acción de Mejora"
              name="accionMejora"
              value={nuevoRiesgo.accionMejora}
              onChange={handleRiesgoChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Fecha de Implementación"
              name="fechaImp"
              value={nuevoRiesgo.fechaImp}
              onChange={handleRiesgoChange}
              type="date"
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Fecha de Evaluación"
              name="fechaEva"
              value={nuevoRiesgo.fechaEva}
              onChange={handleRiesgoChange}
              type="date"
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Responsable"
              name="responsable"
              value={nuevoRiesgo.responsable}
              onChange={handleRiesgoChange}
              fullWidth
              sx={{ mb: 2 }}
            />
          </>
        );
      case 3:
        return (
          <>
            <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#0056b3" }}>
              Evaluación de Efectividad
            </Typography>

            <TextField
              label="Reevaluación Severidad"
              name="reevaluacionSeveridad"
              value={nuevoRiesgo.reevaluacionSeveridad}
              onChange={handleRiesgoChange}
              type="number"
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              label="Reevaluación Ocurrencia"
              name="reevaluacionOcurrencia"
              value={nuevoRiesgo.reevaluacionOcurrencia}
              onChange={handleRiesgoChange}
              type="number"
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              label="Reevaluación NRP"
              name="reevaluacionNRP"
              value={nuevoRiesgo.reevaluacionNRP = (nuevoRiesgo.reevaluacionOcurrencia * nuevoRiesgo.reevaluacionSeveridad)}
              onChange={handleRiesgoChange}
              type="number"
              fullWidth
              sx={{ mb: 2 }}
              disabled
            />

            <TextField
              label="Reevaluación Efectividad"
              name="reevaluacionEfectividad"
              value={nuevoRiesgo.reevaluacionEfectividad =
                (nuevoRiesgo.reevaluacionNRP < nuevoRiesgo.valorNRP
                  ? "Mejoró"
                  : "No mejoró")
              }
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              label="Análisis de Efectividad"
              name="analisisEfectividad"
              value={nuevoRiesgo.analisisEfectividad}
              onChange={handleRiesgoChange}
              fullWidth
              sx={{ mb: 2 }}
            />
          </>

        );
      default:
        return null;
    }
  };

  return (

    <Box sx={{ width: "90%", margin: "auto", mt: 5, borderRadius: 3, boxShadow: 3, p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#0056b3" }}>
        Gestión de Riesgos: {gestionRiesgo.proceso}
      </Typography>

      <MenuNavegacionProceso items={menuItems} />

      {/* === Sección de Info General (gestionriesgos) === */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#0056b3" }}>
          Información General
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {/* Entidad, macroproceso y proceso (solo lectura si deseas) */}
          <TextField
            label="Entidad"
            value={gestionRiesgo.entidad}
            onChange={(e) => setGestionRiesgo({ ...gestionRiesgo, entidad: e.target.value })}
            fullWidth
          />
          <TextField
            label="Macroproceso"
            value={gestionRiesgo.macroproceso}
            onChange={(e) => setGestionRiesgo({ ...gestionRiesgo, macroproceso: e.target.value })}
            fullWidth
          />
          <TextField
            label="Proceso"
            value={gestionRiesgo.proceso}
            onChange={(e) => setGestionRiesgo({ ...gestionRiesgo, proceso: e.target.value })}
            fullWidth
          />
          {/* elaboro y fechaelaboracion (el usuario los edita) */}
          <TextField
            label="Elaboró"
            value={gestionRiesgo.elaboro}
            onChange={(e) => setGestionRiesgo({ ...gestionRiesgo, elaboro: e.target.value })}
            fullWidth
          />
          <TextField
            label="Fecha"
            type="date"
            value={gestionRiesgo.fechaelaboracion}
            onChange={(e) => setGestionRiesgo({ ...gestionRiesgo, fechaelaboracion: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        {puedeEditar && (
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            {!tieneGesRies ? (
              <Button variant="contained" onClick={handleGuardarGestionRiesgos}>Guardar Datos Generales</Button>
            ) : (
              !modoEdicion ? (
                <Button variant="outlined" onClick={() => setModoEdicion(true)}>Editar</Button>
              ) : (
                <Button variant="contained" onClick={handleGuardarGestionRiesgos} sx={{ backgroundColor: "#F9B800", color: "#000" }}>Guardar</Button>
              )
            )}
          </Box>
        )}
      </Paper>

      {/* === Tabs para los riesgos (solo si ya existe idGesRies) === */}
      {tieneGesRies && gestionRiesgo.idGesRies && (
        <>
          <AppBar position="static" sx={{ bgcolor: "#0056b3", borderRadius: 3 }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              centered
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {sections.map((section, index) => (
                <Tab
                  key={index}
                  label={section}
                  sx={{
                    color: "white",
                    flex: 1,
                    textAlign: "center",
                    width: "25%",
                    backgroundColor: selectedTab === index ? "#F9B800" : "inherit",
                    "&.Mui-selected": { color: "black" },
                    borderRadius: 3,
                    m: 0.5,
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                />
              ))}
            </Tabs>
          </AppBar>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0056b3" }}>
              {sections[selectedTab]}
            </Typography>
          </Box>

          {/* Tabla con la data en savedData[selectedTab] */}
          <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 3, boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {Object.keys(savedData[selectedTab]?.[0] || {}).map((header, i) => (
                    <TableCell
                      key={i}
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        bgcolor: "#0056b3",
                        color: "white",
                      }}
                    >
                      {header.toUpperCase()}
                    </TableCell>
                  ))}
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      bgcolor: "#0056b3",
                      color: "white",
                    }}
                  >
                    ACCIONES
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savedData[selectedTab]?.map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value, i) => (
                      <TableCell key={i} align="center" sx={{ borderBottom: "1px solid #e0e0e0" }}>
                        {value}
                      </TableCell>
                    ))}
                    {!soloLectura && (
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditRiesgo(riesgos[index])}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          color="error"
                          onClick={() => handleDeleteRiesgo(riesgos[index])}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>

          {/* Botón para abrir el modal y agregar un riesgo nuevo */}
          {!soloLectura && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={() => {
                  setOpenModal(true);
                  setIsEditing(false);
                  setEditingRiesgo(null);
                  setNuevoRiesgo({
                    idRiesgo: null,
                    responsable: "",
                    fuente: "",
                    tipoRiesgo: "",
                    descripcion: "",
                    consecuencias: "",
                    valorSeveridad: "",
                    valorOcurrencia: "",
                    valorNRP: "",
                    actividades: "",
                    accionMejora: "",
                    fechaImp: "",
                    fechaEva: "",
                    reevaluacionSeveridad: "",
                    reevaluacionOcurrencia: "",
                    reevaluacionNRP: "",
                    reevaluacionEfectividad: "",
                    analisisEfectividad: "",
                  });
                }}
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  fontSize: 30,
                  minWidth: "auto",
                  backgroundColor: "#00B2E3",
                  "&:hover": {
                    backgroundColor: "#0099C3",
                  },
                }}
              >
                +
              </Button>
            </Box>
          )}
        </>
      )}

      {/* Modal para crear/editar riesgo */}
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setCurrentSection(0);
          setIsEditing(false);
          setEditingRiesgo(null);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
            {isEditing ? "Editar Riesgo" : "Agregar Riesgo"}
          </Typography>
          {renderModalSection()}

          <Box mt={2} display="flex" justifyContent="space-between">
            {currentSection > 0 && (
              <Button variant="contained" onClick={handlePreviousSection}>
                Anterior
              </Button>
            )}
            {currentSection < 3 ? (
              <Button variant="contained" onClick={handleNextSection}>
                Siguiente
              </Button>
            ) : (
              <Button variant="contained" onClick={handleGuardarRiesgo}>
                {isEditing ? "Actualizar" : "Guardar"}
              </Button>
            )}
          </Box>
        </Box>
      </Modal>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar este riesgo?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDeleteRiesgo} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FormularioGestionRiesgos;
