import React, { useEffect, useState } from "react";
import { Box, Grid, Fab } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import ProcessCard from "../components/ProcessCard";
import { useNavigate } from "react-router-dom";

function ProcessList() {
  const [processes, setProcesses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedProcesses = JSON.parse(localStorage.getItem("processes") || "[]");
    setProcesses(storedProcesses);
  }, []);

  const handleDelete = (id) => {
    const updatedProcesses = processes.filter((process) => process.id !== id);
    setProcesses(updatedProcesses);
    localStorage.setItem("processes", JSON.stringify(updatedProcesses));
  };

  return (
    <Box sx={{ p: 4 }}>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "32px",
          fontFamily: "'Roboto', sans-serif",
          color: "#004A98"
        }}
      >
        Lista De Procesos
      </h1>
      <Grid container spacing={2}>
        {processes.map((process) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={process.id}>
            <ProcessCard
              process={process}
              onDelete={() => handleDelete(process.id)}
              onEdit={() => navigate(`/editar-proceso/${process.id}`)}
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
          "&:hover": {
            backgroundColor: "primary.main",
          },
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default ProcessList;
