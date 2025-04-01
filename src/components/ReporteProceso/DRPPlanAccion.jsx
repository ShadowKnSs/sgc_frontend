import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Alert,
} from '@mui/material';

const PlanAccion = ({ idProceso, anio }) => {
  const [planCorrectivo, setPlanCorrectivo] = useState(null);
  const [actividadesPlan, setActividadesPlan] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!idProceso || !anio) return;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/plan-correctivo/${idProceso}/${anio}`);
        console.log("Respuesta de la API:", response.data);
        if (response.data) {
          setPlanCorrectivo(response.data.planCorrectivo);
          setActividadesPlan(response.data.actividadesPlan || []);
        } else {
          setError("Formato de respuesta no válido");
        }
      } catch (error) {
        console.error("❌ Error al obtener los datos:", error);
        setError("Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.");
      }
    };
    fetchData();
  }, [idProceso, anio]);

  return (
    <Box sx={{ mt: 2, p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: "#fff", margin: 7 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}>
        Plan Correctivo
      </Typography>

      {error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!error && !planCorrectivo && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No hay datos del plan correctivo.
        </Alert>
      )}

      {!error && planCorrectivo && (
        <>
          {/* Información básica del plan */}
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell><strong>Coordinador:</strong></TableCell>
                  <TableCell>{planCorrectivo.coordinadorPlan}</TableCell>
                  <TableCell><strong>Codigo:</strong></TableCell>
                  <TableCell>{planCorrectivo.codigo}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Fecha:</strong></TableCell>
                  <TableCell colSpan={3}>{planCorrectivo.fechaInicio}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Origen de la no conformidad:
          </Typography>
          <Typography>{planCorrectivo.origenConformidad}</Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Equipo de mejora:
          </Typography>
          <Typography>{planCorrectivo.equipoMejora}</Typography>
    
          {/* Actividades */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Actividades de reaccion:
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Actividad</strong></TableCell>
                  <TableCell><strong>Responsable</strong></TableCell>
                  <TableCell><strong>Fecha Programada</strong></TableCell>
                  <TableCell><strong>Tipo</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actividadesPlan.map((actividad, index) => (
                  <TableRow key={index}>
                    <TableCell>{actividad.descripcionAct}</TableCell>
                    <TableCell>{actividad.responsable}</TableCell>
                    <TableCell>{actividad.fechaProgramada}</TableCell>
                    <TableCell>{actividad.tipo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Revision y analisis:
          </Typography>
          <Typography>{planCorrectivo.revisionAnalisis}</Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Causa Raiz:
          </Typography>
          <Typography>{planCorrectivo.causaRaiz}</Typography>
        </>
      )}
    </Box>
  );
};

export default PlanAccion;
