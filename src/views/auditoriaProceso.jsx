import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import axios from "axios";

const AuditoriaProceso = () => {
  const { idRegistro } = useParams(); // ID de la carpeta (representa el año)
  const location = useLocation();
  const navigate = useNavigate();

  const idProceso = location.state?.idProceso;
  const soloLectura = location.state?.soloLectura ?? true;
  const puedeEditar = location.state?.puedeEditar ?? false;

  const [auditorias, setAuditorias] = useState([]);

  useEffect(() => {
    if (!idProceso || !idRegistro) return;

    const fetchAuditorias = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/auditorias/proceso/${idProceso}?anio=${idRegistro}`);
        setAuditorias(res.data);
      } catch (error) {
        console.error("Error al cargar auditorías:", error);
      }
    };

    fetchAuditorias();
  }, [idProceso, idRegistro]);

  if (!idProceso) {
    return <Typography variant="h6" color="error" sx={{ mt: 4, textAlign: "center" }}>Error: ID del proceso no recibido.</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" color="#004A98" textAlign="center" mb={2}>
        Auditorías del Proceso #{idProceso}
      </Typography>
      <Typography variant="h6" fontWeight="medium" color="text.secondary" textAlign="center" mb={4}>
        Año: {idRegistro}
      </Typography>

      <Grid container spacing={3}>
        {auditorias.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ ml: 2 }}>
            No se han registrado auditorías para este proceso en el año seleccionado.
          </Typography>
        ) : (
          auditorias.map((auditoria, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper elevation={3} sx={{ p: 3, borderLeft: "5px solid #004A98" }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AssignmentIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Auditoría #{auditoria.idAuditorialInterna}
                  </Typography>
                </Box>
                <Typography variant="body2" mt={1}>Fecha: {auditoria.fecha || "N/D"}</Typography>
                <Typography variant="body2">Estado: {auditoria.estadoAceptacion || "Pendiente"}</Typography>
                <Typography variant="body2">Líder: {auditoria.auditorLider || "No asignado"}</Typography>
                <Typography variant="body2" mt={1}>Objetivo: {auditoria.objetivoAud || "No especificado"}</Typography>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>

      {!soloLectura && puedeEditar && (
        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: 20, right: 20 }}
          onClick={() => navigate("/informe-auditoria-interna", { state: { idProceso } })}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default AuditoriaProceso;
