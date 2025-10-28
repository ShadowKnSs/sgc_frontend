// components/UserForm.jsx
import React, { useState, useEffect, useCallback } from "react";
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

const MAX = {
    firstName: 255,
    lastName: 255,
    secondLastName: 255,
    email: 120,
    phone: 10,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function CountTextField({
    label, name, value, onChange, max, errorText, onBlur, ...props
}) {
    const length = (value || "").length;
    const showError = Boolean(errorText);
    return (
        <TextField
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            fullWidth
            margin="dense"
            error={showError}
            helperText={showError ? errorText : `${length}/${max}`}
            inputProps={{ maxLength: max, "aria-describedby": `${name}-helper` }}
            FormHelperTextProps={{
                id: `${name}-helper`,
                sx: { display: "flex", justifyContent: "space-between" },
            }}
            {...props}
        />
    );
}

function PhoneTextField({ value, onChange, errorText, onBlur }) {
    const digits = getDigitsOnly(value);
    const formatted = formatPhoneNumber(value);
    const showError = Boolean(errorText);

    return (
        <TextField
            label="Teléfono"
            name="phone"
            value={formatted}
            onChange={onChange}
            onBlur={onBlur}
            fullWidth
            margin="dense"
            inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 13,
            }}
            error={showError}
            helperText={showError ? errorText : `${digits.length}/${MAX.phone}`}
            FormHelperTextProps={{
                sx: { display: "flex", justifyContent: "space-between" },
            }}
        />
    );
}

const getDigitsOnly = (v) => (v || "").replace(/\D/g, "").slice(0, 10);

const transformRoles = (rolesNames, rolesList) => {
    const roleMap = {};
    rolesList.forEach(role => {
        roleMap[role.nombreRol] = role.idTipoUsuario;
    });

    return rolesNames.map(roleName => roleMap[roleName]).filter(Boolean);
};

