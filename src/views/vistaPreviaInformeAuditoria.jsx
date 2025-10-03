/**
 * Componente: VistaPreviaAud
 * Descripción:
 * Esta vista permite mostrar un resumen detallado de una auditoría interna antes de generar el reporte.
 * Extrae la información desde el backend mediante el `idAuditorialInterna` y permite al usuario revisar:
 * - Información general (entidad, proceso, líder)
 * - Objetivo, alcance, criterios
 * - Equipo auditor y personal auditado
 * - Verificaciones realizadas (incluye hallazgos y evidencia)
 * - Fortalezas, debilidades, conclusiones, plazos y puntos de mejora
 * Finalmente, permite guardar el reporte mediante una petición POST y redirigir al listado de reportes.
 */

import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

function VistaPreviaAud() {
  const { idAuditorialInterna } = useParams();
  const [fecha, setFecha] = useState('');
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);

  // Obtenemos solo la fecha para mostrar en el título
  useEffect(() => {
    const obtenerFecha = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/auditorias/${idAuditorialInterna}`);
        setFecha(res.data.fecha || "");
      } catch (error) {
        console.error("Error al obtener auditoría:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerFecha();
  }, [idAuditorialInterna]);

  const handleGuardarReporte = async () => {
    try {
      // Aquí puedes llamar a tu endpoint para guardar el reporte
      await axios.post("http://localhost:8000/api/reportesauditoria", {
        idAuditorialInterna: parseInt(idAuditorialInterna),
        ruta: `reporte_${idAuditorialInterna}_${Date.now()}.pdf`,
        fechaGeneracion: fecha
      });
      navigate("/reportes-auditoria");
    } catch (error) {
      console.error("Error al guardar reporte:", error);
      alert("Error al guardar el reporte");
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f7f7f7", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "900px", margin: "0 auto", backgroundColor: "white", padding: 4, borderRadius: "8px" }}>
        {/* Título */}
        <h1
          style={{
            textAlign: "center",
            marginBottom: "32px",
            fontFamily: "'Roboto', sans-serif",
            color: "#004A98",
          }}
        >
          Auditoría del {fecha ? new Date(fecha).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '---'}
        </h1>

        {/* Vista previa del PDF */}
        <iframe
          src={`http://localhost:8000/api/reportesauditoria/${idAuditorialInterna}/pdf`}
          width="100%"
          height="600px"
          style={{ border: "1px solid #ccc", borderRadius: "8px" }}
        ></iframe>

        {/* Botones */}
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            sx={{
              backgroundColor: '#0057A8',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '20px',
              paddingX: 3,
              marginRight: 2,
              '&:hover': { backgroundColor: '#004488' }
            }}
            onClick={() => navigate('/reportes-auditoria')}
          >
            Cancelar
          </Button>
          <Button
            sx={{
              backgroundColor: '#FFB800',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '20px',
              paddingX: 3,
              '&:hover': { backgroundColor: '#E0A500' }
            }}
            onClick={handleGuardarReporte}
            disabled={cargando}
          >
            {cargando ? "Cargando..." : "Guardar"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default VistaPreviaAud;