import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Fab, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import MinutaCard from "../components/CardMinuta";
import MinutaForm from "./formularioSeguimiento";
import MinutaDialog from "../components/Modals/MinutaDialog";
import Subtitle from "../components/Subtitle";

const Seguimiento = () => {
  const { idRegistro } = useParams(); // Se obtiene el idRegistro desde la URL
  const [minutas, setMinutas] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentMinuta, setCurrentMinuta] = useState(null);
  const [openMinutaDialog, setOpenMinutaDialog] = useState(false);
  const [selectedMinuta, setSelectedMinuta] = useState(null);

  useEffect(() => {
    const fetchMinutas = async () => {
      const url = `http://127.0.0.1:8000/api/minutas/registro/${idRegistro}`;
      console.log("URL de petición:", url); // Verifica qué URL se está usando

      try {
        const response = await axios.get(url);
        setMinutas(response.data);
      } catch (error) {
        console.error("Error al obtener las minutas:", error.response?.status, error.response?.data);
      }
    };

    if (idRegistro) fetchMinutas();
  }, [idRegistro]);

  // Abre el formulario para crear una nueva minuta o editar una existente
  const handleOpenForm = (minuta) => {
    setCurrentMinuta(minuta); // Si minuta tiene datos, se pasa para editar, si es null, se crea una nueva
    setOpenForm(true);
  };
  // Cierra el formulario
  const handleCloseForm = () => {
    setOpenForm(false);
    setCurrentMinuta(null);
  };
  // Abre el MinutaDialog para ver más detalles de la minuta
  const handleOpenMinutaDialog = (minuta) => {
    setSelectedMinuta(minuta); // Guardamos la minuta seleccionada para editar
    setOpenMinutaDialog(true);
  };
  // Cierra el MinutaDialog
  const handleCloseMinutaDialog = () => {
    setOpenMinutaDialog(false);
    setSelectedMinuta(null);
  };
  // Maneja el evento de editar en el MinutaDialog
  const handleEdit = () => {
    console.log('Minuta seleccionada para editar:', selectedMinuta);
    setCurrentMinuta(selectedMinuta); // Actualiza currentMinuta
    setOpenMinutaDialog(false); // Cierra el MinutaDialog
    setOpenForm(true); // Abre el formulario con los datos de currentMinuta
  };
  const handleDeleteMinuta = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta minuta?")) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/minutasDelete/${id}`, {
          headers: { "Content-Type": "application/json" },
        });
  
        console.log("Minuta eliminada:", response.data);
        alert("Minuta eliminada exitosamente");
        // Opcional: Actualizar el estado para que la lista de minutas se recargue
        // o eliminar la minuta de la UI si es necesario.
        handleCloseMinutaDialog(); // Cerrar el diálogo después de eliminar
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
              onEdit={() => handleOpenForm(minuta)} // Esta acción es para crear una nueva minuta
            />
          </Grid>
        ))}
      </Grid>

      {/* MinutaDialog: aquí se manejan los eventos de ver más detalles y editar */}
      <MinutaDialog
        open={openMinutaDialog}
        onClose={handleCloseMinutaDialog}
        minuta={selectedMinuta}
        onEdit={handleEdit} 
        onDelete={handleDeleteMinuta}
      />

      {/* Este formulario solo se muestra si seleccionas "Editar" en MinutaDialog */}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="md">
        <DialogTitle>{currentMinuta ? "Editar Minuta" : "Nueva Minuta"}</DialogTitle>
        <DialogContent>
          <MinutaForm idRegistro={idRegistro} initialData={currentMinuta} onClose={handleCloseForm} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="primary">Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Botón flotante para crear nueva minuta */}
      <Fab color="primary" aria-label="add" sx={{ position: "fixed", bottom: 20, right: 20 }} onClick={() => handleOpenForm(null)}>
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default Seguimiento;
