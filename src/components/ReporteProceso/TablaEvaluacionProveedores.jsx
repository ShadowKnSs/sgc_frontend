import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress } from "@mui/material";
import axios from "axios";

const TablaEvaluacionProveedores = ({ idProceso, anio }) => {
  const [datos, setData] = useState({ indicadores: [], interpretacion: '', necesidad: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/indicadores/evaluacion-proveedores/${idProceso}/${anio}`)
      .then(res => {
        const indicador = res.data[0];
        if (!indicador) return;

        const indicadores = [
          {
            categoria: "Confiable",
            meta: indicador.metaConfiable,
            resultado1: indicador.resultadoConfiableSem1,
            resultado2: indicador.resultadoConfiableSem2,
          },
          {
            categoria: "Condicionado",
            meta: indicador.metaCondicionado,
            resultado1: indicador.resultadoCondicionadoSem1,
            resultado2: indicador.resultadoCondicionadoSem2,
          },
          {
            categoria: "No Confiable",
            meta: indicador.metaNoConfiable,
            resultado1: indicador.resultadoNoConfiableSem1,
            resultado2: indicador.resultadoNoConfiableSem2,
          },
        ];

        setData({
          indicadores,
          interpretacion: indicador.interpretacion,
          necesidad: indicador.necesidad,
        });
      })

      .catch(err => console.error("Error al cargar datos:", err))
      .finally(() => setLoading(false));
  }, [idProceso, anio]);


  if (loading) return <CircularProgress />;
  if (!Array.isArray(datos.indicadores) || datos.indicadores.length === 0) {
    return <Typography color="error">No se encontraron datos.</Typography>;
  }
  const interpretacion = datos.interpretacion ?? 'No disponible';
  const necesidad = datos.necesidad ?? 'No disponible';
  console.log("Datos de ultima tabla", datos);

  return (
    <Box sx={{ mt: 4, mx: 7, p: 3, bgcolor: "#fff", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}>
        9.1.3 f) Desempeño de Proveedores Externos
      </Typography>

      <Paper elevation={3}>
        <Table size="small">
          <TableHead sx={{ bgcolor: '#0e75cb' }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>No</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Categoría</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Meta</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Ene-Jun</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Jul-Dic</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.indicadores.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.categoria}</TableCell>
                <TableCell>{item.meta}</TableCell>
                <TableCell>{item.resultado1}</TableCell>
                <TableCell>{item.resultado2}</TableCell>
              </TableRow>
            ))}

            {/* Interpretación */}
            <TableRow>
              <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Interpretación:</TableCell>
              <TableCell colSpan={3}>{interpretacion}</TableCell>
            </TableRow>

            {/* Necesidad de mejora */}
            <TableRow>
              <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Necesidad de Mejora:</TableCell>
              <TableCell colSpan={3}>{necesidad}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>

  )
};

export default TablaEvaluacionProveedores;
