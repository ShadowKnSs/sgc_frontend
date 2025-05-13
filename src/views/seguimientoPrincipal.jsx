import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Container, Grid, Fab, Dialog, DialogActions, DialogContent, DialogTitle, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import MinutaCard from "../components/CardMinuta";
import MinutaForm from "./formularioSeguimiento";
import MinutaDialog from "../components/Modals/MinutaDialog";
import Subtitle from "../components/Subtitle";
import DialogTitleCustom from "../components/TitleDialog";
import CustomButton from "../components/Button";
import ContextoProcesoEntidad from "../components/ProcesoEntidad";
import FeedbackSnackbar from "../components/Feedback";
import ConfirmDelete from "../components/confirmDelete";
import ConfirmEdit from "../components/confirmEdit";
import MenuNavegacionProceso from "../components/MenuProcesoEstructura";
import useMenuProceso from "../hooks/useMenuProceso";
import Permiso from "../hooks/userPermiso";


const Seguimiento = () => {
  const { idRegistro } = useParams();
  const { idProceso } = useParams();
  const location = useLocation();
  const menuItems = useMenuProceso();
  const rolActivo = location.state?.rolActivo || JSON.parse(localStorage.getItem("rolActivo"));
  const { soloLectura, puedeEditar } = Permiso("Seguimiento");
  const [minutas, setMinutas] = useState([]);
  const [openInfo, setOpenInfo] = useState(false);
  const [snackbarType, setSnackbarType] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedMinutaId, setSelectedMinutaId] = useState(null);
  const [selectedMinuta, setSelectedMinuta] = useState(null);
  const [currentMinuta, setCurrentMinuta] = useState(null);
  const [openMinutaDialog, setOpenMinutaDialog] = useState(false);
  const [openConfirmEdit, setOpenConfirmEdit] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

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
  console.log("Clic en Editar minuta:", minuta);
  setSelectedMinuta(minuta);
  setModoEdicion(true);
  setOpenConfirmEdit(true);
};


  const handleCloseForm = () => {
    setOpenForm(false);
    setCurrentMinuta(null);
  };

  const handleOpenMinutaDialog = (minuta) => {
    setModoEdicion(false); // Solo para ver, no editar
    setSelectedMinuta(minuta);
    setOpenMinutaDialog(true);
  };

  const handleCloseMinutaDialog = () => {
    setOpenMinutaDialog(false);
    setSelectedMinuta(null);
  };

  /*useEffect(() => {
  if (modoEdicion && selectedMinuta) {
    setOpenConfirmEdit(true);
  }
}, [modoEdicion, selectedMinuta]);*/

  const handleEdit = () => {
    if (selectedMinuta) {
      setCurrentMinuta(selectedMinuta);
      setOpenConfirmEdit(false);
      setOpenMinutaDialog(false);
      setModoEdicion(false);
      setOpenForm(true);
    } else {
      console.log("No hay minuta para editar");
    }
  };

  const handleEditMinuta = (minuta) => {
    setSelectedMinuta(minuta);
    setModoEdicion(true);
  };

  const handleDeleteMinuta = (id) => {
    const minuta = minutas.find((m) => m.idSeguimiento === id);
    setSelectedMinuta(minuta);  // Almacena la minuta completa

    setOpenDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // Aquí va la lógica de eliminación, como tu `axios.delete()`
      await axios.delete(`http://localhost:8000/api/minutasDelete/${selectedMinutaId}`);

      // Actualiza el estado de la snackbar con éxito
      setSnackbarType('success');
      setSnackbarMessage('Minuta eliminada exitosamente');
      setOpenInfo(true);

      // Elimina la minuta de la lista localmente
      setMinutas(minutas.filter((m) => m.idSeguimiento !== selectedMinutaId));
    } catch (error) {
      console.error('Error al eliminar la minuta:', error);
      setSnackbarType('error');
      setSnackbarMessage('Hubo un error al eliminar la minuta');
      setOpenInfo(true);
    }

    // Cierra el cuadro de confirmación
    setOpenDelete(false);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <MenuNavegacionProceso items={menuItems} />

      <Box sx={{ position: "relative", mb: 4 }}>
        <Box sx={{ position: "absolute", left: 0 }}>
          <Subtitle text="Minutas de Seguimiento" />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <ContextoProcesoEntidad idProceso={idProceso} />
        </Box>
      </Box>

      <Grid container spacing={2}>
        {minutas.map((minuta) => (
          <Grid item key={minuta.idSeguimiento}>
            <MinutaCard
              fecha={minuta.fecha}
              lugar={minuta.lugar}
              duracion={minuta.duracion}
              onClick={() => handleOpenMinutaDialog(minuta)}
              soloLectura={soloLectura}
            />
          </Grid>
        ))}
      </Grid>

      <MinutaDialog
        open={openMinutaDialog}
        onClose={handleCloseMinutaDialog}
        minuta={selectedMinuta}
        onEdit={() => handleOpenForm(selectedMinuta)}
        onDelete={handleDeleteMinuta}
        soloLectura={soloLectura}
      />
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="md">
        <DialogTitleCustom title={currentMinuta ? "Editar Minuta" : "Nueva Minuta"}></DialogTitleCustom>
        <DialogContent>
          <MinutaForm idRegistro={idRegistro} initialData={currentMinuta} onClose={handleCloseForm} soloLectura={soloLectura} />
        </DialogContent>
        <DialogActions>
          <CustomButton type={"cancelar"} onClick={handleCloseForm}>{"Cancelar"}</CustomButton>
        </DialogActions>
      </Dialog>

      {!soloLectura && puedeEditar && (
        <Fab color="primary" aria-label="add" sx={{ position: "fixed", bottom: 20, right: 20 }} onClick={() => handleOpenForm(null)}>
          <AddIcon />
        </Fab>
      )}
      <FeedbackSnackbar
        open={openInfo}
        onClose={() => setOpenInfo(false)}
        type={snackbarType}
        title={snackbarType === 'success' ? 'info' : 'Error'}
        message={snackbarMessage}
        autoHideDuration={5000}
      />
      <ConfirmEdit
        open={openConfirmEdit}
        onClose={() => setOpenConfirmEdit(false)}
        onConfirm={handleEdit}
        entityType="minuta"
        entityName={selectedMinuta?.fecha || ""}
      />

      <ConfirmDelete
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        entityType="minuta"
        entityName={selectedMinuta ? selectedMinuta.fecha : ""}
      />

    </Container>
  );
};

export default Seguimiento;
