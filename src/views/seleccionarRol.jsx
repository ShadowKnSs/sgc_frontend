import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RolCard from '../components/CardRol';
import Loader from '../components/Loader';
import MensajeAlert from '../components/MensajeAlert';
import Title from '../components/Title'; 

const SeleccionarRol = () => {
  const [roles, setRoles] = useState([]); //lista de roles disponibles para el usuario.
  const [loading, setLoading] = useState(true); //control para mostrar un loader mientras se obtienen los roles.
  const [mensaje, setMensaje] = useState(null); //mensaje temporal de alerta o éxito.
  const navigate = useNavigate(); //función para redireccionar a otras rutas del sistema.

  useEffect(() => {
    const rolesGuardados = JSON.parse(localStorage.getItem("roles")) || [];

    if (rolesGuardados.length === 0) {
          // 🔴 Caso cuando no hay roles disponibles en el localStorage

      setMensaje({ tipo: 'error', texto: 'No se encontraron roles disponibles' });
      navigate("/login");
    } else {
          // 🎨 Asigna un ícono representativo según el tipo de rol

      const rolesConIcono = rolesGuardados.map(rol => {
        let icono = "AdminPanelSettings";
        switch (rol.nombreRol?.toLowerCase()) {
          case "auditor": icono = "AssignmentIndIcon"; break;
          case "líder": icono = "School"; break;
          case "coordinador": icono = "Settings"; break;
          default: icono = "AdminPanelSettings";
        }
        return { ...rol, icono };
      });

      setRoles(rolesConIcono); //  Se almacenan los roles con íconos
    setLoading(false);       //  Se detiene el loader
    }
  }, [navigate]);

  const handleSeleccion = (rol) => {
    localStorage.setItem("rolActivo", JSON.stringify(rol));
    setMensaje({ tipo: 'success', texto: `Rol seleccionado: ${rol.nombreRol}` });
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, paddingBottom: 3 }}>
      <Title text="Selecciona tu rol" />

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
