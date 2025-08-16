import React, { useEffect, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, MenuItem,
    Checkbox, ListItemText, CircularProgress, FormHelperText, Chip
} from "@mui/material";
import FeedbackSnackbar from "../Feedback";
import axios from "axios";
import CustomButton from "../Button";

const API_URL = 'http://localhost:8000/api';

const SupervisorProcessDialog = ({ open, onClose, supervisorUser, onSaved }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [allProcesos, setAllProcesos] = useState([]); 
    const [selected, setSelected] = useState([]);
    const [error, setError] = useState("");
    const [snackbar, setSnackbar] = useState({ open: false, type: "info", title: "", message: "" });

    const showSnackbar = (type, title, message) =>
        setSnackbar({ open: true, type, title, message });

    useEffect(() => {
        const loadProcesos = async () => {
            if (!open) return;
            setLoading(true);
            setError("");
            try {
                const { data } = await axios.get(`${API_URL}/procesos-con-entidad`);
                setAllProcesos(data.procesos || []);
                const { data: pre } = await axios.get(`${API_URL}/usuarios/${supervisorUser.id}/procesos-supervisor`);
                setSelected(pre.procesosIds || []);
            } catch (e) {
                setError("Error al cargar procesos");
            } finally {
                setLoading(false);
            }
        };
        loadProcesos();
    }, [open, supervisorUser?.id]);

    const handleSave = async () => {
        if (!supervisorUser?.id) return;
        if (selected.length === 0) {
            setError("Selecciona al menos un proceso.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            await axios.post(`${API_URL}/usuarios/${supervisorUser.id}/asignar-procesos`, {
                procesos: selected
            });
            showSnackbar("success", "Asignación guardada", "Los procesos fueron asignados correctamente.");
            onSaved && onSaved();
            onClose && onClose();
        } catch (e) {
            const msg = e?.response?.data?.message || e?.message || "No se pudo asignar procesos.";
            setError(msg);
            showSnackbar("error", "Error", msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Asignar procesos a:{" "}
                <Chip label={`${supervisorUser?.lastName || ""} ${supervisorUser?.secondLastName || ""} ${supervisorUser?.firstName || ""}`} />
            </DialogTitle>

            <DialogContent dividers>
                <FormControl fullWidth error={Boolean(error)}>
                    <InputLabel id="procesos-label">Procesos</InputLabel>
                    <Select
                        labelId="procesos-label"
                        multiple
                        value={selected}
                        label="Procesos"
                        onChange={(e) => setSelected(e.target.value)}
                        renderValue={(ids) => {
                            const names = ids.map(id => {
                                const it = allProcesos.find(p => p.idProceso === id);
                                return it ? it.nombreProceso : id; // ajusta según tu backend
                            });
                            return names.join(", ");
                        }}
                        disabled={loading}
                    >
                        {loading ? (
                            <MenuItem disabled><CircularProgress size={24} /></MenuItem>
                        ) : allProcesos.map(p => (
                            <MenuItem key={p.idProceso} value={p.idProceso}>
                                <Checkbox checked={selected.includes(p.idProceso)} />
                                <ListItemText primary={p.nombreProceso} /> 
                            </MenuItem>
                        ))}
                    </Select>
                    {error && <FormHelperText>{error}</FormHelperText>}
                </FormControl>
            </DialogContent>

            <DialogActions>
                <CustomButton type="cancelar" onClick={onClose} disabled={saving}>
                    Cancelar
                </CustomButton>
                <CustomButton type="guardar" onClick={handleSave} disabled={saving || loading}>
                    {saving ? "Guardando..." : "Guardar asignación"}
                </CustomButton>
            </DialogActions>

            <FeedbackSnackbar
                open={snackbar.open}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                type={snackbar.type}
                title={snackbar.title}
                message={snackbar.message}
            />
        </Dialog>
    );
};

export default SupervisorProcessDialog;
