import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import MapaProceso from "./DRPMapaProceso";
import DiagramaFlujo from "./DRPDiagramaFlujo";
import PlanControl from "./DRPPlanControl";

const ManualOperativo = ({ idProceso }) => {
  const [mapaProceso, setMapaProceso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/mapa-proceso/${idProceso}`)
      .then(response => {
        setMapaProceso(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener el Mapa de Proceso:", error);
        setError("No se pudo cargar el Mapa de Proceso.");
        setLoading(false);
      });
  }, [idProceso]);

  return (
    <Box sx={{ mb: 4, p: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 , textAlign: "center"}}>
        Manual Operativo
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          {/* Mapa de Proceso */}
          <MapaProceso mapaProceso={mapaProceso} />

          {/* Diagrama de Flujo */}
          {/* <DiagramaFlujo/> */}

          {/* Plan de Control */}
          {/* <PlanControl/> */}
        </>
      )}
    </Box>
  );
};

export default ManualOperativo;
