import React, { useState } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  Modal,
  Paper,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const FormularioAnalisis = () => {
  const [formData, setFormData] = useState({
    entidad: "Empresa XYZ",
    macroproceso: "Gestión de Calidad",
    proceso: "Evaluación de Desempeño",
    periodoEvaluacion: "2024 - Primer Trimestre",
  });

  const [savedData, setSavedData] = useState({});
  const [openModal, setOpenModal] = useState({ type: null, index: null });
  const [tempValue, setTempValue] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenModal = (type, index) => {
    setOpenModal({ type, index });
    setTempValue(savedData[selectedTab]?.[index]?.[type] || "");
  };

  const handleCloseModal = () => {
    setOpenModal({ type: null, index: null });
    setTempValue("");
  };

  const handleSaveModal = () => {
    setSavedData((prevData) => ({
      ...prevData,
      [selectedTab]: {
        ...prevData[selectedTab],
        [openModal.index]: {
          ...prevData[selectedTab]?.[openModal.index],
          [openModal.type]: tempValue
        }
      }
    }));
    handleCloseModal();
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
          {["Desempeño del Proceso", "Conformidad del Producto o Servicio", "Satisfacción del Cliente"].map((section, index) => (
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
      <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              {["Descripción", "Meta", "Periodo", "Interpretación", "Necesidad de Mejora"].map((header, i) => (
                <TableCell key={i} sx={{ fontWeight: "bold", textAlign: "center", bgcolor: "#0056b3", color: "white" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[{ description: "Indicador 1", meta: "90%", period: "Mensual", result: "85%" }].map((indicator, index) => (
              <TableRow key={index}>
                <TableCell>{indicator.description}</TableCell>
                <TableCell align="center">{indicator.meta}</TableCell>
                <TableCell align="center">{indicator.period} | {indicator.result}</TableCell>
                <TableCell align="center">
                  {savedData[selectedTab]?.[index]?.interpretacion || (
                    <IconButton color="primary" onClick={() => handleOpenModal("interpretacion", index)}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell align="center">
                  {savedData[selectedTab]?.[index]?.necesidad || (
                    <IconButton color="primary" onClick={() => handleOpenModal("necesidad", index)}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para Interpretación y Necesidad */}
      <Modal open={Boolean(openModal.type)} onClose={handleCloseModal}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", p: 4, boxShadow: 24, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#0056b3" }}>
            {openModal.type === "interpretacion" ? "Agregar Interpretación" : "Agregar Necesidad de Mejora"}
          </Typography>
          <TextField fullWidth multiline rows={4} value={tempValue} onChange={(e) => setTempValue(e.target.value)} sx={{ borderRadius: 3 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button sx={{
            backgroundColor: "#CCCCCC", 
            color: "#000000", 
            '&:hover': {
              backgroundColor: "#B3B3B3", 
            },
          }} onClick={handleCloseModal}>Cancelar</Button>
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
          }} onClick={handleSaveModal}>Guardar</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default FormularioAnalisis;
