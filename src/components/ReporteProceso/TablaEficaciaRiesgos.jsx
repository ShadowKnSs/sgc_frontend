import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";

const TablaEficaciaRiesgos = ({ idProceso, anio }) => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/indicadores/eficacia-riesgos/${idProceso}/${anio}`)
      .then((res) => {
        console.log("📊 Datos de eficacia de riesgos:", res.data);
        setDatos(res.data);
      })
      .catch((err) => {
        console.error("❌ Error al cargar eficacia de riesgos:", err);
      })
      .finally(() => setLoading(false));
  }, [idProceso, anio]);

  if (loading) return <CircularProgress />;
  if (!Array.isArray(datos) || datos.length === 0)
    return <Alert severity="info">No se encontraron datos de eficacia de riesgos.</Alert>;

  // Se asume que la interpretación y necesidad es general
  const interpretacion = datos[0]?.interpretacion ?? "No disponible";
  const necesidad = datos[0]?.necesidad ?? "No disponible";

  return (
    <Box sx={{ mt: 4, mx: 7, p: 3, bgcolor: "#fff", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        9.1.3 e) Eficacia de los riesgos y oportunidades
      </Typography>

      <Paper elevation={3}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#0e75cb" }}>
              <TableCell sx={{ color: "#fff" }}>No</TableCell>
              <TableCell sx={{ color: "#fff" }}>Nombre del Indicador</TableCell>
              <TableCell sx={{ color: "#fff" }}>Meta</TableCell>
              <TableCell sx={{ color: "#fff" }}>Resultado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.map((item, index) => (
              <TableRow key={item.idIndicador}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.nombreIndicador}</TableCell>
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: item.meta == null ? "#ffe0e0" : "transparent",
                    fontStyle: item.meta == null ? "italic" : "normal",
                    color: item.meta == null ? "#b00020" : "inherit"
                  }}
                >
                  {item.meta ?? "No asignada"}
                </TableCell>
                <TableCell align="center">{item.resultadoAnual ?? "-"}</TableCell>
              </TableRow>
            ))}

            {/* 🔍 Fila para interpretación y necesidad de mejora */}
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell colSpan={2}><strong>Interpretación:</strong></TableCell>
              <TableCell colSpan={2}>{interpretacion}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell colSpan={2}><strong>Necesidad de mejora:</strong></TableCell>
              <TableCell colSpan={2}>{necesidad}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default TablaEficaciaRiesgos;
