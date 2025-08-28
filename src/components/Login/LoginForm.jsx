import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  Button,
  Typography,
  CircularProgress,
  Box,
  IconButton
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginForm({ rpe, password, setRpe, setPassword, onSubmit, loading }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Typography variant="h6" mb={1}>Usuario</Typography>
      <TextField
        fullWidth value={rpe} onChange={e => setRpe(e.target.value)}
        placeholder="RPE" variant="outlined"
        sx={{ mb: 3, bgcolor: "#fff", borderRadius: 1 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <PersonIcon />
            </InputAdornment>
          )
        }}
      />

      <Typography variant="h6" mb={1}>Contraseña</Typography>
      <TextField
        fullWidth
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Contraseña"
        variant="outlined"
        sx={{ mb: 3, bgcolor: "#fff", borderRadius: 1 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(prev => !prev)}
                edge="end"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      {loading ? (
        <Box textAlign="center">
          <CircularProgress sx={{ color: "#FFD600" }} />
        </Box>
      ) : (
        <Button
          fullWidth
          variant="contained"
          sx={{ bgcolor: "#68A2C9", mt: 1, borderRadius: 5, fontWeight: "bold" }}
          onClick={onSubmit}
        >
          Iniciar Sesión
        </Button>
      )}
    </>
  );
}
