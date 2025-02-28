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
  Modal
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const sections = ["IDENTIFICACIÓN", "ANÁLISIS", "TRATAMIENTO", "EVALUACIÓN DE LA EFECTIVIDAD"];

const FormularioGestionRiesgos = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState({
    entidad: "Ciencias",
    macroproceso: "Gestión de Calidad",
    proceso: "Evaluación de Riesgos",
    elaboro: "Juan Pérez",
    fecha: new Date().toISOString().split("T")[0],
  });

  const [savedData, setSavedData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [newRow, setNewRow] = useState({});

  const indicatorsBySection = {
    0: [{ fuente: "Interna", tipo: "Riesgo", descripcion: "Posible incumplimiento de plazos" }],
    1: [{ consecuencias: "Retraso en entregas", severidad: "Alta", ocurrencia: "Media", nrp: "9" }],
    2: [{ actividad: "Capacitación", responsable: "Gerente", fechas: "Mensual" }],
    3: [{ reevaluacion: "Sí", severidad: "Media", ocurrencia: "Baja", nrp: "4", efectividad: "Alta" }]
  };

  const indicators = savedData[selectedTab] || indicatorsBySection[selectedTab] || [];

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("gestionRiesgosData")) || {};
    setSavedData(storedData);
  }, []);

  useEffect(() => {
    localStorage.setItem("gestionRiesgosData", JSON.stringify(savedData));
  }, [savedData]);

  const handleAddRow = () => {
    setSavedData({
      ...savedData,
      [selectedTab]: [...indicators, newRow],
    });
    setNewRow({});
    setOpenModal(false);
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
              {Object.keys(indicators[0] || {}).map((header, i) => (
                <TableCell key={i} sx={{ fontWeight: "bold", textAlign: "center", bgcolor: "#0056b3", color: "white" }}>
                  {header.toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {indicators.map((indicator, index) => (
              <TableRow key={index}>
                {Object.values(indicator).map((value, i) => (
                  <TableCell key={i} align="center" sx={{ borderBottom: "1px solid #e0e0e0" }}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: "flex", justifyContent:"center", padding:"5"}}>
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
                  '&:hover': {
                    backgroundColor: "#0099C3", 
                  },
                }}
              >
                +
              </Button>
      </Box>
      {/* Modal para agregar nuevo registro */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          borderRadius: 3
        }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0056b3", mb: 2 }}>
            Agregar nuevo registro
          </Typography>
          {Object.keys(indicators[0] || {}).map((key, i) => (
            <TextField
              key={i}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              fullWidth
              sx={{ mb: 2 }}
              value={newRow[key] || ""}
              onChange={(e) => setNewRow({ ...newRow, [key]: e.target.value })}
            />
          ))}
          <Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
                      
                      <Button sx={{
                      backgroundColor: "#F9B800", 
                      color: "#000000", 
                      '&:hover': {
                        backgroundColor: "#E0A500", 
                      },
                      '&:disabled': {
                        backgroundColor: "#CCCCCC", 
                        color: "#666666", 
                      },
                    }} onClick={handleAddRow}>Guardar</Button>
                    </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default FormularioGestionRiesgos;
