import React, { useState, useEffect } from "react";
import { Box, Fab, Modal, TextField, MenuItem, Button, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";
import ReporteSemCard from "../components/componentsReportSem/CardReportSem";
import SearchFilter from "../components/SearchFilter"; // Asegúrate de importar el componente
import { Snackbar } from '@mui/material';

const PrincipalReportSem = () => {
    const [open, setOpen] = useState(false);
    const [year, setYear] = useState("");
    const [period, setPeriod] = useState("");
    const navigate = useNavigate();
    const [reportes, setReportes] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [messageSnackbar, setMessageSnackbar] = useState("");

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    useEffect(() => {
        fetchReportes();
    }, []);

    const fetchReportes = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/reportes-semestrales");
            if (!response.ok) throw new Error("Error al obtener los reportes");
            const data = await response.json();
            setReportes(data);
        } catch (error) {
            console.error("❌ Error al cargar reportes:", error);
        }
    };

    const handleOpenForm = () => setOpen(true);
    const handleCloseForm = () => {
        setOpen(false);
        setYear("");
        setPeriod("");
    };

    const fetchData = async (anio, periodo, navigate) => {
        try {
            // URLs de las 5 listas
            const urls = [
                `http://127.0.0.1:8000/api/get-riesgos-sem?anio=${anio}&periodo=${periodo}`,
                `http://127.0.0.1:8000/api/get-indicador-sem?anio=${anio}&periodo=${periodo}`,
                `http://127.0.0.1:8000/api/get-acciones-sem?anio=${anio}&periodo=${periodo}`,
                `http://127.0.0.1:8000/api/get-auditorias-sem?anio=${anio}&periodo=${periodo}`,
                `http://127.0.0.1:8000/api/get-seguimiento-sem?anio=${anio}&periodo=${periodo}`,
            ];

            // Hacer las 5 peticiones en paralelo
            const responses = await Promise.all(urls.map(url => fetch(url)));
            const results = await Promise.all(responses.map(res => res.json()));

            // Nombres de cada lista para imprimir en consola
            const nombresListas = ["Riesgos", "Indicadores", "Acciones de Mejora", "Auditorías", "Seguimiento"];

            // Verificar si alguna lista tiene datos
            let hayDatos = false;
            results.forEach((lista, index) => {
                if (lista.length > 0) {
                    console.log(`📌 Hay datos en la lista: ${nombresListas[index]}`);
                    hayDatos = true;
                }
            });

            if (!hayDatos) {
                console.log("No hay datos, mostrando el snack bar...");
                setMessageSnackbar("⚠️ No hay datos para ese año y periodo.");
                setOpenSnackbar(true); // Mostrar Snackbar si no hay datos
                return;
            } else {
                navigate("/reporteSemestral", { state: { data: results, periodo, anio } });
            }

    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return [];
    }
};

