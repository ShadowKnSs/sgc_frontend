import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Fab, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MinutaCard from "../components/CardMinuta";
import MinutaForm from "./formularioSeguimiento";

const Seguimiento = () => {
  const { idRegistro } = useParams(); // Se obtiene el idRegistro desde la URL
  console.log("el id registro", idRegistro);

  const [minutas, setMinutas] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentMinuta, setCurrentMinuta] = useState(null);

  const handleOpenForm = (minuta = null) => {
    setCurrentMinuta(minuta);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setCurrentMinuta(null);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <h2>Minutas de Seguimiento</h2>

      <Grid container spacing={2}>
        {minutas.map((minuta) => (
          <Grid item key={minuta.id}>
            <MinutaCard
              fecha={minuta.fecha}
              lugar={minuta.lugar}
              duracion={minuta.duracion}
              onEdit={() => handleOpenForm(minuta)}
            />
          </Grid>
        ))}
      </Grid>

      <Fab color="primary" aria-label="add" sx={{ position: "fixed", bottom: 20, right: 20 }} onClick={() => handleOpenForm()}>
        <AddIcon />
      </Fab>

      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="md">
        <DialogTitle>Minuta</DialogTitle>
        <DialogContent>
          <MinutaForm idRegistro={idRegistro} initialData={currentMinuta} /> {/* Ahora se pasa idRegistro */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="primary">Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Seguimiento;
