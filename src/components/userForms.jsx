import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Button, Tabs, Tab, FormHelperText, CircularProgress } from "@mui/material";
import ConfirmEdit from "./confirmEdit";
import axios from "axios";

const API_URL = 'http://127.0.0.1:8000/api';

function UserForm({ open, onClose, editingUser }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        secondLastName: "",
        email: "",
        phone: "",
        academicDegree: "",
        roles: [],
        supervisor: "",
        expirationDateTime: "",
    });
    const [rolesList, setRolesList] = useState([]);
    const [supervisores, setSupervisores] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [loadingSupervisores, setLoadingSupervisores] = useState(false);
    const [errors, setErrors] = useState({});
    const [tab, setTab] = useState(0);
    const [openConfirmEdit, setOpenConfirmEdit] = useState(false);

    useEffect(() => {
        const fetchRoles = async () => {
            setLoadingRoles(true);
            try {
                const response = await axios.get(`${API_URL}/tiposusuario`);
                setRolesList(response.data.data);
            } catch (error) {
                console.error("Error al cargar roles:", error);
                setErrors(prev => ({...prev, rolesLoad: "Error al cargar los roles"}));
            } finally {
                setLoadingRoles(false);
            }
        };

        if (open) {
            fetchRoles();
        }

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
                supervisor: "",
                expirationDateTime: "",
            });
        }
    }, [open, editingUser]);

    useEffect(() => {
        const fetchSupervisores = async () => {
            if (formData.roles.includes("Líder") && supervisores.length === 0) {
                setLoadingSupervisores(true);
                try {
                    const response = await axios.get(`${API_URL}/supervisores`);
                    setSupervisores(response.data.data);
                } catch (error) {
                    console.error("Error al cargar supervisores:", error);
                    setErrors(prev => ({...prev, supervisoresLoad: "Error al cargar supervisores"}));
                } finally {
                    setLoadingSupervisores(false);
                }
            }
        };

        fetchSupervisores();
    }, [formData.roles.includes("Líder")]);

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

    const extractRPE = (email) => {
        return email.split('@')[0] || '';
    };

    const generatePassword = (firstName) => {
        return `${firstName.toLowerCase()}123`;
    };

    const convertRolesToId = (roles) => {
        if (!roles.length) return null;
        
        const selectedRoles = roles.map(roleName => {
            const role = rolesList.find(r => r.nombreRol === roleName);
            return role ? role.idTipoUsuario : null;
        }).filter(id => id !== null);

        return selectedRoles.length > 0 ? selectedRoles[0] : null;
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName) newErrors.firstName = "El nombre es obligatorio";
        if (!formData.lastName) newErrors.lastName = "El apellido paterno es obligatorio";
        if (!formData.email) {
            newErrors.email = "El correo electrónico es obligatorio";
        } else if (!formData.email.includes('@')) {
            newErrors.email = "El correo debe contener @";
        }
        if (!formData.phone) newErrors.phone = "El teléfono es obligatorio";
        if (!formData.roles.length) newErrors.roles = "Debe seleccionar al menos un rol";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
    
        try {
            if (editingUser) {
                setOpenConfirmEdit(true);
            } else {
                await saveUser(formData);
                onClose();
            }
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
        }
    };

    const saveUser = async (data) => {
        const backendData = {
            nombre: data.firstName,
            apellidoPat: data.lastName,
            apellidoMat: data.secondLastName,
            correo: data.email,
            telefono: data.phone,
            gradoAcademico: data.academicDegree,
            RPE: extractRPE(data.email),
            pass: editingUser ? undefined : generatePassword(data.firstName),
            idTipoUsuario: convertRolesToId(data.roles),
            idSupervisor: data.supervisor || null
        };
    
        try {
            const url = editingUser ? `${API_URL}/usuarios/${editingUser.id}` : `${API_URL}/usuarios`;
            const method = editingUser ? "put" : "post";
    
            const response = await axios({
                method,
                url,
                data: backendData,
                headers: {
                    "Content-Type": "application/json",
                }
            });
    
            return response.data;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    const handleConfirmEdit = async () => {
        try {
            await saveUser(formData);
            setOpenConfirmEdit(false);
            onClose();
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
        }
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
                        <TextField
                            label="Nombre(s)"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            fullWidth
                            margin="dense"
                            error={Boolean(errors.firstName)}
                            helperText={errors.firstName}
                        />
                        <TextField
                            label="Apellido Paterno"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            fullWidth
                            margin="dense"
                            error={Boolean(errors.lastName)}
                            helperText={errors.lastName}
                        />
                        <TextField
                            label="Apellido Materno"
                            name="secondLastName"
                            value={formData.secondLastName}
                            onChange={handleChange}
                            fullWidth
                            margin="dense"
                            error={Boolean(errors.secondLastName)}
                            helperText={errors.secondLastName}
                        />
                        <TextField
                            label="Correo Electrónico"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            margin="dense"
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                        />
                        <TextField
                            label="Teléfono"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            fullWidth
                            margin="dense"
                            error={Boolean(errors.phone)}
                            helperText={errors.phone}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Grado Académico</InputLabel>
                            <Select
                                name="academicDegree"
                                value={formData.academicDegree}
                                onChange={handleChange}
                            >
                                <MenuItem value="Licenciatura">Licenciatura</MenuItem>
                                <MenuItem value="Maestría">Maestría</MenuItem>
                                <MenuItem value="Doctorado">Doctorado</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="dense" error={Boolean(errors.roles || errors.rolesLoad)}>
                            <InputLabel>Roles {loadingRoles && "(Cargando...)"}</InputLabel>
                            <Select
                                name="roles"
                                multiple
                                value={formData.roles}
                                onChange={handleRoleChange}
                                renderValue={(selected) => selected.join(", ")}
                                disabled={loadingRoles}
                            >
                                {loadingRoles ? (
                                    <MenuItem disabled>
                                        <CircularProgress size={24} />
                                    </MenuItem>
                                ) : (
                                    rolesList.map((role) => (
                                        <MenuItem key={role.idTipoUsuario} value={role.nombreRol}>
                                            {role.nombreRol}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                            {errors.roles && <FormHelperText>{errors.roles}</FormHelperText>}
                            {errors.rolesLoad && <FormHelperText error>{errors.rolesLoad}</FormHelperText>}
                        </FormControl>
                        {formData.roles.includes("Líder") && (
                            <FormControl fullWidth margin="dense" error={Boolean(errors.supervisor || errors.supervisoresLoad)}>
                                <InputLabel>Supervisor</InputLabel>
                                <Select
                                    name="supervisor"
                                    value={formData.supervisor || ""}
                                    onChange={handleChange}
                                    disabled={loadingSupervisores}
                                >
                                    {loadingSupervisores ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={24} />
                                        </MenuItem>
                                    ) : supervisores.length > 0 ? (
                                        supervisores.map((supervisor) => (
                                            <MenuItem 
                                                key={supervisor.idUsuario} 
                                                value={supervisor.idUsuario}
                                            >
                                                {`${supervisor.nombre} ${supervisor.apellidoPat} ${supervisor.apellidoMat}`}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>No hay supervisores disponibles</MenuItem>
                                    )}
                                </Select>
                                {errors.supervisor && <FormHelperText>{errors.supervisor}</FormHelperText>}
                                {errors.supervisoresLoad && <FormHelperText error>{errors.supervisoresLoad}</FormHelperText>}
                            </FormControl>
                        )}
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
                        <Button variant="contained" color="primary" onClick={() => console.log("Generar Token")}>
                            Generar Token
                        </Button>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancelar</Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    disabled={Boolean(errors.firstName || errors.lastName || errors.email || errors.phone || errors.roles)}
                >
                    {editingUser ? "Actualizar Usuario" : "Guardar"}
                </Button>
            </DialogActions>
            <ConfirmEdit
                open={openConfirmEdit}
                onClose={() => setOpenConfirmEdit(false)}
                entityType="usuario"
                entityName={formData.firstName}
                onConfirm={handleConfirmEdit}
            />
        </Dialog>
    );
}

export default UserForm;