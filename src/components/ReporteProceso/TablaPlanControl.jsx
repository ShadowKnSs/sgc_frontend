import React, { useEffect, useState } from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Typography, Paper, CircularProgress } from "@mui/material";
import axios from "axios";

const TablaPlanControl = ({ idProceso, anio }) => {
  const [indicadores, setIndicadores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/indicadores/actividad-control/${idProceso}/${anio}`)
      .then(res => {
        console.log("📦 Datos recibidos del backend:", res.data);
        setIndicadores(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar los indicadores de Plan de Control:", err);
        setLoading(false);
      });
  }, [idProceso, anio]);

  if (loading) return <CircularProgress />;

  const promedio = (campo) => {
    const valores = indicadores.map(i => parseFloat(i[campo]) || 0);
    return (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2);
  };

  const interpretacion = indicadores[0]?.interpretacion || "No disponible";
  const necesidad = indicadores[0]?.necesidad || "No disponible";

  return (
    <Box sx={{ mt: 2, margin: 7, borderRadius: 2, boxShadow: 3, backgroundColor: "#fff", p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}>
        Análisis de Datos - Plan de Control
      </Typography>

      <Paper elevation={3}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#0e75cb' }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>No</TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Descripción de los Indicadores</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Meta</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }} colSpan={2} align="center">Periodo de Medición</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Plan de Control</TableCell>
              <TableCell />
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Ene-Jun</TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Jul-Dic</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {indicadores.map((indicador, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{indicador.nombreIndicador}</TableCell>
                <TableCell>{indicador.meta}</TableCell>
                <TableCell align="center">{indicador.resultadoSemestral1}</TableCell>
                <TableCell align="center">{indicador.resultadoSemestral2}</TableCell>
              </TableRow>
            ))}
            {/* Promedio */}
            <TableRow>
              <TableCell colSpan={2}><strong>Promedio</strong></TableCell>
              <TableCell>{promedio('meta')}</TableCell>
              <TableCell align="center">{promedio('resultadoSemestral1')}</TableCell>
              <TableCell align="center">{promedio('resultadoSemestral2')}</TableCell>
            </TableRow>

            {/* Interpretación y Necesidad - UNA SOLA FILA */}
            <TableRow>
              <TableCell colSpan={5}>
                <strong>Interpretación:</strong> {interpretacion}<br />
                <strong>Necesidad de mejora:</strong> {necesidad}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default TablaPlanControl;
