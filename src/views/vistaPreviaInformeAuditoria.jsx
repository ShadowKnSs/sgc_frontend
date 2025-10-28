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
import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import CustomButton from "../components/Button";
import Title from "../components/Title";

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
      alert("Error al guardar el reporte");
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f7f7f7", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "900px", margin: "0 auto", backgroundColor: "white", padding: 4, borderRadius: "8px" }}>
        {/* Título */}
        <Title
          text={`Auditoría del ${fecha ? new Date(fecha).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '---'}`}
        />
        

        {/* Vista previa del PDF */}
        <iframe
          src={`http://localhost:8000/api/reportesauditoria/${idAuditorialInterna}/pdf`}
          width="100%"
          height="600px"
          style={{ border: "1px solid #ccc", borderRadius: "8px" }}
        ></iframe>

        {/* Botones */}
        <Box display="flex" justifyContent="center" mt={3} gap={2}>
          <CustomButton
            type="cancelar"
            onClick={() => navigate('/reportes-auditoria')}
          >
            Cancelar
          </CustomButton>
          <CustomButton
            type="guardar"
            onClick={handleGuardarReporte}
            disabled={cargando}
          >
            {cargando ? "Cargando..." : "Guardar"}
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
}

export default VistaPreviaAud;