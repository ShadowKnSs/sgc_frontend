import React, { useState } from "react";
import { Box, Grid, Typography, TextField, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AddAsistente from "../components/Forms/AddAsistente";
import AddActividad from "../components/Forms/AddActividad";
import AddCompromiso from "../components/Forms/AddCompromiso";
import Registro from "../components/cardSeg";

function FormularioSeguimiento() {
    const [formData, setFormData] = useState({
        lugar: "",
        fecha: "",
        duracion: "",
    });

    const [asistentes, setAsistentes] = useState([]);
    const [actividades, setActividades] = useState([]);
    const [compromisos, setCompromisos] = useState([]);

    const [showAddAsistenteForm, setShowAddAsistenteForm] = useState(false);
    const [showAddActividadForm, setShowAddActividadForm] = useState(false);
    const [showAddCompromisoForm, setShowAddCompromisoForm] = useState(false);

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

    const handleAddAsistente = () => {
        setAsistentes([...asistentes, asistenteData]);
        setAsistenteData({
            nombre: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
        });
        setShowAddAsistenteForm(false);
    };

    const handleAddActividad = () => {
        setActividades([...actividades, actividadData]);
        setActividadData({
            actividad: "",
            responsable: "",
            fecha: "",
        });
        setShowAddActividadForm(false);
    };

    const handleAddCompromiso = () => {
        setCompromisos([...compromisos, compromisoData]);
        setCompromisoData({
            compromiso: "",
            responsable: "",
            fecha: "",
        });
        setShowAddCompromisoForm(false);
    };

    const handleCancel = () => {
        setShowAddAsistenteForm(false);
        setShowAddActividadForm(false);
        setShowAddCompromisoForm(false); 
    };

    return (
        <Box sx={{ p: 4, display: "flex", flexDirection: "column", height: "100vh" }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Formulario de Seguimiento
            </Typography>

            <Grid container spacing={3}>
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
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", width: "100%", position: "relative", paddingTop: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
                                    Asistentes
                                </Typography>
                                <AddIcon
                                    sx={{ cursor: "pointer", position: "absolute", right: 0, top: 0 }}
                                    onClick={() => setShowAddAsistenteForm(true)}
                                />
                            </Box>

                            <Registro texto="Torres Gonzáles Paola Diana" />
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
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", width: "100%", position: "relative", paddingTop: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
                                    Actividades Realizadas
                                </Typography>
                                <AddIcon
                                    sx={{ cursor: "pointer", position: "absolute", right: 0, top: 0 }}
                                    onClick={() => setShowAddActividadForm(true)}
                                />
                            </Box>

                            <Registro texto="Actividad 1" />
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
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", width: "100%", position: "relative", paddingTop: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
                                    Compromisos
                                </Typography>
                                <AddIcon
                                    sx={{ cursor: "pointer", position: "absolute", right: 0, top: 0 }}
                                    onClick={() => setShowAddCompromisoForm(true)}
                                />
                            </Box>

                            <Registro texto="Compromiso 1" />
                            
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <AddAsistente
                showForm={showAddAsistenteForm}
                handleCancel={handleCancel}
                handleAdd={handleAddAsistente}
                asistenteData={asistenteData}
                handleChange={handleChange}
            />

            <AddActividad
                showForm={showAddActividadForm}
                handleCancel={handleCancel}
                handleAdd={handleAddActividad}
                actividadData={actividadData}
                handleChange={handleChange}
            />

            <AddCompromiso
                showForm={showAddCompromisoForm}
                handleCancel={handleCancel}
                handleAdd={handleAddCompromiso}
                compromisoData={compromisoData}
                handleChange={handleChange}
            />

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
