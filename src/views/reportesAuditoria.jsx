/**
 * Vista: ReportesAuditoria
 * Descripción:
 * Esta vista permite al usuario visualizar, generar y eliminar reportes relacionados con auditorías internas.
 *
 * Funcionalidades:
 * - Visualiza una lista de reportes previamente generados.
 * - Muestra los detalles del reporte: entidad, líder, fecha.
 * - Permite generar un nuevo reporte seleccionando una auditoría existente.
 * - Integra un filtro lateral (`FiltroAuditoria`) para buscar entre reportes.
 * - Descarga el PDF de un reporte desde el backend.
 * - Elimina reportes con confirmación (`ConfirmDeleteDialog`).
 * 
 * Componentes clave:
 * - `ReportCard`: tarjeta visual con acciones para cada reporte.
 * - `FiltroAuditoria`: buscador lateral colapsable.
 * - `MensajeAlert`, `Title`, `ConfirmDeleteDialog`: soporte visual y funcional.
 * 
 * Endpoints utilizados:
 * - GET `/api/reportesauditoria` - Obtener todos los reportes de auditoría.
 * - GET `/api/auditorias` - Obtener todas las auditorías disponibles.
 * - POST `/api/reportesauditoria` - Generar nuevo reporte.
 * - DELETE `/api/reportesauditoria/{id}` - Eliminar un reporte existente.
 * - GET `/api/reporte-pdf/{idAuditorialInterna}` - Descargar PDF del reporte.
 */

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Modal, TextField, MenuItem, Typography, IconButton, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FabCustom from "../components/FabCustom";
import Add from "@mui/icons-material/Add";
import FiltroAuditoria from "../components/buscadorAuditoria"
import Title from "../components/Title";
import { CircularProgress } from "@mui/material";
import MensajeAlert from "../components/MensajeAlert";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";

