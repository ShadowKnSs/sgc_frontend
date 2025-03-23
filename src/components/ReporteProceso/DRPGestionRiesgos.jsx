import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress
} from "@mui/material";
import axios from "axios";

const GestionRiesgos = ({ idProceso, anio }) => {
  const [riesgos, setRiesgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerRiesgos = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/gestion-riesgos/${idProceso}/${anio}`);
        setRiesgos(response.data.riesgos);
      } catch (error) {
        console.error("❌ Error al obtener riesgos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (idProceso && anio) {
      obtenerRiesgos();
    }
  }, [idProceso, anio]);

  const getColor = (valorNRP, reevaluacionNRP) => {
    return valorNRP >= reevaluacionNRP ? "green" : "red";
  };

  return (
    <Box sx={{ mt: 2, margin: 7,borderRadius: 2, boxShadow: 3, backgroundColor: "#fff",p:3,}}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "primary.main"}}>
        Gestión de Riesgos
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : riesgos.length === 0 ? (
        <Typography>No se encontraron riesgos registrados.</Typography>
      ) : (
        <>
          {/* Tabla 1: Identificación */}
          <Typography variant="h6" sx={{ mt: 3, paddingLeft: 2, color:"secondary.main", fontWeight: "bold"}}>1. Identificación</Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table size="small">
              <TableHead sx={{backgroundColor:"primary.main"}}>
                <TableRow>
                  <TableCell sx={{color:"white",fontWeight: "bold"}}>No</TableCell>
                  <TableCell sx={{color:"white",fontWeight: "bold"}}>Fuente</TableCell>
                  <TableCell sx={{color:"white",fontWeight: "bold"}}>Tipo</TableCell>
                  <TableCell sx={{color:"white",fontWeight: "bold"}}>Descripción de Riesgo/Oportunidad</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {riesgos.map((r, index) => (
                  <TableRow key={r.idRiesgo}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{r.fuente}</TableCell>
                    <TableCell>{r.tipoRiesgo}</TableCell>
                    <TableCell>{r.descripcion}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Tabla 2: Análisis */}
          <Typography variant="h6"  sx={{ mt: 3, paddingLeft: 2, color:"secondary.main", fontWeight: "bold"}}>2. Análisis</Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table size="small">
              <TableHead sx={{backgroundColor:"primary.main", color:"white",fontWeight: "bold"}}>
                <TableRow>
                  <TableCell sx={{color:"white",fontWeight: "bold"}}>Consecuencias</TableCell>
                  <TableCell sx={{color:"white",fontWeight: "bold"}}>Severidad</TableCell>
                  <TableCell sx={{color:"white",fontWeight: "bold"}}>Ocurrencia</TableCell>
                  <TableCell sx={{color:"white",fontWeight: "bold"}}>NRP</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {riesgos.map((r) => (
                  <TableRow key={r.idRiesgo}>
                    <TableCell >{r.consecuencias}</TableCell>
                    <TableCell >{r.valorSeveridad}</TableCell>
                    <TableCell >{r.valorOcurrencia}</TableCell>
                    <TableCell >{r.valorNRP}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Tabla 3: Tratamiento */}
          <Typography variant="h6"  sx={{ mt: 3, paddingLeft: 2, color:"secondary.main", fontWeight: "bold"}}>3. Tratamiento</Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table size="small">
              <TableHead sx={{backgroundColor:"primary.main"}}>
                <TableRow>
                  <TableCell sx={{color:"white",fontWeight: "bold"}}>Actividades</TableCell>
                  <TableCell sx={{color:"white",fontWeight: "bold"}}>Acciones de Mejora</TableCell>
                  <TableCell sx={{color:"white",fontWeight: "bold"}}>Responsable</TableCell>
                  <TableCell sx={{color:"white",fontWeight: "bold"}}>Fecha Implementación</TableCell>
                  <TableCell sx={{color:"white",fontWeight: "bold"}}>Fecha Evaluación</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {riesgos.map((r) => (
                  <TableRow key={r.idRiesgo}>
                    <TableCell>{r.actividades}</TableCell>
                    <TableCell>{r.accionMejora}</TableCell>
                    <TableCell>{r.responsable}</TableCell>
                    <TableCell>{r.fechaImp?.split("T")[0]}</TableCell>
                    <TableCell>{r.fechaEva?.split("T")[0]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Tabla 4: Evaluación de la Efectividad */}
          <Typography variant="h6"  sx={{ mt: 3, paddingLeft: 2, color:"secondary.main", fontWeight: "bold"}}>4. Evaluación de la Efectividad</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{backgroundColor:"primary.main"}}>
                <TableRow>
                  <TableCell sx={{color:"white",fontWeight: "bold"}}>Reevaluación Severidad</TableCell>
                  <TableCell sx={{color:"white",fontWeight: "bold"}}>Reevaluación Ocurrencia</TableCell>
                  <TableCell sx={{color:"white",fontWeight: "bold"}}>NRP</TableCell>
                  <TableCell sx={{color:"white",fontWeight: "bold"}}>Efectividad</TableCell>
                  <TableCell sx={{color:"white",fontWeight: "bold"}}>Análisis de la Efectividad</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {riesgos.map((r) => {
                  const color = getColor(r.valorNRP, r.reevaluacionNRP);
                  const esEfectivo = r.valorNRP >= r.reevaluacionNRP;
                  return (
                    <TableRow key={r.idRiesgo}>
                      <TableCell>{r.reevaluacionSeveridad}</TableCell>
                      <TableCell>{r.reevaluacionOcurrencia}</TableCell>
                      <TableCell>{r.reevaluacionNRP}</TableCell>
                      <TableCell sx={{ color: "#fff", backgroundColor: color, fontWeight: "bold", textAlign: "center" }}>
                        {esEfectivo ? "" : ""}
                      </TableCell>
                      <TableCell>{r.analisisEfectividad}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default GestionRiesgos;
