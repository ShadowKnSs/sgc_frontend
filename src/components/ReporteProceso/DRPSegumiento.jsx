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

const Seguimiento = ({ idProceso, anio }) => {
  const [seguimientos, setSeguimientos] = useState([]);
  const [compromisos, setCompromisos] = useState([]);
  const [asistentes, setAsistentes] = useState([]);
  const [actividades, setActividades] = useState([]);
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
        const response = await axios.get(`http://localhost:8000/api/seguimiento/${idProceso}/${anio}`);
        console.log("Respuesta de la API:", response.data);

        // Verificar y asignar los datos
        if (response.data && Array.isArray(response.data.seguimientos)) {
          setSeguimientos(response.data.seguimientos);
          setCompromisos(response.data.compromisos || []);
          setAsistentes(response.data.asistentes || []);
          setActividades(response.data.actividades || []);
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

  return (
    <Box sx={{ mt: 5, margin: 7 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Seguimiento
      </Typography>

      {seguimientos.length > 0 ? (
        seguimientos.map((seguimiento) => {
          // Filtrar los datos relacionados con este seguimiento
          const compromisosSeg = compromisos.filter((c) => c.idSeguimiento === seguimiento.idSeguimiento);
          const asistentesSeg = asistentes.filter((a) => a.idSeguimiento === seguimiento.idSeguimiento);
          const actividadesSeg = actividades.filter((a) => a.idSeguimiento === seguimiento.idSeguimiento);

          return (
            <Box key={seguimiento.idSeguimiento} sx={{ mb: 4 }}>
              <Typography variant="h6">Minuta</Typography>
              <Typography variant="subtitle1">Asistentes:</Typography>

              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Nombre</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {asistentesSeg.map((asistente, index) => (
                      <TableRow key={index}>
                        <TableCell>{asistente.nombre}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography><strong>Lugar:</strong> {seguimiento.lugar}</Typography>
              <Typography><strong>Fecha:</strong> {seguimiento.fecha}</Typography>
              <Typography><strong>Duración:</strong> {seguimiento.duracion}</Typography>

              <Typography variant="subtitle1" sx={{ mt: 2 }}>Actividades:</Typography>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>No</strong></TableCell>
                      <TableCell><strong>Actividades Realizadas</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {actividadesSeg.map((actividad, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{actividad.descripcion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="subtitle1" sx={{ mt: 2 }}>Compromisos:</Typography>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>No</strong></TableCell>
                      <TableCell><strong>Compromisos</strong></TableCell>
                      <TableCell><strong>Responsable</strong></TableCell>
                      <TableCell><strong>Fecha</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {compromisosSeg.map((compromiso, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{compromiso.descripcion}</TableCell>
                        <TableCell>{compromiso.responsables}</TableCell>
                        <TableCell>{compromiso.fecha}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <hr style={{ marginTop: 20, marginBottom: 20 }} />
            </Box>
          );
        })
      ) : (
        <Typography color="text.secondary">No hay seguimientos registrados.</Typography>
      )}
    </Box>
  );
};

export default Seguimiento;