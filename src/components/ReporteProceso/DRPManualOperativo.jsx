import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import axios from "axios";
import MapaProceso from "./DRPMapaProceso";
import DiagramaFlujo from "./DRPDiagramaFlujo";
import PlanControl from "./DRPPlanControl";

const ManualOperativo = ({ idProceso }) => {
  const [mapaProceso, setMapaProceso] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/mapaproceso/${idProceso}`)
      .then((response) => {
        setMapaProceso(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener el Mapa de Proceso:", error);
      });
  }, [idProceso]);

  return (
    <Box sx={{ mb: 4, p: 3, borderRadius: 2 }}>

        <MapaProceso mapaProceso={mapaProceso} />
        <DiagramaFlujo imageUrl={mapaProceso?.diagramaFlujo} />
        <PlanControl idProceso={mapaProceso?.idProceso} />
        
    </Box>
  );
};

export default ManualOperativo;
