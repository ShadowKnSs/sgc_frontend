import React, { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, 
  InputLabel, Select, MenuItem, Button, Tabs, Tab, FormHelperText, CircularProgress 
} from "@mui/material";
import ConfirmEdit from "./confirmEdit";
import axios from "axios";

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

  // Al abrir el dialogo se carga la lista de roles y se inicializa el formulario
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

  // Carga supervisores si se selecciona el rol "Líder"
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
  }, [formData.roles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    // Limita el número de roles seleccionados a 2, modifica según sea necesario.
    if (value.length <= 2) {
      setFormData({ ...formData, roles: value });
    }
  };

  const handleSubmit = () => {
    const datosAPI = transformUserDataForAPI(formData);
    console.log("Datos enviados a la API:", datosAPI);
    if (editingUser) {
      setOpenConfirmEdit(true); // Mostrar confirmación antes de actualizar
    } else {
      onSubmit(datosAPI);
    }
  };
  
  const handleConfirmEdit = () => {
    const datosAPI = transformUserDataForAPI(formData);
    console.log("Datos enviados a la API (editar):", datosAPI);
    onSubmit(datosAPI);
    setOpenConfirmEdit(false);
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
              <InputLabel>
                Roles {loadingRoles && "(Cargando...)"}
              </InputLabel>
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
                    supervisores.map((sup) => (
                      <MenuItem key={sup.idUsuario} value={sup.idUsuario}>
                        {`${sup.nombre} ${sup.apellidoPat} ${sup.apellidoMat}`}
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