const ReportesAuditoria = () => {
    const [reports, setReports] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [auditorias, setAuditorias] = useState([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState("");
    const [openConfirm, setOpenConfirm] = useState(false);
    const [idAEliminar, setIdAEliminar] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [alerta, setAlerta] = useState({ tipo: "", mensaje: "" });
    const [entidades, setEntidades] = useState([]);
    const [procesos, setProcesos] = useState([]);
    const [entidadSeleccionada, setEntidadSeleccionada] = useState("");
    const [procesoSeleccionado, setProcesoSeleccionado] = useState("");

    const navigate = useNavigate();

    const confirmarEliminacion = (id) => {
        setIdAEliminar(id);
        setOpenConfirm(true);
    };

    const fetchAuditorias = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/auditorias");
            setAuditorias(res.data);
        } catch (err) {
            console.error("Error al obtener auditorías:", err);
        }
    };

    const fetchReportes = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8000/api/reportesauditoria");
            const datos = res.data.map((r) => ({
                id: r.idReporte,
                idAuditorialInterna: r.idAuditorialInterna,
                title: "Auditoría Interna",
                date: new Date(r.fechaGeneracion).toLocaleDateString(),
            }));
            setReports(datos);
        } catch (err) {
            console.error("Error al obtener reportes:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEliminarReporte = async () => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8000/api/reportesauditoria/${idAEliminar}`);
            setReports(reports.filter(r => r.id !== idAEliminar));
            setOpenConfirm(false);
            setIdAEliminar(null);
            setAlerta({ tipo: "success", mensaje: "Reporte eliminado correctamente" });
        } catch (err) {
            console.error("Error al eliminar reporte:", err);
            alert("Error al eliminar el reporte");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerar = async () => {
        try {
            const auditoria = auditorias.find(a => a.idAuditorialInterna === fechaSeleccionada);
            if (!auditoria) return alert("Selecciona una auditoría válida");

            const payload = {
                idAuditorialInterna: auditoria.idAuditorialInterna,
                hallazgo: auditoria.verificacionRuta?.map(v => v.tipoHallazgo).join(', ') || "Sin hallazgos",
                oportunidadesMejora: auditoria.puntosMejora?.map(p => p.descripcion).join(', ') || "Sin oportunidades",
                cantidadAuditoria: 1, // o un conteo basado en algún criterio si tienes más datos
                ruta: `reporte_${auditoria.idAuditorialInterna}_${Date.now()}.pdf` // puedes modificar según necesites
            };

            const res = await axios.post("http://localhost:8000/api/reportesauditoria", payload);

            // Opcional: actualizar lista de reportes
            setReports([...reports, {
                id: res.data.idReporte, // asumimos que el backend devuelve el ID
                idAuditorialInterna: auditoria.idAuditorialInterna,
                title: "Auditoría Interna",
                date: new Date(auditoria.fecha).toLocaleDateString()
            }]);

            setOpenModal(false);
        } catch (err) {
            console.error("Error al generar reporte:", err);
            alert("Error al generar reporte");
        }
    };

    useEffect(() => {
        fetchReportes();
        const cargarAuditorias = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/auditorias");
                setAuditorias(res.data);
            } catch (err) {
                console.error("Error al cargar auditorías:", err);
            }
        };
        cargarAuditorias();
        if (openModal) {
            fetchAuditorias();
        }
    }, [openModal]);

    useEffect(() => {
        fetchReportes();
        const cargarDatos = async () => {
            try {
                const resEntidades = await axios.get("http://localhost:8000/api/entidades");
                setEntidades(resEntidades.data);

                const resAuditorias = await axios.get("http://localhost:8000/api/auditorias");
                setAuditorias(resAuditorias.data);
            } catch (err) {
                console.error("Error al cargar datos:", err);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    useEffect(() => {
        const cargarProcesos = async () => {
            if (!entidadSeleccionada) return;
            try {
                const resProcesos = await axios.get(`http://localhost:8000/api/procesos?entidad_id=${entidadSeleccionada}`);
                setProcesos(resProcesos.data);
            } catch (err) {
                console.error("Error al cargar procesos:", err);
            }
        };
        cargarProcesos();
    }, [entidadSeleccionada]);

    return (
        <Box sx={{ p: 1, textAlign: "center", display: "flex", flexDirection: "row", position: "relative" }}>
            {loading && (
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999
                }}>
                    <CircularProgress size={60} color="primary" />
                </Box>
            )}
            
            <FiltroAuditoria
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <Box sx={{ flex: 1, p: 4 }}>
                <Title text="Reportes Auditoría" />
                {alerta.mensaje && (
                    <MensajeAlert tipo={alerta.tipo} mensaje={alerta.mensaje} />
                )}
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(3, 1fr)"
                    gap={10}
                    justifyContent="center"
                    maxWidth={1000}
                    margin="auto"
                >
                    {reports.map((report) => (
                        <ReportCard key={report.id} report={report} onDelete={confirmarEliminacion} />
                    ))}
                </Box>

                <Box sx={{ position: "fixed", bottom: 90, right: 16 }}>
                    <Tooltip title="Buscar Reportes">
                        <IconButton
                            onClick={() => setSearchOpen(!searchOpen)}
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

                <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
                    <FabCustom
                        onClick={() => setOpenModal(true)} title="Agregar Reporte"
                        icon={<Add />}
                    />
                </Box>
                
                <Modal open={openModal} onClose={() => setOpenModal(false)}>
                    <Box sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        height: 350,
                        bgcolor: "white",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 3,
                    }}>
                        <h2 style={{ textAlign: "center", color: "#004A98" }}>Generar Reporte De Auditoría</h2>
                        <TextField fullWidth variant="outlined" label="Facultad/Entidad" margin="dense" disabled />
                        <TextField fullWidth variant="outlined" label="Proceso" margin="dense" disabled />
                        <TextField select fullWidth variant="outlined" label="Auditoría" margin="dense" value={fechaSeleccionada}
                            onChange={(e) => setFechaSeleccionada(e.target.value)}
                        >
                            {auditorias.map((aud) => (
                                <MenuItem key={aud.idAuditorialInterna} value={aud.idAuditorialInterna}>
                                    {new Date(aud.fecha).toLocaleDateString()}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <Button variant="contained" sx={{ backgroundColor: "#004A98", borderRadius: "50px" }} onClick={() => setOpenModal(false)}>Cancelar</Button>
                            <Button variant="contained" sx={{ backgroundColor: "#FFC107", borderRadius: "50px" }}
                                onClick={() => {
                                    setOpenModal(false);
                                    navigate(`/vista-previa/${fechaSeleccionada}`);
                                }}
                            >
                                Generar
                            </Button>
                        </Box>
                    </Box>
                </Modal>
                <ConfirmDeleteDialog
                    open={openConfirm}
                    onClose={() => setOpenConfirm(false)}
                    onConfirm={handleEliminarReporte}
                    titulo="¿Eliminar Reporte?"
                    subtitulo="Esta acción no se puede deshacer."
                />
            </Box>
        </Box>
    );
};

const ReportCard = ({ report, onDelete }) => {
    return (
        <Box
            sx={{
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: 320,
                minHeight: 160,
                borderLeft: "6px solid #004A98",
                transition: "transform 0.2s",
                "&:hover": {
                    transform: "translateY(-4px)"
                }
            }}
        >
            <Box sx={{ mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
                    {report.titulo || "Auditoría Interna"}
                </Typography>
                <Typography variant="body2">
                    <b>Entidad:</b> {report.entidad || "Sin entidad"}
                </Typography>
                <Typography variant="body2">
                    <b>Líder:</b> {report.lider || "Sin líder"}
                </Typography>
                <Typography variant="body2">
                    <b>Fecha:</b> {report.date}
                </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#004A98",
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: "bold",
                        "&:hover": {
                            backgroundColor: "#00336b"
                        }
                    }}
                    onClick={() => window.open(`http://localhost:8000/api/reporte-pdf/${report.idAuditorialInterna}`, '_blank')}
                >
                    Descargar
                </Button>

                <Button
                    variant="outlined"
                    sx={{
                        color: "#B00020",
                        borderColor: "#B00020",
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: "bold",
                        "&:hover": {
                            backgroundColor: "#fbe9e7"
                        }
                    }}
                    onClick={() => onDelete(report.id)}
                >
                    Eliminar
                </Button>
            </Box>
        </Box>
    );
};

export default ReportesAuditoria;