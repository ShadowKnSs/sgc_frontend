import React, { useState } from "react";
import { Box, Grid, Typography, TextField, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AddAsistente from "../components/Forms/AddAsistente";
import AddActividad from "../components/Forms/AddActividad";
import AddCompromiso from "../components/Forms/AddCompromiso"; // Importa el formulario de compromiso

function FormularioSeguimiento() {
    const [formData, setFormData] = useState({
        lugar: "",
        fecha: "",
        duracion: "",
    });

    // Estado para los datos de los asistentes, actividades y compromisos
    const [asistentes, setAsistentes] = useState([]);
    const [actividades, setActividades] = useState([]);
    const [compromisos, setCompromisos] = useState([]); // Estado para los compromisos

    // Estado para controlar la visibilidad de los formularios
    const [showAddAsistenteForm, setShowAddAsistenteForm] = useState(false);
    const [showAddActividadForm, setShowAddActividadForm] = useState(false);
    const [showAddCompromisoForm, setShowAddCompromisoForm] = useState(false); // Estado para el formulario de compromiso

    // Estado para los datos de los formularios
    const [asistenteData, setAsistenteData] = useState({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
    });

    const [actividadData, setActividadData] = useState({
        actividad: "",
        responsable: "",
        fecha: "",
    });

    const [compromisoData, setCompromisoData] = useState({
        compromiso: "",
        responsable: "",
        fecha: "",
    });

    // Manejo de cambios en los campos de texto
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "nombre" || name === "apellidoPaterno" || name === "apellidoMaterno") {
            setAsistenteData({
                ...asistenteData,
                [name]: value,
            });
        } else if (name === "actividad" || name === "responsable" || name === "fecha") {
            setActividadData({
                ...actividadData,
                [name]: value,
            });
        } else if (name === "compromiso" || name === "responsable" || name === "fecha") {
            setCompromisoData({
                ...compromisoData,
                [name]: value,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    // Manejo de agregar asistente
    const handleAddAsistente = () => {
        setAsistentes([...asistentes, asistenteData]);
        setAsistenteData({
            nombre: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
        });
        setShowAddAsistenteForm(false);
    };

    // Manejo de agregar actividad
    const handleAddActividad = () => {
        setActividades([...actividades, actividadData]);
        setActividadData({
            actividad: "",
            responsable: "",
            fecha: "",
        });
        setShowAddActividadForm(false);
    };

    // Manejo de agregar compromiso
    const handleAddCompromiso = () => {
        setCompromisos([...compromisos, compromisoData]);
        setCompromisoData({
            compromiso: "",
            responsable: "",
            fecha: "",
        });
        setShowAddCompromisoForm(false);
    };

    // Cancelar y cerrar los formularios
    const handleCancel = () => {
        setShowAddAsistenteForm(false);
        setShowAddActividadForm(false);
        setShowAddCompromisoForm(false); // Cerrar formulario de compromiso
    };

    return (
        <Box sx={{ p: 4, display: "flex", flexDirection: "column", height: "100vh" }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Formulario de Seguimiento
            </Typography>

            <Grid container spacing={3}>
                {/* Fila superior con 2 cuadros */}
                <Grid item xs={12} sm={6}>
                    <Box
                        sx={{
                            height: "200px",
                            border: "1px solid #ccc",
                            padding: 2,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            backgroundColor: "#f7f7f7",
                            borderRadius: "4px",
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Asistentes
                            </Typography>
                            <AddIcon
                                sx={{ position: "absolute", right: 10, top: 10, cursor: "pointer" }}
                                onClick={() => setShowAddAsistenteForm(true)}
                            />
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Box
                        sx={{
                            height: "200px",
                            border: "1px solid #ccc",
                            padding: 2,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            backgroundColor: "#f7f7f7",
                            borderRadius: "4px",
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Actividades Realizadas
                            </Typography>
                            <AddIcon
                                sx={{ position: "absolute", right: 10, top: 10, cursor: "pointer" }}
                                onClick={() => setShowAddActividadForm(true)}
                            />
                        </Box>
                    </Box>
                </Grid>

                {/* Fila inferior con 3 cuadros */}
                <Grid item xs={12} sm={6}>
                    <Box
                        sx={{
                            height: "200px",
                            border: "1px solid #ccc",
                            padding: 2,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            backgroundColor: "#f7f7f7",
                            borderRadius: "4px",
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Lugar"
                            name="lugar"
                            value={formData.lugar}
                            onChange={handleChange}
                            sx={{ marginBottom: 2, backgroundColor: "white", borderRadius: "4px" }}
                        />
                        <TextField
                            fullWidth
                            label="Fecha"
                            name="fecha"
                            type="date"
                            value={formData.fecha}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ marginBottom: 2, backgroundColor: "white", borderRadius: "4px" }}
                        />
                        <TextField
                            fullWidth
                            label="Duración"
                            name="duracion"
                            value={formData.duracion}
                            onChange={handleChange}
                            sx={{ marginBottom: 2, backgroundColor: "white", borderRadius: "4px" }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box
                        sx={{
                            height: "200px",
                            border: "1px solid #ccc",
                            padding: 2,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            backgroundColor: "#f7f7f7",
                            borderRadius: "4px",
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Compromisos
                            </Typography>
                            <AddIcon
                                sx={{ position: "absolute", right: 10, top: 10, cursor: "pointer" }}
                                onClick={() => setShowAddCompromisoForm(true)} // Mostrar formulario de compromiso
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Formulario de Agregar Asistente */}
            <AddAsistente
                showForm={showAddAsistenteForm}
                handleCancel={handleCancel}
                handleAdd={handleAddAsistente}
                asistenteData={asistenteData}
                handleChange={handleChange}
            />

            {/* Formulario de Agregar Actividad */}
            <AddActividad
                showForm={showAddActividadForm}
                handleCancel={handleCancel}
                handleAdd={handleAddActividad}
                actividadData={actividadData}
                handleChange={handleChange}
            />

            {/* Formulario de Agregar Compromiso */}
            <AddCompromiso
                showForm={showAddCompromisoForm}
                handleCancel={handleCancel}
                handleAdd={handleAddCompromiso}
                compromisoData={compromisoData}
                handleChange={handleChange}
            />

            {/* Botones al final alineados a la derecha */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <Button 
                    variant="contained" 
                    sx={{ backgroundColor: "#1976d2", color: "white", mr: 2 }}
                >
                    Guardar
                </Button>
                <Button 
                    variant="contained" 
                    sx={{ backgroundColor: "#f39c12", color: "white" }}
                >
                    Generar Reporte
                </Button>
            </Box>
        </Box>
    );
}

export default FormularioSeguimiento;
