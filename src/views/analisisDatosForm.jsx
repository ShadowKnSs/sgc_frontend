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
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const sections = ["Desempeño del Proceso", "Conformidad del Producto o Servicio", "Satisfacción del Cliente"];

const indicators = [
  {
    description: "Entrega de reporte de calificaciones de exámenes completas, por parte de los docentes en las fechas establecidas del calendario escolar.",
    meta: "90%",
    period: "Ene-Jun / Jul-Dic",
    result: "91%"
  },{
    description: "Entrega de reporte de calificaciones de exámenes completas, por parte de los docentes en las fechas establecidas del calendario escolar.",
    meta: "90%",
    period: "Ene-Jun / Jul-Dic",
    result: "91%"
  }
];

const FormularioAnalisis = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [openModal, setOpenModal] = useState({ type: null, index: null });
    const [savedData, setSavedData] = useState({});
    const [tempValue, setTempValue] = useState("");
  
    const sections = ["DESEMPEÑO DEL PROCESO", "CONFORMIDAD DEL PRODUCTO O SERVICIO", "SATISFACCIÓN DEL CLIENTE"];
    
    const indicatorsBySection = {
      0: [
        { description: "Indicador A1", meta: "90%", period: "Mensual", result: "85%" },
        { description: "Indicador A2", meta: "80%", period: "Trimestral", result: "78%" }
      ],
      1: [
        { description: "Indicador B1", meta: "75%", period: "Mensual", result: "72%" },
        { description: "Indicador B2", meta: "88%", period: "Anual", result: "89%" }
      ],
      2: [
        { description: "Indicador C1", meta: "95%", period: "Semestral", result: "96%" }
      ]
    };
  
    const indicators = indicatorsBySection[selectedTab] || [];
  
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem("analysisData")) || {};
      setSavedData(storedData);
    }, []);
  
    useEffect(() => {
      localStorage.setItem("analysisData", JSON.stringify(savedData));
    }, [savedData]);
  
    const handleOpenModal = (type, index) => {
      setOpenModal({ type, index });
      setTempValue(savedData[selectedTab]?.[index]?.[type] || "");
    };
  
    const handleCloseModal = () => {
      setOpenModal({ type: null, index: null });
      setTempValue("");
    };
  
    const handleSave = () => {
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
      <Box sx={{ width: "90%", margin: "auto", mt: 5, borderRadius: 3, boxShadow: 3, p: 3, bgcolor: "background.paper" }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#0056b3" }}>
          Formulario de Análisis de Datos
        </Typography>
  
        {/* Barra de navegacion */}
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
                  "&.Mui-selected": { bgcolor: "#F9B800", color: "black" },
                  borderRadius: 3,
                  m: 0.5,
                  textTransform: "none", // Evita que el texto esté en mayúsculas
                  fontSize: "1rem", // Tamaño de fuente más adecuado
                }}
              />
            ))}
          </Tabs>
        </AppBar>
  
        {/* Tabla de contenido */}
        <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                {["Descripción", "Meta", "Periodo", "Interpretación", "Necesidad de Mejora"].map((header, i) => (
                  <TableCell key={i} sx={{ fontWeight: "bold", textAlign: "center", bgcolor: "#0056b3", color: "white" }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {indicators.map((indicator, index) => (
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
  
        {/* Modal para Interpretacion y Necesidad */}
        <Modal open={Boolean(openModal.type)} onClose={handleCloseModal}>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", p: 4, boxShadow: 24, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#0056b3" }}>
              {openModal.type === "interpretacion" ? "Agregar Interpretación" : "Agregar Necesidad de Mejora"}
            </Typography>
            <TextField fullWidth multiline rows={4} value={tempValue} onChange={(e) => setTempValue(e.target.value)} sx={{ borderRadius: 3 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button variant="contained" color="error" onClick={handleCloseModal} sx={{ borderRadius: 3, boxShadow: 3 }}>Cancelar</Button>
              <Button variant="contained" color="primary" onClick={handleSave} sx={{ borderRadius: 3, boxShadow: 3 }}>Guardar</Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    );
  };
  

export default FormularioAnalisis;