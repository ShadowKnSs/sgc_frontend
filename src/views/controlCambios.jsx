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
  Pagination,
  Alert,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { useParams } from "react-router-dom";

const ControlCambios = ({ showSnackbar }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const { idProceso } = useParams();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Función mejorada para formatear fecha
  const formatDate = (fecha) => {
    if (!fecha) return "N/A";
    
    try {
      // Si la fecha incluye hora, tomar solo la parte de la fecha
      const fechaPart = fecha.split(" ")[0];
      const [year, month, day] = fechaPart.split("-");
      
      // Validar que tenemos los componentes necesarios
      if (!year || !month || !day) return fecha;
      
      // Crear array de nombres de meses en español
      const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      
      const dia = parseInt(day, 10);
      const mesIndex = parseInt(month, 10) - 1;
      const año = parseInt(year, 10);
      
      // Validar índices
      if (mesIndex < 0 || mesIndex > 11) return fecha;
      
      return `${dia} de ${meses[mesIndex]} de ${año}`;
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return fecha;
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await axios.get(
          `http://localhost:8000/api/controlcambios/proceso/${idProceso}`
        );
        
        // Verificar si hay datos
        if (!response.data || response.data.length === 0) {
          setData([]);
          if (showSnackbar) {
            showSnackbar("No hay registros de cambios disponibles", "info", "Información");
          }
          return;
        }
        
        const ordenados = [...response.data].sort(
          (a, b) => new Date(b.fechaRevision) - new Date(a.fechaRevision)
        );
        setData(ordenados);
        
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        
        // Manejo específico de errores
        let errorMessage = "Error al cargar el control de cambios";
        
        if (error.response) {
          if (error.response.status === 404) {
            errorMessage = "No se encontraron registros de cambios";
          } else if (error.response.status >= 500) {
            errorMessage = "Error del servidor al cargar los cambios";
          }
        } else if (error.request) {
          errorMessage = "Error de conexión. Verifique su internet";
        }
        
        setError(errorMessage);
        
        if (showSnackbar) {
          showSnackbar(errorMessage, "error", "Error");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [idProceso, showSnackbar]);

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Estado de carga mejorado
  if (loading) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "50vh", 
        flexDirection: "column",
        gap: 2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Cargando control de cambios...
        </Typography>
      </Box>
    );
  }

  // Manejo de errores
  if (error) {
    return (
      <Box sx={{ 
        width: isMobile ? "95%" : "80%", 
        margin: "auto", 
        mt: 3 
      }}>
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No se pudieron cargar los registros de cambios
          </Typography>
        </Box>
      </Box>
    );
  }

  // Manejo de datos vacíos
  if (data.length === 0) {
    return (
      <Box sx={{ 
        width: isMobile ? "95%" : "80%", 
        margin: "auto", 
        mt: 3 
      }}>
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
        >
          No hay registros de cambios disponibles
        </Alert>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Aún no se han realizado cambios en este proceso
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Los cambios realizados en las diferentes secciones aparecerán aquí
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: isMobile ? "95%" : "80%", 
      margin: "auto", 
      mt: 1 
    }}>
      <Typography
        variant="h5"
        sx={{ 
          fontWeight: "bold", 
          color: "#0056b3", 
          mb: 2,
          textAlign: isMobile ? "center" : "center",
          fontSize: isMobile ? "1.5rem" : "1.5rem"
        }}
      >
        CONTROL DE CAMBIOS
      </Typography>
      
      <Card sx={{ 
        borderRadius: 3, 
        boxShadow: 3,
        overflow: "hidden"
      }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer
            component={Paper}
            sx={{ 
              borderRadius: 0,
              overflowX: "auto",
              minWidth: isMobile ? 300 : 600
            }}
          >
            <Table>
              <TableBody>
                {/* Header de la tabla */}
                <TableRow sx={{ 
                  bgcolor: "#458cd4",
                  "& th": {
                    fontSize: isMobile ? "0.8rem" : "0.9rem",
                    py: 1.5,
                  }
                }}>
                  <TableCell  sx={{ fontWeight: "bold", color: "white", textAlign: "center" }} >SECCIÓN</TableCell>
                  <TableCell  sx={{ fontWeight: "bold", color: "white", textAlign: "center" }} >EDICIÓN</TableCell>
                  <TableCell  sx={{ fontWeight: "bold", color: "white", textAlign: "center" }} >VERSIÓN</TableCell>
                  <TableCell  sx={{ fontWeight: "bold", color: "white", textAlign: "center" }} >FECHA DE REVISIÓN</TableCell>
                  <TableCell  sx={{ fontWeight: "bold", color: "white", textAlign: "center" }} >DESCRIPCIÓN</TableCell>
                </TableRow>
                
                {/* Filas de datos */}
                {paginatedData.map((row, index) => (
                  <TableRow 
                    key={index}
                    sx={{ 
                      '&:nth-of-type(odd)': {
                        backgroundColor: '#f8f9fa'
                      },
                      '&:hover': {
                        backgroundColor: '#e9ecef'
                      },
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <TableCell 
                      align="center"
                      sx={{ 
                        fontSize: isMobile ? "0.8rem" : "0.9rem",
                        py: 2
                      }}
                    >
                      {row.seccion || "N/A"}
                    </TableCell>
                    <TableCell 
                      align="center"
                      sx={{ 
                        fontSize: isMobile ? "0.8rem" : "0.9rem",
                        py: 2
                      }}
                    >
                      {row.edicion || "N/A"}
                    </TableCell>
                    <TableCell 
                      align="center"
                      sx={{ 
                        fontSize: isMobile ? "0.8rem" : "0.9rem",
                        py: 2
                      }}
                    >
                      {row.version || "N/A"}
                    </TableCell>
                    <TableCell 
                      align="center"
                      sx={{ 
                        fontSize: isMobile ? "0.8rem" : "0.9rem",
                        py: 2,
                        minWidth: isMobile ? "120px" : "150px"
                      }}
                    >
                      {formatDate(row.fechaRevision)}
                    </TableCell>
                    <TableCell 
                      align="center"
                      sx={{ 
                        fontSize: isMobile ? "0.8rem" : "0.9rem",
                        py: 2,
                        maxWidth: isMobile ? "200px" : "300px",
                        wordBreak: "break-word"
                      }}
                    >
                      {row.descripcion || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Paginación */}
      {totalPages > 1 && (
        <Box sx={{ 
          mt: 3, 
          display: "flex", 
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: 1
        }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
          >
            Página {currentPage} de {totalPages} - {data.length} registros totales
          </Typography>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "medium"}
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default ControlCambios;