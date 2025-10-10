/**
 * Vista: Seguimiento
 * Descripción:
 * Muestra y gestiona las minutas de seguimiento asociadas a un `idRegistro` y `idProceso`.
 * 
 * Funcionalidades:
 * - Visualizar una lista de minutas como tarjetas (`MinutaCard`).
 * - Consultar detalles de cada minuta en un modal (`MinutaDialog`).
 * - Crear nuevas minutas o editar existentes mediante un formulario (`MinutaForm`).
 * - Eliminar minutas con confirmación y notificaciones (`ConfirmDelete`, `FeedbackSnackbar`).
 * - Restringe acciones según permisos (`soloLectura`, `puedeEditar`).
 * 
 * Componentes clave utilizados:
 * - `MinutaCard`, `MinutaForm`, `MinutaDialog`, `ConfirmEdit`, `ConfirmDelete`, `FeedbackSnackbar`
 * - Navegación del proceso (`MenuNavegacionProceso`), contexto (`ContextoProcesoEntidad`)
 */
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Container, Grid, Fab, Dialog, DialogActions, DialogContent, Box, Typography } from "@mui/material";
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
import Permiso from "../hooks/userPermiso";
import BreadcrumbNav from "../components/BreadcrumbNav";
import FolderIcon from '@mui/icons-material/Folder';
import LinkIcon from "@mui/icons-material/Link";
import AccountTreeIcon from '@mui/icons-material/AccountTree';


const Seguimiento = () => {
  const { idRegistro, idProceso } = useParams();
  const location = useLocation();
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
  const [isDeleting, setIsDeleting] = useState(false);

  const idProcesoFromState = location.state?.idProceso || null;
  const [idProcesoResolved] = useState(
    () => idProcesoFromState || localStorage.getItem("idProcesoActivo") || null
  );

  useEffect(() => {
    if (idProcesoResolved) {
      localStorage.setItem("idProcesoActivo", String(idProcesoResolved));
    }
  }, [idProcesoResolved]);

  const breadcrumbItems = useMemo(() => ([
    {
      label: 'Estructura',
      to: idProcesoResolved ? `/estructura-procesos/${idProcesoResolved}` : '/estructura-procesos',
      icon: AccountTreeIcon
    },
    {
      label: 'Carpetas',
      to: idProcesoResolved ? `/carpetas/${idProcesoResolved}/Seguimiento` : undefined,
      icon: FolderIcon
    },
    { label: 'Seguimiento', icon: LinkIcon }
  ]), [idProcesoResolved]);

  const fetchMinutas = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/minutas/registro/${idRegistro}`);
      if (Array.isArray(response.data)) {
        setMinutas(response.data);
      } else {
        setMinutas([]);
      }
    } catch (error) {
      console.error("Error al obtener las minutas:", error);
      setMinutas([]);
    }
  };

  useEffect(() => {
    if (idRegistro) fetchMinutas();
  }, [idRegistro]);

  const handleCreateMinuta = () => {
    setCurrentMinuta(null);
    setModoEdicion(false);
    setOpenForm(true);
  };

  const handleOpenForm = (minuta) => {
    setSelectedMinuta(minuta);
    setModoEdicion(true);
    setOpenConfirmEdit(true);
  };

  const handleCloseForm = async () => {
    setOpenForm(false);
    setCurrentMinuta(null);
    await fetchMinutas();
  };

  const handleOpenMinutaDialog = (minuta) => {
    setModoEdicion(false);
    setSelectedMinuta(minuta);
    setOpenMinutaDialog(true);
  };

  const handleCloseMinutaDialog = () => {
    setOpenMinutaDialog(false);
    setSelectedMinuta(null);
  };

  const handleEdit = () => {
    if (selectedMinuta) {
      setCurrentMinuta(selectedMinuta);
      setOpenConfirmEdit(false);
      setOpenMinutaDialog(false);
      setModoEdicion(true);
      setOpenForm(true);
    }
  };

  const handleDeleteMinuta = (id) => {
    setSelectedMinutaId(id);
    const minuta = minutas.find((m) => m.idSeguimiento === id);
    setSelectedMinuta(minuta);
    setOpenDelete(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    try {
      await axios.delete(`http://localhost:8000/api/minutasDelete/${selectedMinutaId}`);
      setOpenDelete(false);

      if (openMinutaDialog) {
        setOpenMinutaDialog(false);
      }

      await fetchMinutas();
      setSnackbarType('success');
      setSnackbarMessage('Minuta eliminada exitosamente');
      setOpenInfo(true);
    } catch (error) {
      setSnackbarType('error');
      setSnackbarMessage('Hubo un error al eliminar la minuta');
      setOpenInfo(true);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Container sx={{ mt: 2, mr: 1 , ml: 1}}>
      <Box sx={{ mb: 2 }}>
        <BreadcrumbNav items={breadcrumbItems} />
      </Box>
      
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        mb: 2,
        ml: 32
      }}>
        <ContextoProcesoEntidad idProceso={idProceso} />
      </Box>

      <Box sx={{
        textAlign: "center",
        mb: 2,
        display: { xs: "none", md: "block" }
      }}>
        <Subtitle text="Minutas de Seguimiento" />
      </Box>

      <Grid container spacing={2}>
        {minutas.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "150px" }}>
              <Typography variant="body1" color="text.secondary">
                No existen minutas para este registro
              </Typography>
            </Box>
          </Grid>
        ) : (
          minutas.map((minuta) => (
            <Grid item key={minuta.idSeguimiento}>
              <MinutaCard
                fecha={minuta.fecha}
                lugar={minuta.lugar}
                duracion={minuta.duracion}
                onClick={() => handleOpenMinutaDialog(minuta)}
                soloLectura={soloLectura}
              />
            </Grid>
          ))
        )}
      </Grid>

      <MinutaDialog
        open={openMinutaDialog}
        onClose={handleCloseMinutaDialog}
        minuta={selectedMinuta}
        onEdit={() => handleOpenForm(selectedMinuta)}
        onDelete={() => handleDeleteMinuta(selectedMinuta?.idSeguimiento)}
        soloLectura={soloLectura}
      />

      <Dialog open={openForm} onClose={() => handleCloseForm()} fullWidth maxWidth="md">
        <DialogTitleCustom title={currentMinuta ? "Editar Minuta" : "Nueva Minuta"} />
        <DialogContent>
          <MinutaForm
            idRegistro={idRegistro}
            initialData={currentMinuta}
            onClose={handleCloseForm}
            soloLectura={soloLectura}
            modoEdicion={modoEdicion}
          />
        </DialogContent>
        <DialogActions>
          <CustomButton type="cancelar" onClick={() => handleCloseForm()}>Cancelar</CustomButton>
        </DialogActions>
      </Dialog>

      {!soloLectura && puedeEditar && (
        <Fab color="primary" aria-label="add" sx={{ position: "fixed", bottom: 20, right: 20 }} onClick={handleCreateMinuta}>
          <AddIcon />
        </Fab>
      )}

      <FeedbackSnackbar
        open={openInfo}
        onClose={() => setOpenInfo(false)}
        type={snackbarType}
        title={snackbarType === 'success' ? 'Éxito' : 'Error'}
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
        onClose={() => {
          setOpenDelete(false);
          setIsDeleting(false);
        }}
        onConfirm={handleConfirmDelete}
        entityType="minuta-delete"
        entityName={selectedMinuta ? selectedMinuta.fecha : ""}
        isDeleting={isDeleting}
        isPermanent={true}
      />
    </Container>
  );
};

export default Seguimiento;