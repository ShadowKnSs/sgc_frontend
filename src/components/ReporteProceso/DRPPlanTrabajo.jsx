import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import axios from 'axios';

const DRPPlanTrabajo = ({ idProceso, anio }) => {
  const [planTrabajoData, setPlanTrabajoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanTrabajo = async () => {
      if (!idProceso || !anio) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/plan-trabajo/${idProceso}/${anio}`);
        setPlanTrabajoData(response.data);
      } catch (err) {
        console.error('Error al obtener el plan de trabajo:', err);
        setError(err.response?.data?.error || 'Error al cargar el plan de trabajo');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanTrabajo();
  }, [idProceso, anio]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!planTrabajoData) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No hay plan de trabajo registrado.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main' }}>
        Plan de Trabajo
      </Typography>

      {/* Información general del plan de trabajo */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Información General</Typography>
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Elaboración</TableCell>
                <TableCell>{planTrabajoData.planTrabajo.fechaElaboracion || 'No especificado'}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Objetivo</TableCell>
                <TableCell>{planTrabajoData.planTrabajo.objetivo || 'No especificado'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Revisión</TableCell>
                <TableCell>{planTrabajoData.planTrabajo.fechaRevision || 'No especificado'}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Revisado Por</TableCell>
                <TableCell>{planTrabajoData.planTrabajo.revisadoPor || 'No especificado'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Responsable</TableCell>
                <TableCell>{planTrabajoData.planTrabajo.responsable || 'No especificado'}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell>
                  <Chip 
                    label={planTrabajoData.planTrabajo.estado || 'No especificado'} 
                    color={planTrabajoData.planTrabajo.estado === 'Cerrado' ? 'success' : 'primary'} 
                    size="small" 
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Fuente</TableCell>
                <TableCell>{planTrabajoData.planTrabajo.fuente || 'No especificado'}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Entregable</TableCell>
                <TableCell>{planTrabajoData.planTrabajo.entregable || 'No especificado'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Tabla de fuentes */}
      {planTrabajoData.fuentes && planTrabajoData.fuentes.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Fuentes Documentales</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>No. Actividad</TableCell>
                  <TableCell>Responsable</TableCell>
                  <TableCell>Fecha Inicio</TableCell>
                  <TableCell>Fecha Término</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Nombre Fuente</TableCell>
                  <TableCell>Elemento Entrada</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Entregable</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {planTrabajoData.fuentes.map((fuente, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{fuente.noActividad || '-'}</TableCell>
                    <TableCell>{fuente.responsable || '-'}</TableCell>
                    <TableCell>{fuente.fechaInicio || '-'}</TableCell>
                    <TableCell>{fuente.fechaTermino || '-'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={fuente.estado || '-'} 
                        color={fuente.estado === 'Cerrado' ? 'success' : 'primary'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{fuente.nombreFuente || '-'}</TableCell>
                    <TableCell>{fuente.elementoEntrada || '-'}</TableCell>
                    <TableCell>{fuente.descripcion || '-'}</TableCell>
                    <TableCell>{fuente.entregable || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default DRPPlanTrabajo;