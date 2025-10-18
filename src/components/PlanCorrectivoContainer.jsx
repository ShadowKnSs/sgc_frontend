import { useState, useEffect } from "react";
import {
    Box, Card, CardContent, Typography, CircularProgress, Alert
} from "@mui/material";
import { Add } from "@mui/icons-material";
import PlanCorrectivoForm from "./Forms/PlanCorrectivoForm";
import PlanCorrectivoDetalleModal from './Modals/PlanCorrectivoModal';
import axios from "axios";
import { useParams } from "react-router-dom";
import FeedbackSnackbar from "../components/Feedback";
import CustomButton from "../components/Button";

function PlanCorrectivoContainer({ idProceso, soloLectura, puedeEditar, showSnackbar }) {
    const { idRegistro } = useParams();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [sequence, setSequence] = useState(1);
    const [snackbar, setSnackbar] = useState({ open: false, type: '', title: '', message: '' });
    const [saving, setSaving] = useState(false);

    //  Función para manejar snackbar local si no viene del padre
    const handleLocalSnackbar = (message, type = "info", title = "") => {
        if (showSnackbar) {
            showSnackbar(message, type, title);
        } else {
            setSnackbar({ open: true, type, title, message });
        }
    };

    // Función para cerrar snackbar local
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const fetchRecords = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/plan-correctivos/registro/${idRegistro}`);
            setRecords(response.data || []);

        } catch (err) {
            // 404 = sin datos → NO es error: mostrar estado vacío
            if (err.response?.status === 404) {
                setRecords([]);
                setError("");           // importante: NO marcar error
            } else {
                let errorMessage = "Error al obtener los planes correctivos";
                if (err.response?.status >= 500) errorMessage = "Error del servidor al cargar los planes";
                else if (err.request) errorMessage = "Error de conexión. Verifique su internet";
                setError(errorMessage);
                handleLocalSnackbar(errorMessage, "error", "Error");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (idRegistro) {
            fetchRecords();
        } else {
            setError("No se proporcionó un ID de registro válido");
            setLoading(false);
        }
    }, [idRegistro]);

    const handleSave = async (data) => {
        setSaving(true);
        try {
            if (editingRecord) {
                await axios.put(`http://127.0.0.1:8000/api/plan-correctivos/${editingRecord.idPlanCorrectivo}`, {
                    ...data,
                    idRegistro
                });
                handleLocalSnackbar("Plan actualizado correctamente", "success", "Actualizado");
                setEditingRecord(null);
            } else {
                await axios.post("http://127.0.0.1:8000/api/plan-correctivos", {
                    ...data,
                    idRegistro
                });
                setSequence((prev) => prev + 1);
                handleLocalSnackbar("Plan creado correctamente", "success", "Guardado");
            }
            await fetchRecords(); // Recargar datos después de guardar
            setShowForm(false);
        } catch (err) {
            console.error("Error saving record:", err);
            let errorMessage = "Error al guardar el plan de acción";

            if (err.response) {
                if (err.response.status >= 500) {
                    errorMessage = "Error del servidor al guardar";
                }
            } else if (err.request) {
                errorMessage = "Error de conexión al guardar";
            }

            handleLocalSnackbar(errorMessage, "error", "Error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (record) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/plan-correctivo/${record.idPlanCorrectivo}`);
            await fetchRecords(); //  Recargar datos después de eliminar
            setSelectedRecord(null);
            handleLocalSnackbar("Plan eliminado correctamente", "success", "Eliminado");
        } catch (err) {
            console.error("Error deleting record:", err);
            let errorMessage = "Error al eliminar el plan de acción";

            if (err.response) {
                if (err.response.status >= 500) {
                    errorMessage = "Error del servidor al eliminar";
                }
            } else if (err.request) {
                errorMessage = "Error de conexión al eliminar";
            }

            handleLocalSnackbar(errorMessage, "error", "Error");
        }
    };

    const handleEdit = (record) => {
        const recordForEdit = {
            ...record,
            entidad: record.entidad || "",
            codigo: record.codigo || "Código existente",
            fechaInicio: record.fechaInicio ? record.fechaInicio.split(" ")[0] : "",
            reaccion: record.actividades || [{ descripcionAct: "", responsable: "", fechaProgramada: "" }],
            planAccion: record.actividades || [{ descripcionAct: "", responsable: "", fechaProgramada: "" }]
        };
        setEditingRecord(recordForEdit);
        setShowForm(true);
        setSelectedRecord(null);
    };

    //  Renderizado condicional de estados
    const renderContent = () => {
        // Estado de carga
        if (loading) {
            return (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4, flexDirection: "column", alignItems: "center" }}>
                    <CircularProgress size={60} thickness={4} />
                    <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                        Cargando planes correctivos...
                    </Typography>
                </Box>
            );
        }

        // Estado de error
        if (error) {
            return (
                <Box sx={{ textAlign: "center", my: 4 }}>
                    <Alert
                        severity="error"
                        sx={{
                            mb: 2,
                            '& .MuiAlert-message': { textAlign: 'left' }
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Error al cargar
                        </Typography>
                        <Typography variant="body2">
                            {error}
                        </Typography>
                    </Alert>
                    <CustomButton
                        type="guardar"
                        onClick={fetchRecords}
                        variant="outlined"
                    >
                        Reintentar
                    </CustomButton>
                </Box>
            );
        }

        // Estado sin datos y no mostrando formulario
        if (records.length === 0 && !showForm) {
            return (
                <Box sx={{ textAlign: "center", my: 4 }}>
                    <Alert
                        severity="info"
                        sx={{
                            mb: 2,
                            '& .MuiAlert-message': { textAlign: 'left' }
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            No hay planes correctivos
                        </Typography>
                        <Typography variant="body2">
                            {!soloLectura
                                ? "Puede crear un nuevo plan de acción haciendo clic en el botón 'Nuevo Plan de Acción'."
                                : "No tiene permisos para crear planes correctivos."
                            }
                        </Typography>
                    </Alert>
                </Box>
            );
        }

        // Contenido normal - Formulario o lista de registros
        if (showForm) {
            return (
                <PlanCorrectivoForm
                    onSave={handleSave}
                    onCancel={() => setShowForm(false)}
                    initialData={editingRecord}
                    sequence={sequence}
                    idProceso={idProceso}
                    disabled={saving}
                    showSnackbar={handleLocalSnackbar}
                />
            );
        }

        // Lista de registros
        return (
            <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", gap: 2, justifyContent: records.length === 1 ? "flex-start" : "center" }}>
                {records.map((record) => (
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
                ))}
            </Box>
        );
    };

    return (
        <Box sx={{ p: 4 }}>
            {/*  Botón de nuevo plan - solo mostrar si no está en modo formulario y tiene permisos */}
            {!soloLectura && !showForm && (
                <CustomButton
                    type="guardar"
                    startIcon={<Add />}
                    onClick={() => {
                        setEditingRecord(null);
                        setShowForm(true);
                    }}
                    disabled={saving || loading}
                >
                    Nuevo Plan de Acción
                </CustomButton>
            )}

            {/*  Contenido principal con manejo de estados */}
            {renderContent()}

            {/* Modal de detalles */}
            <PlanCorrectivoDetalleModal
                open={Boolean(selectedRecord)}
                record={selectedRecord}
                onClose={() => setSelectedRecord(null)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                soloLectura={soloLectura}
                puedeEditar={puedeEditar}
            />

            {/* Snackbar local (solo si no se usa el del padre) */}
            {!showSnackbar && (
                <FeedbackSnackbar
                    open={snackbar.open}
                    onClose={handleCloseSnackbar}
                    type={snackbar.type}
                    title={snackbar.title}
                    message={snackbar.message}
                    autoHideDuration={6000}
                />
            )}
        </Box>
    );
}

export default PlanCorrectivoContainer;