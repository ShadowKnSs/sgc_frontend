import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, FormControl, InputLabel, FormHelperText, Tabs, Tab } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

const rolesOptions = ["Administrador", "Gestor", "Usuario"];
const academicDegrees = ["Licenciatura", "Maestría", "Doctorado"];

function UserForm({ open, onClose, onSubmit }) {
    const [tab, setTab] = useState(0);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        secondLastName: "",
        email: "",
        roles: [],
        phone: "",
        academicDegree: "",
        status: "Activo",
        registrationDate: new Date().toISOString().split("T")[0],
        photo: null,
        expirationDateTime: "",
        tempToken: ""
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};
        if (!formData.firstName) tempErrors.firstName = "El nombre es obligatorio.";
        if (!formData.lastName) tempErrors.lastName = "El apellido paterno es obligatorio.";
        if (!formData.email) tempErrors.email = "El correo electrónico es obligatorio.";
        if (!formData.phone) tempErrors.phone = "El teléfono es obligatorio.";
        if (formData.roles.length === 0) tempErrors.roles = "Debe seleccionar al menos un rol.";
        return tempErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRoleChange = (event) => {
        const { value } = event.target;
        if (value.length > 2) return;
        setFormData({ ...formData, roles: value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, photo: file });
    };

    const generateToken = () => {
        if (!formData.expirationDateTime) return;
        setFormData({ ...formData, tempToken: uuidv4() });
    };

    const handleSubmit = () => {
        const tempErrors = validate();
        setErrors(tempErrors);
        if (Object.keys(tempErrors).length === 0) {
            onSubmit(formData);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Agregar Usuario</DialogTitle>
            <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
                <Tab label="Usuario Normal" />
                <Tab label="Temporal" />
            </Tabs>
            <DialogContent>
                {tab === 0 ? (
                    <>
                        <TextField label="Nombre(s)" name="firstName" value={formData.firstName} onChange={handleChange} fullWidth margin="dense" error={Boolean(errors.firstName)} helperText={errors.firstName} />
                        <TextField label="Apellido Paterno" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth margin="dense" error={Boolean(errors.lastName)} helperText={errors.lastName} />
                        <TextField label="Apellido Materno" name="secondLastName" value={formData.secondLastName} onChange={handleChange} fullWidth margin="dense" />
                        <TextField label="Correo Electrónico" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth margin="dense" error={Boolean(errors.email)} helperText={errors.email} />
                        <TextField label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} fullWidth margin="dense" error={Boolean(errors.phone)} helperText={errors.phone} />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Grado Académico</InputLabel>
                            <Select name="academicDegree" value={formData.academicDegree} onChange={handleChange}>
                                {academicDegrees.map((degree) => (
                                    <MenuItem key={degree} value={degree}>{degree}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="dense" error={Boolean(errors.roles)}>
                            <InputLabel>Roles (Máximo 2)</InputLabel>
                            <Select name="roles" multiple value={formData.roles} onChange={handleRoleChange} renderValue={(selected) => selected.join(", ") }>
                                {rolesOptions.map((role) => (
                                    <MenuItem key={role} value={role}>{role}</MenuItem>
                                ))}
                            </Select>
                            {errors.roles && <FormHelperText>{errors.roles}</FormHelperText>}
                        </FormControl>
                        <Button variant="contained" component="label" color="primary" style={{ marginTop: 16 }}> Subir Foto <input type="file" accept="image/*" onChange={handlePhotoChange} hidden /> </Button>
                    </>
                ) : (
                    <>
                        <TextField 
                            label="Fecha y Hora de Expiración" 
                            name="expirationDateTime" 
                            type="datetime-local" 
                            value={formData.expirationDateTime} 
                            onChange={handleChange} 
                            fullWidth 
                            margin="dense" 
                            InputLabelProps={{ shrink: true }}
                        />
                        <Button variant="contained" color="primary" onClick={generateToken} style={{ marginTop: 16 }}>Generar Token</Button>
                        {formData.tempToken && <TextField label="Token Generado" value={formData.tempToken} fullWidth margin="dense" disabled />}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancelar</Button>
                <Button onClick={handleSubmit} color="primary" disabled={Boolean(errors.firstName || errors.lastName || errors.email || errors.phone || errors.roles)}>Guardar</Button>
            </DialogActions>
        </Dialog>
    );
}

export default UserForm;
