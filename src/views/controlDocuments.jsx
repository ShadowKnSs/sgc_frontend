/**
 * Componente: ProcessMapView
 * Ubicación: src/views/ProcessMapView.jsx
 * Props:
 *  - idProceso (number): ID del proceso al que pertenecen los documentos.
 *  - soloLectura (boolean): Si es true, desactiva las funciones de agregar, editar y eliminar documentos.
 *
 * Descripción:
 * Vista para administrar los documentos relacionados a un proceso. Permite ver, agregar, editar y eliminar documentos,
 * con soporte para tarjetas desplegables con detalles completos y validación de campos.
 *
 * Funcionalidades principales:
 * 1.  Obtener documentos del proceso desde el backend (`/api/documentos?proceso=idProceso`).
 * 2.  Visualizar documentos como tarjetas (vista compacta o expandida).
 * 3.  Permite "desplegar todo" o "cerrar todo".
 * 4.  Agregar nuevos documentos mediante un formulario dentro de un `Dialog`.
 * 5.  Editar documentos con formulario reutilizable (condicional por tipo de documento).
 * 6.  Eliminar documentos con confirmación.
 * 7.  Validación de campos obligatorios en el formulario.
 * 8.  Gestión visual de errores, alertas (`MensajeAlert`) y diálogos de confirmación (`ConfirmDeleteDialog`).

 */
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Box, Typography, Alert, CircularProgress
} from "@mui/material";
import ConfirmDelete from "../components/confirmDelete";
import DocumentListView from "../components/DocumentListView";
import DocumentFormDialog from "../components/Forms/DocumentFormDialog";
import useDocumentForm from "../hooks/useDocumenForm";
import CustomButton from "../components/Button";

