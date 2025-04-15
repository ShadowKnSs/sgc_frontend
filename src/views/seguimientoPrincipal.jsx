import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Container, Grid, Fab, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import MinutaCard from "../components/CardMinuta";
import MinutaForm from "./formularioSeguimiento";
import MinutaDialog from "../components/Modals/MinutaDialog";
import Subtitle from "../components/Subtitle";

const Seguimiento = () => {
  const { idRegistro } = useParams();
  const location = useLocation();
  const soloLectura = location.state?.soloLectura ?? true;
  const puedeEditar = location.state?.puedeEditar ?? false;

  const [minutas, setMinutas] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentMinuta, setCurrentMinuta] = useState(null);
  const [openMinutaDialog, setOpenMinutaDialog] = useState(false);
  const [selectedMinuta, setSelectedMinuta] = useState(null);

  useEffect(() => {
    const fetchMinutas = async () => {
      const url = `http://127.0.0.1:8000/api/minutas/registro/${idRegistro}`;
      try {
        const response = await axios.get(url);
        setMinutas(response.data);
      } catch (error) {
        console.error("Error al obtener las minutas:", error);
      }
    };

    if (idRegistro) fetchMinutas();
  }, [idRegistro]);

  const handleOpenForm = (minuta) => {
    setCurrentMinuta(minuta);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setCurrentMinuta(null);
  };

  const handleOpenMinutaDialog = (minuta) => {
    setSelectedMinuta(minuta);
    setOpenMinutaDialog(true);
  };

  const handleCloseMinutaDialog = () => {
    setOpenMinutaDialog(false);
    setSelectedMinuta(null);
  };

  const handleEdit = () => {
    setCurrentMinuta(selectedMinuta);
    setOpenMinutaDialog(false);
    setOpenForm(true);
  };

  const handleDeleteMinuta = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta minuta?")) {
      try {
        await axios.delete(`http://localhost:8000/api/minutasDelete/${id}`);
        alert("Minuta eliminada exitosamente");
        handleCloseMinutaDialog();
        setMinutas(minutas.filter((m) => m.idSeguimiento !== id));
      } catch (error) {
        console.error("Error al eliminar la minuta:", error);
        alert("Hubo un error al eliminar la minuta");
      }
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Subtitle text="Minutas de Seguimiento" sx={{ textAlign: "center", mb: 4 }} />

      <Grid container spacing={2}>
        {minutas.map((minuta) => (
          <Grid item key={minuta.idSeguimiento}>
            <MinutaCard
              fecha={minuta.fecha}
              lugar={minuta.lugar}
              duracion={minuta.duracion}
              onClick={() => handleOpenMinutaDialog(minuta)}
              onEdit={() => handleOpenForm(minuta)}
              soloLectura={soloLectura}
            />
          </Grid>
        ))}
      </Grid>

      <MinutaDialog
        open={openMinutaDialog}
        onClose={handleCloseMinutaDialog}
        minuta={selectedMinuta}
        onEdit={handleEdit}
        onDelete={handleDeleteMinuta}
        soloLectura={soloLectura}
      />

      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="md">
        <DialogTitle>{currentMinuta ? "Editar Minuta" : "Nueva Minuta"}</DialogTitle>
        <DialogContent>
          <MinutaForm idRegistro={idRegistro} initialData={currentMinuta} onClose={handleCloseForm} soloLectura={soloLectura} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="primary">Cancelar</Button>
        </DialogActions>
      </Dialog>

      {!soloLectura && puedeEditar && (
        <Fab color="primary" aria-label="add" sx={{ position: "fixed", bottom: 20, right: 20 }} onClick={() => handleOpenForm(null)}>
          <AddIcon />
        </Fab>
      )}
    </Container>
  );
};

export default Seguimiento;
