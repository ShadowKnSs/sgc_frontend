import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const PlanTrabajoForm = () => {
  const [formData, setFormData] = useState({
    responsable: "",
    fechaElaboracion: "",
    objetivo: "",
    revisadoPor: "",
  });
  const [formSaved, setFormSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [additionalFormData, setAdditionalFormData] = useState({
    numero: "",
    fuente: "",
    elementoEntrada: "",
    descripcionActividad: "",
    entregable: "",
    responsable: "",
    fechaInicio: "",
    fechaTermino: "",
    estado: "",
  });

  const [records, setRecords] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'cards'
  const [selectedRecord, setSelectedRecord] = useState(null); // Para mostrar el modal con la tarjeta completa

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdditionalChange = (e) => {
    setAdditionalFormData({ ...additionalFormData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => Object.values(formData).every((value) => value.trim() !== "");
  const isAdditionalFormValid = () => Object.values(additionalFormData).every((value) => value.trim() !== "");

  const handleSave = () => {
    if (!isFormValid()) return;
    console.log("Datos guardados:", formData);
    setFormSaved(true);
  };

  const handleClear = () => {
    setFormData({ responsable: "", fechaElaboracion: "", objetivo: "", revisadoPor: "" });
    setFormSaved(false);
  };

  const handleOpenModal = (index = null) => {
    if (index !== null) {
      setEditIndex(index);
      setAdditionalFormData(records[index]);
    } else {
      setEditIndex(null);
      setAdditionalFormData({
        numero: "",
        fuente: "",
        elementoEntrada: "",
        descripcionActividad: "",
        entregable: "",
        responsable: "",
        fechaInicio: "",
        fechaTermino: "",
        estado: "",
      });
    }
    setShowModal(true);
  };

  const handleAddOrUpdateRecord = () => {
    if (!isAdditionalFormValid()) return;

    if (editIndex !== null) {
      // Editar registro
      const updatedRecords = [...records];
      updatedRecords[editIndex] = additionalFormData;
      setRecords(updatedRecords);
    } else {
      // Agregar nuevo registro
      setRecords([...records, additionalFormData]);
    }

    setShowModal(false);
  };

  const handleDeleteRecord = (index) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
  };

  const handleViewModeChange = () => {
    setViewMode(viewMode === "table" ? "cards" : "table");
  };

  const handleOpenCardModal = (record) => {
    setSelectedRecord(record);
  };

  const handleCloseCardModal = () => {
    setSelectedRecord(null);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", mx: "auto" }}>
      {/* Formulario principal */}
      <Box sx={{ p: 2, boxShadow: 3, borderRadius: 2, bgcolor: "background.paper", mb: 2, width: "70%" }}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField label="Responsable" name="responsable" value={formData.responsable} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Fecha de Elaboración" name="fechaElaboracion" type="date" value={formData.fechaElaboracion} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Objetivo" name="objetivo" value={formData.objetivo} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Revisado por" name="revisadoPor" value={formData.revisadoPor} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: "flex", justifyContent:"right" }}>
          <Button variant="contained" color="error" onClick={handleClear}>
            Borrar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={!isFormValid()}>
            Guardar
          </Button>
          
        </Box>
      </Box>

      {/* Botón para agregar registros */}
      {formSaved && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
            Agregar Registro
          </Button>
        </Box>
      )}

      {/* Modal para agregar/editar registros */}
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>{editIndex !== null ? "Editar Registro" : "Agregar Registro"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {["numero", "fuente", "elementoEntrada", "descripcionActividad", "entregable", "responsable", "fechaInicio", "fechaTermino", "estado"].map((field, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  label={field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  name={field}
                  value={additionalFormData[field]}
                  onChange={handleAdditionalChange}
                  fullWidth
                  margin="dense"
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} color="error">
            Cancelar
          </Button>
          <Button onClick={handleAddOrUpdateRecord} color="primary" disabled={!isAdditionalFormValid()}>
            {editIndex !== null ? "Actualizar" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Switch para cambiar entre tabla y tarjetas */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <FormControlLabel
          control={<Switch checked={viewMode === "cards"} onChange={handleViewModeChange} />}
          label={viewMode === "cards" ? "Ver en Tarjetas" : "Ver en Tabla"}
        />
      </Box>

      {/* Tabla de registros */}
      {records.length > 0 && viewMode === "table" && (
        <Box sx={{ mt: 4, width: "80%", overflowX: "auto" }}>
          <Typography variant="h5" gutterBottom>
            Registros Agregados
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "primary.main" }}>
                  {["Número", "Fuente", "Elemento Entrada", "Descripción Actividad", "Entregable", "Responsable", "Fecha Inicio", "Fecha Término", "Estado", ""].map((header) => (
                    <TableCell key={header} sx={{ color: "white", fontWeight: "bold" }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record, index) => (
                  <TableRow key={index}>
                    {Object.values(record).map((value, i) => (
                      <TableCell key={i}>{value}</TableCell>
                    ))}
                    <TableCell>
                      <IconButton sx={{ color: "orange" }} onClick={() => handleOpenModal(index)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteRecord(index)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Tarjetas de registros */}
      {records.length > 0 && viewMode === "cards" && (
        <Box sx={{ mt: 4, width: "80%", display: "flex", flexWrap: "wrap", gap: 2 }}>
          {records.map((record, index) => (
            <Card
              key={index}
              sx={{
                width: 150,
                height: 200, padding:2,
                boxShadow: 7, borderRadius: 2, bgcolor: "background.paper",
                "&:hover": { bgcolor: "lightgrey" },
                position: "relative", // Para posicionar los botones
              }}
              onClick={() => handleOpenCardModal(record)}
            >
              <CardContent sx={{ p: 1 }}>
                <Typography variant="body2" sx={{ fontSize: "1.2rem" }}>
                  <strong>Número:</strong> {record.numero}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                  <strong>Fuente:</strong> {record.fuente}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                  <strong>Elemento:</strong> {record.elementoEntrada}
                </Typography>
              </CardContent>
              {/* Botones de editar y borrar */}
              <Box sx={{ position: "absolute", bottom: 0, right: 0, display: "flex", gap: 1 }}>
                <IconButton
                  sx={{ color: "orange", p: 0.5 }}
                  onClick={(e) => {
                    e.stopPropagation(); // Evita que se abra el modal al hacer clic en el botón
                    handleOpenModal(index);
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  sx={{ color: "error.main", p: 0.5 }}
                  onClick={(e) => {
                    e.stopPropagation(); // Evita que se abra el modal al hacer clic en el botón
                    handleDeleteRecord(index);
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Modal para mostrar la tarjeta completa */}
      <Dialog open={Boolean(selectedRecord)} onClose={handleCloseCardModal}>
        <DialogTitle>Detalles del Registro</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box>
              <Typography><strong>Número:</strong> {selectedRecord.numero}</Typography>
              <Typography><strong>Fuente:</strong> {selectedRecord.fuente}</Typography>
              <Typography><strong>Elemento Entrada:</strong> {selectedRecord.elementoEntrada}</Typography>
              <Typography><strong>Descripción Actividad:</strong> {selectedRecord.descripcionActividad}</Typography>
              <Typography><strong>Entregable:</strong> {selectedRecord.entregable}</Typography>
              <Typography><strong>Responsable:</strong> {selectedRecord.responsable}</Typography>
              <Typography><strong>Fecha Inicio:</strong> {selectedRecord.fechaInicio}</Typography>
              <Typography><strong>Fecha Término:</strong> {selectedRecord.fechaTermino}</Typography>
              <Typography><strong>Estado:</strong> {selectedRecord.estado}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCardModal} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlanTrabajoForm;