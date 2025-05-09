import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const ProyectosMejoraCards = () => {
  const [proyectos, setProyectos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [mostrarCards, setMostrarCards] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchProyectos();
  }, []);

  useEffect(() => {
    // Si regresamos del formulario y location.state indica volver a mostrar
    if (location.state?.volverACards) {
      setMostrarCards(true);
    }
  }, [location.state]);

  const fetchProyectos = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/proyecto-mejora");
      setProyectos(res.data);
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
    }
  };

  const handleOpenModal = (proyecto) => {
    setSelectedProyecto(proyecto);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProyecto(null);
    setModalOpen(false);
  };

  const handleNuevoProyecto = () => {
    setMostrarCards(false);
    navigate("/proyecto-mejora/registro", {
      state: { soloLectura: false, puedeEditar: true },
    });
  };

  if (!mostrarCards) return null;

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Proyectos de Mejora</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleNuevoProyecto}>
          Nuevo Proyecto
        </Button>
      </Box>

      <Grid container spacing={2}>
        {proyectos.map((proy) => (
          <Grid item xs={12} sm={6} md={4} key={proy.idProyectoMejora}>
            <Card
              sx={{
                transition: "transform 0.3s ease",
                ":hover": {
                  transform: "scale(1.02)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  #{proy.idProyectoMejora} - {proy.fecha}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {proy.descripcionMejora?.substring(0, 60)}...
                </Typography>
                <Typography variant="body2">
                  <strong>División:</strong> {proy.division}<br />
                  <strong>Departamento:</strong> {proy.departamento}<br />
                  <strong>Responsable:</strong> {proy.responsable}
                </Typography>
              </CardContent>
              <Box px={2} pb={2} display="flex" justifyContent="flex-end">
                <Tooltip title="Ver detalles">
                  <IconButton color="primary" onClick={() => handleOpenModal(proy)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal Detalle */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          Detalles del Proyecto
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedProyecto && (
            <Box>
              <Typography><strong>División:</strong> {selectedProyecto.division}</Typography>
              <Typography><strong>Departamento:</strong> {selectedProyecto.departamento}</Typography>
              <Typography><strong>Responsable:</strong> {selectedProyecto.responsable}</Typography>
              <Typography><strong>Fecha:</strong> {selectedProyecto.fecha}</Typography>
              <Typography sx={{ mt: 2 }}><strong>Descripción:</strong><br />{selectedProyecto.descripcionMejora}</Typography>
              <Typography sx={{ mt: 2 }}><strong>Situación Actual:</strong><br />{selectedProyecto.situacionActual}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProyectosMejoraCards;