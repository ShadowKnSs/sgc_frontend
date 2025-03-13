import React, { useState, useEffect } from "react";
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

const sections = ["IDENTIFICACIÓN", "ANÁLISIS", "TRATAMIENTO", "EVALUACIÓN DE LA EFECTIVIDAD"];

const FormularioGestionRiesgos = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState({
    entidad: "",
    macroproceso: "",
    proceso: "",
    elaboro: "",
    fecha: new Date().toISOString().split("T")[0],
  });

  const [data, setData] = useState([]);
  const [savedData, setSavedData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [newRow, setNewRow] = useState({
    idRiesgo: null,
    idGesRies: 4,
    responsable: '',
    fuente: '',
    tipoRiesgo: '',
    descripcion: '',
    consecuencias: '',
    valorSeveridad: '',
    valorOcurrencia: '',
    valorNRP: '',
    actividades: '',
    accionMejora: '',
    fechaImp: '',
    fechaEva: '',
    reevaluacionSeveridad: '',
    reevaluacionOcurencia: '',
    reevaluacionNRP: '',
    reevaluacionEfectividad: '',
    analisisEfectividad: '',
  });
  const [currentSection, setCurrentSection] = useState(0);
  const [editingRow, setEditingRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/gestionriesgos/4/riesgos")
      .then((response) => response.json())
      .then((apiData) => {
        console.log("Datos de la API:", apiData);
        setData(apiData.riesgos);
        setFormData({
          entidad: "",
          macroproceso: "",
          proceso: "",
          elaboro: apiData.gestionRiesgos.elaboro,
          fecha: apiData.gestionRiesgos.fechaelaboracion.split("T")[0],
        });
        const organizedData = organizeData(apiData.riesgos);
        console.log("Datos organizados:", organizedData);
        setSavedData(organizedData);
      })
      .catch((error) => console.error("Error al obtener datos:", error));
  }, []);

  const organizeData = (apiData) => {
    return {
      0: apiData.map((item) => ({
        fuente: item.fuente,
        tipoRiesgo: item.tipoRiesgo,
        descripcion: item.descripcion,
      })),
      1: apiData.map((item) => ({
        consecuencias: item.consecuencias,
        valorSeveridad: item.valorSeveridad,
        valorOcurrencia: item.valorOcurrencia,
        valorNRP: item.valorNRP,
      })),
      2: apiData.map((item) => ({
        actividades: item.actividades,
        accionMejora: item.accionMejora,
        fechaImp: item.fechaImp,
        fechaEva: item.fechaEva,
        responsable: item.responsable,
      })),
      3: apiData.map((item) => ({
        reevaluacionSeveridad: item.reevaluacionSeveridad,
        reevaluacionOcurencia: item.reevaluacionOcurencia,
        reevaluacionNRP: item.reevaluacionNRP,
        reevaluacionEfectividad: item.reevaluacionEfectividad,
        analisisEfectividad: item.analisisEfectividad,
      })),
    };
  };

  const handleAddRow = async () => {
    if (
      !newRow.responsable ||
      !newRow.tipoRiesgo ||
      !newRow.descripcion ||
      !newRow.valorSeveridad ||
      !newRow.valorOcurrencia ||
      !newRow.valorNRP
    ) {
      alert("Por favor, complete todos los campos requeridos.");
      return;
    }

    if (
      newRow.valorSeveridad < 1 || newRow.valorSeveridad > 10 ||
      newRow.valorOcurrencia < 1 || newRow.valorOcurrencia > 10
    ) {
      alert("Los valores de Severidad y Ocurrencia deben estar entre 1 y 10.");
      return;
    }

    try {
      const url = isEditing
        ? `http://127.0.0.1:8000/api/gestionriesgos/4/riesgos/${editingRow.idRiesgo}`
        : "http://127.0.0.1:8000/api/gestionriesgos/4/riesgos";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) throw new Error("Error en la petición");

      const result = await response.json();

      if (isEditing) {
        const updatedData = data.map((item) =>
          item.idRiesgo === editingRow.idRiesgo ? result : item
        );
        setData(updatedData);
        setSavedData(organizeData(updatedData));
      } else {
        setData([...data, result]);
        setSavedData(organizeData([...data, result]));
      }

      setNewRow({
        idRiesgo: null,
        idGesRies: 4,
        responsable: '',
        fuente: '',
        tipoRiesgo: '',
        descripcion: '',
        consecuencias: '',
        valorSeveridad: '',
        valorOcurrencia: '',
        valorNRP: '',
        actividades: '',
        accionMejora: '',
        fechaImp: '',
        fechaEva: '',
        reevaluacionSeveridad: '',
        reevaluacionOcurencia: '',
        reevaluacionNRP: '',
        reevaluacionEfectividad: '',
        analisisEfectividad: '',
      });

      setOpenModal(false);
      setCurrentSection(0);
      setIsEditing(false);
      setEditingRow(null);
    } catch (error) {
      console.error("Error al guardar el registro:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "valorSeveridad" ||
      name === "valorOcurrencia" ||
      name === "valorNRP" ||
      name === "reevaluacionSeveridad" ||
      name === "reevaluacionOcurencia" ||
      name === "reevaluacionNRP" ||
      name === "reevaluacionEfectividad"
    ) {
      if (value === "" || (Number.isInteger(Number(value)) && Number(value) >= 0) ){
        setNewRow({ ...newRow, [name]: value === "" ? "" : Number(value) });
      }
    } else {
      setNewRow({ ...newRow, [name]: value });
    }
  };

  const handleNextSection = () => {
    if (currentSection < 3) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleEditRow = (row) => {
    setEditingRow(row);
    setNewRow(row);
    setIsEditing(true);
    setOpenModal(true);
  };

  const handleDeleteRow = (idRiesgo) => {
    setRowToDelete(idRiesgo);
    setConfirmDelete(true);
  };

  const confirmDeleteRow = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/gestionriesgos/4/riesgos/${rowToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar el registro");

      const updatedData = data.filter((item) => item.idRiesgo !== rowToDelete);
      setData(updatedData);
      setSavedData(organizeData(updatedData));
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
    } finally {
      setConfirmDelete(false);
      setRowToDelete(null);
    }
  };

  const renderModalSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <>
            <TextField
              label="Fuente"
              name="fuente"
              value={newRow.fuente}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Tipo de Riesgo"
              name="tipoRiesgo"
              value={newRow.tipoRiesgo}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Descripción"
              name="descripcion"
              value={newRow.descripcion}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              label="Consecuencias"
              name="consecuencias"
              value={newRow.consecuencias}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Severidad"
              name="valorSeveridad"
              value={newRow.valorSeveridad}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              type="number"
              inputProps={{ min: 1, max: 10 }}
              required
            />
            <TextField
              label="Ocurrencia"
              name="valorOcurrencia"
              value={newRow.valorOcurrencia}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              type="number"
              inputProps={{ min: 1, max: 10 }}
              required
            />
            <TextField
              label="NRP"
              name="valorNRP"
              value={newRow.valorNRP}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              type="number"
              required
            />
          </>
        );
      case 2:
        return (
          <>
            <TextField
              label="Actividades"
              name="actividades"
              value={newRow.actividades}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Acción de Mejora"
              name="accionMejora"
              value={newRow.accionMejora}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Fecha de Implementación"
              name="fechaImp"
              value={newRow.fechaImp}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Fecha de Evaluación"
              name="fechaEva"
              value={newRow.fechaEva}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Responsable"
              name="responsable"
              value={newRow.responsable}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
          </>
        );
      case 3:
        return (
          <>
            <TextField
              label="Reevaluación de Severidad"
              name="reevaluacionSeveridad"
              value={newRow.reevaluacionSeveridad}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              type="number"
              inputProps={{ min: 1, max: 10 }}
            />
            <TextField
              label="Reevaluación de Ocurrencia"
              name="reevaluacionOcurencia"
              value={newRow.reevaluacionOcurencia}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              type="number"
              inputProps={{ min: 1, max: 10 }}
            />
            <TextField
              label="Reevaluación de NRP"
              name="reevaluacionNRP"
              value={newRow.reevaluacionNRP}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              type="number"
            />
            <TextField
              label="Reevaluación de Efectividad"
              name="reevaluacionEfectividad"
              value={newRow.reevaluacionEfectividad}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              type="number"
              inputProps={{ min: 1, max: 10 }}
            />
            <TextField
              label="Análisis de Efectividad"
              name="analisisEfectividad"
              value={newRow.analisisEfectividad}
              onChange={handleInputChange}
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
    <Box sx={{ width: "90%", margin: "auto", mt: 5, borderRadius: 3, boxShadow: 3, p: 3, bgcolor: "background.paper" }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#0056b3" }}>
        Formulario Gestión de Riesgos
      </Typography>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#0056b3" }}>
          Información General
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {Object.keys(formData).map((key, index) => (
            <TextField
              key={index}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              fullWidth
              value={formData[key]}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
            />
          ))}
        </Box>
      </Paper>

      <AppBar position="static" sx={{ bgcolor: "#0056b3", borderRadius: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
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

      <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(savedData[selectedTab]?.[0] || {}).map((header, i) => (
                <TableCell key={i} sx={{ fontWeight: "bold", textAlign: "center", bgcolor: "#0056b3", color: "white" }}>
                  {header.toUpperCase()}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: "bold", textAlign: "center", bgcolor: "#0056b3", color: "white" }}>
                ACCIONES
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {savedData[selectedTab]?.map((indicator, index) => (
              <TableRow key={index}>
                {Object.values(indicator).map((value, i) => (
                  <TableCell key={i} align="center" sx={{ borderBottom: "1px solid #e0e0e0" }}>
                    {value}
                  </TableCell>
                ))}
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditRow(data[index])}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteRow(data[index].idRiesgo)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          onClick={() => setOpenModal(true)}
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

      <Modal open={openModal} onClose={() => { setOpenModal(false); setCurrentSection(0); setIsEditing(false); setEditingRow(null); }}>
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
            {isEditing ? "Editar registro" : "Agregar nuevo registro"}
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
              <Button variant="contained" onClick={handleAddRow}>
                {isEditing ? "Actualizar" : "Guardar"}
              </Button>
            )}
          </Box>
        </Box>
      </Modal>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar este registro?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDeleteRow} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormularioGestionRiesgos;