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
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Typography
} from "@mui/material";
import ConfirmDelete from "../components/confirmDelete";
import ConfirmEdit from "../components/confirmEdit";
import DocumentListView from "../components/DocumentListView";
import DocumentFormDialog from "../components/Forms/DocumentFormDialog";
import FeedbackSnackbar from "../components/Feedback";
import useDocumentForm from "../hooks/useDocumenForm";
import CustomButton from "../components/Button";

function ProcessMapView({ soloLectura, idProceso }) {
  const [users, setUsers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [docAEliminar, setDocAEliminar] = useState(null);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [pendingEditDoc, setPendingEditDoc] = useState(null);
  const [savingCreate, setSavingCreate] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false)
  const [alerta, setAlerta] = useState({
    open: false,
    type: "",     // "success", "error", etc.
    title: "",
    message: ""
  });
  const showFeedback = (type, title, message) => {
    setAlerta({ open: true, type, title, message });
  };

  const {
    data: newUser,
    errors,
    setData: setNewUser,
    setErrors,
    handleChange,
    validate,
    resetForm
  } = useDocumentForm();



  useEffect(() => {
    axios.get(`http://localhost:8000/api/documentos?proceso=${idProceso}`)
      .then((resp) => {
        setUsers(resp.data);
      })
      .catch((error) => {
        console.error("Error al obtener documentos:", error);
      });
  }, [idProceso]);

  const confirmarEliminacion = () => {
    axios.delete(`http://localhost:8000/api/documentos/${docAEliminar.idDocumento}`)
      .then(() => {
        setUsers(prev => prev.filter(u => u.idDocumento !== docAEliminar.idDocumento));
        showFeedback("success", "Eliminado", "Documento eliminado correctamente.");
      })
      .catch(() => {
        showFeedback("error", "Error", "No se pudo eliminar el documento.");
      })
      .finally(() => {
        setConfirmDialogOpen(false);
        setDocAEliminar(null);
      });
  };

  const handleAddUser = () => {
    if (!validate()) return;
    setSavingCreate(true);
    const payload = {
      ...newUser,
      idProceso,
      responsable: newUser.usuarios.join(", "),
      // Asegurar que los campos null/0 se envíen correctamente
      noRevision: newUser.noRevision || 0,
      noCopias: newUser.noCopias || 0,
      tiempoRetencion: newUser.tiempoRetencion || 0,
      disposicion: newUser.disposicion || null
    };

    if (payload.tipoDocumento !== "externo") {
      delete payload.fechaVersion;
    }

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "archivo" && value instanceof File) {
        formData.append("archivo", value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    axios.post("http://localhost:8000/api/documentos", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
      .then((res) => {
        setUsers(prev => [...prev, res.data]);
        setOpenForm(false);
        resetForm();
        showFeedback("success", "Creado", "Documento creado correctamente.");
      })
      .catch((error) => {
        console.error("Error al crear documento:", error.response?.data);
        showFeedback("error", "Error", "No se pudo agregar el documento.");
      })
      .finally(() => {
        setSavingCreate(false);
      });
  };


  const handleEditDocument = (doc) => {
    setPendingEditDoc(doc);
    setConfirmEditOpen(true);
  };


  const confirmarEdicionDocumento = () => {
    setEditDoc({
      ...pendingEditDoc,
      usuarios: pendingEditDoc.responsable
        ? pendingEditDoc.responsable.split(',').map(r => r.trim())
        : [],
    });
    setEditDialogOpen(true);
    setPendingEditDoc(null);
  };
  const handleSaveEditDocument = () => {
    if (!editDoc) return;
    setSavingEdit(true);
    const payload = {
      ...editDoc,
      responsable: editDoc.usuarios?.join(", ") || "",
      // Asegurar valores por defecto
      noRevision: editDoc.noRevision || 0,
      noCopias: editDoc.noCopias || 0,
      tiempoRetencion: editDoc.tiempoRetencion || 0,
      disposicion: editDoc.disposicion || null
    };

    if (payload.tipoDocumento !== "externo") {
      delete payload.fechaVersion;
    } else {
      delete payload.fechaRevision;
    }

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "archivo" && value instanceof File) {
        formData.append("archivo", value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    axios
      .post(`http://localhost:8000/api/documentos/${editDoc.idDocumento}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setUsers((prev) =>
          prev.map((u) => (u.idDocumento === res.data.idDocumento ? res.data : u))
        );
        setEditDoc(null);
        setEditDialogOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        showFeedback("success", "Editado", "Documento editado exitosamente.");
      })
      .catch(() => {
        showFeedback("error", "Error", "No se pudo editar el documento.");
      })
      .finally(() =>{
        setSavingEdit(false);
      });
  };

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
        <Box sx={{ flex: 1 }} /> {/* Espacio izquierdo */}

        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#0056b3", textAlign: "center", flex: 1 }}
        >
          DOCUMENTOS
        </Typography>

        {!soloLectura && (
          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <CustomButton type="guardar" onClick={() => setOpenForm(true)}>
              Agregar Documento
            </CustomButton>
          </Box>
        )}
      </Box>

      <DocumentListView
        documentos={users}
        onEdit={handleEditDocument}
        onDelete={(doc) => {
          setDocAEliminar(doc);
          setConfirmDialogOpen(true);
        }}
        soloLectura={soloLectura}
      />

      <DocumentFormDialog
        open={openForm}
        modo="crear"
        data={newUser}
        errors={errors}
        onChange={handleChange}
        onClose={() => {
          setOpenForm(false);
          resetForm();
        }}
        onSubmit={handleAddUser}
        submitting={savingCreate}
      />

      <DocumentFormDialog
        open={editDialogOpen}
        modo="editar"
        data={{ usuarios: [], ...editDoc }} errors={{}}
        onChange={(field, value) => setEditDoc(prev => ({ ...prev, [field]: value }))}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleSaveEditDocument}
        submitting={savingEdit}
      />


      <ConfirmDelete
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        entityType="documento"
        entityName={docAEliminar?.nombreDocumento || "este documento"}
        onConfirm={confirmarEliminacion}
      />
      <ConfirmEdit
        open={confirmEditOpen}
        onClose={() => setConfirmEditOpen(false)}
        entityType="documento"
        entityName={pendingEditDoc?.nombreDocumento || "este documento"}
        onConfirm={confirmarEdicionDocumento}
      />

      <FeedbackSnackbar
        open={alerta.open}
        onClose={() => setAlerta(prev => ({ ...prev, open: false }))}
        type={alerta.type}
        title={alerta.title}
        message={alerta.message}
      />

    </Box>
  );
}

export default ProcessMapView;
