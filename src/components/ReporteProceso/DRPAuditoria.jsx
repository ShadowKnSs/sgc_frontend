import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const Auditoria = ({ idProceso }) => {
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditorias = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/auditoria/${idProceso}`);
        setAuditorias(response.data);
      } catch (error) {
        console.error("❌ Error al obtener auditorías:", error);
      } finally {
        setLoading(false);
      }
    };

    if (idProceso) fetchAuditorias();
  }, [idProceso]);

  return (
    <Box sx={{ mt: 5, margin: 7 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Auditorías
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : auditorias.length > 0 ? (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "primary.main", color: "white" }}>
                  <strong>Fecha Programada</strong>
                </TableCell>
                <TableCell sx={{ backgroundColor: "primary.main", color: "white" }}>
                  <strong>Hora Programada</strong>
                </TableCell>
                <TableCell sx={{ backgroundColor: "primary.main", color: "white" }}>
                  <strong>Tipo</strong>
                </TableCell>
                <TableCell sx={{ backgroundColor: "primary.main", color: "white" }}>
                  <strong>Estado</strong>
                </TableCell>
                <TableCell sx={{ backgroundColor: "primary.main", color: "white" }}>
                  <strong>Descripción</strong>
                </TableCell>
                <TableCell sx={{ backgroundColor: "primary.main", color: "white" }}>
                  <strong>Entidad</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auditorias.map((auditoria) => (
                <TableRow key={auditoria.id}>
                  <TableCell>{auditoria.fechaProgramada || "No disponible"}</TableCell>
                  <TableCell>{auditoria.horaProgramada || "No disponible"}</TableCell>
                  <TableCell>{auditoria.tipoAuditoria || "No disponible"}</TableCell>
                  <TableCell>{auditoria.estado || "No disponible"}</TableCell>
                  <TableCell>{auditoria.descripcion || "No disponible"}</TableCell>
                  <TableCell>{auditoria.nombreEntidad || "No disponible"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography color="text.secondary">No hay auditorías registradas.</Typography>
      )}
    </Box>
  );
};

export default Auditoria;
