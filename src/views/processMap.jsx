/**
 * Vista: ProcessMapView
 * Descripción:
 * Esta vista presenta la estructura detallada de un proceso específico, incluyendo:
 * 1. Información general del proceso (objetivo, alcance, norma, etc.).
 * 2. Información general del Mapa de Procesos editable.
 * 3. Indicadores registrados para el mapa del proceso, con capacidad para visualizar, crear, editar o eliminar.
 *
 * Funcionalidades:
 * - Listar indicadores (`indmapaproceso`) por `idProceso`.
 * - Cargar información detallada del proceso y su mapa (`mapaproceso`).
 * - Agregar nuevo indicador con validación.
 * - Editar y guardar información general del mapa de procesos.
 * - Editar o eliminar indicadores individuales mediante diálogo y confirmación.
 * - Expandir/cerrar indicadores individualmente o en lote.
 * - Vista adaptativa con tarjetas (`UserCard`) que cambian entre colapsadas y expandibles.
 *
 *
 * Endpoints API usados:
 * - `GET /api/indmapaproceso?proceso={id}` → indicadores del mapa.
 * - `GET /api/procesos/{id}` → datos del proceso.
 * - `GET /api/mapaproceso/{id}` → datos del mapa de proceso.
 * - `POST /api/indmapaproceso` → crear nuevo indicador.
 * - `PUT /api/indmapaproceso/{id}` → actualizar indicador.
 * - `DELETE /api/indmapaproceso/{id}` → eliminar indicador.
 * - `POST /api/mapaproceso` o `PUT /api/mapaproceso/{id}` → guardar mapa de proceso.
 *
 * Props:
 * - `idProceso`: ID del proceso actual.
 * - `soloLectura`: determina si el usuario puede editar o solo visualizar.
 *
 * Nota:
 * Este componente está diseñado para roles con permisos de edición. Si `soloLectura` está activado,
 * los botones de edición/creación quedan ocultos o inactivos.
 */

import React, { useState, useEffect, useCallback } from "react";
import Title from "../components/Title";
import axios from "axios";
import {
  Box, Typography, TableCell, TableBody, TableRow, Table, TableHead, TableContainer, Paper, CircularProgress
} from "@mui/material";
import FeedbackSnackbar from "../components/Feedback";
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import IndicadorForm from "../components/Modals/IndicadorForm";
import InfoProceso from "../components/InfoProceso";
import InfoMapaProceso from "../components/InfoMapaProceso";
import CustomButton from "../components/Button";

