// src/views/AdminCarouselManager.jsx
import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Grid, Button, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Alert, MenuItem, DeleteIcon } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "axios";

const AdminCarouselManager = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fechaPublicacion: "",
    tipo: "",
    fechaEvento: "",
    rutaImg: ""
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  const fetchPublicaciones = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/eventos");
      setPublicaciones(response.data.eventos || []);
    } catch (err) {
      console.error(err);
      setError("Error al obtener las publicaciones.");
    }
  };

  useEffect(() => {
    fetchPublicaciones();
  }, []);

  const handleOpenForm = (pub = null) => {
    if (pub) {
      setEditing(true);
      setFormData({
        titulo: pub.titulo,
        descripcion: pub.descripcion,
        fechaPublicacion: pub.fechaPublicacion ? pub.fechaPublicacion.split("T")[0] : "",
        tipo: pub.tipo,
        fechaEvento: pub.fechaEvento ? pub.fechaEvento : "",
        rutaImg: pub.rutaImg
      });
    } else {
      setEditing(false);
      setFormData({
        titulo: "",
        descripcion: "",
        fechaPublicacion: "",
        tipo: "",
        fechaEvento: "",
        rutaImg: ""
      });
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setError("");
  };

  const handleFormChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };

  const handleSave = async () => {
    // Validar datos básicos, por ejemplo
    if (!formData.titulo || !formData.rutaImg) {
      setError("El título y la ruta de la imagen son obligatorios.");
      return;
    }
    try {
      if (editing) {
        // Suponiendo que formData incluye un id en edición (lo puedes agregar cuando abres el form)
        await axios.put(`http://127.0.0.1:8000/api/eventos/${formData.idEvento}`, formData);
      } else {
        await axios.post("http://127.0.0.1:8000/api/eventos", formData);
      }
      fetchPublicaciones();
      handleCloseForm();
    } catch (err) {
      console.error(err);
      setError("Error al guardar la publicación.");
    }
  };

  const handleDelete = async (idEvento) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/eventos/${idEvento}`);
      fetchPublicaciones();
    } catch (err) {
      console.error(err);
      setError("Error al eliminar la publicación.");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: "'Roboto', sans-serif", color: "primary.main", fontWeight: "bold" }}>
        Administración de Publicaciones
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenForm()}>
          Nueva Publicación
        </Button>
      </Box>
      <Grid container spacing={2}>
        {publicaciones.map((pub) => (
          <Grid item xs={12} sm={6} md={4} key={pub.idEvento}>
            <Box sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2 }}>
              <Box component="img" src={pub.rutaImg} alt={pub.titulo} sx={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 1 }} />
              <Typography variant="h6" sx={{ mt: 1 }}>{pub.titulo}</Typography>
              <Typography variant="body2">{pub.descripcion}</Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1, gap: 1 }}>
                <IconButton color="primary" onClick={() => handleOpenForm({ ...pub, idEvento: pub.idEvento })}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(pub.idEvento)}>
                </IconButton>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Modal para agregar/editar */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? "Editar Publicación" : "Nueva Publicación"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Título"
            value={formData.titulo}
            onChange={handleFormChange("titulo")}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Descripción"
            value={formData.descripcion}
            onChange={handleFormChange("descripcion")}
            margin="dense"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Fecha de Publicación"
            type="date"
            value={formData.fechaPublicacion}
            onChange={handleFormChange("fechaPublicacion")}
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Tipo"
            select
            value={formData.tipo}
            onChange={handleFormChange("tipo")}
            margin="dense"
          >
            <MenuItem value="Aviso">Aviso</MenuItem>
            <MenuItem value="Noticia">Noticia</MenuItem>
            <MenuItem value="Evento">Evento</MenuItem>
          </TextField>
          {formData.tipo === "Evento" && (
            <TextField
              fullWidth
              label="Fecha del Evento"
              type="date"
              value={formData.fechaEvento}
              onChange={handleFormChange("fechaEvento")}
              margin="dense"
              InputLabelProps={{ shrink: true }}
            />
          )}
          <TextField
            fullWidth
            label="Ruta de la Imagen"
            value={formData.rutaImg}
            onChange={handleFormChange("rutaImg")}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editing ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminCarouselManager;
