// 📁 src/hooks/useMenuProceso.js
import { useMemo } from "react";
import { useParams } from "react-router-dom";

// Íconos de MUI
import BookIcon from "@mui/icons-material/MenuBook";
import WarningIcon from "@mui/icons-material/Warning";
import InsertDriveFileIcon from "@mui/icons-material/Assessment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DescriptionIcon from "@mui/icons-material/Description";
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
