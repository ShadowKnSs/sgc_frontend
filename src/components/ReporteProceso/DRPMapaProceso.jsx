import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from "@mui/material";

const MapaProceso = ({ mapaProceso }) => {
  return (
    <Box
      sx={{
        mb: 4,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#fff",
        margin: 4,
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}
      >
        Mapa de Proceso
      </Typography>

      {!mapaProceso && (
        <Alert severity="error">No existe información</Alert>
      )}

      {mapaProceso && (
        <>
          {/* Documentos Relacionados */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              <strong>Documentos Relacionados:</strong>{" "}
              {mapaProceso.documentos || "No disponible"}
            </Typography>
          </Box>

          {/* Puestos Involucrados */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1">
              <strong>Puestos Involucrados:</strong>{" "}
              {mapaProceso.puestosInvolucrados || "No disponible"}
            </Typography>
          </Box>

          {/* Tabla 1: Fuente de Entrada y Entradas */}
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ backgroundColor: "primary.main", color: "white" }}
                    align="center"
                  >
                    <strong>Fuente de Entrada</strong>
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "primary.main", color: "white" }}
                    align="center"
                    colSpan={2}
                  >
                    <strong>Entradas</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ backgroundColor: "primary.main", color: "white" }} />
                  <TableCell
                    sx={{ backgroundColor: "primary.main", color: "white" }}
                    align="center"
                  >
                    <strong>Material y/o Información</strong>
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "primary.main", color: "white" }}
                    align="center"
                  >
                    <strong>Requisito de Entrada</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">
                    {mapaProceso.fuente || "No disponible"}
                  </TableCell>
                  <TableCell align="center">
                    {mapaProceso.material || "No disponible"}
                  </TableCell>
                  <TableCell align="center">
                    {mapaProceso.requisitos || "No disponible"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Tabla 2: Salidas y Receptores de Salidas/Cliente */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ backgroundColor: "primary.main", color: "white" }}
                    align="center"
                  >
                    <strong>Salidas</strong>
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "primary.main", color: "white" }}
                    align="center"
                  >
                    <strong>Receptores de Salidas/Cliente</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">
                    {mapaProceso.salidas || "No disponible"}
                  </TableCell>
                  <TableCell align="center">
                    {mapaProceso.receptores || "No disponible"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default MapaProceso;
