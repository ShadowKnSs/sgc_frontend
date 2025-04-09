import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RolCard from '../components/CardRol';
import Loader from '../components/Loader';
import MensajeAlert from '../components/MensajeAlert';

const SeleccionarRol = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const rolesGuardados = JSON.parse(localStorage.getItem("roles")) || [];

    if (rolesGuardados.length === 0) {
      setMensaje({ tipo: 'error', texto: 'No se encontraron roles disponibles' });
      navigate("/login");
    } else {
      const rolesConIcono = rolesGuardados.map(rol => {
        let icono = "AdminPanelSettings";
        switch (rol.nombreRol?.toLowerCase()) {
          case "auditor": icono = "AssignmentIndIcon"; break;
          case "líder": icono = "School"; break;
          case "coordinador": icono = "Settings"; break;
          default:
            icono = "AdminPanelSettings";
        }
        return { ...rol, icono };
      });

      setRoles(rolesConIcono);
      setLoading(false);
    }
  }, [navigate]);

  const handleSeleccion = (rol) => {
    localStorage.setItem("rolActivo", JSON.stringify(rol)); // 🔐 Guarda rol con permisos incluidos
    setMensaje({ tipo: 'success', texto: `Rol seleccionado: ${rol.nombreRol}` });
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center', paddingBottom: 3 }}>
      <Typography variant="h4" gutterBottom>Selecciona tu rol</Typography>
      {mensaje && <MensajeAlert tipo={mensaje.tipo} texto={mensaje.texto} />}
      {loading ? <Loader /> : (
        <Grid container spacing={3} justifyContent="center">
          {roles.map((rol, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <RolCard rol={rol} onSelect={handleSeleccion} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SeleccionarRol;
