// 📁 src/hooks/usePermiso.js
import { useMemo } from "react";

export default function usePermiso(modulo) {
  const rolActivo = JSON.parse(localStorage.getItem("rolActivo"));
  const permiso = rolActivo?.permisos?.find(p => p.modulo === modulo);

  const soloLectura = permiso?.tipoAcceso === "Lectura";
  const puedeEditar = ["Edición", "Escritura", "Administración", "Eliminación"].includes(permiso?.tipoAcceso);

  return useMemo(() => ({
    permiso,
    soloLectura,
    puedeEditar
  }), [permiso, soloLectura, puedeEditar]);
}
