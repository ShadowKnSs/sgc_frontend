import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import axios from "axios";

const Auditoria = ({ idProceso }) => {
  const [auditorias, setAuditorias] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (idProceso) {
      axios
        .get(`http://localhost:8000/api/auditoria/${idProceso}`)
        .then((response) => {
          setAuditorias(response.data);
        })
        .catch((err) => {
          console.error("❌ Error al obtener auditorías:", err);
          setError("Error al cargar las auditorías. Por favor, inténtelo de nuevo más tarde.");
        });
    }
  }, [idProceso]);

  return (
    <Box sx={{
      mt: 2,
      p: 3,
      borderRadius: 2,
      boxShadow: 3,
      backgroundColor: "#fff",
      margin: 7,
    }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 , color: "primary.main"}}>
        Auditorías
      </Typography>

      {error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!error && auditorias.length === 0 && (
        <Alert severity="info">No hay auditorías registradas.</Alert>
      )}

      {!error && auditorias.length > 0 && (
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
      )}
    </Box>
  );
};

export default Auditoria;
