import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Fab } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import ProcessCard from "../components/ProcessCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProcessList() {
  const [processes, setProcesses] = useState([]);
  const navigate = useNavigate();

  // Función para obtener la lista de procesos desde el backend
  const fetchProcesses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/procesos");
      // Si la respuesta tiene la propiedad "procesos", la usamos; de lo contrario, asumimos que response.data es un arreglo
      const data = response.data.procesos || response.data;
      console.log("Fetched processes:", data);
      setProcesses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching processes:", error);
      setProcesses([]);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  const handleDelete = async (idProceso) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/procesos/${idProceso}`);
      // Actualizamos el estado eliminando el proceso borrado
      setProcesses((prevProcesses) =>
        prevProcesses.filter((procesos) => procesos.idProceso !== idProceso)
      );
    } catch (error) {
      console.error("Error deleting process:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h1"
        sx={{
          textAlign: "center",
          marginBottom: "32px",
          fontFamily: "'Roboto', sans-serif",
          color: "#004A98",
          fontSize: 48,
          fontWeight: "bold",
        }}
      >
        Lista De Procesos
      </Typography>
      <Grid container spacing={2}>
        {Array.isArray(processes) &&
          processes.map((process) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={process.idProceso}>
              <ProcessCard
                process={process}
                onDelete={() => handleDelete(process.idProceso)}
                onEdit={() => navigate(`/editar-proceso/${process.ididProceso}`)}
              />
            </Grid>
          ))}
      </Grid>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => navigate("/nuevo-proceso")}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          backgroundColor: "secondary.main",
          "&:hover": { backgroundColor: "primary.main" },
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default ProcessList;
