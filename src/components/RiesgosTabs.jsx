// components/RiesgosTabs.jsx
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EvaluacionEfectividadModal from "./Modals/EvaluacionEfectividadModal";

const formatearFecha = (valor) => {
  if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}/.test(valor)) {
    const [año, mes, dia] = valor.split(" ")[0].split("-");
    return `${dia}/${mes}/${año}`;
  }
  return valor;
};

const RiesgosTabs = ({
  selectedTab,
  savedData,
  riesgos,
  soloLectura,
  onEdit,
  onDelete,
  sections, 
  onEvaluate
}) => {
  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);
  const [selectedRiesgo, setSelectedRiesgo] = useState(null);

  const handleEvaluateClick = (riesgo) => {
    setSelectedRiesgo(riesgo);
    setEvaluationModalOpen(true);
  };

  const handleSaveEvaluation = async (evaluationData) => {
    if (selectedRiesgo && onEvaluate) {
      await onEvaluate(selectedRiesgo.idRiesgo, evaluationData);
      setEvaluationModalOpen(false);
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0056b3" }}>
          {sections[selectedTab]}
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              {(savedData[selectedTab]?.[0] &&
                Object.keys(savedData[selectedTab][0]).map((header, i) => (
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
                ))) || null}
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
                {Object.entries(row).map(([key, value], i) => {
                  const isEfectividad = key.toLowerCase().includes("efectividad");
                  const isFecha = key.toLowerCase().includes("fecha");
                  const displayValue = isFecha ? formatearFecha(value) : value;

                  let bgColor = "transparent";
                  if (isEfectividad && typeof value === "string") {
                    const lowerValue = value?.toLowerCase().trim();
                    if (lowerValue === "mejoró") bgColor = "#C8E6C9";
                    else if (lowerValue === "no mejoró") bgColor = "#FFCDD2";
                  }

                  return (
                    <TableCell
                      key={i}
                      align="center"
                      sx={{
                        borderBottom: "1px solid #e0e0e0",
                        bgcolor: bgColor,
                        fontWeight: isEfectividad ? 600 : "normal",
                      }}
                    >
                      {displayValue}
                    </TableCell>
                  );
                })}

                {!soloLectura && (
                  <TableCell align="center">
                    {/* Botón de Editar con Tooltip */}
                    <Tooltip title="Editar riesgo" arrow>
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(riesgos[index])}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    {/* Botón de Evaluación (solo visible en sección 3 - Evaluación) */}
                    {selectedTab === 3 && (
                      <Tooltip title="Evaluar efectividad" arrow>
                        <IconButton
                          color="secondary"
                          onClick={() => handleEvaluateClick(riesgos[index])}
                          sx={{ mr: 1 }}
                        >
                          <AssessmentIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* Botón de Eliminar con Tooltip */}
                    <Tooltip title="Eliminar riesgo" arrow>
                      <IconButton
                        color="error"
                        onClick={() => onDelete(riesgos[index])}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <EvaluacionEfectividadModal
        open={evaluationModalOpen}
        onClose={() => setEvaluationModalOpen(false)}
        riesgo={selectedRiesgo}
        onGuardar={handleSaveEvaluation}
      />
    </>
  );
};

export default RiesgosTabs;