// src/auth/guards.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const getUsuario = () => JSON.parse(localStorage.getItem("usuario") || "null");
const getRolActivo = () => JSON.parse(localStorage.getItem("rolActivo") || "null");

// Rutas públicas (sin credenciales)
export const PUBLIC_PATHS = [
  "/",                // home (muestra noticias)
  "/login",
  "/manual-calidad",
  "/user-eventos",
  "/seleccionarRol"
];

// Mapa de rutas permitidas por rol (patrones de react-router)
export const ALLOWED_BY_ROLE = {
  "Administrador": [
    "/procesos",
    "/procesos/:idEntidad",
    "/nuevo-proceso",
    "/editar-proceso/:idProceso",
    "/manualDelSitio",
    "/gestion-entidades",
    "/usuarios",
    "/admin-eventos",
    "/cronograma",
    "/typesReports",
    "/principalReportSem",
    "/listado-reportes-proceso",
    "/reportes-auditoria",
    "/formatos",
  ],
  "Líder": [
    "/manual-calidad",
    "/manualDelSitio",
    "/user-eventos",
    "/cronograma",
    "/formatos",
    "/busca_supervisor",
    "/estructura-procesos/:idProceso",
    "/manual-operativo",
    "/manual-operativo/:idProceso",
    "/carpetas/:idProceso/:title",
    "/gestion-riesgos",
    "/gestion-riesgos/:idRegistro",
    "/analisis-datos",
    "/analisis-datos/:idRegistro",
    "/indicadores",
    "/indicadores/:idProceso/:anio",
    "/graficas",
    "/graficas/:idRegistro",
    "/actividad-mejora",
    "/actividad-mejora/:idRegistro",
    "/seguimientoPrincipal/:idRegistro/:idProceso",
    "/reporteSemestral"
  ],
  "Auditor": [
    "/manualDelSitio",
    "/manual-calidad",
    "/carpetas/:idProceso/:title",
    "/seguimientoPrincipal/:idRegistro/:idProceso",
    "/user-eventos",
    "/cronograma",
    "/entidades",
    "/procesos/:idEntidad",          // Nota: solo con :id para auditor
    "/auditoria/:idRegistro",
    "/informe-auditoria",
    "/auditorias/:id",               
    "/vista-previa/:idAuditorialInterna",
    "/estructura-procesos/:idProceso",
    "/manual-operativo",
    "/manual-operativo/:idProceso",
    "/gestion-riesgos",
    "/gestion-riesgos/:idRegistro",
    "/analisis-datos",
    "/analisis-datos/:idRegistro",
    "/indicadores",
    "/indicadores/:idProceso/:anio",
    "/graficas",
    "/graficas/:idRegistro",
    "/actividad-mejora",
    "/actividad-mejora/:idRegistro",
  ],
  "Coordinador de Calidad": [
    "/manual-calidad",
    "/manualDelSitio",
    "/user-eventos",
    "/cronograma",
    "/entidades",
    "/auditores",
    "/procesos/:idEntidad",
    "/estructura-procesos/:idProceso",
    "/manual-operativo",
    "/manual-operativo/:idProceso",
    "/carpetas/:idProceso/:title",
    "/gestion-riesgos",
    "/gestion-riesgos/:idRegistro",
    "/analisis-datos",
    "/analisis-datos/:idRegistro",
    "/indicadores",
    "/indicadores/:idProceso/:anio",
    "/graficas",
    "/graficas/:idRegistro",
    "/actividad-mejora",
    "/actividad-mejora/:idRegistro",
    "/seguimientoPrincipal/:idRegistro/:idProceso",

  ],
  "Supervisor": [
    "/manual-calidad",
    "/manualDelSitio",
    "/user-eventos",
    "/cronograma",
    "/entidades",
    "/auditores",
    "/procesos/:idEntidad",
    "/estructura-procesos/:idProceso",
    "/manual-operativo",
    "/manual-operativo/:idProceso",
    "/carpetas/:idProceso/:title",
    "/gestion-riesgos",
    "/gestion-riesgos/:idRegistro",
    "/analisis-datos",
    "/analisis-datos/:idRegistro",
    "/indicadores",
    "/indicadores/:idProceso/:anio",
    "/graficas",
    "/graficas/:idRegistro",
    "/actividad-mejora",
    "/actividad-mejora/:idRegistro",
    "/seguimientoPrincipal/:idRegistro/:idProceso",

  ],
  // Invitado (sin credenciales) se controla con PUBLIC_PATHS
};

const pathMatch = (pattern, path) => {
  // Comparador simple de patrones tipo react-router (/:param)
  const p = pattern.split("/").filter(Boolean);
  const u = path.split("/").filter(Boolean);
  if (p.length !== u.length) return false;
  return p.every((seg, i) => seg.startsWith(":") || seg === u[i]);
};

const isPublic = (pathname) =>
  PUBLIC_PATHS.some((p) => pathMatch(p, pathname));

const isAllowedForRole = (rolNombre, pathname) => {
  const list = ALLOWED_BY_ROLE[rolNombre] || [];
  return list.some((p) => pathMatch(p, pathname));
};

// Guarda principal
export function ProtectedRoute({ children }) {
  const location = useLocation();
  const pathname = location.pathname;
  const usuario = getUsuario();

  // 1) Si es pública, deja pasar siempre
  if (isPublic(pathname)) return children;

  // 2) Si no hay sesión, manda a login
  if (!usuario) return <Navigate to="/login" replace />;

  // 3) Si hay sesión y hay rol, valida contra la matriz por rol
  const rolActivo = getRolActivo();

  if (!rolActivo?.nombreRol) {
    // No hay rol activo: si el usuario tiene varios, que elija
    return <Navigate to="/seleccionarRol" replace />;
  }

  // 3.1) Si definiste permisos por “módulo” en rolActivo.permisos,
  //      puedes aprobar por permisos además del rol (fallback robusto)
  //      Aquí lo dejamos por rol para el enrutamiento, y por permisos
  //      para controles de edición dentro de la vista.
  if (!isAllowedForRole(rolActivo.nombreRol, pathname)) {
    // Sin acceso: mándalo al home
    return <Navigate to="/" replace />;
  }

  return children;
}
