import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';

const ProyectoMejora = ({ idProceso, anio }) => {
  const [proyectoMejora, setProyectoMejora] = useState(null);
  const [recursos, setRecursos] = useState([]);
  const [actividadesPM, setActividadesPM] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!idProceso || !anio) {
        setLoading(false);
        return;
      }

      try {
        // Obtener los datos de la API
        const response = await axios.get(`http://127.0.0.1:8000/api/proyecto-mejora/${idProceso}/${anio}`);
        console.log("Respuesta de la API:", response.data);

        // Verificar y asignar los datos
        if (response.data) {
          setProyectoMejora(response.data.proyectoMejora);
          setRecursos(response.data.recursos || []);
          setActividadesPM(response.data.actividadesPM || []);
        } else {
          setError("Formato de respuesta no válido");
        }
      } catch (error) {
        console.error("❌ Error al obtener los datos:", error);
        setError("Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idProceso, anio]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!proyectoMejora) {
    return <Typography color="text.secondary">No hay datos del proyecto de mejora.</Typography>;
  }

  return (
    <Box sx={{ mt: 5, margin: 7 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Proyecto de Mejora
      </Typography>

      {/* Información básica del proyecto */}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell><strong>Fecha:</strong></TableCell>
              <TableCell>{proyectoMejora.fecha}</TableCell>
              <TableCell><strong>No. Mejora:</strong></TableCell>
              <TableCell>{proyectoMejora.noMejora}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Descripción de la mejora:</strong></TableCell>
              <TableCell colSpan={3}>{proyectoMejora.descripcionMejora}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Objetivos/Beneficios de la mejora */}
      <Typography variant="h6" sx={{ mt: 2 }}>Objetivos/Beneficio de la mejora:</Typography>
      <Typography>{proyectoMejora.objetivo}</Typography>

      {/* Áreas de impacto/Personal beneficiado */}
      <Typography variant="h6" sx={{ mt: 2 }}>Áreas de impacto/Personal beneficiado:</Typography>
      <Typography>{proyectoMejora.areaImpacto}</Typography>

      {/* Responsables involucrados */}
      <Typography variant="h6" sx={{ mt: 2 }}>Responsables involucrados:</Typography>
      <Typography>{proyectoMejora.responsable}</Typography>

      {/* Situación actual */}
      <Typography variant="h6" sx={{ mt: 2 }}>Situación actual:</Typography>
      <Typography>{proyectoMejora.situacionActual}</Typography>

      {/* Indicadores de Éxito */}
      <Typography variant="h6" sx={{ mt: 2 }}>Indicadores de Éxito:</Typography>
      <Typography>{proyectoMejora.indicadorExito}</Typography>

      {/* Recursos */}
      <Typography variant="h6" sx={{ mt: 2 }}>Recursos:</Typography>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Descripción</strong></TableCell>
              <TableCell><strong>Recursos Materiales y Humanos</strong></TableCell>
              <TableCell><strong>Costo estimado</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recursos.map((recurso, index) => (
              <TableRow key={index}>
                <TableCell>{recurso.descripcionRec}</TableCell>
                <TableCell>{recurso.recursosMatHum}</TableCell>
                <TableCell>{recurso.costo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Actividades */}
      <Typography variant="h6" sx={{ mt: 2 }}>Actividades:</Typography>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Descripción</strong></TableCell>
              <TableCell><strong>Responsable</strong></TableCell>
              <TableCell><strong>Fecha</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actividadesPM.map((actividad, index) => (
              <TableRow key={index}>
                <TableCell>{actividad.descripcionAct}</TableCell>
                <TableCell>{actividad.responsable}</TableCell>
                <TableCell>{actividad.fecha}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProyectoMejora;