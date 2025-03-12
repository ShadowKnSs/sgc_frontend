import { useState, useEffect } from "react";
import { Box, Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import CardArchivos from "../components/CardArchivos";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // Asegúrate de importar Axios

function Seguimiento() {
  const [carpetas, setCarpetas] = useState([]); // Inicializamos como vacío
  const [open, setOpen] = useState(false);
  const [nuevoAnio, setNuevoAnio] = useState("");
  const { idProceso } = useParams();
  console.log("id del proceso en seguimiento", idProceso);

  // Obtener los registros (carpetas) del backend
  useEffect(() => {
    // Hacemos la solicitud GET para obtener los registros
    axios
      .get(`http://127.0.0.1:8000/api/registros/${idProceso}`)
      .then((response) => {
        console.log("Registros obtenidos: ", response.data); // Verifica si el `idRegistro` está en los registros
        setCarpetas(response.data); // Suponiendo que cada registro tiene un idRegistro
      })
      .catch((error) => {
        console.error("Error al obtener los registros:", error);
      });
  }, [idProceso]);

  // Función para abrir/cerrar el diálogo
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNuevoAnio(""); // Limpiar input
    setOpen(false);
  };

  // Función para añadir una nueva carpeta
  const handleAddCarpeta = () => {
    const anio = parseInt(nuevoAnio);
    if (!isNaN(anio) && !carpetas.includes(anio)) {
      // Agregar el año al backend
      axios
        .post("http://127.0.0.1:8000/api/registros", { idProceso, año: anio })
        .then((response) => {
          console.log("Nuevo registro agregado:", response.data);
          setCarpetas([anio, ...carpetas]); // Actualizar el estado local con el nuevo año
        })
        .catch((error) => {
          console.error("Error al agregar registro:", error);
        });
    }
    handleClose();
  };

  return (
    <Box sx={{ p: 4 }}>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "32px",
          fontFamily: "'Roboto', sans-serif",
          color: "#004A98",
        }}
      >
        Seguimiento
      </h1>

      <Grid container spacing={3} justifyContent="left" paddingLeft={20}>
        {carpetas.map((registro) => (
          <Link
            key={registro.idRegistro}  // Cambié esto para usar `idRegistro` como clave
            to={`/seguimientoPrincipal/${registro.idRegistro}`}  // Cambié esto para pasar el idRegistro en la URL
            style={{ textDecoration: "none", color: "inherit" }}
            onClick={() => console.log(`Navegando a /seguimientoPrincipal/${registro.idRegistro}`)} // Verificación en el clic
          >
            <CardArchivos nombreCarpeta={registro.año.toString()} />
          </Link>
        ))}
      </Grid>

      {/* Botón flotante */}
      <Fab color="primary" sx={{ position: "fixed", bottom: 20, right: 20 }} onClick={handleOpen}>
        <AddIcon />
      </Fab>

      {/* Diálogo para añadir una nueva carpeta */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Nueva Carpeta</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="año"
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
    </Box>
  );
}

export default Seguimiento;
