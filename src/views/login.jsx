/**
 * Vista: Login.jsx
 * Descripción:
 * Componente de inicio de sesión del sistema de Gestión de Calidad. Ofrece dos métodos de autenticación:
 * 1. Mediante RPE y contraseña.
 * 2. Mediante token temporal validado por backend.

 * Funcionalidades clave:
 * - Manejo visual y lógico de dos métodos de autenticación (toggle con botón).
 * - Envío de credenciales al backend para validación (`/api/login`).
 * - Envío y validación de token temporal (`/api/validar-token`).
 * - Guardado de datos del usuario (`usuario`), roles (`roles`) y `rolActivo` en `localStorage`.
 * - Redirección automática en caso de inicio exitoso.
 * - Modal visual para mostrar mensajes de éxito o error.
 * - Diseño responsive con distinción visual entre columna izquierda (branding) y columna derecha (formulario).

 * Estados locales:
 * - `rpe`, `password`: datos de usuario.
 * - `token`, `useToken`: token temporal y selector de modo.
 * - `loading`: control de estado de carga al hacer login.
 * - `modal`: configuración del mensaje emergente (tipo, título, contenido).

 * Navegación:
 * - Redirección hacia:
 *    - `/`: para administradores.
 *    - `/user-eventos`: para usuarios comunes.
 *    - `/seleccionarRol`: si el usuario tiene múltiples roles.

 * Lógica adicional:
 * - Si un usuario ingresa por token:
 *    - Se simula un usuario con `idUsuario !== 0` y se almacena en localStorage.
 *    - Se marca con `localStorage.viaToken = true` para su posterior rastreo.

 * Componentes y estilos:
 * - Utiliza `Material UI` (`TextField`, `Dialog`, `CircularProgress`, `InputAdornment`, etc.)
 * - Colores organizados en `colorPalette` para consistencia visual.
 * - Uso de `Paper` para estructura y separación de columnas.
 * - Íconos como `EmailIcon`, `LockIcon`, `CheckCircleIcon`, `CancelIcon` para experiencia de usuario visual.

 * Mejoras sugeridas:
 * - Integrar validación de formularios con `Yup` o `react-hook-form`.
 * - Añadir botón de mostrar/ocultar contraseña.
 * - Validación de longitud o formato de token.
 * - Recordar última opción de login (token o usuario).
 * - Centralizar lógica de almacenamiento (`setLocalStorageUsuario()`).

 * Seguridad:
 * - Asegurar en backend el cifrado de contraseñas y la expiración controlada de tokens.
 * - Verificar uso de HTTPS en producción.
 */
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
        setTimeout(() => navigate("/"), 1500);
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
        showModal("success", "¡Inicio exitoso!", "Redirigiendo al sistema");
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
