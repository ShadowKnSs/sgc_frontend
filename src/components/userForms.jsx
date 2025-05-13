import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Button, Tabs, Tab, FormHelperText, CircularProgress, Box, IconButton } from "@mui/material";
import ConfirmEdit from "./confirmEdit";
import axios from "axios";
import CustomButton from "./Button";
import DialogTitleCustom from "./TitleDialog";
const API_URL = 'http://localhost:8000/api';

function UserForm({ open, onClose, editingUser, onSubmit, onTokenCreated }) {
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
    const isLider = formData.roles.includes("Líder");
    const transformUserDataForAPI = (data) => {
        // Extrae RPE del correo (todo lo que está antes de "@")
        const RPE = extractRPE(data.email);
        const pass = generatePassword(data.firstName);

        // Transforma los roles: de los nombres seleccionados se obtienen los id correspondientes
        // Se asume que rolesList ya está cargado en el estado
        const rolesTransformed = rolesList
            .filter(role => data.roles.includes(role.nombreRol))
            .map(role => role.idTipoUsuario);

        return {
            nombre: data.firstName,
            apellidoPat: data.lastName,
            apellidoMat: data.secondLastName,
            correo: data.email,
            telefono: data.phone,
            gradoAcademico: data.academicDegree,
            RPE,
            pass,
            roles: rolesTransformed,
            supervisor: data.supervisor,
            expirationDateTime: data.expirationDateTime,
        };
    };
    const [rolesList, setRolesList] = useState([]);
    const [supervisores, setSupervisores] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [loadingSupervisores, setLoadingSupervisores] = useState(false);
    const [errors, setErrors] = useState({});
    const [tab, setTab] = useState(0);
    const [openConfirmEdit, setOpenConfirmEdit] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);


    useEffect(() => {
        const fetchRoles = async () => {
            setLoadingRoles(true);
            try {
                const response = await axios.get(`${API_URL}/tiposusuario`);
                setRolesList(response.data.data);
            } catch (error) {
                console.error("Error al cargar roles:", error);
                setErrors(prev => ({ ...prev, rolesLoad: "Error al cargar los roles" }));
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
            if (isLider && supervisores.length === 0) {
                setLoadingSupervisores(true);
                try {
                    const response = await axios.get(`${API_URL}/supervisores`);
                    setSupervisores(response.data.data);
                } catch (error) {
                    console.error("Error al cargar supervisores:", error);
                    setErrors(prev => ({ ...prev, supervisoresLoad: "Error al cargar supervisores" }));
                } finally {
                    setLoadingSupervisores(false);
                }
            }
        };

        fetchSupervisores();
    }, [isLider, supervisores.length]);

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
        const primerNombre = firstName.trim().split(" ")[0];
        return `${primerNombre.toLowerCase()}12345678`;
    };

    const getDigitsOnly = (value) => value.replace(/\D/g, "").slice(0, 10);

    const formatPhoneNumber = (value) => {
        const digits = getDigitsOnly(value);
        const parts = [];

        if (digits.length > 0) parts.push(digits.slice(0, 3));
        if (digits.length > 3) parts.push(digits.slice(3, 6));
        if (digits.length > 6) parts.push(digits.slice(6, 8));
        if (digits.length > 8) parts.push(digits.slice(8, 10));

        return parts.join("-");
    };

    const handlePhoneChange = (e) => {
        const onlyDigits = getDigitsOnly(e.target.value);
        setFormData(prev => ({ ...prev, phone: onlyDigits }));
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
            const datosAPI = transformUserDataForAPI(formData);
            const usuarioGuardado = await saveUser(datosAPI);

            onSubmit(usuarioGuardado); // ✅ solo pasa el usuario creado o editado
            onClose(); // ✅ cerrar el modal
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
        }
    };

    const saveUser = async (data) => {
        try {
            console.log('Payload a enviar:', data); // <- asegúrate de que tenga los campos correctos

            const url = editingUser ? `${API_URL}/usuarios/${editingUser.id}` : `${API_URL}/usuarios`;
            const method = editingUser ? "put" : "post";

            const response = await axios({
                method,
                url,
                data,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            return response.data.usuario;


        } catch (error) {
            console.error('Error detallado:', {
                status: error.response?.status,
                data: error.response?.data,
                config: error.config
            });
            throw new Error(
                error.response?.data?.errors
                    ? Object.values(error.response.data.errors).flat().join(" - ")
                    : error.response?.data?.message || 'Error al guardar usuario'
            );

        }
    };


    const convertRolesToId = (roles) => {
        if (!Array.isArray(roles)) return [];

        return roles.map(role => {
            if (typeof role === 'object' && role !== null) {
                return role.idTipoUsuario || role;
            }
            const roleObj = rolesList.find(r => r.nombreRol === role);
            return roleObj ? roleObj.idTipoUsuario : null;
        }).filter(id => id !== null);
    };

    const handleConfirmEdit = async () => {
        try {
            const datosAPI = transformUserDataForAPI(formData);
            const usuarioActualizado = await saveUser(datosAPI);

            onSubmit(usuarioActualizado); // ✅ usuario actualizado
            setOpenConfirmEdit(false);
            onClose();
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
        }
    };

    const generarToken = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/generar-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    expirationDateTime: formData.expirationDateTime,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(`Token generado: ${data.token}\nExpira: ${data.expiracion}`);
                if (typeof onTokenCreated === "function") {
                    onTokenCreated(); // <- esto actualiza la lista
                }
            } else {
                alert("Error al generar el token: " + data.message);
            }
        } catch (error) {
            console.error("Error al generar el token:", error);
            alert("Fallo en la comunicación con el backend");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">

            <DialogTitleCustom title={editingUser ? "Editar Usuario" : "Agregar Usuario"} />
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
                            value={formatPhoneNumber(formData.phone)} // sólo visual
                            onChange={handlePhoneChange}
                            inputProps={{
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                                maxLength: 13, // límite visual (ej. 123-456-78-90 = 13 caracteres)
                            }}
                            fullWidth
                            margin="dense"
                            error={Boolean(errors.phone)}
                            helperText={errors.phone}
                        />

                        <FormControl fullWidth margin="dense" variant="outlined">
                            <InputLabel id="grado-label">Grado Académico</InputLabel>
                            <Select
                                labelId="grado-label"
                                id="grado-academico"
                                name="academicDegree"
                                value={formData.academicDegree}
                                onChange={handleChange}
                                label="Grado Académico"
                            >
                                <MenuItem value="Licenciatura">Licenciatura</MenuItem>
                                <MenuItem value="Maestría">Maestría</MenuItem>
                                <MenuItem value="Doctorado">Doctorado</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="dense" error={Boolean(errors.roles || errors.rolesLoad)} variant="outlined">
                            <InputLabel id="roles-label">Roles</InputLabel>
                            <Select
                                labelId="roles-label"
                                name="roles"
                                multiple
                                value={formData.roles}
                                onChange={handleRoleChange}
                                renderValue={(selected) => selected.join(", ")}
                                disabled={loadingRoles}
                                label="Roles"
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
                            <FormControl fullWidth margin="dense" error={Boolean(errors.supervisor || errors.supervisoresLoad)} variant="outlined">
                                <InputLabel id="supervisor-label">Supervisor</InputLabel>
                                <Select
                                    labelId="supervisor-label"
                                    name="supervisor"
                                    value={formData.supervisor || ""}
                                    onChange={handleChange}
                                    disabled={loadingSupervisores}
                                    label="Supervisor"
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
                        
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <CustomButton type="cancelar" onClick={onClose}>Cancelar</CustomButton>

                {tab === 0 ? (
                    <CustomButton
                        type="Guardar"
                        onClick={handleSubmit}
                        disabled={
                            !formData.firstName ||
                            !formData.lastName ||
                            !formData.email ||
                            !formData.phone ||
                            formData.roles.length === 0 ||
                            Boolean(errors.firstName || errors.lastName || errors.email || errors.phone || errors.roles)
                        }
                    >
                        {editingUser ? "Actualizar Usuario" : "Guardar"}
                    </CustomButton>
                ) : (
                    <CustomButton type="guardar" onClick={async () => {
                        await generarToken();
                        onClose(); 
                    }}>
                        Generar Token
                    </CustomButton>
                )}
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