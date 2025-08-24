/**
 * Hook: usePermiso
 * Descripción:
 * Custom hook que facilita la gestión de permisos del usuario activo para un módulo específico,
 * en función del rol activo almacenado en `localStorage`.

 * Parámetros:
 * - modulo (string): Nombre exacto del módulo a validar, como aparece en los objetos de permisos del backend.

 * Retorna:
 * - permiso: Array de todos los permisos asignados al módulo (puede estar vacío).
 * - soloLectura: `true` si todos los permisos del módulo son exclusivamente de tipo "Lectura".
 * - puedeEditar: `true` si existe al menos un permiso del módulo que permita escritura, edición, administración o eliminación.

 * Ejemplo de uso:
 * ```js
 * const { soloLectura, puedeEditar } = usePermiso("Cronograma");
 * if (puedeEditar) {
 *   // Mostrar botones de edición
 * }
 * ```

 * Funcionamiento Interno:
 * - Recupera el `rolActivo` desde `localStorage` (formato JSON).
 * - Filtra los permisos para quedarse únicamente con aquellos cuyo `modulo` coincide con el argumento recibido.
 * - Evalúa si todos son de tipo `"Lectura"` (`soloLectura`).
 * - Evalúa si alguno permite edición, escritura, eliminación o administración (`puedeEditar`).
 * - Memoiza la respuesta para evitar recalcular si los valores no cambian.

 * Consideraciones:
 * - Si el `rolActivo` no existe o no tiene permisos definidos, retorna valores predeterminados seguros (`soloLectura: false`, `puedeEditar: false`).
 * - Este hook está pensado para usarse dentro de vistas o componentes funcionales React.

 * Mejora recomendada:
 * Reemplazar acceso directo a `localStorage` por un contexto global en el futuro, para evitar depender de side effects fuera del control de React.
 */

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
