// components/UserForm.jsx
import React, { useState, useEffect } from "react";
import {
    Dialog, DialogContent, DialogActions, TextField, FormControl,
    InputLabel, Select, MenuItem, Tabs, Tab, FormHelperText,
    CircularProgress, Typography
} from "@mui/material";
import ConfirmEdit from "./confirmEdit";
import axios from "axios";
import CustomButton from "./Button";
import DialogTitleCustom from "./TitleDialog";
import FeedbackSnackbar from "./Feedback";

const API_URL = 'http://localhost:8000/api';

function UserForm({ open, onClose, editingUser, onSubmit, onTokenCreated }) {
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", secondLastName: "",
        email: "", phone: "", academicDegree: "",
        roles: [], supervisor: "", expirationDateTime: ""
    });

    const [rolesList, setRolesList] = useState([]);
    const [supervisores, setSupervisores] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [loadingSupervisores, setLoadingSupervisores] = useState(false);
    const [errors, setErrors] = useState({});
    const [tab, setTab] = useState(0);
    const [openConfirmEdit, setOpenConfirmEdit] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, type: "info", title: "", message: "" });

    const showSnackbar = (type, title, message) =>
        setSnackbar({ open: true, type, title, message });

    const isEdit = Boolean(editingUser);
    const isLider = formData.roles.includes("Líder");

    // Cargar roles y setear form
    useEffect(() => {
        const fetchRoles = async () => {
            setLoadingRoles(true);
            try {
                const { data } = await axios.get(`${API_URL}/tiposusuario`);
                setRolesList(data.data);
            } catch (e) {
                setErrors(prev => ({ ...prev, rolesLoad: "Error al cargar los roles" }));
            } finally {
                setLoadingRoles(false);
            }
        };

        if (open) fetchRoles();

        if (editingUser) {
            setFormData({
                ...editingUser,
                expirationDateTime: editingUser.expirationDateTime || "",
                supervisor: editingUser.supervisor?.id || ""
            });
        } else {
            setFormData({
                firstName: "", lastName: "", secondLastName: "",
                email: "", phone: "", academicDegree: "",
                roles: [], supervisor: "", expirationDateTime: ""
            });
        }
    }, [open, editingUser]);

    // Supervisores (solo al editar y si es Líder)
    useEffect(() => {
        const fetchSupervisores = async () => {
            if (isLider && isEdit && supervisores.length === 0) {
                setLoadingSupervisores(true);
                try {
                    const { data } = await axios.get(`${API_URL}/supervisores`);
                    setSupervisores(data.data);
                } catch (e) {
                    setErrors(prev => ({ ...prev, supervisoresLoad: "Error al cargar supervisores" }));
                } finally {
                    setLoadingSupervisores(false);
                }
            }
        };
        fetchSupervisores();
    }, [isLider, isEdit, supervisores.length]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (e) => {
        const { value } = e.target;
        if (value.length <= 2) setFormData(prev => ({ ...prev, roles: value }));
    };

    const extractRPE = (email) => (email || "").split('@')[0] || '';
    const generatePassword = (firstName) => `${(firstName || "").trim().split(" ")[0].toLowerCase()}12345678`;
    const getDigitsOnly = (v) => (v || "").replace(/\D/g, "").slice(0, 10);
    const formatPhoneNumber = (v) => {
        const d = getDigitsOnly(v);
        const p = [];
        if (d.length > 0) p.push(d.slice(0, 3));
        if (d.length > 3) p.push(d.slice(3, 6));
        if (d.length > 6) p.push(d.slice(6, 8));
        if (d.length > 8) p.push(d.slice(8, 10));
        return p.join("-");
    };
    const handlePhoneChange = (e) =>
        setFormData(prev => ({ ...prev, phone: getDigitsOnly(e.target.value) }));

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = "El nombre es obligatorio";
        if (!formData.lastName) newErrors.lastName = "El apellido paterno es obligatorio";
        if (!formData.email) newErrors.email = "El correo electrónico es obligatorio";
        else if (!formData.email.includes('@')) newErrors.email = "El correo debe contener @";
        if (!formData.phone) newErrors.phone = "El teléfono es obligatorio";
        if (!formData.roles.length) newErrors.roles = "Debe seleccionar al menos un rol";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const transformUserDataForAPI = (data) => {
        const rolesTransformed = rolesList
            .filter(r => data.roles.includes(r.nombreRol))
            .map(r => r.idTipoUsuario);

        const payload = {
            nombre: data.firstName,
            apellidoPat: data.lastName,
            apellidoMat: data.secondLastName,
            correo: data.email,
            telefono: data.phone,
            gradoAcademico: data.academicDegree,
            RPE: extractRPE(data.email),
            pass: generatePassword(data.firstName),
            roles: rolesTransformed,
            expirationDateTime: data.expirationDateTime,
        };

        // En edición de Líder, solo mostramos supervisor actual (no lo cambiamos aquí)
        // Si en tu back ya soportas cambio explícito, aquí podrías enviarlo:
        // if (isEdit && data.roles.includes("Líder") && data.supervisor) payload.supervisor = data.supervisor;

        return payload;
    };

    const saveUser = async (data) => {
        const url = isEdit ? `${API_URL}/usuarios/${editingUser.id}` : `${API_URL}/usuarios`;
        const method = isEdit ? "put" : "post";
        const { data: resp } = await axios({ method, url, data, headers: { "Content-Type": "application/json" } });
        return resp.usuario;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        try {
            const payload = transformUserDataForAPI(formData);
            const usuarioGuardado = await saveUser(payload);
            onSubmit(usuarioGuardado);
            showSnackbar("success", "Usuario guardado", "El usuario se guardó correctamente.");
            onClose();
        } catch (error) {
            showSnackbar("error", "Error", error?.response?.data?.message || error.message || "No se pudo guardar el usuario.");
        }
    };

    const handleConfirmEdit = async () => {
        try {
            const payload = transformUserDataForAPI(formData);
            const usuarioActualizado = await saveUser(payload);
            onSubmit(usuarioActualizado);
            setOpenConfirmEdit(false);
            onClose();
        } catch (error) {
            showSnackbar("error", "Error", error?.response?.data?.message || error.message || "No se pudo guardar el usuario.");
        }
    };

    const generarToken = async () => {
        try {
            const res = await fetch(`${API_URL}/generar-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ expirationDateTime: formData.expirationDateTime }),
            });
            const data = await res.json();
            if (res.ok) {
                showSnackbar("success", "Token generado", `Token: ${data.token}, expira: ${data.expiracion}`);
                onTokenCreated && onTokenCreated();
            } else {
                showSnackbar("error", "Error", data.message || "No se pudo generar el token.");
            }
        } catch (e) {
            showSnackbar("error", "Error", e?.message || "No se pudo generar el token.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitleCustom title={isEdit ? "Editar Usuario" : "Agregar Usuario"} />
            <Tabs value={tab} onChange={(e, v) => setTab(v)}>
                <Tab label="Usuario Normal" />
                <Tab label="Temporal" />
            </Tabs>

            <DialogContent>
                {tab === 0 ? (
                    <>
                        {/* Roles */}
                        <Typography variant="subtitle1" sx={{ mt: 1, mb: 1, fontWeight: 600, color: "text.primary" }}>
                            Información de acceso
                        </Typography>
                        <FormControl fullWidth margin="dense" error={Boolean(errors.roles || errors.rolesLoad)}>
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
                                    <MenuItem disabled><CircularProgress size={24} /></MenuItem>
                                ) : (
                                    rolesList.map(role => (
                                        <MenuItem key={role.idTipoUsuario} value={role.nombreRol}>
                                            {role.nombreRol}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                            {errors.roles && <FormHelperText>{errors.roles}</FormHelperText>}
                            {errors.rolesLoad && <FormHelperText error>{errors.rolesLoad}</FormHelperText>}
                        </FormControl>

                        {/* Supervisor actual (informativo) al editar Líder */}
                        {formData.roles.includes("Líder") && isEdit && (
                            <FormControl fullWidth margin="dense">
                                <Typography variant="body2" sx={{ mt: 1.5 }}>
                                    Supervisor actual:{" "}
                                    {editingUser?.supervisor
                                        ? `${editingUser.supervisor.lastName} ${editingUser.supervisor.secondLastName} ${editingUser.supervisor.firstName}`
                                        : "Sin supervisor asignado"}
                                </Typography>
                            </FormControl>
                        )}

                        {/* Datos personales */}
                        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 600, color: "text.primary" }}>
                            Información personal
                        </Typography>
                        <TextField label="Nombre(s)" name="firstName" value={formData.firstName} onChange={handleChange}
                            fullWidth margin="dense" error={Boolean(errors.firstName)} helperText={errors.firstName} />
                        <TextField label="Apellido Paterno" name="lastName" value={formData.lastName} onChange={handleChange}
                            fullWidth margin="dense" error={Boolean(errors.lastName)} helperText={errors.lastName} />
                        <TextField label="Apellido Materno" name="secondLastName" value={formData.secondLastName}
                            onChange={handleChange} fullWidth margin="dense" />
                        <TextField label="Correo Electrónico" name="email" type="email" value={formData.email}
                            onChange={handleChange} fullWidth margin="dense" error={Boolean(errors.email)} helperText={errors.email} />
                        <TextField label="Teléfono" name="phone" value={formatPhoneNumber(formData.phone)} onChange={handlePhoneChange}
                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 13 }} fullWidth margin="dense"
                            error={Boolean(errors.phone)} helperText={errors.phone} />
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="grado-label">Grado Académico</InputLabel>
                            <Select labelId="grado-label" name="academicDegree" value={formData.academicDegree} onChange={handleChange}>
                                <MenuItem value="Licenciatura">Licenciatura</MenuItem>
                                <MenuItem value="Maestría">Maestría</MenuItem>
                                <MenuItem value="Doctorado">Doctorado</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                ) : (
                    <>
                        {/* Usuario temporal */}
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
                        {isEdit ? "Actualizar Usuario" : "Guardar"}
                    </CustomButton>
                ) : (
                    <CustomButton type="guardar" onClick={async () => { await generarToken(); onClose(); }}>
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

            <FeedbackSnackbar
                open={snackbar.open}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                type={snackbar.type}
                title={snackbar.title}
                message={snackbar.message}
            />
        </Dialog>
    );
}

export default UserForm;
