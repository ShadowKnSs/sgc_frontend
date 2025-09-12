import React, { useState, useEffect } from 'react';
import DetalleAuditor from './informacionAuditor';
import Title from "../components/Title";
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import { Box, CircularProgress, Typography } from '@mui/material';

const AuditoresView = () => {
  const [auditores, setAuditores] = useState([]);
  const [auditorSeleccionado, setAuditorSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/api/auditores')
      .then(response => {
        if (response.data.success) {
          const auditoresOrdenados = response.data.data.sort((a, b) => {
            const nombreA = `${a.nombre} ${a.apellidoPat}`.toLowerCase();
            const nombreB = `${b.nombre} ${b.apellidoPat}`.toLowerCase();
            return nombreA.localeCompare(nombreB);
          });
          setAuditores(auditoresOrdenados);
        }
      })
      .catch(error => console.error('Error al obtener auditores:', error))
      .finally(() => setLoading(false));
  }, []);

  if (auditorSeleccionado) {
    return <DetalleAuditor auditor={auditorSeleccionado} onBack={() => setAuditorSeleccionado(null)} />;
  }

  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 10, pb: 2 }}>
        <Title text="Auditores" />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : auditores.length === 0 ? (
        <Typography sx={{ mt: 10, textAlign: 'center', color: 'text.secondary' }}>
          No hay auditores registrados.
        </Typography>
      ) : (
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
          mt: 4
        }}>
          {auditores.map((auditor) => (
            <Box
              key={auditor.idUsuario}
              sx={{
                backgroundColor: '#fff',
                borderRadius: 2,
                textAlign: 'center',
                p: 3,
                width: 230,
                height: 150,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 6px 18px rgba(0,0,0,0.15)' }
              }}
              onClick={() => setAuditorSeleccionado(auditor)}
            >
              <PersonIcon sx={{ fontSize: 40, color: '#1a237e', mb: 1 }} />
              <Typography sx={{ fontWeight: 600, color: '#1a237e' }}>
                {auditor.nombre} {auditor.apellidoPat}
              </Typography>
              <Typography sx={{ fontSize: 14, color: '#555', mt: 0.5 }}>
                {auditor.correo}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AuditoresView;
