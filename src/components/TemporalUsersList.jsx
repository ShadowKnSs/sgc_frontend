/**
 * Componente: TemporalUsersList
 * Descripción:
 * Muestra una lista de usuarios temporales generados con token de acceso, junto con su fecha de expiración.
 * Permite eliminar usuarios de forma individual mediante un botón con ícono.

 * Lógica Principal:
 * - Se hace una petición GET a `/api/usuarios-temporales` para obtener todos los tokens temporales.
 * - Cada tarjeta muestra:
 *    - El `token`
 *    - La fecha y hora de expiración (`expiracion`)
 *    - Un botón para eliminar el token.
 * - Al eliminar un usuario, se actualiza el estado local filtrando el token eliminado.

 * Estado:
 * - `users`: lista de usuarios temporales obtenidos del backend
 * - `loading`: estado de carga inicial mientras se consulta la API

 * Efectos:
 * - `useEffect`: ejecuta la función `fetchUsers()` al montar el componente

 * Funciones:
 * - `fetchUsers`: obtiene todos los usuarios temporales desde la API
 * - `deleteUser(id)`: elimina un usuario temporal y actualiza la lista local

 * Diseño y UX:
 * - Cada tarjeta:
 *    - Tiene un `hover` animado con efecto de escala
 *    - Colores institucionales (#004A98 para texto, #F9B800 para ícono de eliminación)
 *    - Incluye un `Tooltip` en el botón de eliminar para mayor claridad
 * - Si está `loading`, se muestra un `CircularProgress` centrado

 * Uso:
 * Ideal para un panel de administración donde se gestionan accesos temporales.

 * Mejoras Futuras:
 * -  Incluir paginación o scroll infinito si hay muchos tokens
 * -  Confirmación antes de eliminar
 * -  Visualizar usuario asociado (si existe)
 * -  Ordenar por fecha de expiración próxima

 */

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  IconButton,
  Tooltip,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const TemporalUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/usuarios-temporales");
      setUsers(response.data);
    } catch (error) {
      console.error("❌ Error al obtener usuarios temporales:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/usuarios-temporales/${id}`);
      setUsers(users.filter((user) => user.idToken !== id));
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3} justifyContent="center" mt={3}>
      {users.map((user) => (
        <Grid item key={user.idToken}>
          <Card
            sx={{
              width: 320,
              padding: 3,
              backgroundColor: "#F9F8F8",
              borderRadius: 3,
              boxShadow: 4,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 8,
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="#004A98" noWrap>
                  {user.token}
                </Typography>
                <Typography variant="body2" color="#00B2E3" sx={{ wordBreak: "break-word", mt: 1 }}>
                  Expira: {new Date(user.expiracion).toLocaleString()}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="center" gap={3}>
                <Tooltip title="Eliminar">
                  <IconButton
                    onClick={() => deleteUser(user.idToken)}
                    sx={{
                      color: "#F9B800",
                      '&:hover': { backgroundColor: "#fbe7a2" },
                      padding: 1.5,
                      borderRadius: "50%",
                      boxShadow: 2,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TemporalUsersList;
