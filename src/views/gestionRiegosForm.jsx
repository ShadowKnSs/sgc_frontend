import React, { useState, useEffect } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
  Modal,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const sections = ["IDENTIFICACIÓN", "ANÁLISIS", "TRATAMIENTO", "EVALUACIÓN DE LA EFECTIVIDAD"];

const FormularioGestionRiesgos = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [newEntry, setNewEntry] = useState({});
  const [savedData, setSavedData] = useState({});

  const indicatorsBySection = {
    0: [
      { fuente: "Interna", tipo: "Riesgo", descripcion: "Posible incumplimiento de plazos" }
    ],
    1: [
      { consecuencias: "Retraso en entregas", severidad: "Alta", ocurrencia: "Media", nrp: "9" }
    ],
    2: [
      { actividad: "Capacitación", responsable: "Gerente", fechas: "Mensual" }
    ],
    3: [
      { reevaluacion: "Sí", severidad: "Media", ocurrencia: "Baja", nrp: "4", efectividad: "Alta" }
    ]
  };

  const indicators = savedData[selectedTab] || indicatorsBySection[selectedTab] || [];

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("gestionRiesgosData")) || {};
    setSavedData(storedData);
  }, []);

  useEffect(() => {
    localStorage.setItem("gestionRiesgosData", JSON.stringify(savedData));
  }, [savedData]);

  const handleAddEntry = () => {
    setSavedData(prevData => {
      const newData = { ...prevData };
      newData[selectedTab] = [...(newData[selectedTab] || []), newEntry];
      return newData;
    });
    setNewEntry({});
    setOpenModal(false);
  };

  const isFormValid = Object.keys(indicatorsBySection[selectedTab][0] || {}).every(key => newEntry[key]?.trim());

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 5, borderRadius: 3, boxShadow: 3, p: 3, bgcolor: "background.paper" }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#0056b3" }}>
        Gestión de Riesgos
      </Typography>

      <AppBar position="static" sx={{ bgcolor: "#0056b3", borderRadius: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          centered
          TabIndicatorProps={{ style: { display: "none" } }} // Elimina la línea inferior
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
                textTransform: "none", // Evita que el texto esté en mayúsculas
                fontSize: "1rem", // Tamaño de fuente más adecuado
              }}
            />
          ))}
        </Tabs>
      </AppBar>

      <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(indicators[0] || {}).map((header, i) => (
                <TableCell key={i} sx={{ fontWeight: "bold", textAlign: "center", bgcolor: "#0056b3", color: "white" }}>{header.toUpperCase()}</TableCell>
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

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
          sx={{
            borderRadius: "50%",
            width: 60,
            height: 60,
            minWidth: 0,
            minHeight: 0,
            boxShadow: 3,
            bgcolor: "#0056b3",
            "&:hover": { bgcolor: "#004494" },
          }}
        >
          <AddCircleOutlineIcon sx={{ fontSize: 30, color: "white" }} />
        </Button>
      </Box>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "white", p: 4, borderRadius: 3, boxShadow: 3, width: 400 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#0056b3" }}>Agregar Nuevo Registro</Typography>
          {Object.keys(indicatorsBySection[selectedTab][0] || {}).map((key, index) => (
            <TextField
              key={index}
              label={key.toUpperCase()}
              fullWidth
              margin="normal"
              value={newEntry[key] || ""}
              onChange={(e) => setNewEntry({ ...newEntry, [key]: e.target.value })}
              sx={{ borderRadius: 3 }}
            />
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddEntry}
            disabled={!isFormValid}
            sx={{ mt: 2, borderRadius: 3, boxShadow: 3 }}
          >
            Guardar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default FormularioGestionRiesgos;