function ProcessMapView({ idProceso, soloLectura }) {
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [activeCards, setActiveCards] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alerta, setAlerta] = useState({ tipo: "", texto: "" });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [indicadorAEliminar, setIndicadorAEliminar] = useState(null);

  // Este es tu form local para crear un nuevo "indicador"
  const [newUser, setNewUser] = useState({
    descripcion: "",
    formula: "",
    periodo: "",
    responsable: "",
    meta: ""
  });

  // EJEMPLO: info de Proceso / Mapa de Proceso
  const [proceso, setProceso] = useState({
    objetivo: "",
    alcance: "",
    anioCertificado: "",
    norma: "",
    duracionCetificado: "",
    estado: ""
  });

  const [mapaProceso, setMapaProceso] = useState({
    documentos: "",
    fuente: "",
    material: "",
    requisitos: "",
    salidas: "",
    receptores: "",
    puestosInvolucrados: ""
  });

  /**
   * 1) Efecto para cargar "indmapaproceso" filtrado por idProceso
   */
  useEffect(() => {
    if (!idProceso) return setLoading(false);
    axios.get(`http://localhost:8000/api/indmapaproceso?proceso=${idProceso}`)
      .then((resp) => setUsers(resp.data))
      .catch((error) => console.error("Error al obtener indmapaproceso:", error))
      .finally(() => setLoading(false));
  }, [idProceso]);

  /**
   * 2) Efecto para cargar "proceso" y "mapaProceso" (ejemplo)
   */
  useEffect(() => {
    axios.get(`http://localhost:8000/api/procesos/${idProceso}`)
      .then((response) => response.data.proceso && setProceso(response.data.proceso))
      .catch((error) => console.error("Error al obtener datos del proceso:", error));

    axios.get(`http://localhost:8000/api/mapaproceso/${idProceso}`)
      .then((response) => response.data && setMapaProceso(response.data))
      .catch((error) => console.error("Error al obtener datos del mapa de procesos:", error));

    const handleScroll = () => setIsFixed(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const validateFields = () => {
    let tempErrors = {};
    if (!newUser.descripcion.trim()) tempErrors.descripcion = "Este campo es obligatorio";
    if (!newUser.formula.trim()) tempErrors.formula = "Este campo es obligatorio";
    if (!newUser.periodo.trim()) tempErrors.periodo = "Debe seleccionar un período";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleAddUser = () => {
    if (soloLectura || !validateFields()) return;
    const payload = {
      idProceso,
      descripcion: newUser.descripcion,
      formula: newUser.formula,
      periodoMed: newUser.periodo,
      responsable: newUser.responsable,
      meta: parseInt(newUser.meta) || null
    };
    return axios.post("http://localhost:8000/api/indmapaproceso", payload).then((response) => {
      const nuevo = response.data.indMapaProceso;
      setUsers((prev) => [...prev, nuevo]);
      setOpenForm(false);
      setNewUser({ descripcion: "", formula: "", periodo: "", responsable: "", meta: "" });
      setErrors({});
    })
      .catch((error) => console.error("Error al agregar indicador (indmapaproceso):", error));
  };

  const handleSaveChanges = async () => {
    if (soloLectura) return;
    const payload = { idProceso, ...mapaProceso };
    try {
      if (!mapaProceso.idMapaProceso) {
        const res = await axios.post("http://localhost:8000/api/mapaproceso", payload);
        setMapaProceso(res.data);
        setAlerta({ tipo: "success", texto: "Mapa de proceso creado correctamente." });
      } else {
        await axios.put(`http://localhost:8000/api/mapaproceso/${mapaProceso.idMapaProceso}`, payload);
        setAlerta({ tipo: "success", texto: "Cambios guardados correctamente." });
      }
      setEditMode(false);
    } catch (error) {
      console.error("Error al guardar:", error);
      setAlerta({ tipo: "error", texto: "Ocurrió un error al guardar el mapa de proceso." });
    }
  };

  useEffect(() => {
    if (alerta.texto) {
      const timeout = setTimeout(() => setAlerta({ tipo: "", texto: "" }), 4000);
      return () => clearTimeout(timeout);
    }
  }, [alerta]);

  const handleDeleteUser = useCallback((indicador) => {
    setIndicadorAEliminar(indicador);
    setConfirmDialogOpen(true);
  }, []);

  const confirmarEliminarIndicador = useCallback(() => {
    if (!indicadorAEliminar) return;
    axios.delete(`http://localhost:8000/api/indmapaproceso/${indicadorAEliminar.idIndicador}`)
      .then(() => {
        setUsers((prev) => prev.filter((u) => u.idIndicador !== indicadorAEliminar.idIndicador));
        setAlerta({ tipo: "success", texto: "Indicador eliminado correctamente." });
      })
      .catch(() => setAlerta({ tipo: "error", texto: "Error al eliminar el indicador." }))
      .finally(() => {
        setConfirmDialogOpen(false);
        setIndicadorAEliminar(null);
      });
  }, [indicadorAEliminar]);

  const handleEditUser = (user) => {
    setEditUser({ ...user, periodo: user.periodoMed || "" });
    setEditFormOpen(true);
  };

  const handleSaveEditUser = () => {
    if (!editUser) return;
    return axios.put(`http://localhost:8000/api/indmapaproceso/${editUser.idIndicadorMP}`, {
      idProceso,
      descripcion: editUser.descripcion,
      formula: editUser.formula,
      periodoMed: editUser.periodo,
      responsable: editUser.responsable,
      meta: parseInt(editUser.meta) || null
    })
      .then((resp) => {
        setUsers((prev) => prev.map((u) => u.idIndicadorMP === editUser.idIndicadorMP ? resp.data : u));
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveCards([]);
        setEditFormOpen(false);
        setEditUser(null);
        setAlerta({ tipo: "success", texto: "Indicador actualizado correctamente." });
      })
      .catch((error) => console.error("Error al actualizar indicador:", error));
  };

  /**
   * Render principal
   */
  if (loading) {
    return (
      <Box sx={{
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
      }}>
        <CircularProgress size={60} thickness={5} sx={{ color: "#1976d2", mb: 2 }} />
        <Typography variant="subtitle1" color="text.secondary">
          Cargando información del proceso...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      <FeedbackSnackbar
        open={!!alerta.texto}
        type={alerta.tipo}
        message={alerta.texto}
        onClose={() => setAlerta({ tipo: "", texto: "" })}
      />

      {/* Información del proceso */}
      <InfoProceso proceso={proceso} />

      {/* Mapa de proceso */}
      <InfoMapaProceso
        mapaProceso={mapaProceso}
        setMapaProceso={setMapaProceso}
        editMode={editMode}
        setEditMode={setEditMode}
        handleSaveChanges={handleSaveChanges}
        soloLectura={soloLectura}
      />

      {/* Título + botón de expandir */}

      <Title text="Indicadores" />


      {/* Tarjetas expandidas */}
      {users.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ my: 4, textAlign: "center" }}>
          No hay indicadores registrados aún.
        </Typography>
      ) : (
        <Box sx={{ mt: 2 }}>
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead sx={{ backgroundColor: "#E3F2FD" }}>
                <TableRow>
                  <TableCell><strong>Descripción</strong></TableCell>
                  <TableCell><strong>Fórmula</strong></TableCell>
                  <TableCell><strong>Período</strong></TableCell>
                  <TableCell><strong>Responsable</strong></TableCell>
                  <TableCell><strong>Meta</strong></TableCell>
                  {!soloLectura && <TableCell align="center"><strong>Acciones</strong></TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.idIndicadorMP}>
                    <TableCell>{user.descripcion || "No disponible"}</TableCell>
                    <TableCell>{user.formula || "No disponible"}</TableCell>
                    <TableCell>{user.periodoMed || "No disponible"}</TableCell>
                    <TableCell>{user.responsable || "No disponible"}</TableCell>
                    <TableCell>{user.meta ?? "N/A"}</TableCell>
                    {!soloLectura && (
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                          <CustomButton
                            type="generar"
                            onClick={() => handleEditUser(user)}
                          >
                            Editar
                          </CustomButton>
                          <CustomButton
                            type="cancelar"
                            onClick={() => handleDeleteUser(user)}
                          >
                            Eliminar
                          </CustomButton>
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Botón Añadir Indicador */}
      {!soloLectura && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <CustomButton type="guardar" onClick={() => setOpenForm(true)}>
            Añadir Indicador
          </CustomButton>
        </Box>
      )}

      {/* Formulario Crear Indicador */}
      <IndicadorForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleAddUser}
        formData={newUser}
        setFormData={setNewUser}
        errors={errors}
        modo="crear"
      />

      {/* Formulario Editar Indicador */}
      <IndicadorForm
        open={editFormOpen}
        onClose={() => setEditFormOpen(false)}
        onSave={handleSaveEditUser}
        formData={editUser || {}}
        setFormData={setEditUser}
        modo="editar"
      />

      {/* Confirmación de Eliminación */}
      <ConfirmDeleteDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmarEliminarIndicador}
        itemName={indicadorAEliminar?.descripcion || "este indicador"}
      />
    </Box>
  );

}


export default ProcessMapView;
