import React, { useState, useEffect } from "react";
import axios from "axios";
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

const ProyectoMejora = ({ idProceso, anio }) => {
  const [proyectoMejora, setProyectoMejora] = useState(null);
  const [recursos, setRecursos] = useState([]);
  const [actividadesPM, setActividadesPM] = useState([]);
  const [objetivos, setObjetivos] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [indicadoresExito, setIndicadoresExito] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!idProceso || !anio) return;

      try {
        // Obtener los datos de la API
        const response = await axios.get(
          `http://127.0.0.1:8000/api/proyecto-mejora/${idProceso}/${anio}`
        );
        console.log("Respuesta de la API:", response.data);

        if (response.data) {
          setProyectoMejora(response.data.proyectoMejora);
          setRecursos(response.data.recursos || []);
          setActividadesPM(response.data.actividadesPM || []);
          setObjetivos(response.data.objetivos || []);
          setResponsables(response.data.responsables || []);
          setIndicadoresExito(response.data.indicadoresExito || []);
        } else {
          setError("Formato de respuesta no válido");
        }
      } catch (error) {
        console.error("❌ Error al obtener los datos:", error);
        setError("Error al cargar los datos.");
      }
    };

    fetchData();
  }, [idProceso, anio]);

  return (
    <Box
      sx={{
        mt: 2,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#fff",
        margin: 7,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}>
        Proyecto de Mejora
      </Typography>

      {error ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : !proyectoMejora ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No hay datos del proyecto de mejora.
        </Alert>
      ) : (
        <>
          {/* Información básica del proyecto */}
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Fecha:</strong>
                  </TableCell>
                  <TableCell>{proyectoMejora.fecha}</TableCell>
                  <TableCell>
                    <strong>No. Mejora:</strong>
                  </TableCell>
                  <TableCell>{proyectoMejora.noMejora}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Descripción de la mejora:</strong>
                  </TableCell>
                  <TableCell colSpan={3}>{proyectoMejora.descripcionMejora}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Objetivos/Beneficios de la mejora */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Objetivos/Beneficio de la mejora:
          </Typography>
          {objetivos.length > 0 ? (
            <ul>
              {objetivos.map((obj, index) => (
                <li key={index}>{obj.descripcionObj}</li>
              ))}
            </ul>
          ) : (
            <Typography>No se registraron objetivos.</Typography>
          )}

          {/* Áreas de impacto/Personal beneficiado */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Áreas de impacto/Personal beneficiado:
          </Typography>
          <Typography>{proyectoMejora.areaImpacto}</Typography>

          {/* Responsables involucrados */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Responsables involucrados:
          </Typography>
          {responsables.length > 0 ? (
            <ul>
              {responsables.map((r, index) => (
                <li key={index}>{r.nombre}</li>
              ))}
            </ul>
          ) : (
            <Typography>No hay responsables registrados.</Typography>
          )}

          {/* Situación actual */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Situación actual:
          </Typography>
          <Typography>{proyectoMejora.situacionActual}</Typography>

          {/* Indicadores de Éxito */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Indicadores de Éxito:
          </Typography>
          {indicadoresExito.length > 0 ? (
            <ul>
              {indicadoresExito.map((ind, index) => (
                <li key={index}>
                  {ind.nombreInd} - Meta: {ind.meta}
                </li>
              ))}
            </ul>
          ) : (
            <Typography>No se definieron indicadores.</Typography>
          )}

          {/* Recursos */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Recursos:
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Tiempo</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Recursos Materiales y Humanos</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Costo estimado</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recursos.map((recurso, index) => (
                  <TableRow key={index}>
                    <TableCell>{recurso.tiempoEstimado}</TableCell>
                    <TableCell>{recurso.recursosMatHum}</TableCell>
                    <TableCell>{recurso.costo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Actividades */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Actividades:
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Descripción</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Responsable</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Fecha</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actividadesPM.map((actividad, index) => (
                  <TableRow key={index}>
                    <TableCell>{actividad.descripcionAct}</TableCell>
                    <TableCell>{actividad.responsable}</TableCell>
                    <TableCell>{actividad.fecha}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default ProyectoMejora;
