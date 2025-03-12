import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Fab,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link, useParams } from "react-router-dom";
import CardArchivos from "../components/CardArchivos";
import axios from "axios";

function CarpetasPlanCorrectivo() {
  const [carpetas, setCarpetas] = useState([]); // Lista de registros (carpetas)
  const [open, setOpen] = useState(false);
  const [nuevoAnio, setNuevoAnio] = useState("");
  const { idProceso } = useParams();
  console.log("id del proceso en CarpetasPlanCorrectivo:", idProceso);

  // Cargar los registros (carpetas) asociados a idProceso
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/registros/${idProceso}`)
      .then((response) => {
        console.log("Registros obtenidos:", response.data);
        setCarpetas(response.data); // Se asume que cada registro tiene un idRegistro y un campo "año"
      })
      .catch((error) => {
        console.error("Error al obtener los registros:", error);
      });
  }, [idProceso]);

  // Funciones para abrir y cerrar el diálogo
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNuevoAnio("");
    setOpen(false);
  };

  // Función para añadir una nueva carpeta (registro)
  const handleAddCarpeta = () => {
    const anio = parseInt(nuevoAnio);
    if (!isNaN(anio)) {
      // Envia el idProceso y el año al backend
      axios
        .post("http://127.0.0.1:8000/api/registros", { idProceso, año: anio })
        .then((response) => {
          console.log("Nuevo registro agregado:", response.data);
          // Se asume que response.data contiene el registro completo (incluyendo idRegistro y año)
          setCarpetas([response.data, ...carpetas]);
        })
        .catch((error) => {
          console.error("Error al agregar registro:", error);
        });
    }
    handleClose();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>
        Carpetas de Plan Correctivo
      </Typography>

      <Grid container spacing={3} justifyContent="left" sx={{ pl: 4 }}>
        {carpetas.length === 0 ? (
          <Typography variant="h6" color="textSecondary">
            No hay carpetas. Cree una nueva carpeta.
          </Typography>
        ) : (
          carpetas.map((registro) => (
            <Link
              key={registro.idRegistro} // Usamos el idRegistro como clave
              to={`/actividad-mejora/${registro.idRegistro}`} // Navega a la vista de ActividadMejora pasando el idRegistro
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={() =>
                console.log(`Navegando a /actividad-mejora/${registro.idRegistro}`)
              }
            >
              <CardArchivos nombreCarpeta={registro.año.toString()} />
            </Link>
          ))
        )}
      </Grid>

      {/* Botón flotante para abrir el diálogo y crear una nueva carpeta */}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>

      {/* Diálogo para añadir una nueva carpeta */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Nueva Carpeta</DialogTitle>
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
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAddCarpeta} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CarpetasPlanCorrectivo;
