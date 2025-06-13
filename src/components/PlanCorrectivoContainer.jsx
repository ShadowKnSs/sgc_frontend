import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress
} from "@mui/material";
import { Add } from "@mui/icons-material";
import PlanCorrectivoForm from "./Forms/PlanCorrectivoForm";
import PlanCorrectivoDetalleModal from './Modals/PlanCorrectivoModal';
import axios from "axios";
import { useParams } from "react-router-dom";
import FeedbackSnackbar from "../components/Feedback";

function PlanCorrectivoContainer({ idProceso, soloLectura, puedeEditar }) {
  const { idRegistro } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [sequence, setSequence] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, type: '', title: '', message: '' });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/plan-correctivos/registro/${idRegistro}`);
      setRecords(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al obtener los planes correctivos.");
      setSnackbar({ open: true, type: "error", title: "Error", message: "No se pudieron cargar los planes." });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (idRegistro) {
      fetchRecords();
    }
  }, [idRegistro]);

  const handleSave = async (data) => {
    try {
      if (editingRecord) {
        await axios.put(`http://127.0.0.1:8000/api/plan-correctivos/${editingRecord.idPlanCorrectivo}`, {
          ...data,
          idRegistro
        });
        setSnackbar({ open: true, type: "success", title: "Actualizado", message: "Plan actualizado correctamente." });
        setEditingRecord(null);
      } else {
        await axios.post("http://127.0.0.1:8000/api/plan-correctivos", {
          ...data,
          idRegistro
        });
        setSequence((prev) => prev + 1);
        setSnackbar({ open: true, type: "success", title: "Guardado", message: "Plan creado correctamente." });
      }
      fetchRecords();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Error al guardar el plan de acción.");
      setSnackbar({ open: true, type: "error", title: "Error", message: "No se pudo guardar el plan." });
    }
  };

  const handleDelete = async (record) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/plan-correctivo/${record.idPlanCorrectivo}`);
      fetchRecords();
      setSelectedRecord(null);
      setSnackbar({ open: true, type: "success", title: "Eliminado", message: "Plan eliminado correctamente." });
    } catch (err) {
      console.error(err);
      setError("Error al eliminar el plan de acción");
      setSnackbar({ open: true, type: "error", title: "Error", message: "No se pudo eliminar el plan." });
    }
  };

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
          idProceso={idProceso}
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
                  width: 280,
                  minHeight: 140,
                  cursor: "pointer",
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": { transform: "scale(1.05)", boxShadow: 6 }
                }}
                onClick={() => setSelectedRecord(record)}
              >
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    Código del Plan
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {record.codigo}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Fecha Inicio: <strong>{record.fechaInicio?.split(" ")[0]}</strong>
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}

      <PlanCorrectivoDetalleModal
        open={Boolean(selectedRecord)}
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        soloLectura={soloLectura}
        puedeEditar={puedeEditar}
      />

      <FeedbackSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        type={snackbar.type}
        title={snackbar.title}
        message={snackbar.message}
      />
    </Box>
  );
}

export default PlanCorrectivoContainer;
