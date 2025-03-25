import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress } from "@mui/material";
import axios from "axios";

const TablaEvaluacionProveedores = ({ idProceso, anio }) => {
    const [datos, setData] = useState({ indicadores: [], interpretacion: '', necesidad: '' });
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/indicadores/evaluacion-proveedores/${idProceso}/${anio}`)
      .then(res => setData(res.data || { indicadores: [], interpretacion: '', necesidad: '' }))
      .catch(err => console.error("Error al cargar datos:", err))
      .finally(() => setLoading(false));
  }, [idProceso, anio]);

  if (loading) return <CircularProgress />;
  if (!Array.isArray(datos.indicadores) || datos.indicadores.length === 0) {
    return <Typography color="error">No se encontraron datos.</Typography>;
  }
  const interpretacion = datos[0]?.interpretacion ?? 'No disponible';
  const necesidad = datos[0]?.necesidad ?? 'No disponible';
  console.log("Datos de ultima tabla", datos);

  return (
    <Box sx={{ mt: 4, mx: 7, p: 3, bgcolor: "#fff", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        9.1.3 f) Desempeño de Proveedores Externos
      </Typography>
      <Paper elevation={3}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Nombre del Indicador</TableCell>
              <TableCell>Meta</TableCell>
              <TableCell>Ene-Jun</TableCell>
              <TableCell>Jul-Dic</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.indicadores.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.categoria}</TableCell>
                <TableCell>{item.meta ?? "No disponible"}</TableCell>
                <TableCell>{item.resultado1 ?? "-"}</TableCell>
                <TableCell>{item.resultado2 ?? "-"}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2}><strong>Interpretación:</strong></TableCell>
              <TableCell colSpan={3}>{interpretacion}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}><strong>Necesidad de Mejora:</strong></TableCell>
              <TableCell colSpan={3}>{necesidad}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default TablaEvaluacionProveedores;
