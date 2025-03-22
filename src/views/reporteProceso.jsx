import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import GeneralInfo from "../components/ReporteProceso/GeneralInfo";
import ManualOperativo from "../components/ReporteProceso/DRPManualOperativo";
import GestionRiesgos from "../components/ReporteProceso/DRPGestionRiesgos";
import AnalisisDatos from "../components/ReporteProceso/DRPAnalisisDatos";

const ReportView = () => {
  const [imagenPlanControl, setImagenPlanControl] = useState(null);
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

  const handleDownload = async () => {
    try {
      // Si ya tenemos la imagen generada
      if (imagenPlanControl) {
        await axios.post('http://localhost:8000/api/graficas/guardar', {
          imagenBase64: imagenPlanControl,
          nombre: `plan_control_${idProceso}_${year}`
        });
        console.log("✅ Imagen guardada antes de descargar el PDF.");
      }

      // Abrir PDF
      window.open(`http://localhost:8000/api/generar-reporte/${idProceso}/${year}`, "_blank");
    } catch (error) {
      console.error("❌ Error al guardar la imagen antes del PDF:", error);
      alert("No se pudo guardar la imagen antes de generar el PDF.");
    }
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

      {/* AnalisiDatos */}
      <AnalisisDatos />

      {/* Botón para descargar el PDF */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          disabled={!imagenPlanControl} // solo habilita cuando la imagen está lista
        >
          Descargar PDF
        </Button>

      </Box>
    </Box>
  );
};

export default ReportView;
