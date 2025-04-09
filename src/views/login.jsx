import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, InputAdornment, Typography, Paper, Box, Snackbar, Alert } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

export default function Login() {
  const [rpe, setRpe] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [useToken, setUseToken] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        rpe,
        password
      });

      const { usuario, roles } = response.data;

      // Guardar información básica del usuario
      localStorage.setItem("usuario", JSON.stringify(usuario));
      localStorage.setItem("roles", JSON.stringify(response.data.roles));

      console.log("Datos Uusario:", response.data);

      if (roles.length === 1) {
        // Usuario con un solo rol: ir directo
        localStorage.setItem("rolActivo", JSON.stringify(roles[0].nombreRol));
        navigate("/");
      } else if (roles.length > 1) {
        // Usuario con múltiples roles: ir a selección
        localStorage.setItem("roles", JSON.stringify(roles));
        navigate("/seleccionarRol");
      } else {
        setSnackbar({ open: true, message: "No se encontraron roles asignados", severity: "warning" });
      }
    } catch (error) {
      let msg = "Error al iniciar sesión";
      if (error.response?.data?.message) {
        msg = error.response.data.message;
      }
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  };

  return (
    <Box display="flex" minHeight="100vh" justifyContent="center" alignItems="center" bgcolor="#f3f3f3">
      <Paper elevation={3} sx={{ display: 'flex', p: 6, borderRadius: 4 }}>

        <Box textAlign="center" pr={{ md: 8 }} mb={{ xs: 4, md: 0 }}>
          <Typography variant="h2" color="primary" fontWeight="bold">¡Hola,</Typography>
          <Typography variant="h2" color="primary" fontWeight="bold">bienvenido!</Typography>
          <Box mt={4} textAlign="center">
            <Typography
              sx={{
                fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                fontWeight: 400,
                fontSize: "3rem",
                letterSpacing: "0.4em",
                color: "#2E6FA9",
              }}
            >
              SICAL
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                fontWeight: 300,
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                color: "#2E6FA9",
              }}
            >
              SISTEMA INTEGRAL DE CALIDAD
            </Typography>
          </Box>

        </Box>

        <Box
          sx={{
            backgroundColor: "#0D47A1",
            color: "white",
            borderRadius: 3,
            p: 4,
            width: 350,
            border: "4px solid #FFD600",
          }}
        >
          {!useToken ? (
            <>
              <Typography variant="h6" mb={1}>Usuario</Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="RPE"
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3, backgroundColor: "white", borderRadius: 1 }}
              />
              <Typography variant="h6" mb={1}>Contraseña</Typography>
              <TextField
                fullWidth
                type="password"
                variant="outlined"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3, backgroundColor: "white", borderRadius: 1 }}
              />
            </>
          ) : (
            <>
              <Typography variant="h6" mb={1}>Token</Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="AZ19DBB860L9533"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3, backgroundColor: "white", borderRadius: 1 }}
              />
            </>
          )}

          
          <Button
            fullWidth
            variant="contained"
            sx={{ backgroundColor: "#00BCD4", mt: 1, borderRadius: 10, fontSize: "1.1rem" }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Button
            fullWidth
            sx={{ mt: 2, color: "#ccc", textTransform: "none", fontSize: "0.85rem" }}
            onClick={() => setUseToken(!useToken)}
          >
            {useToken ? "¿Volver a login por RPE?" : "¿Usar token temporal?"}
          </Button>
        </Box>
        {/* Snackbar de errores */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
