import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import GeneralInfo from "../components/ReporteProceso/GeneralInfo"; 
import ManualOperativo from "../components/ReporteProceso/DRPManualOperativo";
import GestionRiesgos  from "../components/ReporteProceso/DRPGestionRiesgos";
const ReportView = () => {
  const { idProceso, year } = useParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/datos-reporte/${idProceso}/${year}`)
      .then(response => {
        setReportData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener el reporte:", error);
        setError("No se pudo cargar el reporte.");
        setLoading(false);
      });
  }, [idProceso, year]);

  const handleDownload = () => {
    window.open(`http://localhost:8000/api/generar-reporte/${idProceso}/${year}`, "_blank");
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}>
        Reporte del Proceso
      </Typography>

      {/* Información General */}
      <GeneralInfo reportData={reportData} />

      {/* Manual Operativo */}
      <ManualOperativo idProceso={idProceso} />

      {/* Gestión de Riesgos */}
      <GestionRiesgos idProceso={idProceso} anio={year} />

      {/* Botón para descargar el PDF */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleDownload}>
          Descargar PDF
        </Button>
      </Box>
    </Box>
  );
};

export default ReportView;
