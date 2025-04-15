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
  Chip,
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
