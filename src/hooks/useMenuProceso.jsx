/**
 * Hook: useMenuProceso
 * Descripción:
 * Custom hook que construye dinámicamente el menú de navegación lateral para las vistas relacionadas a un proceso
 * específico en el sistema de gestión de calidad. Este hook determina el `idProceso` activo, lo persiste si es necesario,
 * y genera los enlaces de navegación correspondientes.

 * Funcionamiento:
 * - Primero intenta obtener `idProceso` desde los parámetros de la URL mediante `useParams()`.
 * - Si no está en la URL, lo recupera desde `localStorage` (`idProcesoActivo`).
 * - Si se obtiene de la URL, lo actualiza en `localStorage` para mantener persistencia.
 * - Usa `useMemo` para evitar cálculos innecesarios al renderizar, recalculando solo si cambia `idProceso`.

 * Retorna:
 * - `menuItems`: Arreglo de objetos, donde cada objeto representa una entrada del menú lateral. Cada entrada incluye:
 *   - `title` (string): Nombre visible del módulo.
 *   - `path` (string): Ruta que redirige al módulo correspondiente.
 *   - `icon` (JSX.Element): Ícono representativo del módulo (usando Material UI Icons).

 * Uso:
 * ```js
 * import useMenuProceso from "../hooks/useMenuProceso";
 * const menuItems = useMenuProceso();
 * // Luego se puede mapear `menuItems` para renderizar botones o tabs
 * ```

 * Ejemplo de un ítem generado:
 * {
 *   title: "Análisis de Datos",
 *   path: "/carpetas/23/Análisis de Datos",
 *   icon: <InsertDriveFileIcon fontSize="small" />
 * }

 * Consideraciones:
 * - Este hook permite a los componentes reutilizar la lógica del menú sin replicar rutas o lógica de persistencia.
 * - Ideal para ser usado en menús laterales (`MenuNavegacionProceso`, `Sidebar`, etc.).
 * - Requiere que el `idProceso` esté presente en la URL o en `localStorage` para funcionar correctamente.

 * Mejoras Futuras:
 * -  Añadir soporte multientidad (si el sistema evoluciona para permitir múltiples procesos simultáneos).
 * -  Extraer rutas y títulos a una configuración externa (JSON o constante), facilitando mantenimiento y traducción.
 */
import { useMemo } from "react";
import { useParams } from "react-router-dom";

// Íconos de MUI
import BookIcon from "@mui/icons-material/MenuBook";
import WarningIcon from "@mui/icons-material/Warning";
import InsertDriveFileIcon from "@mui/icons-material/Assessment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LinkIcon from "@mui/icons-material/Link";

const useMenuProceso = () => {
  let { idProceso } = useParams();
  // Verifica si el parámetro no está disponible en la URL
  if (!idProceso) {
    idProceso = localStorage.getItem("idProcesoActivo");
  } else {
    // Si viene en la URL, actualiza el valor persistente
    localStorage.setItem("idProcesoActivo", idProceso);
  }

  const menuItems = useMemo(() => [
    {
      title: "Estructura",
      path: `/estructura-procesos/${idProceso}`,
      icon: <AccountTreeIcon fontSize="small" />,
    },
    {
      title: "Manual Operativo",
      path: `/manual-operativo/${idProceso}`,
      icon: <BookIcon fontSize="small" />,
    },
    {
      title: "Gestión de Riesgo",
      path: `/carpetas/${idProceso}/Gestión de Riesgo`,
      icon: <WarningIcon fontSize="small" />,
    },
    {
      title: "Análisis de Datos",
      path: `/carpetas/${idProceso}/Análisis de Datos`,
      icon: <InsertDriveFileIcon fontSize="small" />,
    },
    {
      title: "Acciones de Mejora",
      path: `/carpetas/${idProceso}/Acciones de Mejora`,
      icon: <TrendingUpIcon fontSize="small" />,
    },
    {
      title: "Auditoría",
      path: `/carpetas/${idProceso}/Auditoria`,
      icon: <DescriptionIcon fontSize="small" />,
    },
    {
      title: "Seguimiento",
      path: `/carpetas/${idProceso}/Seguimiento`,
      icon: <LinkIcon fontSize="small" />,
    },
  ], [idProceso]);

  return menuItems;
};

export default useMenuProceso;
