import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  CircularProgress,
  Pagination
} from "@mui/material";
import { useParams } from "react-router-dom";

const ControlCambios = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const { idProceso } = useParams();

  const formatDate = (fecha) => fecha.split(" ")[0];

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/controlcambios/proceso/${idProceso}`
        );
        const ordenados = [...response.data].sort(
          (a, b) => new Date(b.fechaRevision) - new Date(a.fechaRevision)
        );
        setData(ordenados);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idProceso]);

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(data.length / rowsPerPage);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "80%", margin: "auto", mt: 1 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", color: "#0056b3", mb: 2 }}
      >
        CONTROL DE CAMBIOS
      </Typography>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 3, overflowX: "auto", minWidth: 600 }}
          >
            <Table>
              <TableBody>
                <TableRow sx={{ bgcolor: "#0056b3", color: "white" }}>
                  <TableCell
                    sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}
                  >
                    SECCIÓN
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}
                  >
                    EDICIÓN
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}
                  >
                    VERSIÓN
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}
                  >
                    FECHA DE REVISIÓN
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}
                  >
                    DESCRIPCIÓN
                  </TableCell>
                </TableRow>
                {paginatedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{row.seccion}</TableCell>
                    <TableCell align="center">{row.edicion}</TableCell>
                    <TableCell align="center">{row.version}</TableCell>
                    <TableCell align="center">{formatDate(row.fechaRevision)}</TableCell>
                    <TableCell align="center">{row.descripcion}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default ControlCambios;
