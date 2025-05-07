import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Button, Tabs, Tab, FormHelperText, CircularProgress, Box, IconButton } from "@mui/material";
import ConfirmEdit from "./confirmEdit";
import axios from "axios";
import CustomButton from "./Button";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FeedbackSnackbar from "./Feedback";
import DialogTitleCustom from "./TitleDialog";
const API_URL = 'http://127.0.0.1:8000/api';

function UserForm({ open, onClose, editingUser, onSubmit }) {
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
    const transformUserDataForAPI = (data) => {
        // Extrae RPE del correo (todo lo que está antes de "@")
        const RPE = data.email.split("@")[0];
        // Toma el primer nombre
        const firstNameForPass = data.firstName.split(" ")[0];
        const pass = firstNameForPass + "123";
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
            if (formData.roles.includes("Líder") && supervisores.length === 0) {
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

            if (editingUser) {
                setOpenConfirmEdit(true);
            } else {
                await saveUser(datosAPI);
                onSubmit(datosAPI);
                onClose();
            }
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
        }
    };

    const saveUser = async (data) => {
        try {
            const rolesIds = convertRolesToId(data.roles);

            const payload = {
                nombre: data.firstName,
                apellidoPat: data.lastName,
                apellidoMat: data.secondLastName || null,
                correo: data.email,
                telefono: data.phone,
                gradoAcademico: data.academicDegree || null,
                RPE: extractRPE(data.email),
                pass: generatePassword(data.firstName),
                roles: rolesIds,
                idSupervisor: data.supervisor || null
            };

            console.log('Payload a enviar:', payload);

            const url = editingUser ? `${API_URL}/usuarios/${editingUser.id}` : `${API_URL}/usuarios`;
            const method = editingUser ? "put" : "post";

            const response = await axios({
                method,
                url,
                data: payload,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            return response.data;

        } catch (error) {
            console.error('Error detallado:', {
                status: error.response?.status,
                data: error.response?.data,
                config: error.config
            });
            throw new Error(error.response?.data?.message || 'Error al guardar usuario');
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
            await saveUser(datosAPI);
            onSubmit(datosAPI);
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
                            <InputLabel shrink>
                                <Box display="flex" alignItems="center" gap={1}>
                                    Roles {loadingRoles && "(Cargando...)"}
                                    <IconButton
                                        size="small"
                                        onClick={() => setOpenInfo(true)}
                                        sx={{
                                            padding: 0,
                                            color: "#185FA4",
                                            '&:hover': { backgroundColor: 'transparent' }
                                        }}
                                    >
                                        <InfoOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </InputLabel>

                            <Select
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

                            <FeedbackSnackbar
                                open={openInfo}
                                onClose={() => setOpenInfo(false)}
                                type="info"
                                title="Información"
                                message="Un usuario puede tener hasta dos roles."
                                autoHideDuration={5000}
                            />
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
                        <Button variant="contained" color="primary" onClick={generarToken}>
                            Generar Token
                        </Button>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <CustomButton type="cancelar" onClick={onClose}> {"Cancelar"} </CustomButton>
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