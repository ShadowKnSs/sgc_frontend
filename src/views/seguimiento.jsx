import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Asegúrate de importar Axios
import { useParams} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Title from "../components/Title"; // Importamos el componente Title
import CardArchivos from "../components/CardArchivos";
import { Box, Grid, Fab, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar, Alert } from "@mui/material";

function Carpetas() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const rolActivo = state?.rolActivo || "";
  const soloLectura = rolActivo === "Auditor";
  const [carpetas, setCarpetas] = useState([]);
  const [open, setOpen] = useState(false);
  const [nuevoAnio, setNuevoAnio] = useState("");
  const [error, setError] = useState(null);
  const { idProceso, title } = useParams();

  // Mapeo de rutas según el título
  const rutas = {
    "Gestión de Riesgo": "gestion-riesgos",
    "Análisis de Datos": "analisis-datos",
    "Acciones de Mejora": "actividad-mejora",
    "Generar informe de auditoría": "informe-adutoria",
    "Seguimiento": "seguimientoPrincipal",
    "Indicadores": "user-indicadores"
  };

  console.log("titulo", title);

  useEffect(() => {
    obtenerRegistros();
  }, []);

  const obtenerRegistros = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/registros/filtrar", {
        idProceso,
        Apartado: title,
      });

      // Ordenar las carpetas por año de menor a mayor
      const carpetasOrdenadas = response.data.sort((a, b) => a.año - b.año);
      setCarpetas(carpetasOrdenadas);
    } catch (error) {
      console.error("Error al obtener registros:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNuevoAnio("");
    setOpen(false);
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

      console.log("Nuevo registro agregado:", response.data);
      setCarpetas([...carpetas, response.data]);
      setError(null);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Error al agregar la carpeta.");
      }
    }
    handleClose();
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Título */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Title text={title} sx={{ textAlign: "center", mb: 4 }} />
      </Box>

      {/* Cards */}
      <Grid container spacing={4} justifyContent="left" paddingLeft={10} sx={{ mt: 4 }}>
        {carpetas.map((registro) => (
          <Grid item key={registro.idRegistro}>
            <Box
              onClick={() => {
                navigate(`/${rutas[title]}/${registro.idRegistro}`, {
                  state: { rolActivo },
                });
              }}
              sx={{ cursor: "pointer" }}
            >
              <CardArchivos nombreCarpeta={registro.año.toString()} />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Botón flotante */}
      {!soloLectura && (
        <Fab color="primary" sx={{ position: "fixed", bottom: 20, right: 20 }} onClick={handleOpen}>
          <AddIcon />
        </Fab>
      )}

      {/* Diálogo */}
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
          <Button onClick={handleClose} color="secondary">Cancelar</Button>
          <Button onClick={handleAddCarpeta} color="primary">Aceptar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mostrar errores */}
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
}

export default Carpetas;




