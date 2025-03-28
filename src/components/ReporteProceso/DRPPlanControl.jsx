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
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const PlanControl = ({ idProceso }) => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanControl = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/actividadcontrol`, {
          params: { proceso: idProceso },
        });
        setActividades(response.data);
      } catch (error) {
        console.error("❌ Error al obtener el plan de control:", error);
      } finally {
        setLoading(false);
      }
    };

    if (idProceso) fetchPlanControl();
  }, [idProceso]);

  return (
    <Box sx={{mt: 3 ,borderRadius: 2, boxShadow: 3, backgroundColor: "#fff",p:3, marginLeft: 4, marginRight: 4}}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color:"primary.main"}}>
        Plan de Control
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : actividades.length > 0 ? (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{backgroundColor:"primary.main", color:"white"}}><strong>Actividad</strong></TableCell>
                <TableCell sx={{backgroundColor:"primary.main", color:"white"}}><strong>Procedimiento</strong></TableCell>
                <TableCell sx={{backgroundColor:"primary.main", color:"white"}}><strong>Características a Verificar</strong></TableCell>
                <TableCell sx={{backgroundColor:"primary.main", color:"white"}}><strong>Criterio de Aceptación</strong></TableCell>
                <TableCell sx={{backgroundColor:"primary.main", color:"white"}}><strong>Frecuencia</strong></TableCell>
                <TableCell sx={{backgroundColor:"primary.main", color:"white"}}><strong>Identificación de la Salida</strong></TableCell>
                <TableCell sx={{backgroundColor:"primary.main", color:"white"}}><strong>Tratamiento</strong></TableCell>
                <TableCell sx={{backgroundColor:"primary.main", color:"white"}}><strong>Registro de la Salida</strong></TableCell>
                <TableCell sx={{backgroundColor:"primary.main", color:"white"}}><strong>Responsable</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {actividades.map((act) => (
                <TableRow key={act.idActividad}>
                  <TableCell>{act.nombreActividad}</TableCell>
                  <TableCell>{act.procedimiento}</TableCell>
                  <TableCell>{act.caracteriticasVerificar}</TableCell>
                  <TableCell>{act.criterioAceptacion}</TableCell>
                  <TableCell>{act.frecuencia}</TableCell>
                  <TableCell>{act.identificacionSalida}</TableCell>
                  <TableCell>{act.tratamiento}</TableCell>
                  <TableCell>{act.registroSalida}</TableCell>
                  <TableCell>{act.responsable}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography color="text.secondary">No hay actividades registradas.</Typography>
      )}
    </Box>
  );
};

export default PlanControl;
