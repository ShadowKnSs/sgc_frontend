import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField, Button, InputAdornment, Typography, Paper, Box,
  CircularProgress, Dialog, DialogContent, DialogActions,
  IconButton
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";

const colorPalette = {
  azulOscuro: "#185FA4",
  azulClaro: "#68A2C9",
  verdeAgua: "#BBD8D7",
  verdeClaro: "#DFECDF",
  verdePastel: "#E3EBDA",
  grisClaro: "#DEDFD1",
  grisOscuro: "#A4A7A0",
};

export default function Login() {
  const [rpe, setRpe] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [useToken, setUseToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    type: "success",
    title: "",
    message: ""
  });

  const navigate = useNavigate();

  const showModal = (type, title, message) => {
    setModal({
      open: true,
      type,
      title,
      message
    });
  };

  const handleLoginToken = async () => {
    if (!token.trim()) {
      showModal("error", "Token inválido", "Por favor ingresa un token");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/validar-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (response.ok) {
        // Al validar el token, se asume que data.rol contiene la información del rol (por ejemplo, { nombreRol: "Auditor", permisos: [...] })
        localStorage.setItem("rolActivo", JSON.stringify(data.rol));
        // Además, se debe guardar un objeto usuario (con idUsuario distinto a 0)
        const dummyUser = { idUsuario: data.idUsuario || 9999, nombre: data.nombre || "TokenUsuario" };
        localStorage.setItem("usuario", JSON.stringify(dummyUser));
        localStorage.setItem("viaToken", "true");
        
        showModal("success", "¡Token válido!", "Accediendo al sistema...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        const msg = data.message.includes("expirado")
          ? "El token ha expirado"
          : "El token no es válido";
        showModal("error", "Token inválido", msg);
      }
    } catch (error) {
      console.error(error);
      showModal("error", "Error de conexión", "No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };
  

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", { rpe, password });
      const { usuario, roles } = response.data;

      localStorage.setItem("usuario", JSON.stringify(usuario));
      localStorage.setItem("roles", JSON.stringify(roles));
      localStorage.removeItem("viaToken");

      if (roles.length === 1) {
        localStorage.setItem("rolActivo", JSON.stringify(roles[0]));
        showModal("success", "¡Inicio exitoso!", "Redirigiendo al sistema...");
        setTimeout(() => navigate("/"), 1500);
      } else if (roles.length > 1) {
        navigate("/seleccionarRol");
      } else {
        showModal("error", "Sin roles", "No se encontraron roles asignados");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Error al iniciar sesión";
      showModal("error", "Oops!", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" minHeight="100vh" justifyContent="center" alignItems="center" bgcolor={colorPalette.verdeClaro}>
      <Paper elevation={6} sx={{ display: 'flex', width: '90%', maxWidth: 1000, borderRadius: 4, overflow: 'hidden', height: 500 }}>

        {/* Columna izquierda */}
        <Box flex={1} bgcolor="#ffffff" p={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Box display="flex" width="100%" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" justifyContent="center" flex={1}>
              <img
                src="https://admincongresos.uaslp.mx//Informacion/Patrocinadores/191.jpg"
                alt="Logo UASLP"
                style={{ width: 200 }}
              />
            </Box>

            <Box width="1px" bgcolor="#0D47A1" height="100px" mx={2} />

            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" flex={1}>
  <Typography sx={{ fontWeight: "bold", fontSize: "3rem", letterSpacing: "0.1em", color: "#0D47A1", mb: -2 }}>
    DIGC
  </Typography>
  <Typography variant="subtitle2" color="#0D47A1" textAlign="center">
    Dirección Institucional de Gestión de Calidad
  </Typography>
</Box>

          </Box>

          <Typography variant="h4" color="#0D47A1" fontWeight="bold" mt={6} textAlign="center">
            ¡Hola, bienvenidos!
          </Typography>
        </Box>


        {/* Columna derecha */}
        <Box flex={1} bgcolor={colorPalette.azulOscuro} color="white" p={4} display="flex" flexDirection="column" justifyContent="center">
          {useToken ? (
            <>
              <Typography variant="h6" mb={1}>Token</Typography>
              <TextField
                fullWidth
                placeholder="AZ19DBB860L9533"
                variant="outlined"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3, backgroundColor: "#fff", borderRadius: 1 }}
              />
              {loading ? (
                <Box textAlign="center"><CircularProgress sx={{ color: "#FFD600" }} /></Box>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: colorPalette.azulClaro, mt: 1, borderRadius: 5, fontWeight: "bold" }}
                  onClick={handleLoginToken}
                >
                  Validar Token
                </Button>
              )}
            </>
          ) : (
            <>
              <Typography variant="h6" mb={1}>Usuario</Typography>
              <TextField
                fullWidth
                placeholder="RPE"
                variant="outlined"
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  backgroundColor: "#fff",
                  borderRadius: 1,
                }}
              />

              <Typography variant="h6" mb={1}>Contraseña</Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="Contraseña"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  backgroundColor: "#fff",
                  borderRadius: 1,
                }}
              />

              {loading ? (
                <Box textAlign="center"><CircularProgress sx={{ color: "#FFD600" }} /></Box>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: colorPalette.azulClaro, mt: 1, borderRadius: 5, fontWeight: "bold" }}
                  onClick={handleLogin}
                >
                  Iniciar Sesión
                </Button>
              )}
            </>
          )}

          <Button
            fullWidth
            sx={{ mt: 2, color: "#fff", textTransform: "none", fontSize: "0.85rem" }}
            onClick={() => setUseToken(!useToken)}
          >
            {useToken ? "¿Volver a inciar sesión por RPE?" : "¿Usar token temporal?"}
          </Button>
        </Box>
      </Paper>

      {/* MODAL */}
      <Dialog open={modal.open} onClose={() => setModal({ ...modal, open: false })}>
        <IconButton
          onClick={() => setModal({ ...modal, open: false })}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          {modal.type === "success" ? (
            <CheckCircleIcon sx={{ fontSize: 60, color: "green" }} />
          ) : (
            <CancelIcon sx={{ fontSize: 60, color: "red" }} />
          )}
          <Typography variant="h5" mt={2} fontWeight="bold">
            {modal.title}
          </Typography>
          <Typography mt={1}>{modal.message}</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={() => setModal({ ...modal, open: false })} variant="contained" color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}