function ProcessMapView({ soloLectura, idProceso, showSnackbar }) {
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [docAEliminar, setDocAEliminar] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    data: formData,
    errors,
    setData: setFormData,
    handleChange,
    validate,
    resetForm
  } = useDocumentForm();

  // Función para cargar documentos
  const cargarDocumentos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`http://localhost:8000/api/documentos?proceso=${idProceso}`);

      if (!response.data || response.data.length === 0) {
        setUsers([]);
      } else {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error al obtener documentos:", error);
      let errorMessage = "Error al cargar los documentos";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "No se encontraron documentos";
        } else if (error.response.status >= 500) {
          errorMessage = "Error del servidor al cargar documentos";
        }
      } else if (error.request) {
        errorMessage = "Error de conexión. Verifique su internet";
      }

      setError(errorMessage);
      setUsers([]);
      showSnackbar?.(errorMessage, "error", "Error");
    } finally {
      setLoading(false);
    }
  }, [idProceso, showSnackbar]);

  useEffect(() => {
    if (!idProceso) {
      setLoading(false);
      return;
    }
    cargarDocumentos();
  }, [idProceso, cargarDocumentos]);

  const confirmarEliminacion = async () => {
    if (!docAEliminar) return;

    try {
      await axios.delete(`http://localhost:8000/api/documentos/${docAEliminar.idDocumento}`);
      setUsers(prev => prev.filter(u => u.idDocumento !== docAEliminar.idDocumento));
      showSnackbar?.("Documento eliminado correctamente", "success", "Éxito");
    } catch (error) {
      console.error("Error al eliminar documento:", error);
      let errorMessage = "Error al eliminar el documento";
      if (error.response?.status === 404) {
        errorMessage = "El documento no fue encontrado";
      }
      showSnackbar?.(errorMessage, "error", "Error");
    } finally {
      setConfirmDialogOpen(false);
      setDocAEliminar(null);
    }
  };

  const handleOpenCreateDialog = () => {
    resetForm();
    setCurrentDoc(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (doc) => {
    const formData = {
      ...doc,
      usuarios: doc.responsable ? doc.responsable.split(',').map(r => r.trim()) : [],
      noRevision: String(doc.noRevision ?? ""),  // String, no number
      noCopias: String(doc.noCopias ?? ""),
      tiempoRetencion: String(doc.tiempoRetencion ?? ""),
      disposicion: doc.disposicion ?? ""  // String vacío, no null
    };

    setFormData(formData);
    setCurrentDoc(doc);
    setDialogOpen(true);
  };


  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentDoc(null);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!validate()) {
      showSnackbar?.("Por favor complete todos los campos obligatorios", "error", "Error de validación");
      return;
    }

    setSaving(true);

    // Preparar payload común
    const payload = {
      ...formData,
      idProceso,
      responsable: Array.isArray(formData.usuarios) ? formData.usuarios.join(", ") : formData.usuarios,
      noRevision: formData.noRevision || 0,
      noCopias: formData.noCopias || 0,
      tiempoRetencion: (formData.tiempoRetencion ?? '').toString().trim() || null,
      disposicion: formData.disposicion || null
    };

    // Limpiar campos según tipo de documento
    if (payload.tipoDocumento !== "externo") {
      delete payload.fechaVersion;
    } else {
      delete payload.fechaRevision;
    }

    const formDataToSend = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "archivo" && value instanceof File) {
        formDataToSend.append("archivo", value);
      } else if (value !== null && value !== undefined && value !== '') {
        formDataToSend.append(key, value);
      }
    });

    try {
      let response;

      if (currentDoc) {
        // Modo edición
        response = await axios.post(
          `http://localhost:8000/api/documentos/${currentDoc.idDocumento}?_method=PUT`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setUsers(prev => prev.map(u => u.idDocumento === response.data.idDocumento ? response.data : u));
        showSnackbar?.("Documento actualizado correctamente", "success", "Éxito");
      } else {
        // Modo creación
        response = await axios.post("http://localhost:8000/api/documentos", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setUsers(prev => [...prev, response.data]);
        showSnackbar?.("Documento creado correctamente", "success", "Éxito");
      }

      setDialogOpen(false);
      resetForm();
      setCurrentDoc(null);

    } catch (error) {
      console.error("Error al guardar documento:", error);

      let errorMessage = currentDoc ? "Error al actualizar el documento" : "Error al crear el documento";
      if (error.response?.status === 400) {
        errorMessage = "Datos inválidos";
      } else if (error.response?.status === 404) {
        errorMessage = "El documento no fue encontrado";
      } else if (error.response?.status === 413) {
        errorMessage = "El archivo es demasiado grande";
      }

      showSnackbar?.(errorMessage, "error", "Error");
    } finally {
      setSaving(false);
    }
  };

  // Estados de carga y error (mantener igual)
  if (loading) {
    return (
      <Box sx={{
        p: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        flexDirection: "column",
        gap: 2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Cargando documentos...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        p: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        flexDirection: "column",
        gap: 3
      }}>
        <Alert severity="error" sx={{ mb: 2, maxWidth: 500 }}>
          {error}
        </Alert>
        <CustomButton
          type="guardar"
          onClick={cargarDocumentos}
          variant="outlined"
        >
          Reintentar
        </CustomButton>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, display: "flex", minHeight: "100vh", flexDirection: "column", paddingTop: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          px: 1,
        }}
      >
        <Box sx={{ flex: 1 }} />

        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#0056b3", textAlign: "center", flex: 1 }}
        >
          DOCUMENTOS
        </Typography>

        {!soloLectura && (
          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <CustomButton type="guardar" onClick={handleOpenCreateDialog}>
              Agregar Documento
            </CustomButton>
          </Box>
        )}
      </Box>

      {users.length === 0 && !loading && !error && (
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            No hay documentos registrados
          </Alert>
          <Typography variant="body1" color="text.secondary">
            {soloLectura
              ? "No hay documentos disponibles para mostrar."
              : "Puede agregar documentos usando el botón 'Agregar Documento'."
            }
          </Typography>
        </Box>
      )}

      {users.length > 0 && (
        <DocumentListView
          documentos={users}
          onEdit={handleOpenEditDialog}
          onDelete={(doc) => {
            setDocAEliminar(doc);
            setConfirmDialogOpen(true);
          }}
          soloLectura={soloLectura}
        />
      )}

      {/* Modal unificado para crear/editar */}
      <DocumentFormDialog
        open={dialogOpen}
        modo={currentDoc ? "editar" : "crear"}
        data={formData}
        errors={errors}
        onChange={handleChange}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        submitting={saving}
      />

      {/* Confirmación de eliminación */}
      <ConfirmDelete
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        entityType="documento"
        entityName={docAEliminar?.nombreDocumento || "este documento"}
        onConfirm={confirmarEliminacion}
      />
    </Box>
  );
}

export default ProcessMapView;