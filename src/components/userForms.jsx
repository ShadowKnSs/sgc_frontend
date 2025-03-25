import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl,
    InputLabel, Select, MenuItem, Button, Tabs, Tab, FormHelperText
} from "@mui/material";
import ConfirmEdit from "./confirmEdit";

function UserForm({ open, onClose, onSubmit, editingUser }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        secondLastName: "",
        email: "",
        phone: "",
        academicDegree: "",
        roles: [],
        supervisor: ""
    });
    const [errors, setErrors] = useState({});
    const [tab, setTab] = useState(0);
    const [openConfirmEdit, setOpenConfirmEdit] = useState(false);

    useEffect(() => {
        if (editingUser) {
            setFormData(editingUser);
        } else {
            setFormData({
                firstName: "",
                lastName: "",
                secondLastName: "",
                email: "",
                phone: "",
                academicDegree: "",
                roles: [],
                supervisor: ""
            });
        }
    }, [editingUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRoleChange = (e) => {
        const { value } = e.target;
        if (value.length <= 2) {
            setFormData({ ...formData, roles: value });
        }
    };

    const handleSubmit = () => {
        if (editingUser) {
            setOpenConfirmEdit(true); // Mostrar confirmación antes de actualizar
        } else {
            onSubmit(formData);
        }
    };

    const handleConfirmEdit = () => {
        onSubmit(formData);
        setOpenConfirmEdit(false);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{editingUser ? "Editar Usuario" : "Agregar Usuario"}</DialogTitle>
            <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
                <Tab label="Usuario Normal" />
                <Tab label="Temporal" />
            </Tabs>
            <DialogContent>
                {tab === 0 ? (
                    <>
                        <TextField label="Nombre(s)" name="firstName" value={formData.firstName} onChange={handleChange} fullWidth margin="dense" error={Boolean(errors.firstName)} helperText={errors.firstName} />
                        <TextField label="Apellido Paterno" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth margin="dense" error={Boolean(errors.lastName)} helperText={errors.lastName} />
                        <TextField label="Correo Electrónico" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth margin="dense" error={Boolean(errors.email)} helperText={errors.email} />
                        <TextField label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} fullWidth margin="dense" error={Boolean(errors.phone)} helperText={errors.phone} />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Grado Académico</InputLabel>
                            <Select name="academicDegree" value={formData.academicDegree} onChange={handleChange}>
                                <MenuItem value="Licenciatura">Licenciatura</MenuItem>
                                <MenuItem value="Maestría">Maestría</MenuItem>
                                <MenuItem value="Doctorado">Doctorado</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="dense" error={Boolean(errors.roles)}>
                            <InputLabel>Roles (Máximo 2)</InputLabel>
                            <Select name="roles" multiple value={formData.roles} onChange={handleRoleChange} renderValue={(selected) => selected.join(", ")}>
                                <MenuItem value="Líder de Proceso">Líder de Proceso</MenuItem>
                                <MenuItem value="Supervisor">Supervisor</MenuItem>
                                <MenuItem value="Operativo">Operativo</MenuItem>
                            </Select>
                            {errors.roles && <FormHelperText>{errors.roles}</FormHelperText>}
                        </FormControl>
                        {formData.roles.includes("Líder de Proceso") && (
                            <FormControl fullWidth margin="dense" error={Boolean(errors.supervisor)}>
                                <InputLabel>Supervisor</InputLabel>
                                <Select name="supervisor" value={formData.supervisor || ""} onChange={handleChange}>
                                    <MenuItem value="Supervisor 1">Supervisor 1</MenuItem>
                                    <MenuItem value="Supervisor 2">Supervisor 2</MenuItem>
                                </Select>
                                {errors.supervisor && <FormHelperText>{errors.supervisor}</FormHelperText>}
                            </FormControl>
                        )}
                    </>
                ) : (
                    <>
                        <TextField label="Fecha y Hora de Expiración" name="expirationDateTime" type="datetime-local" value={formData.expirationDateTime} onChange={handleChange} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
                        <Button variant="contained" color="primary" onClick={() => console.log("Generar Token")}>Generar Token</Button>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancelar</Button>
                <Button onClick={handleSubmit} color="primary" disabled={Boolean(errors.firstName || errors.lastName || errors.email || errors.phone || errors.roles)}>
                    {editingUser ? "Actualizar Usuario" : "Guardar"}
                </Button>
            </DialogActions>
            <ConfirmEdit open={openConfirmEdit} onClose={() => setOpenConfirmEdit(false)} entityType="usuario" entityName={formData.firstName} onConfirm={handleConfirmEdit} />
        </Dialog>
    );
}

export default UserForm;
