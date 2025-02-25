import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Fab } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import ProcessCard from "../components/ProcessCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProcessList() {
  const [processes, setProcesses] = useState([]);
  const [entidades, setEntidades] = useState([]);
  const navigate = useNavigate();

  // Función para obtener la lista de procesos desde el backend
  const fetchProcesses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/procesos");
      const data = response.data.procesos || response.data;
      console.log("Fetched processes:", data);
      setProcesses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching processes:", error);
      setProcesses([]);
    }
  };

  // Función para obtener las entidades
  const fetchEntidades = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/entidades");
      setEntidades(response.data.entidades || []);
    } catch (error) {
      console.error("Error fetching entidades:", error);
      setEntidades([]);
    }
  };


  useEffect(() => {
    fetchProcesses();
    fetchEntidades();
  }, []);

  const handleDelete = async (idProceso) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/procesos/${idProceso}`);
      setProcesses((prev) => prev.filter((p) => p.idProceso !== idProceso));
    } catch (error) {
      console.error("Error deleting process:", error);
    }
  };

  const enrichedProcesses = processes.map((process) => {
    const processId = process.id || process.idProcesoPK;
    const entity = entidades.find(
      (ent) => ent.idEntidadDependecia.toString() === process.idEntidad.toString()
    );
    return {
      ...process,
      id: processId,
      name: process.nombreProceso,
      entidad: entity ? entity.nombreEntidad : "Sin entidad",
    };
  });

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h1"
        sx={{
          textAlign: "center",
          marginBottom: "32px",
          fontFamily: "'Roboto', sans-serif",
          color: "primary.main",
          fontSize: 48,
          fontWeight: "bold",
        }}
      >
        Lista De Procesos
      </Typography>
      <Grid container spacing={2}>
           {enrichedProcesses.map((process) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={process.id}>
              <ProcessCard
                process={process}
                onEdit={() => navigate(`/editar-proceso/${process.id}`)}
                onDelete={() => handleDelete(process.id)}
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
