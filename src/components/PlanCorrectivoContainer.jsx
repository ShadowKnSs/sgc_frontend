import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress
} from "@mui/material";
import { Add} from "@mui/icons-material";
import PlanCorrectivoForm from "./Forms/PlanCorrectivoForm";
import PlanCorrectivoDetalleModal from './Modals/PlanCorrectivoModal';
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";


function PlanCorrectivoContainer({idProceso, soloLectura, puedeEditar}) {
  const location = useLocation();
  
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
          `http://127.0.0.1:8000/api/plan-correctivos/${editingRecord.idPlanCorrectivo}`,
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
      <PlanCorrectivoDetalleModal
        open={Boolean(selectedRecord)}
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        soloLectura={soloLectura}
        puedeEditar={puedeEditar}
      />

    </Box>
  );
}

export default PlanCorrectivoContainer;
