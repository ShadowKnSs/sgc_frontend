// src/components/Tablas/TablaMapaProceso.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress
} from "@mui/material";
import axios from "axios";

const TablaMapaProceso = ({ idProceso, anio }) => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/indicadores/mapa-proceso/${idProceso}/${anio}`)
      .then(res => setDatos(res.data || []))
      
      .catch(err => {
        console.error("❌ Error al cargar datos MapaProceso:", err);
        setDatos([]);
      })
      .finally(() => setLoading(false));
  }, [idProceso, anio]);

  if (loading) return <CircularProgress />;
  if (!Array.isArray(datos) || datos.length === 0) return <Typography>No hay datos disponibles.</Typography>;

  const promedio = (campo) => {
    const valores = datos.map(d => parseFloat(d[campo]) || 0);
    return (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2);
  };

  console.log("Los datos para la tabla MP", datos);
  const interpretacion = datos[0]?.interpretacion ?? "No hay interpretación";
  const necesidad = datos[0]?.necesidad ?? "No hay necesidad";

  return (
    <Box sx={{ mt: 4, mx: 7, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>9.1.3 c) Desempeño del proceso</Typography>
      <Paper elevation={3}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#0e75cb' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción del Indicador</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Meta</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ene-Jun</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Jul-Dic</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.nombreIndicador}</TableCell>
                <TableCell align="center">{item.meta ?? '-'}</TableCell>
                <TableCell align="center">{item.resultadoSemestral1 ?? '-'}</TableCell>
                <TableCell align="center">{item.resultadoSemestral2 ?? '-'}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
              <TableCell colSpan={2}>Promedio</TableCell>
              <TableCell align="center">{promedio("meta")}</TableCell>
              <TableCell align="center">{promedio("resultadoSemestral1")}</TableCell>
              <TableCell align="center">{promedio("resultadoSemestral2")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}><strong>Interpretación:</strong> {interpretacion}</TableCell>
              <TableCell colSpan={3}><strong>Necesidad:</strong> {necesidad}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default TablaMapaProceso;
