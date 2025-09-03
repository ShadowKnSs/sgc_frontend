// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import LoginLayout from "../components/Login/LoginLayout";
import LoginForm from "../components/Login/LoginForm";
import TokenForm from "../components/Login/TokenForm";
import LoginModal from "../components/Login/LoginModal";

import { Button, Box } from "@mui/material";

export default function Login() {
  const [rpe, setRpe] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [useToken, setUseToken] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState({ open: false, type: "success", title: "", message: "" });

  const navigate = useNavigate();

  const showModal = (type, title, message) => {
    setModal({ open: true, type, title, message });
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
        localStorage.setItem("rolActivo", JSON.stringify(data.rol));
        const dummyUser = { idUsuario: data.idUsuario || 9999, nombre: data.nombre || "TokenUsuario" };
        localStorage.setItem("usuario", JSON.stringify(dummyUser));
        localStorage.setItem("viaToken", "true");

        showModal("success", "¡Token válido!", "Accediendo al sistema...");
        setTimeout(() => navigate("/user-eventos"), 1500);
      } else {
        const msg = data.message.includes("expirado")
          ? "El token ha expirado"
          : "El token no es válido";
        showModal("error", "¡Error!", msg);
      }
    } catch {
      showModal("error", "Error de conexión", "No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("http://127.0.0.1:8000/api/login", { rpe, password });
      const { usuario, roles } = data;

      localStorage.setItem("usuario", JSON.stringify(usuario));
      localStorage.setItem("roles", JSON.stringify(roles));
      localStorage.removeItem("viaToken");

      if (roles.length === 1) {
        const rol = roles[0];
        localStorage.setItem("rolActivo", JSON.stringify(rol));
        //showModal("success", "¡Inicio exitoso!", "Redirigiendo al sistema");
        setTimeout(() => {
          rol.nombreRol === "Administrador" ? navigate("/") : navigate("/user-eventos");
        }, 1500);
      } else if (roles.length > 1) {
        navigate("/seleccionarRol");
      } else {
        showModal("error", "Sin roles", "No se encontraron roles asignados");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Error al iniciar sesión";
      showModal("error", "¡Hubo un problema!", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleInstitucionalLogin = async () => {
    setLoading(true);
    try {
      // Primero redirigimos al backend de Laravel
      window.location.href = "http://localhost:8000/api/login-institucional";
    } catch (error) {
      showModal("error", "Error", "No se pudo iniciar el proceso de autenticación institucional");
      setLoading(false);
    }
  };

  // Función para verificar si estamos en la callback del login institucional
  const checkInstitucionalCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');
  const error = urlParams.get('error');
  const token = urlParams.get('token');
  const usuarioParam = urlParams.get('usuario');
  const rolesParam = urlParams.get('roles');
  
  if (success === 'true' && token && usuarioParam && rolesParam) {
    setLoading(true);
    try {
      // Parsear datos
      const usuario = JSON.parse(usuarioParam);
      const roles = JSON.parse(rolesParam);
      
      // Guardar datos en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      localStorage.setItem("roles", JSON.stringify(roles));
      localStorage.setItem("institucional", "true");
      
      if (roles.length === 1) {
        const rol = roles[0];
        localStorage.setItem("rolActivo", JSON.stringify(rol));
        showModal("success", "¡Inicio exitoso!", "Redirigiendo al sistema");
        setTimeout(() => {
          rol.nombreRol === "Administrador" ? navigate("/") : navigate("/user-eventos");
        }, 1500);
      } else if (roles.length > 1) {
        navigate("/seleccionarRol");
      } else {
        showModal("error", "Sin roles", "No se encontraron roles asignados");
      }
      
      // Limpiar URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      showModal("error", "Error", "Error al procesar la autenticación institucional");
    } finally {
      setLoading(false);
    }
  } else if (error) {
    showModal("error", "Error", error);
    // Limpiar URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};

  // Ejecutar la verificación al cargar el componente
  React.useEffect(() => {
    checkInstitucionalCallback();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!useToken && rpe.trim() && password.trim()) {
        handleLogin();
      } else if (useToken && token.trim()) {
        handleLoginToken();
      }
    }
  };

  return (
    <>
      <LoginLayout>
        <Box onKeyDown={handleKeyDown} tabIndex={0}>
          {useToken ? (
            <TokenForm
              token={token}
              setToken={setToken}
              onSubmit={handleLoginToken}
              loading={loading}
            />
          ) : (
            <LoginForm
              rpe={rpe}
              password={password}
              setRpe={setRpe}
              setPassword={setPassword}
              onSubmit={handleLogin}
              loading={loading}
            />
          )}

          <Button
            fullWidth
            onClick={() => setUseToken(prev => !prev)}
            sx={{
              mt: 2,
              color: "#fff",
              textTransform: "none",
              fontSize: "0.85rem",
              transition: "color 0.3s ease",
              "&:hover": { color: "#F9B800" },
            }}
          >
            {useToken ? "Iniciar sesión con RPE" : "Usar token"}
          </Button>

          <Button
            fullWidth
            onClick={handleInstitucionalLogin}
            disabled={loading}
            sx={{
              mt: 1,
              color: "#fff",
              textTransform: "none",
              fontSize: "0.85rem",
              transition: "color 0.3s ease",
              "&:hover": { color: "#F9B800" },
            }}
          >
            Iniciar sesión institucional
          </Button>
        </Box>
      </LoginLayout>

      <LoginModal
        open={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
    </>
  );
}