/**
 * Vista: PrincipalReportSem
 * Descripción:
 * Muestra un listado de todos los reportes semestrales generados, permitiendo crear nuevos
 * reportes desde un modal. Al generar uno nuevo, se verifica su existencia, se recolectan datos
 * de varios endpoints y se redirige al usuario a la vista de edición previa del reporte.

 * Funcionalidades clave:
 * - Renderiza una cuadrícula de `ReporteSemCard` para visualizar reportes existentes.
 * - Permite filtrar reportes mediante el componente lateral `SearchFilter`.
 * - Contiene un formulario emergente (modal) para crear un nuevo reporte seleccionando año y periodo.
 * - Verifica si ya existe un reporte para el año y periodo antes de redirigir.
 * - Recolecta datos de riesgos, indicadores, acciones, auditorías y seguimiento al crear un nuevo reporte.
 * - Muestra notificaciones (`Snackbar`) cuando hay errores o advertencias.

 * Navegación:
 * - Al generar un nuevo reporte exitosamente, se redirige a `/reporteSemestral` con los datos recolectados.

 * Estado local:
 * - `reportes`: Lista de reportes semestrales existentes.
 * - `year`, `period`: Año y período seleccionados por el usuario.
 * - `open`, `openSnackbar`, `searchOpen`: Controlan la visibilidad del modal, snackbar y filtro lateral.
 * - `messageSnackbar`: Mensaje para mostrar en el `Snackbar`.

 * Endpoints utilizados:
 * - `GET /api/reportes-semestrales` → lista de todos los reportes semestrales.
 * - `GET /api/verificar-reporte?anio=&periodo=` → verifica si ya existe un reporte para los valores dados.
 * - `GET /api/get-riesgos-sem?anio=&periodo=`
 * - `GET /api/get-indicador-sem?anio=&periodo=`
 * - `GET /api/get-acciones-sem?anio=&periodo=`
 * - `GET /api/get-auditorias-sem?anio=&periodo=`
 * - `GET /api/get-seguimiento-sem?anio=&periodo=`

 * Componentes personalizados:
 * - `Title`: Encabezado estilizado.
 * - `ReporteSemCard`: Card para representar un reporte semestral.
 * - `SearchFilter`: Componente lateral para filtrar resultados por búsqueda.
 */

import React, { useState, useEffect } from "react";
import { Box, Modal, TextField, MenuItem, Button, Grid, Snackbar, IconButton, Tooltip } from "@mui/material";
import FabCustom from "../components/FabCustom";
import Add from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";
import ReporteSemCard from "../components/componentsReportSem/CardReportSem";
import SearchFilter from "../components/SearchFilter";

const PrincipalReportSem = () => {
    const [open, setOpen] = useState(false);
    const [year, setYear] = useState("");
    const [period, setPeriod] = useState("");
    const [reportes, setReportes] = useState([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [messageSnackbar, setMessageSnackbar] = useState("");

    const navigate = useNavigate();

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

    const toggleSearch = () => {
        setSearchOpen(!searchOpen);
    };

    const handleClick = async () => {
        if (!year || !period) {
            console.warn("⚠️ Por favor ingresa el año y el periodo.");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/verificar-reporte?anio=${year}&periodo=${period}`);
            const data = await response.json();

            if (data.exists) {
                setMessageSnackbar("❌ Error: El reporte ya existe.");
                setOpenSnackbar(true);
                return;
            }

            await fetchData(year, period);
        } catch (error) {
            console.error("🚨 Error en la verificación del reporte:", error);
        }

        handleCloseForm();
    };

    const fetchData = async (anio, periodo) => {
        try {
            const urls = [
                `http://127.0.0.1:8000/api/get-riesgos-sem?anio=${anio}&periodo=${periodo}`,
                `http://127.0.0.1:8000/api/get-indicador-sem?anio=${anio}&periodo=${periodo}`,
                `http://127.0.0.1:8000/api/get-acciones-sem?anio=${anio}&periodo=${periodo}`,
                `http://127.0.0.1:8000/api/get-auditorias-sem?anio=${anio}&periodo=${periodo}`,
                `http://127.0.0.1:8000/api/get-seguimiento-sem?anio=${anio}&periodo=${periodo}`,
            ];

            const responses = await Promise.all(urls.map(url => fetch(url)));
            const results = await Promise.all(responses.map(res => res.json()));

            const nombresListas = ["Riesgos", "Indicadores", "AccionesMejora", "Auditorías", "Seguimiento"];

            let hayDatos = false;
            results.forEach((lista, index) => {
                if (lista.length > 0) {
                    console.log(`📌 Hay datos en la lista: ${nombresListas[index]}`);
                    hayDatos = true;
                }
            });

            if (!hayDatos) {
                setMessageSnackbar("⚠️ No hay datos para ese año y periodo.");
                setOpenSnackbar(true);
                return;
            }

            navigate("/reporteSemestral", { state: { data: results, periodo, anio } });

        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            {/* Componente SearchFilter */}
            <SearchFilter
                open={searchOpen}
                onClose={toggleSearch}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <Box sx={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* Título */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 5, mb: 5 }}>
                    <Title text="Reportes Semestrales" sx={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold" }} />
                </Box>

                {/* Grid de cards */}
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

                {/* Botón flotante de búsqueda */}
                <Box sx={{ position: "fixed", bottom: 90, right: 16 }}>
                    <Tooltip title="Buscar Reportes">
                        <IconButton
                            onClick={toggleSearch}
                            sx={{
                                backgroundColor: "#004A98",
                                color: "white",
                                "&:hover": { backgroundColor: "#003366" },
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                                boxShadow: 3
                            }}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Botón flotante para agregar */}
                <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
                    <FabCustom
                        onClick={handleOpenForm}
                        title="Agregar Reporte"
                        icon={<Add />}
                    />
                </Box>

                {/* Modal para generar reporte */}
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
                    }}>
                        <h2 id="modal-title" style={{ color: "#004A98", textAlign: "center", fontSize: "28px" }}>
                            Generar Reporte Semestral
                        </h2>

                        <TextField
                            label="Año"
                            type="number"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />

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

                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <Button
                                onClick={handleCloseForm}
                                sx={{ backgroundColor: "#004A98", color: "white", "&:hover": { backgroundColor: "#003366" }, borderRadius: "30px", padding: "8px 16px" }}
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

                {/* Snackbar */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    message={messageSnackbar}
                />
            </Box>
        </Box>
    );
};

export default PrincipalReportSem;

