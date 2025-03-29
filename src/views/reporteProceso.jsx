import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import GeneralInfo from "../components/ReporteProceso/GeneralInfo";
import ManualOperativo from "../components/ReporteProceso/DRPManualOperativo";
import Auditoria from "../components/ReporteProceso/DRPAuditoria";
import GestionRiesgos from "../components/ReporteProceso/DRPGestionRiesgos";
import AnalisisDatos from "../components/ReporteProceso/DRPAnalisisDatos";
import Seguimiento from "../components/ReporteProceso/DRPSegumiento";
import ProyectoMejora from "../components/ReporteProceso/DRPProyectoMejora";
import PlanAccion from "../components/ReporteProceso/DRPPlanAccion";
const ReportView = () => {
  const { idProceso, year } = useParams();
  const [reportData, setReportData] = useState(null);
  const [imagenes, setImagenes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [idRegistro, setIdRegistro] = useState(null);

  // ✅ Cargar datos generales del reporte
  useEffect(() => {
    axios.get(`http://localhost:8000/api/datos-reporte/${idProceso}/${year}`)
      .then(res => {
        setReportData(res.data);
        console.log("Datos del repore Info General",res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Error al obtener el reporte:", err);
        setError("No se pudo cargar el reporte.");
        setLoading(false);
      });
  }, [idProceso, year]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/registros/idRegistro`, {
      params: {
        proceso: idProceso,
        año: year,
        apartado: 'Indicadores'
      }
    })
      .then(res => {
        setIdRegistro(res.data.idRegistro);
      })
      .catch(err => {
        console.error("❌ No se encontró el idRegistro:", err);
      });
  }, [idProceso, year]);

  // ✅ Función para recibir cada imagen generada
  const handleImagenGenerada = (tipo, base64) => {
    console.log(`📥 Recibida imagen de tipo: ${tipo}, longitud: ${base64?.length}`);
    setImagenes(prev => ({ ...prev, [tipo]: base64 }));
  };

  // ✅ Guardar imágenes y abrir PDF
  const handleDownload = async () => {
    try {
      for (const tipo in imagenes) {
        await axios.post('http://localhost:8000/api/graficas/guardar', {
          imagenBase64: imagenes[tipo],
          nombre: `${tipo}_${idProceso}_${year}`
        });
      }

      console.log("✅ Imágenes guardadas. Generando PDF...");
      window.open(`http://localhost:8000/api/generar-reporte/${idProceso}/${year}`, "_blank");
    } catch (error) {
      console.error("❌ Error al guardar imágenes:", error);
      alert("No se pudieron guardar las gráficas.");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" mb={3}> 
      {reportData ? `Reporte ${reportData.nombreProceso} ${reportData.entidad}` : "Reporte"} 
      </Typography>

      <GeneralInfo reportData={reportData} />
      <ManualOperativo idProceso={idProceso} />
      <GestionRiesgos idProceso={idProceso} anio={year} />


      <AnalisisDatos
        idProceso={idProceso}
        anio={year}
        idRegistro={idRegistro}
        onImagenGenerada={handleImagenGenerada}
      />
      <ProyectoMejora idProceso={idProceso} anio={year} />
      <Seguimiento idProceso={idProceso} anio={year} />
      <PlanAccion idProceso={idProceso} anio={year} />
      <Auditoria idProceso={idProceso} />


      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
        >
          Descargar PDF
        </Button>
      </Box>
    </Box>
  );
};

export default ReportView;
