// ✅ Versión mejorada de Carpetas.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CardArchivos from "../components/CardArchivos";
import { Box, Grid, Fab, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar, Alert } from "@mui/material";
import Permiso from "../hooks/userPermiso";
import ContextoProcesoEntidad from "../components/ProcesoEntidad";
import Subtitle from "../components/Subtitle";
import ConfirmEdit from "../components/confirmEdit";

const rutas = {
  "Gestión de Riesgo": "gestion-riesgos",
  "Análisis de Datos": "analisis-datos",
  "Acciones de Mejora": "actividad-mejora",
  "Generar informe de auditoría": "informe-auditoria",
  "Seguimiento": "seguimientoPrincipal",
};

function Carpetas() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [carpetas, setCarpetas] = useState([]);
  const [open, setOpen] = useState(false);
  const [nuevoAnio, setNuevoAnio] = useState("");
  const [error, setError] = useState(null);
  const { idProceso, title } = useParams();
  const [editarCarpeta, setEditarCarpeta] = useState(null); 
  const [openConfirmEdit, setOpenConfirmEdit] = useState(false);
const [carpetaPendiente, setCarpetaPendiente] = useState(null);


  const rolActivo = state?.rolActivo || JSON.parse(localStorage.getItem("rolActivo"));
  const { soloLectura, puedeEditar } = Permiso(title);

  useEffect(() => {
    obtenerRegistros();
  }, []);

  const obtenerRegistros = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/registros/filtrar", {
        idProceso,
        Apartado: title,
      });
      const carpetasOrdenadas = response.data.sort((a, b) => a.año - b.año);
      setCarpetas(carpetasOrdenadas);
    } catch (error) {
      console.error("Error al obtener registros:", error);
    }
  };

  /*const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNuevoAnio("");
    setOpen(false);
  };*/

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNuevoAnio("");
    setOpen(false);
    setEditarCarpeta(null); // Limpiar estado al cerrar el form
  };

  const handleAddCarpeta = async () => {
    const anio = parseInt(nuevoAnio);
    if (isNaN(anio)) return;

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/registros", {
        idProceso,
        año: anio,
        Apartado: title,
      });
      setCarpetas([...carpetas, response.data]);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Error al agregar la carpeta.");
    }
    handleClose();
  };

  const handleEditCarpeta = (nombreCarpeta) => {
    const carpeta = carpetas.find((carpeta) => carpeta.año.toString() === nombreCarpeta);
    setEditarCarpeta(carpeta); // Establecer la carpeta seleccionada para editar
    setNuevoAnio(carpeta?.año.toString() || ""); // Cargar el año de la carpeta en el campo del formulario
    handleOpen(); // Abrir el formulario
  };

  const handleUpdateCarpeta = async () => {
    const anio = parseInt(nuevoAnio);
    if (isNaN(anio)) return;

    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/registros/${editarCarpeta.idRegistro}`, {
        idProceso,
        año: anio,
        Apartado: title,
      });
      const updatedCarpetas = carpetas.map((carpeta) =>
        carpeta.idRegistro === editarCarpeta.idRegistro ? response.data : carpeta
      );
      setCarpetas(updatedCarpetas);
      setError(null);
      setEditarCarpeta(null); // Limpiar estado
      handleClose();
    } catch (error) {
      setError(error.response?.data?.message || "Error al actualizar la carpeta.");
    }
  };

  const handleTryUpdateCarpeta = () => {
    const anio = parseInt(nuevoAnio);
    if (isNaN(anio)) return;
    setCarpetaPendiente({
      idRegistro: editarCarpeta.idRegistro,
      año: anio,
    });
    setOpenConfirmEdit(true);
  };

  const handleEditConfirmada = async () => {
    if (!carpetaPendiente) return;
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/registros/${carpetaPendiente.idRegistro}`, {
        año: carpetaPendiente.año,
      });
      
      const updatedCarpetas = carpetas.map((carpeta) =>
        carpeta.idRegistro === carpetaPendiente.idRegistro ? response.data : carpeta
      );
      setCarpetas(updatedCarpetas);
      setError(null);
      setEditarCarpeta(null);
      handleClose();
    } catch (error) {
      setError(error.response?.data?.message || "Error al actualizar la carpeta.");
    } finally {
      setCarpetaPendiente(null);
      setOpenConfirmEdit(false);
    }
  };
  
  

  return (
    <Box sx={{ p: 4 }}>
      <Subtitle text={title}  withBackground={true}/>
      
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        
        <ContextoProcesoEntidad idProceso={idProceso }/>
      </Box>

      <Grid container spacing={4} justifyContent="left" paddingLeft={10} sx={{ mt: 4 }}>
        {carpetas.map((registro) => (
          <Grid item key={registro.idRegistro}>
            <Box sx={{ cursor: "pointer" }}>
  <CardArchivos
    nombreCarpeta={registro.año.toString()}
    ruta={`/${rutas[title]}/${registro.idRegistro}${title === "Seguimiento" ? `/${idProceso}` : ""}`}
    onEditClick={handleEditCarpeta}
    rolActivo={rolActivo}
    soloLectura={soloLectura}
    puedeEditar={puedeEditar}
    año={registro.año}
  />
</Box>

          </Grid>
        ))}
      </Grid>

      {!soloLectura && (
        <Fab color="primary" sx={{ position: "fixed", bottom: 20, right: 20 }} onClick={handleOpen}>
          <AddIcon />
        </Fab>
      )}

      <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{editarCarpeta ? "Editar Carpeta" : "Nueva Carpeta"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Año"
            type="number"
            fullWidth
            variant="outlined"
            value={nuevoAnio}
            onChange={(e) => setNuevoAnio(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancelar</Button>
          <Button onClick={editarCarpeta ? handleTryUpdateCarpeta : handleAddCarpeta} color="primary">
  {editarCarpeta ? "Guardar Cambios" : "Aceptar"}
</Button>

        </DialogActions>
      </Dialog>

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <ConfirmEdit
  open={openConfirmEdit}
  onClose={() => setOpenConfirmEdit(false)}
  onConfirm={handleEditConfirmada}
  entityType="carpeta"
  entityName={nuevoAnio}
/>

    </Box>
  );
}

export default Carpetas;
