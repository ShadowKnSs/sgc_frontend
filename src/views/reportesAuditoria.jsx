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
import { CircularProgress, Grid } from "@mui/material";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import ReportView from "../components/ReportView";
import FeedbackSnackbar from "../components/Feedback";

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
    const [auditoriaSeleccionada, setAuditoriaSeleccionada] = useState("");
    const [loadingModal, setLoadingModal] = useState(false);
    const reporteExistente = reports.find(
      r => r.idAuditorialInterna === Number(fechaSeleccionada)
    );

    useEffect(() => {
      if (!fechaSeleccionada) return;

      if (reporteExistente) {
        setAlerta({ tipo: "warning", mensaje: "Ya existe un reporte para esta auditoría" });
      } else {
        setAlerta({ tipo: "", mensaje: "" });
      }
    }, [fechaSeleccionada, reports]);

    const navigate = useNavigate();

    const cargarDatosModal = async () => {
      try {
        const resEntidades = await axios.get("http://localhost:8000/api/entidades");
        setEntidades(resEntidades.data.entidades || []);

        const resAuditorias = await axios.get("http://localhost:8000/api/auditorias");
        setAuditorias(resAuditorias.data);
      } catch (err) {
        console.error("Error al cargar datos del modal:", err);
      } finally {
        setLoadingModal(false); // cuando termina la carga se apaga el loader
      }
    };

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
            entidad: r.auditoria?.registro?.proceso?.entidad?.nombreEntidad || "Sin entidad",
            proceso: r.auditoria?.registro?.proceso?.nombreProceso || "Sin proceso",
            lider: r.auditoria?.auditorLider || "Sin líder",
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

            setReports([...reports, {
                id: res.data.idReporte,
                idAuditorialInterna: auditoria.idAuditorialInterna,
                title: "Auditoría Interna",
                entidad: auditoria.registro?.proceso?.entidad?.nombre || "Sin entidad",
                lider: auditoria.auditorLider || "Sin líder",
                date: new Date(auditoria.fecha).toLocaleDateString()
            }]);

            setAlerta({ tipo: "success", mensaje: "Reporte generado correctamente" });

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
                setEntidades(resEntidades.data.entidades || []);
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
      if (!entidadSeleccionada) {
        setProcesos([]);
        setProcesoSeleccionado("");
        return;
      }

      const procesosFiltrados = auditorias
        .filter(aud => aud.registro?.proceso?.idEntidad === Number(entidadSeleccionada))
        .map(aud => aud.registro.proceso)
        .filter((proc, i, arr) => arr.findIndex(p => p.idProceso === proc.idProceso) === i); // sin duplicados

      setProcesos(procesosFiltrados);
      setProcesoSeleccionado("");
    }, [entidadSeleccionada, auditorias]);
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
            <Title text="Reportes de Auditoría" />

                <FeedbackSnackbar
                  open={!!alerta.mensaje}
                  onClose={() => setAlerta({ tipo: "", mensaje: "" })}
                  type={alerta.tipo}
                  title={alerta.tipo ? alerta.tipo.charAt(0).toUpperCase() + alerta.tipo.slice(1) : ""}
                  message={alerta.mensaje}
                />
                <Box sx={{ p: 3 }}>
                  {reports.length > 0 ? (
                    <Grid container spacing={5} justifyContent="center">
                      {reports.map((report) => (
                        <Grid
                          item
                          key={report.id}
                          xs={12}
                          sm={6}
                          md={3}
                        >
                          <ReportView
                            report={report}
                            onDelete={confirmarEliminacion}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography 
                      variant="h6" 
                      sx={{ textAlign: "center", mt: 4, color: "gray" }}
                    >
                      No hay reportes de auditoría generados
                    </Typography>
                  )}
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
                          onClick={() => {
                          setOpenModal(true);
                          setLoadingModal(true);
                          cargarDatosModal();
                        }} 
                        title="Agregar Reporte"
                        icon={<Add />}
                    />
                </Box>
                
                <Modal open={openModal} onClose={() => setOpenModal(false)}>
                  <Box
                    sx={{
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
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    {loadingModal ? (
                      <Box
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <CircularProgress size={50} color="primary" />
                        <Typography sx={{ mt: 2, color: "gray" }}>Cargando datos...</Typography>
                      </Box>
                    ) : (
                      <>
                      <h2 style={{ textAlign: "center", color: "#004A98" }}>Generar Reporte De Auditoría</h2>
                      {/* Entidad */}
                      <TextField
                        select
                        fullWidth
                        variant="outlined"
                        label="Facultad/Entidad"
                        margin="dense"
                        value={entidadSeleccionada}
                        onChange={(e) => {
                          setEntidadSeleccionada(e.target.value);
                          setProcesoSeleccionado(""); // reset proceso
                          setFechaSeleccionada("");   // reset auditoría
                        }}
                      >
                        {entidades.length > 0 ? (
                          entidades.map(ent => (
                            <MenuItem key={ent.idEntidadDependencia} value={String(ent.idEntidadDependencia)}>
                              {ent.nombreEntidad || "Sin nombre"}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No hay entidades</MenuItem>
                        )}
                      </TextField>

                      {/* Proceso */}
                      <TextField
                        select
                        fullWidth
                        variant="outlined"
                        label="Proceso"
                        margin="dense"
                        value={procesoSeleccionado}
                        onChange={(e) => {
                          setProcesoSeleccionado(e.target.value);
                          setFechaSeleccionada(""); // reset auditoría
                        }}
                        disabled={!entidadSeleccionada}
                      >
                        {procesos.length > 0 ? (
                          procesos.map(proc => (
                            <MenuItem key={proc.idProceso} value={String(proc.idProceso)}>
                              {proc.nombreProceso || "Sin nombre"}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No hay procesos</MenuItem>
                        )}
                      </TextField>

                      {/* Auditoría */}
                      <TextField
                        select
                        fullWidth
                        variant="outlined"
                        label="Auditoría"
                        margin="dense"
                        value={fechaSeleccionada}
                        onChange={(e) => setFechaSeleccionada(e.target.value)}
                        disabled={!procesoSeleccionado}
                      >
                        {auditorias.filter(aud => aud.registro?.proceso?.idProceso === Number(procesoSeleccionado)).length > 0 ? (
                          auditorias
                            .filter(aud => aud.registro?.proceso?.idProceso === Number(procesoSeleccionado))
                            .map(aud => (
                              <MenuItem key={aud.idAuditorialInterna} value={String(aud.idAuditorialInterna)}>
                                {new Date(aud.fecha).toLocaleDateString()}
                              </MenuItem>
                            ))
                        ) : (
                          <MenuItem disabled>No hay auditorías</MenuItem>
                        )}
                      </TextField>
                      {/* Botones */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "#004A98", borderRadius: "50px" }}
                          onClick={() => setOpenModal(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "#FFC107", borderRadius: "50px" }}
                          disabled={!fechaSeleccionada || reporteExistente} // deshabilita si ya existe
                          onClick={() => {
                            setOpenModal(false);
                            navigate(`/vista-previa/${fechaSeleccionada}`);
                          }}
                        >
                          {reporteExistente ? "Reporte ya generado" : "Generar"}
                        </Button>
                      </Box>
                      </>
                    )}
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



export default ReportesAuditoria;