const PrincipalReportSem = () => {
    const [open, setOpen] = useState(false);
    const [year, setYear] = useState("");
    const [period, setPeriod] = useState("");
    const navigate = useNavigate();
    const [reportes, setReportes] = useState([]);
    // Nuevos estados para el SearchFilter
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchReportes();
    }, []);

    const fetchReportes = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/reportes-semestrales");
            if (!response.ok) throw new Error("Error al obtener los reportes");
            const data = await response.json();
            setReportes(data);
        } catch (error) {
            console.error("❌ Error al cargar reportes:", error);
        }
    };

    const handleOpenForm = () => setOpen(true);
    const handleCloseForm = () => {
        setOpen(false);
        setYear("");
        setPeriod("");
        
    };

    const handleClick = async () => {
        if (!year || !period) {
            console.log("⚠️ Por favor ingresa el año y el periodo.");
            return;
        }

        try {
            console.log(`🔍 Verificando si el reporte del ${year}, ${period} ya existe...`);

            // Verificar si el reporte ya existe
            const response = await fetch(`http://127.0.0.1:8000/api/verificar-reporte?anio=${year}&periodo=${period}`);
            const data = await response.json();

            if (data.exists) {
                setMessageSnackbar("❌ Error: El reporte ya existe.");
                setOpenSnackbar(true);
                return; // Detiene la ejecución si el reporte ya existe
            }

            console.log("✅ El reporte no existe. Procediendo a verificar datos...");

            // Si no existe, verificar si hay datos
            await fetchData(year, period, navigate);

        } catch (error) {
            console.error("🚨 Error en la verificación del reporte:", error);
        }

        handleCloseForm();
    };

    // Función para alternar el SearchFilter
    const toggleSearch = () => {
        setSearchOpen(!searchOpen);
    };


    return (
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            {/* Línea vertical a la izquierda - ahora clickeable */}
            <Box
                onClick={toggleSearch}
                sx={{
                    position: "absolute",
                    top: "60%",
                    left: "3%",
                    transform: "translateY(-50%)",
                    width: "5px",
                    height: "1.5cm",
                    bgcolor: "#D3D3D3",
                    borderRadius: "10px",
                    cursor: "pointer", // Cambia el cursor para indicar que es clickeable
                    "&:hover": {
                        bgcolor: "#004A98", // Cambia de color al pasar el mouse
                    },
                    transition: "background-color 0.3s", // Suaviza la transición de color
                }}
            />

            {/* Componente SearchFilter */}
            <SearchFilter 
                open={searchOpen}
                onClose={toggleSearch}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <Box sx={{
                position: "relative", 
                zIndex: 1, 
                width: "100%", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center"
            }}>
                {/* Título */}
                <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 5,  
                    mb: 5,
                }}>
                    <Title text="Reportes Semestrales" sx={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold" }} />
                </Box>

                {/* Contenedor de las cards */}
                <Grid container spacing={3} justifyContent="center">
                    {reportes.map((reporte) => (
                        <Grid item key={reporte.idReporteSemestral}>
                            <ReporteSemCard
                                anio={reporte.anio}
                                periodo={reporte.periodo}
                                fechaGeneracion={reporte.fechaGeneracion}
                                ubicacion={reporte.ubicacion}
                            />
                        </Grid>
                    ))}
                </Grid>

                {/* Botón flotante */}
                <Fab color="primary" aria-label="add" sx={{ position: "fixed", bottom: 20, right: 20 }} onClick={handleOpenForm}>
                    <AddIcon />
                </Fab>

                {/* Modal */}
                <Modal open={open} onClose={handleCloseForm} aria-labelledby="modal-title">
                    <Box sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "white",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <h2 id="modal-title" style={{ color: "#004A98", textAlign: "center", fontSize: "28px" }}>
                        Generar Reporte Semestral
                    </h2>

                        {/* Campo Año */}
                        <TextField
                            label="Año"
                            type="number"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />

                        {/* Campo Período */}
                        <TextField
                            select
                            label="Período"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                        >
                            <MenuItem value="01-06">Enero - Junio</MenuItem>
                            <MenuItem value="07-12">Julio - Diciembre</MenuItem>
                        </TextField>

                        {/* Botones */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <Button
                                onClick={handleCloseForm}
                                sx={{ backgroundColor: "#004A98", color: "white", "&:hover": { backgroundColor: "#003366" }, borderRadius: "30px", padding: "8px 16px"}}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleClick}
                                sx={{ backgroundColor: "#F9B800", color: "white", "&:hover": { backgroundColor: "#D99400" }, borderRadius: "30px", padding: "8px 16px" }}
                                disabled={!year || !period}
                            >
                                Generar
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
                    {/* Botones */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                        <Button
                            onClick={handleCloseForm}
                            sx={{
                                backgroundColor: "#004A98", color: "white", "&:hover": { backgroundColor: "#003366" }, borderRadius: "30px", // Redondear los bordes
                                padding: "8px 16px"
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleClick}
                            sx={{
                                backgroundColor: "#F9B800", color: "white", "&:hover": { backgroundColor: "#D99400" }, borderRadius: "30px", // Redondear los bordes
                                padding: "8px 16px"
                            }}
                            disabled={!year || !period}
                        >
                            Generar
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Snackbar
                            open={openSnackbar}
                            autoHideDuration={6000}  // Duración en milisegundos (6 segundos en este caso)
                            onClose={() => setOpenSnackbar(false)}  // Cerrar el snackbar cuando se termine
                            message={messageSnackbar}
                        />
        </Box>
    );
};

export default PrincipalReportSem;