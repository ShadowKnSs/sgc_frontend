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
  Box, Typography, TableCell, TableBody, TableRow, Table, TableHead,
  TableContainer, Paper, CircularProgress, Alert
} from "@mui/material";
import ConfirmDelete from '../components/confirmDelete';
import IndicadorForm from "../components/Modals/IndicadorForm";
import InfoProceso from "../components/InfoProceso";
import InfoMapaProceso from "../components/InfoMapaProceso";
import CustomButton from "../components/Button";

function ProcessMapView({ idProceso, soloLectura, showSnackbar }) {
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [activeCards, setActiveCards] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [indicadorAEliminar, setIndicadorAEliminar] = useState(null);


  const api = axios.create({
    baseURL: "http://localhost:8000/api"
  });


  // Estado para crear nuevo indicador
  const [newUser, setNewUser] = useState({
    descripcion: "",
    formula: "",
    periodo: "",
    responsable: "",
    meta: ""
  });

  // Información del proceso
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
   * Cargar indicadores del mapa de proceso
   */
  const cargarIndicadores = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/indmapaproceso`, { params: { proceso: idProceso } });

      if (!response.data || response.data.length === 0) {
        setUsers([]);
      } else {
        setUsers(response.data);
      }
    } catch (error) {

      let errorMessage = "Error al cargar los indicadores";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "No se encontraron indicadores";
        } else if (error.response.status >= 500) {
          errorMessage = "Error del servidor al cargar indicadores";
        }
      } else if (error.request) {
        errorMessage = "Error de conexión. Verifique su internet";
      }

      setError(errorMessage);
      setUsers([]);

      if (showSnackbar) {
        showSnackbar(errorMessage, "error", "Error");
      }
    } finally {
      setLoading(false);
    }
  }, [idProceso, showSnackbar]);

  /**
   * Cargar datos del proceso y mapa de proceso
   */
  const cargarDatosProceso = useCallback(async () => {
    // defaults “vacíos” para el mapa, en caso de 404
    const mapaVacio = {
      documentos: "",
      fuente: "",
      material: "",
      requisitos: "",
      salidas: "",
      receptores: "",
      puestosInvolucrados: ""
    };

    // 1) Cargar PROCESO (si este falla, sí avisamos)
    try {
      const procesoRes = await api.get(`/procesos/${idProceso}`);
      if (procesoRes.data?.proceso) {
        setProceso(procesoRes.data.proceso);
      } else {
        // No lanzó error pero no vino “proceso”
        if (showSnackbar) {
          showSnackbar("No se encontró el proceso solicitado", "warning", "Aviso");
        }
      }
    } catch (error) {
      let msg = "Error al cargar la información del proceso";
      if (error.response?.status === 404) msg = "No se encontró el proceso solicitado";
      if (showSnackbar) showSnackbar(msg, "error", "Error");
    }

    // 2) Cargar MAPA (404 sin datos, no es error)
    try {
      const mapaRes = await api.get(`/mapaproceso/${idProceso}`);
      if (mapaRes.data) {
        setMapaProceso(mapaRes.data);
      } else {
        setMapaProceso(mapaVacio);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // No hay mapa aún  set vacíos, no alertamos como error
        setMapaProceso(mapaVacio);
      } else {
        // Otros errores del servidor o red
        if (showSnackbar) {
          showSnackbar("Error al cargar el mapa de proceso", "warning", "Aviso");
        }
        // Mantén el estado actual o usa vacíos
        setMapaProceso(prev => prev?.idMapaProceso ? prev : mapaVacio);
      }
    }
  }, [idProceso, showSnackbar]);


  useEffect(() => {
    if (!idProceso) {
      setLoading(false);
      return;
    }

    cargarIndicadores();
    cargarDatosProceso();

    const handleScroll = () => setIsFixed(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [idProceso, cargarIndicadores, cargarDatosProceso]);

  const validateFields = () => {
    let tempErrors = {};
    if (!newUser.descripcion.trim()) tempErrors.descripcion = "Este campo es obligatorio";
    if (!newUser.formula.trim()) tempErrors.formula = "Este campo es obligatorio";
    if (!newUser.periodo.trim()) tempErrors.periodo = "Debe seleccionar un período";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleAddUser = async () => {
    if (soloLectura || !validateFields()) return;

    const payload = {
      idProceso,
      descripcion: newUser.descripcion,
      formula: newUser.formula,
      periodoMed: newUser.periodo,
      responsable: newUser.responsable,
      meta: parseInt(newUser.meta) || null
    };

    try {
      const response = await api.post(`/indmapaproceso`, payload);
      const nuevo = response.data.indMapaProceso;
      setUsers((prev) => [...prev, nuevo]);
      setOpenForm(false);
      setNewUser({ descripcion: "", formula: "", periodo: "", responsable: "", meta: "" });
      setErrors({});

      if (showSnackbar) {
        showSnackbar("Indicador creado exitosamente", "success", "Éxito");
      }
    } catch (error) {
      console.error("Error al agregar indicador:", error);

      let errorMessage = "Error al crear el indicador";
      if (error.response?.status === 400) {
        errorMessage = "Datos inválidos para crear el indicador";
      }

      if (showSnackbar) {
        showSnackbar(errorMessage, "error", "Error");
      }
    }
  };

  const handleSaveChanges = async () => {
    if (soloLectura) return;
    const payload = { idProceso, ...mapaProceso };

    try {
      if (!mapaProceso.idMapaProceso) {
        const res = await api.post(`/mapaproceso`, payload);
        setMapaProceso(res.data);
        if (showSnackbar) {
          showSnackbar("Mapa de proceso creado correctamente", "success", "Éxito");
        }
      } else {
        await api.put(`/mapaproceso/${mapaProceso.idMapaProceso}`, payload);
        if (showSnackbar) {
          showSnackbar("Cambios guardados correctamente", "success", "Éxito");
        }
      }
      setEditMode(false);
    } catch (error) {
      console.error("Error al guardar:", error);

      let errorMessage = "Error al guardar el mapa de proceso";
      if (error.response?.status === 400) {
        errorMessage = "Datos inválidos para guardar";
      }

      if (showSnackbar) {
        showSnackbar(errorMessage, "error", "Error");
      }
    }
  };

  const handleDeleteUser = useCallback((indicador) => {
    setIndicadorAEliminar(indicador);
    setConfirmDialogOpen(true);
  }, []);

  const confirmarEliminarIndicador = useCallback(async () => {
    if (!indicadorAEliminar) return;

    try {
      await api.delete(`/indmapaproceso/${indicadorAEliminar.idIndicador}`);
      setUsers((prev) => prev.filter((u) => u.idIndicador !== indicadorAEliminar.idIndicador));

      if (showSnackbar) {
        showSnackbar("Indicador eliminado correctamente", "success", "Éxito");
      }
    } catch (error) {
      console.error("Error al eliminar indicador:", error);

      let errorMessage = "Error al eliminar el indicador";
      if (error.response?.status === 404) {
        errorMessage = "El indicador no fue encontrado";
      }

      if (showSnackbar) {
        showSnackbar(errorMessage, "error", "Error");
      }
    } finally {
      setConfirmDialogOpen(false);
      setIndicadorAEliminar(null);
    }
  }, [indicadorAEliminar, showSnackbar]);

  const handleEditUser = (user) => {
    setEditUser({ ...user, periodo: user.periodoMed || "" });
    setEditFormOpen(true);
  };

  const handleSaveEditUser = async () => {
    if (!editUser) return;

    try {
      const resp = await axios.put(`http://localhost:8000/api/indmapaproceso/${editUser.idIndicadorMP}`, {
        idProceso,
        descripcion: editUser.descripcion,
        formula: editUser.formula,
        periodoMed: editUser.periodo,
        responsable: editUser.responsable,
        meta: parseInt(editUser.meta) || null
      });

      setUsers((prev) => prev.map((u) => u.idIndicadorMP === editUser.idIndicadorMP ? resp.data : u));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveCards([]);
      setEditFormOpen(false);
      setEditUser(null);

      if (showSnackbar) {
        showSnackbar("Indicador actualizado correctamente", "success", "Éxito");
      }
    } catch (error) {
      console.error("Error al actualizar indicador:", error);

      let errorMessage = "Error al actualizar el indicador";
      if (error.response?.status === 404) {
        errorMessage = "El indicador no fue encontrado";
      }

      if (showSnackbar) {
        showSnackbar(errorMessage, "error", "Error");
      }
    }
  };

  // Estados de carga y error
  if (loading) {
    return (
      <Box sx={{
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
      }}>
        <CircularProgress size={60} thickness={5} sx={{ color: "#458cd4", mb: 2 }} />
        <Typography variant="subtitle1" color="text.secondary">
          Cargando información del proceso...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        p: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        flexDirection: "column"
      }}>
        <Alert severity="error" sx={{ mb: 3, maxWidth: 500 }}>
          {error}
        </Alert>
        <CustomButton
          type="guardar"
          onClick={cargarIndicadores}
          variant="outlined"
        >
          Reintentar
        </CustomButton>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, display: "flex", minHeight: "100vh", flexDirection: "column" }}>
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
        showSnackbar={showSnackbar}
      />

      {/* Título de Indicadores */}
      <Title text="Indicadores" />

      {/* Tabla de Indicadores */}
      {users.length === 0 ? (
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            No hay indicadores registrados aún
          </Alert>
          <Typography variant="body1" color="text.secondary">
            {soloLectura
              ? "No hay indicadores disponibles para mostrar."
              : "Puede agregar indicadores usando el botón 'Añadir Indicador'."
            }
          </Typography>
        </Box>
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
        showSnackbar={showSnackbar}
      />

      {/* Formulario Editar Indicador */}
      <IndicadorForm
        open={editFormOpen}
        onClose={() => setEditFormOpen(false)}
        onSave={handleSaveEditUser}
        formData={editUser || {}}
        setFormData={setEditUser}
        modo="editar"
        showSnackbar={showSnackbar}
      />

      {/* Confirmación de Eliminación */}
      <ConfirmDelete
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmarEliminarIndicador}
        entityType="indicador"
        entityName={indicadorAEliminar?.descripcion || "este indicador"}
        isPermanent={true}
        description="Esta acción no se puede deshacer."
      />
    </Box>
  );
}

export default ProcessMapView;