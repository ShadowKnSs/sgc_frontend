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

const Seguimiento = ({ idProceso, anio }) => {
  const [seguimientos, setSeguimientos] = useState([]);
  const [compromisos, setCompromisos] = useState([]);
  const [asistentes, setAsistentes] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!idProceso || !anio) return;

      try {
        const response = await axios.get(`http://localhost:8000/api/seguimiento/${idProceso}/${anio}`);
        console.log("Respuesta de la API:", response.data);

        if (response.data && Array.isArray(response.data.seguimientos)) {
          setSeguimientos(response.data.seguimientos);
          setCompromisos(response.data.compromisos || []);
          setAsistentes(response.data.asistentes || []);
          setActividades(response.data.actividades || []);
        } else {
          setError("Formato de respuesta no válido");
        }
      } catch (err) {
        console.error("❌ Error al obtener los datos:", err);
        setError("Error al cargar los datos");
      }
    };

    fetchData();
  }, [idProceso, anio]);

  return (
    <Box sx={{
      mt: 2,
      p: 3,
      borderRadius: 2,
      boxShadow: 3,
      backgroundColor: "#fff",
      margin: 7,
    }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}>
        Seguimiento
      </Typography>

      {error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!error && seguimientos.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No hay seguimientos registrados.
        </Alert>
      )}

      {!error &&
        seguimientos.length > 0 &&
        seguimientos.map((seguimiento) => {
          const compromisosSeg = compromisos.filter(
            (c) => c.idSeguimiento === seguimiento.idSeguimiento
          );
          const asistentesSeg = asistentes.filter(
            (a) => a.idSeguimiento === seguimiento.idSeguimiento
          );
          const actividadesSeg = actividades.filter(
            (a) => a.idSeguimiento === seguimiento.idSeguimiento
          );

          return (
            <Box key={seguimiento.idSeguimiento} sx={{ mb: 4 }}>
              <Typography variant="h6">Minuta</Typography>
              <Typography variant="subtitle1">Asistentes:</Typography>

              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Nombre</strong>
                      </TableCell>
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

              <Typography>
                <strong>Lugar:</strong> {seguimiento.lugar}
              </Typography>
              <Typography>
                <strong>Fecha:</strong> {seguimiento.fecha}
              </Typography>
              <Typography>
                <strong>Duración:</strong> {seguimiento.duracion}
              </Typography>

              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Actividades:
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>No</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Actividades Realizadas</strong>
                      </TableCell>
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

              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Compromisos:
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>No</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Compromisos</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Responsable</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Fecha</strong>
                      </TableCell>
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
        })}
    </Box>
  );
};

export default Seguimiento;
