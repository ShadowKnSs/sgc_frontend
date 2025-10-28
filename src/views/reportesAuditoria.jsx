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
import { Box, Modal, TextField, MenuItem, Typography, IconButton, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FabCustom from "../components/FabCustom";
import Add from "@mui/icons-material/Add";
import FiltroAuditoria from "../components/buscadorAuditoria"
import Title from "../components/Title";
import { CircularProgress, Grid } from "@mui/material";
import ConfirmDelete from "../components/confirmDelete"; import ReportView from "../components/ReportView";
import FeedbackSnackbar from "../components/Feedback";
import BreadcrumbNav from "../components/BreadcrumbNav";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from '@mui/icons-material/Assignment';
import CustomButton from "../components/Button";
import DialogTitleCustom from "../components/TitleDialog";

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



  const confirmarEliminacion = (id) => {
    setIdAEliminar(id);
    setOpenConfirm(true);
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
      alert("Error al eliminar el reporte");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchReportes();
    const cargarDatos = async () => {
      try {
        const [resEntidades, resAuditorias] = await Promise.all([
          axios.get("http://localhost:8000/api/entidades"),
          axios.get("http://localhost:8000/api/auditorias")
        ]);

        setEntidades(resEntidades.data.entidades || []);
        setAuditorias(resAuditorias.data);
      } catch (err) {
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

      <Box sx={{ flex: 1, p: 2 }}>
        <BreadcrumbNav
          items={[
            { label: "Reportes", to: "/typesReports", icon: AssignmentIcon },
            { label: "Reportes de Auditoría", icon: DescriptionIcon },
          ]}
        />
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
            onClick={() => setOpenModal(true)}
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
              bgcolor: "white",
              boxShadow: 24,
              p: 4,
              borderRadius: 3,
            }}
          >

            <DialogTitleCustom
              title="Generar Reporte de Auditoría"
            />

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
                setProcesoSeleccionado("");
                setFechaSeleccionada("");
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
                setFechaSeleccionada("");
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

            {/* Botones - ACTUALIZADOS CON CUSTOMBUTTON */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, gap: 1 }}>
              <CustomButton
                type="cancelar"
                onClick={() => setOpenModal(false)}
                sx={{ flex: 1 }}
              >
                Cancelar
              </CustomButton>
              <CustomButton
                type="guardar"
                onClick={() => {
                  setOpenModal(false);
                  navigate(`/vista-previa/${fechaSeleccionada}`);
                }}
                disabled={!fechaSeleccionada || reporteExistente}
                sx={{ flex: 1 }}
              >
                {reporteExistente ? "Reporte ya generado" : "Generar"}
              </CustomButton>
            </Box>
          </Box>
        </Modal>
        <ConfirmDelete
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          onConfirm={handleEliminarReporte}
          entityType="reporte"
          entityName="de auditoría"
          isPermanent={true}
          description="Esta acción no se puede deshacer. El reporte será eliminado permanentemente del sistema."
        />
      </Box>
    </Box>
  );
};



export default ReportesAuditoria;