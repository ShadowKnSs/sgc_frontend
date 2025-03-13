import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Tabs, Tab, TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

const rolesOptions = ["Administrador", "Líder de Proceso", "Coordinador", "Supervisor", "Auditor Interno"];
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
    const [photoPreview, setPhotoPreview] = useState(null);

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
        if (value.length > 2) return; // Limitar a un máximo de 2 roles
        setFormData({ ...formData, roles: value });
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
            setFormData({
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
            }); // Limpiar el formulario
        }
    };
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, photo: file });
        
        // Vista previa de la foto
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };
    const handleTabChange = (event, newValue) => {
        setTab(newValue);
        if (newValue === 0) {
            // Limpiar fecha cuando se cambia a "Usuario Normal"
            setFormData(prevData => ({
                ...prevData,
                expirationDateTime: ""
            }));
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
                                {academicDegrees.map((degree) => (
                                    <MenuItem key={degree} value={degree}>
                                        {degree}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="dense" error={Boolean(errors.roles)}>
                            <InputLabel>Roles (Máximo 2)</InputLabel>
                            <Select
                                name="roles"
                                multiple
                                value={formData.roles}
                                onChange={handleRoleChange}
                                renderValue={(selected) => selected.join(", ")}
                            >
                                {rolesOptions.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.roles && <FormHelperText>{errors.roles}</FormHelperText>}
                        </FormControl>
                        <Button variant="contained" component="label" color="primary" style={{ marginTop: 16 }}>
                            Subir Foto
                            <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
                        </Button>
                        {photoPreview && <img src={photoPreview} alt="Vista previa" style={{ width: 100, height: 100, marginTop: 16 }} />}
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
                        <Button variant="contained" color="primary" onClick={generateToken} style={{ marginTop: 16 }}>
                            Generar Token
                        </Button>
                        {formData.tempToken && (
                            <TextField label="Token Generado" value={formData.tempToken} fullWidth margin="dense" disabled />
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                {tab === 0 && (
                    <>
                        <Button onClick={onClose} color="secondary">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            color="primary"
                            disabled={Boolean(errors.firstName || errors.lastName || errors.email || errors.phone || errors.roles)}
                        >
                            Guardar
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}

export default UserForm;
