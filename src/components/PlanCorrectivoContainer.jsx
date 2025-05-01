import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import PlanCorrectivoForm from "./Forms/PlanCorrectivoForm";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";


function PlanCorrectivoContainer() {
  const location = useLocation();
  const soloLectura = location.state?.soloLectura ?? true;
  const puedeEditar = location.state?.puedeEditar ?? false
  const { idRegistro } = useParams();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  // Estado para la secuencia (si lo usas para generar el código, pero ahora el usuario ingresa su propio código)
  const [sequence, setSequence] = useState(1);

  // Función para obtener los planes correctivos (sin filtrar por idProceso o idRegistro)
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/plan-correctivos/registro/${idRegistro}`);
      setRecords(response.data);
      setError("");
    } catch (err) {
      setError("Error al obtener los planes de acción");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (idRegistro) {
      fetchRecords();
    }
  }, [idRegistro]);


  // Función para guardar (crear o actualizar) un plan de acción.
  const handleSave = async (data) => {
    console.log("Datos enviados:", data); // Esto imprimirá el objeto completo en la consola
    try {
      if (editingRecord) {
        await axios.put(
          `http://127.0.0.1:8000/api/plan-correctivo/${editingRecord.idPlanCorrectivo}`,
          { ...data, idRegistro }
        );
        setEditingRecord(null);
      } else {
        await axios.post("http://127.0.0.1:8000/api/plan-correctivos", {
          ...data,
          idRegistro
        });
        setSequence((prev) => prev + 1);
      }
      fetchRecords();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Error al guardar el plan de acción.");
    }
  };


  // Función para eliminar un plan de acción
  const handleDelete = async (record) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/plan-correctivo/${record.idPlanCorrectivo}`);
      fetchRecords();
      setSelectedRecord(null);
    } catch (err) {
      console.error(err);
      setError("Error al eliminar el plan de acción");
    }
  };

  // Función para editar: abre el formulario con los datos del registro seleccionado
  const handleEdit = (record) => {
    const recordForEdit = {
      ...record,
      entidad: record.entidad || "",
      codigo: record.codigo || "",
      fechaInicio: record.fechaInicio ? record.fechaInicio.split(" ")[0] : "",
      reaccion: record.actividades || [{ descripcionAct: "", responsable: "", fechaProgramada: "" }],
      planAccion: record.actividades || [{ descripcionAct: "", responsable: "", fechaProgramada: "" }]
    };
    setEditingRecord(recordForEdit);
    setShowForm(true);
    setSelectedRecord(null);
  };

  return (
    <Box sx={{ p: 4 }}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {!soloLectura && (
        <Button
          variant="contained"
          onClick={() => {
            setEditingRecord(null);
            setShowForm(true);
          }}
          startIcon={<Add />}
          sx={{ backgroundColor: "secondary.main" }}
        >
          Nuevo Plan de Acción
        </Button>
      )}
      {showForm && (
        <PlanCorrectivoForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          initialData={editingRecord}
          sequence={sequence}
        />
      )}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", gap: 2 }}>
          {records.length === 0 ? (
            <Typography variant="h6" color="textSecondary">
              No hay registros. Cree un nuevo plan de acción.
            </Typography>
          ) : (
            records.map((record) => (
              <Card
                key={record.idPlanCorrectivo}
                sx={{
                  width: 200,
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.05)" }
                }}
                onClick={() => setSelectedRecord(record)}
              >
                <CardContent>
                  <Typography variant="h6">{record.codigo}</Typography>
                  <Typography variant="body2">
                    {record.fechaInicio ? record.fechaInicio.split(" ")[0] : ""}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}
      <Dialog open={Boolean(selectedRecord)} onClose={() => setSelectedRecord(null)} fullWidth>
        <DialogTitle>
          Detalles del Plan de Acción
          <IconButton onClick={() => setSelectedRecord(null)} sx={{ position: "absolute", right: 8, top: 8 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Datos del Proceso
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  <strong>Entidad:</strong> {selectedRecord.entidad}
                </Typography>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  <strong>No Conformidad:</strong> {selectedRecord.noConformidad ? "Sí" : "No"}
                </Typography>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  <strong>Código:</strong> {selectedRecord.codigo}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  <strong>Coordinador:</strong> {selectedRecord.coordinadorPlan}
                </Typography>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  <strong>Fecha de Inicio:</strong> {selectedRecord.fechaInicio ? selectedRecord.fechaInicio.split(" ")[0] : ""}
                </Typography>
              </Box>
              <Typography variant="body2">
                <strong>Origen:</strong> {selectedRecord.origenConformidad}
              </Typography>
              <Typography variant="body2">
                <strong>Equipo de Mejora:</strong> {selectedRecord.equipoMejora}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
                Descripción de la No Conformidad
              </Typography>
              <Typography variant="body2">
                <strong>Requisito:</strong> {selectedRecord.requisito}
              </Typography>
              <Typography variant="body2">
                <strong>Incumplimiento:</strong> {selectedRecord.incumplimiento}
              </Typography>
              <Typography variant="body2">
                <strong>Evidencia:</strong> {selectedRecord.evidencia}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
                Reacción para Controlar y Corregir
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 1, mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Actividad</TableCell>
                      <TableCell>Responsable</TableCell>
                      <TableCell>Fecha Programada</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(selectedRecord.actividades.filter(a => a.tipo === 'reaccion') || []).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.descripcionAct || item.actividad}</TableCell>
                        <TableCell>{item.responsable}</TableCell>
                        <TableCell>{item.fechaProgramada ? item.fechaProgramada.split(" ")[0] : ""}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
                Consecuencias Identificadas
              </Typography>
              <Typography variant="body2">
                <strong>Revisión:</strong> {selectedRecord.revisionAnalisis}
              </Typography>
              <Typography variant="body2">
                <strong>Causa Raíz:</strong> {selectedRecord.causaRaiz}
              </Typography>
              <Typography variant="body2">
                <strong>Similares:</strong> {selectedRecord.estadoSimilares}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
                Plan de Acción
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Actividad</TableCell>
                      <TableCell>Responsable</TableCell>
                      <TableCell>Fecha Programada</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(selectedRecord.actividades.filter(a => a.tipo === 'planaccion') || []).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.descripcionAct || item.actividad}</TableCell>
                        <TableCell>{item.responsable}</TableCell>
                        <TableCell>{item.fechaProgramada ? item.fechaProgramada.split(" ")[0] : ""}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {!soloLectura && puedeEditar && (
            <>
              <Button color="primary" onClick={() => handleEdit(selectedRecord)}>
                Editar
              </Button>
              <Button color="error" onClick={() => handleDelete(selectedRecord)}>
                Eliminar
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PlanCorrectivoContainer;
