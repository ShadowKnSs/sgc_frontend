import { useMemo } from "react";

export default function usePermiso(modulo) {
  const rolActivo = JSON.parse(localStorage.getItem("rolActivo"));
  // Obtiene todos los permisos para el módulo
  const permisosModulo = rolActivo?.permisos?.filter(p => p.modulo === modulo) || [];

  // Si existen permisos, solo es de lectura cuando todos son "Lectura"
  const soloLectura = permisosModulo.length > 0 ? permisosModulo.every(p => p.tipoAcceso === "Lectura") : false;
  // Se permite editar si al menos uno tiene tipoAcceso en el listado:
  const puedeEditar = permisosModulo.some(p =>
    ["Edición", "Escritura", "Administración", "Eliminación"].includes(p.tipoAcceso)
  );

  return useMemo(() => ({
    permiso: permisosModulo, // devuelve el arreglo de permisos para el módulo
    soloLectura,
    puedeEditar
  }), [permisosModulo, soloLectura, puedeEditar]);
}
