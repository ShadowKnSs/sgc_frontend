import React, { useEffect, useState, useCallback } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, MenuItem,
    Checkbox, ListItemText, CircularProgress, FormHelperText, Chip
} from "@mui/material";
import axios from "axios";
import CustomButton from "../Button";

const API_URL = 'http://localhost:8000/api';

// Memoizar el componente para evitar re-renders innecesarios
const SupervisorProcessDialog = React.memo(({ open, onClose, supervisorUser, onSaved, onError }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [allProcesos, setAllProcesos] = useState([]); 
    const [selected, setSelected] = useState([]);
    const [error, setError] = useState("");

    // Cargar procesos con useCallback para memoización
    const loadProcesos = useCallback(async () => {
        if (!open || !supervisorUser?.id) return;
        
        setLoading(true);
        setError("");
        try {
            // Cargar en paralelo para mejor rendimiento
            const [procesosResponse, assignedResponse] = await Promise.all([
                axios.get(`${API_URL}/procesos-con-entidad`),
                axios.get(`${API_URL}/usuarios/${supervisorUser.id}/procesos-supervisor`)
            ]);
            
            setAllProcesos(procesosResponse.data.procesos || []);
            setSelected(assignedResponse.data.procesosIds || []);

        } catch (e) {
            setError("Error al cargar procesos");
            onError && onError("No se pudieron cargar los procesos");
        } finally {
            setLoading(false);
        }
    }, [open, supervisorUser?.id, onError]);

    useEffect(() => {
        if (open) {
            loadProcesos();
        } else {
            // Limpiar estado al cerrar
            setAllProcesos([]);
            setSelected([]);
            setError("");
        }
    }, [open, loadProcesos]);

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
            
            onSaved && onSaved(true, "Los procesos fueron asignados correctamente.");
            onClose && onClose();
        } catch (e) {
            const msg = e?.response?.data?.message || e?.message || "No se pudo asignar procesos.";
            setError(msg);
            onError && onError(msg);
        } finally {
            setSaving(false);
        }
    };

    // Memoizar la función de renderizado de valores
    const renderSelectedValues = useCallback((selectedIds) => {
        if (selectedIds.length === 0) return "Selecciona procesos";
        
        return selectedIds.map(id => {
            const proceso = allProcesos.find(p => p.idProceso === id);
            return proceso ? proceso.nombreCompleto : `ID: ${id}`;
        }).join(", ");
    }, [allProcesos]);

    if (!supervisorUser) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Asignar procesos a:{" "}
                <Chip label={`${supervisorUser.lastName || ""} ${supervisorUser.secondLastName || ""} ${supervisorUser.firstName || ""}`} />
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
                        renderValue={renderSelectedValues}
                        disabled={loading || saving}
                    >
                        {loading ? (
                            <MenuItem disabled>
                                <CircularProgress size={24} />
                                <ListItemText primary="Cargando procesos..." />
                            </MenuItem>
                        ) : allProcesos.length === 0 ? (
                            <MenuItem disabled>
                                <ListItemText primary="No hay procesos disponibles" />
                            </MenuItem>
                        ) : (
                            allProcesos.map(proceso => (
                                <MenuItem key={proceso.idProceso} value={proceso.idProceso}>
                                    <Checkbox 
                                        checked={selected.includes(proceso.idProceso)} 
                                        disabled={saving}
                                    />
                                    <ListItemText primary={proceso.nombreCompleto} />
                                </MenuItem>
                            ))
                        )}
                    </Select>
                    {error && <FormHelperText>{error}</FormHelperText>}
                </FormControl>
            </DialogContent>

            <DialogActions>
                <CustomButton 
                    type="cancelar" 
                    onClick={onClose} 
                    disabled={saving}
                >
                    Cancelar
                </CustomButton>
                <CustomButton 
                    type="guardar" 
                    onClick={handleSave} 
                    disabled={saving || loading || selected.length === 0}
                    loading={saving}
                >
                    {saving ? "Guardando..." : "Guardar asignación"}
                </CustomButton>
            </DialogActions>
        </Dialog>
    );
});

export default SupervisorProcessDialog;