const formatPhoneNumber = (v) => {
    const d = getDigitsOnly(v);
    const p = [];
    if (d.length > 0) p.push(d.slice(0, 3));
    if (d.length > 3) p.push(d.slice(3, 6));
    if (d.length > 6) p.push(d.slice(6, 8));
    if (d.length > 8) p.push(d.slice(8, 10));
    return p.join("-");
};

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
    const [touched, setTouched] = useState({});
    const [tab, setTab] = useState(0);
    const [openConfirmEdit, setOpenConfirmEdit] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, type: "info", title: "", message: "" });
    const [saving, setSaving] = useState(false);

    const [generatingToken, setGeneratingToken] = useState(false); // Estado para loading de token


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
                localStorage.setItem('rolesCache', JSON.stringify({
                    data: data.data,
                    timestamp: Date.now()
                }));
            } catch (e) {
                const cached = localStorage.getItem('rolesCache');
                if (cached) {
                    const { data, timestamp } = JSON.parse(cached);
                    if (Date.now() - timestamp < 600000) {
                        setRolesList(data);
                    }
                }
                setErrors(prev => ({ ...prev, rolesLoad: "Error al cargar los roles" }));
            } finally {
                setLoadingRoles(false);
            }
        };

        if (open) {
            const cached = localStorage.getItem('rolesCache');
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < 600000) {
                    setRolesList(data);
                } else {
                    fetchRoles();
                }
            } else {
                fetchRoles();
            }

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
            // Resetear touched y errors al abrir el diálogo
            setTouched({});
            setErrors({});
        }
    }, [open, editingUser]);

    // Validación en tiempo real cuando los campos cambian
    useEffect(() => {
        const newErrors = {};
        const trimmedFirstName = formData.firstName.trim();
        const trimmedLastName = formData.lastName.trim();
        const trimmedEmail = formData.email.trim();

        // Solo validar campos que han sido tocados o tienen errores previos
        if (touched.firstName || errors.firstName) {
            if (!trimmedFirstName) {
                newErrors.firstName = "El nombre es obligatorio";
            } else if (trimmedFirstName.length > MAX.firstName) {
                newErrors.firstName = `Máximo ${MAX.firstName} caracteres`;
            }
        }

        if (touched.lastName || errors.lastName) {
            if (!trimmedLastName) {
                newErrors.lastName = "El apellido paterno es obligatorio";
            } else if (trimmedLastName.length > MAX.lastName) {
                newErrors.lastName = `Máximo ${MAX.lastName} caracteres`;
            }
        }

        if (touched.secondLastName || errors.secondLastName) {
            if (formData.secondLastName && formData.secondLastName.trim().length > MAX.secondLastName) {
                newErrors.secondLastName = `Máximo ${MAX.secondLastName} caracteres`;
            }
        }

        if (touched.email || errors.email) {
            if (!trimmedEmail) {
                newErrors.email = "El correo electrónico es obligatorio";
            } else if (trimmedEmail.length > MAX.email) {
                newErrors.email = `Máximo ${MAX.email} caracteres`;
            } else if (!emailRegex.test(trimmedEmail)) {
                newErrors.email = "Correo inválido (ej. nombre@dominio.com)";
            }
        }

        if (touched.phone || errors.phone) {
            if (!formData.phone) {
                newErrors.phone = "El teléfono es obligatorio";
            } else if (formData.phone.length !== MAX.phone) {
                newErrors.phone = `El teléfono debe tener ${MAX.phone} dígitos`;
            }
        }

        if (touched.roles || errors.roles) {
            if (!formData.roles.length) {
                newErrors.roles = "Debe seleccionar al menos un rol";
            }
        }

        setErrors(newErrors);
    }, [formData, touched]);

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

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            let v = value ?? "";

            if (name === "firstName" || name === "lastName" || name === "secondLastName") {
                v = v.replace(/\s{2,}/g, " ");
                const max = MAX[name] ?? 50;
                v = v.slice(0, max);
            }

            if (name === "email") {
                v = v.replace(/\s+/g, "").toLowerCase();
                v = v.slice(0, MAX.email);
            }

            return { ...prev, [name]: v };
        });
    };

    const handleRoleChange = (e) => {
        const { value } = e.target;
        if (value.length <= 2) {
            setFormData(prev => ({ ...prev, roles: value }));
            setTouched(prev => ({ ...prev, roles: true }));
        }
    };

    const extractRPE = (email) => (email || "").split('@')[0] || '';
    const generatePassword = (firstName) => `${(firstName || "").trim().split(" ")[0].toLowerCase()}12345678`;

    const handlePhoneChange = (e) => {
        const digits = getDigitsOnly(e.target.value);
        setFormData((prev) => ({ ...prev, phone: digits }));
        setTouched(prev => ({ ...prev, phone: true }));
    };


    const validateTemporalForm = useCallback(() => {
        const newErrors = {};

        if (!formData.expirationDateTime) {
            newErrors.expirationDateTime = "La fecha y hora de expiración es obligatoria";
        } else {
            const selectedDate = new Date(formData.expirationDateTime);
            const now = new Date();

            if (selectedDate <= now) {
                newErrors.expirationDateTime = "La fecha debe ser futura";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData.expirationDateTime]);

    const validateForm = useCallback(() => {
        const newErrors = {};
        const trimmedFirstName = formData.firstName.trim();
        const trimmedLastName = formData.lastName.trim();
        const trimmedEmail = formData.email.trim();

        if (!trimmedFirstName) newErrors.firstName = "El nombre es obligatorio";
        else if (trimmedFirstName.length > MAX.firstName) newErrors.firstName = `Máximo ${MAX.firstName} caracteres`;

        if (!trimmedLastName) newErrors.lastName = "El apellido paterno es obligatorio";
        else if (trimmedLastName.length > MAX.lastName) newErrors.lastName = `Máximo ${MAX.lastName} caracteres`;

        if (formData.secondLastName && formData.secondLastName.trim().length > MAX.secondLastName) {
            newErrors.secondLastName = `Máximo ${MAX.secondLastName} caracteres`;
        }

        if (!trimmedEmail) newErrors.email = "El correo electrónico es obligatorio";
        else if (trimmedEmail.length > MAX.email) newErrors.email = `Máximo ${MAX.email} caracteres`;
        else if (!emailRegex.test(trimmedEmail)) newErrors.email = "Correo inválido (ej. nombre@dominio.com)";

        if (!formData.phone) newErrors.phone = "El teléfono es obligatorio";
        else if (formData.phone.length !== MAX.phone) newErrors.phone = `El teléfono debe tener ${MAX.phone} dígitos`;

        if (!formData.roles.length) newErrors.roles = "Debe seleccionar al menos un rol";

        // Marcar todos los campos como tocados para mostrar todos los errores
        const allFields = ['firstName', 'lastName', 'email', 'phone', 'roles'];
        setTouched(prev => {
            const newTouched = { ...prev };
            allFields.forEach(field => {
                newTouched[field] = true;
            });
            return newTouched;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const transformUserDataForAPI = (data) => {
        const rolesTransformed = transformRoles(data.roles, rolesList);

        const payload = {
            nombre: data.firstName.trim(),
            apellidoPat: data.lastName.trim(),
            apellidoMat: data.secondLastName?.trim() || null,
            correo: data.email.trim(),
            telefono: data.phone,
            gradoAcademico: data.academicDegree || null,
            RPE: extractRPE(data.email),
            pass: generatePassword(data.firstName),
            roles: rolesTransformed,
            expirationDateTime: data.expirationDateTime || null,
        };

        if (data.supervisor) {
            payload.supervisor = data.supervisor;
        }

        return payload;
    };

    const saveUser = async (data) => {
        const url = isEdit ? `${API_URL}/usuarios/${editingUser.id}` : `${API_URL}/usuarios`;
        const method = isEdit ? "put" : "post";

        try {
            const response = await axios({
                method,
                url,
                data,
                headers: { "Content-Type": "application/json" }
            });
            return response.data;
        } catch (error) {
            // Re-lanzar el error para que lo capturen las funciones superiores
            throw error;
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            showSnackbar("error", "Error de validación", "Por favor, complete todos los campos obligatorios correctamente.");
            return;
        }

        if (isEdit) {
            setOpenConfirmEdit(true);
            return;
        }

        setSaving(true);
        try {
            const payload = transformUserDataForAPI(formData);
            const usuarioGuardado = await saveUser(payload);
            onSubmit(usuarioGuardado);
            onClose();
        } catch (error) {
            // Capturar errores de validación de Laravel
            if (error.response && error.response.status === 422) {
                const backendErrors = error.response.data.errors;

                // Mapear errores del backend a los campos del frontend
                const newErrors = {};

                if (backendErrors.correo) {
                    newErrors.email = backendErrors.correo[0]; // Tomar el primer mensaje de error
                }

                if (backendErrors.RPE) {
                    newErrors.email = newErrors.email
                        ? `${newErrors.email}. ${backendErrors.RPE[0]}`
                        : backendErrors.RPE[0];
                }

                // Actualizar otros campos si es necesario
                if (backendErrors.nombre) {
                    newErrors.firstName = backendErrors.nombre[0];
                }

                if (backendErrors.apellidoPat) {
                    newErrors.lastName = backendErrors.apellidoPat[0];
                }

                if (backendErrors.telefono) {
                    newErrors.phone = backendErrors.telefono[0];
                }

                if (backendErrors.roles) {
                    newErrors.roles = backendErrors.roles[0];
                }

                setErrors(newErrors);

                // Marcar los campos con error como "touched" para mostrar los errores
                const errorFields = Object.keys(newErrors);
                const newTouched = { ...touched };
                errorFields.forEach(field => {
                    newTouched[field] = true;
                });
                setTouched(newTouched);

                showSnackbar("error", "Error", "Ese correo ya esta en uso.");
            } else {
                showSnackbar("error", "Error", error?.response?.data?.message || error.message || "No se pudo guardar el usuario.");
            }
        } finally {
            setSaving(false);
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
            // Mismo manejo de errores que en handleSubmit
            if (error.response && error.response.status === 422) {
                const backendErrors = error.response.data.errors;

                const newErrors = {};

                if (backendErrors.correo) {
                    newErrors.email = backendErrors.correo[0];
                }

                if (backendErrors.RPE) {
                    newErrors.email = newErrors.email
                        ? `${newErrors.email}. ${backendErrors.RPE[0]}`
                        : backendErrors.RPE[0];
                }

                // Actualizar otros campos según sea necesario
                if (backendErrors.nombre) {
                    newErrors.firstName = backendErrors.nombre[0];
                }

                if (backendErrors.apellidoPat) {
                    newErrors.lastName = backendErrors.apellidoPat[0];
                }

                setErrors(newErrors);

                const errorFields = Object.keys(newErrors);
                const newTouched = { ...touched };
                errorFields.forEach(field => {
                    newTouched[field] = true;
                });
                setTouched(newTouched);

                setOpenConfirmEdit(false); // Cerrar el diálogo de confirmación
                showSnackbar("error", "Error de validación", "Por favor, corrija los errores en el formulario.");
            } else {
                showSnackbar("error", "Error", error?.response?.data?.message || error.message || "No se pudo guardar el usuario.");
            }
        }
    };

    const generarToken = async () => {
        // Validar formulario temporal
        if (!validateTemporalForm()) {
            showSnackbar("error", "Error de validación", "Por favor, complete la fecha y hora correctamente.");
            return;
        }

        setGeneratingToken(true); // Activar loading
        try {
            const res = await fetch(`${API_URL}/generar-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ expirationDateTime: formData.expirationDateTime }),
            });

            const data = await res.json();

            if (res.ok) {
                onTokenCreated && onTokenCreated();
                onClose(); // Cerrar el diálogo después de generar
            } else {
                showSnackbar("error", "Error", data.message || "No se pudo generar el token.");
            }
        } catch (e) {
            showSnackbar("error", "Error", e?.message || "No se pudo generar el token.");
        } finally {
            setGeneratingToken(false); // Desactivar loading
        }
    };

    // Efecto para limpiar errores cuando cambia la pestaña
    useEffect(() => {
        if (open) {
            setErrors({});
        }
    }, [tab, open]);

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
                                onBlur={() => handleBlur('roles')}
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

                        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 600, color: "text.primary" }}>
                            Información personal
                        </Typography>
                        <CountTextField
                            label="Nombre(s)"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            onBlur={() => handleBlur('firstName')}
                            max={MAX.firstName}
                            errorText={errors.firstName}
                        />
                        <CountTextField
                            label="Apellido Paterno"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            onBlur={() => handleBlur('lastName')}
                            max={MAX.lastName}
                            errorText={errors.lastName}
                        />
                        <CountTextField
                            label="Apellido Materno"
                            name="secondLastName"
                            value={formData.secondLastName}
                            onChange={handleChange}
                            onBlur={() => handleBlur('secondLastName')}
                            max={MAX.secondLastName}
                            errorText={errors.secondLastName}
                        />
                        <CountTextField
                            label="Correo Electrónico"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={() => handleBlur('email')}
                            max={MAX.email}
                            errorText={errors.email}
                        />
                        <PhoneTextField
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            onBlur={() => handleBlur('phone')}
                            errorText={errors.phone}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="grado-label">Grado Académico</InputLabel>
                            <Select labelId="grado-label" name="academicDegree" value={formData.academicDegree} onChange={handleChange} label="Grado Académico">
                                <MenuItem value="Licenciatura">Licenciatura</MenuItem>
                                <MenuItem value="Maestría">Maestría</MenuItem>
                                <MenuItem value="Doctorado">Doctorado</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                ) : (
                    <>
                        <TextField
                            label="Fecha y Hora de Expiración"
                            name="expirationDateTime"
                            type="datetime-local"
                            value={formData.expirationDateTime}
                            onChange={handleChange}
                            onBlur={() => handleBlur('expirationDateTime')}
                            fullWidth
                            margin="dense"
                            InputLabelProps={{ shrink: true }}
                            error={Boolean(errors.expirationDateTime)}
                            helperText={errors.expirationDateTime}
                            inputProps={{
                                min: new Date().toISOString().slice(0, 16) // ← Limitar a fechas futuras
                            }}
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
                        disabled={saving}
                    >
                        {(isEdit ? "Actualizar Usuario" : "Guardar")}
                    </CustomButton>
                ) : (
                    <CustomButton
                        type="guardar"
                        onClick={generarToken}
                        disabled={generatingToken}
                        loading={generatingToken}
                    >
                        {"Generar Token"}
                    </CustomButton>
                )}
            </DialogActions>

            <ConfirmEdit
                open={openConfirmEdit}
                onClose={() => setOpenConfirmEdit(false)}
                entityType="usuario"
                entityName={`${formData.firstName} ${formData.lastName}`.trim()}
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