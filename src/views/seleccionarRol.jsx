/**
 * Vista: SeleccionarRol
 * Descripción:
 * Permite al usuario elegir entre los diferentes roles disponibles que tiene asignados.
 * Una vez seleccionado, guarda el rol activo en `localStorage` y redirige a la vista principal.
 * 
 * Características:
 * - Muestra un mensaje si no hay roles disponibles y redirige al login.
 * - Añade un ícono representativo a cada rol mostrado.
 * - Usa los componentes `RolCard`, `MensajeAlert`, `Loader` y `Title`.
 */
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

      setMensaje({ tipo: 'error', texto: 'No se encontraron roles disponibles' });
      navigate("/login");
    } else {

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
    setTimeout(() => navigate("/user-eventos"), 1000);
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
