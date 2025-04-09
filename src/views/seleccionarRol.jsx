// 📁 src/components/SeleccionarRol.jsx
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
    // Simulación de llamada al backend
    setTimeout(() => {
      const rolesDeUsuario = [
        { id: 1, nombreRol: 'Administrador', icono: 'AdminPanelSettings' },
        { id: 2, nombreRol: 'Auditor', icono: 'School' },
      ];
      setRoles(rolesDeUsuario);
      setLoading(false);
    }, 1500);
  }, []);

  const handleSeleccion = (rol) => {
    setMensaje({ tipo: 'success', texto: `Rol seleccionado: ${rol.nombreRol}` });
    // Navegación según rol
    setTimeout(() => {
      localStorage.setItem("rolActivo", JSON.stringify(rol.nombreRol));
      navigate("/");
    }, 800);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center' , paddingBottom: 3}}>
      <Typography variant="h4" gutterBottom>
        Selecciona tu rol
      </Typography>

      {loading ? (
        <Loader />
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {roles.map((rol) => (
            <Grid item key={rol.id} xs={12} sm={6} md={4}>
              <RolCard rol={rol} onSelect={handleSeleccion} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SeleccionarRol;
