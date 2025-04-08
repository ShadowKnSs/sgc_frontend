import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  InputAdornment,
  Typography,
  Paper,
  Box,
  CircularProgress
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

export default function Login() {
  const [rpe, setRpe] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [useToken, setUseToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorMessage(""); // limpia mensaje anterior
    if (!token.trim()) {
      setErrorMessage("Por favor ingresa un token");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/validar-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/"); // Redirige si el token es válido
      } else {
        if (data.message.includes("expirado")) {
          setErrorMessage(" El token ha expirado");
        } else {
          setErrorMessage(" El token no es válido");
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("❌ Error al conectar con el servidor");
    } finally {
      setLoading(false);
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
          {useToken ? (
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
          ) : (
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
          )}

          {loading ? (
            <Box textAlign="center" mt={2}>
              <CircularProgress sx={{ color: "#00BCD4" }} />
            </Box>
          ) : (
            <Button
              fullWidth
              variant="contained"
              sx={{ backgroundColor: "#00BCD4", mt: 1, borderRadius: 10, fontSize: "1.1rem" }}
              onClick={handleLogin}
            >
              Login
            </Button>
          )}

          {errorMessage && (
            <Typography
              mt={2}
              fontSize="0.85rem"
              color="#FFD600"
              textAlign="center"
              sx={{ fontWeight: 500 }}
            >
              {errorMessage}
            </Typography>
          )}

          <Button
            fullWidth
            sx={{ mt: 2, color: "#ccc", textTransform: "none", fontSize: "0.85rem" }}
            onClick={() => setUseToken(!useToken)}
          >
            {useToken ? "¿Volver a login por RPE?" : "¿Usar token temporal?"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
