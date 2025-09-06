import React, { useState, useRef, useCallback } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

// Colores personalizados mejorados con variantes más armoniosas
const colorPalette = {
  azulOscuro: "#1565C0",
  azulClaro: "#42A5F5",
  verdeAgua: "#26A69A",
  verdeClaro: "#66BB6A",
  verdePastel: "#81C784",
  grisClaro: "#E0E0E0",
  grisOscuro: "#9E9E9E",
  blanco: "#FFFFFF",
  negro: "#212121",
  // Nuevos colores para efectos
  azulOscuroHover: "#0D47A1",
  azulClaroHover: "#1E88E5",
  verdeAguaHover: "#00897B",
  verdeClaroHover: "#43A047",
  verdePastelHover: "#66BB6A",
};

// Botón base estilizado con styled API para mejor rendimiento
const StyledButton = styled(Button)(({ 
  buttoncolor, 
  hovercolor, 
  textcolor,
  withshadow 
}) => ({
  textTransform: "none",
  borderRadius: "24px",
  fontWeight: 600,
  padding: "10px 24px",
  minWidth: "120px",
  minHeight: "42px",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  backgroundColor: buttoncolor,
  color: textcolor,
  boxShadow: withshadow ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none",
  
  "&:hover": {
    backgroundColor: hovercolor,
    transform: "translateY(-2px)",
    boxShadow: withshadow ? "0 6px 16px rgba(0, 0, 0, 0.2)" : "none",
  },
  
  "&:active": {
    transform: "translateY(0)",
    boxShadow: withshadow ? "0 2px 8px rgba(0, 0, 0, 0.15)" : "none",
  },
  
  "&:focus-visible": {
    outline: `2px solid ${buttoncolor}`,
    outlineOffset: "2px",
  },
  
  "&:disabled": {
    backgroundColor: colorPalette.grisClaro,
    color: colorPalette.grisOscuro,
    cursor: "not-allowed",
    transform: "none",
    boxShadow: "none",
  },
  
  // Efecto de onda al hacer clic
  "&::after": {
    content: '""',
    position: "absolute",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    transform: "scale(0)",
    transition: "transform 0.5s, opacity 0.5s",
    width: "120%",
    height: "120%",
    opacity: 0,
  },
  
  "&:active::after": {
    transform: "scale(1)",
    opacity: 1,
    transition: "0s",
  },
}));

// Configuraciones para cada tipo de botón
const buttonConfigs = {
  guardar: {
    buttoncolor: colorPalette.azulOscuro,
    hovercolor: colorPalette.azulOscuroHover,
    textcolor: colorPalette.blanco,
    withshadow: true,
  },
  cancelar: {
    buttoncolor: "transparent",
    hovercolor: colorPalette.grisClaro,
    textcolor: colorPalette.azulOscuro,
    withshadow: false,
    border: `2px solid ${colorPalette.azulOscuro}`,
  },
  aceptar: {
    buttoncolor: colorPalette.verdeAgua,
    hovercolor: colorPalette.verdeAguaHover,
    textcolor: colorPalette.blanco,
    withshadow: true,
  },
  descargar: {
    buttoncolor: colorPalette.azulClaro,
    hovercolor: colorPalette.azulClaroHover,
    textcolor: colorPalette.blanco,
    withshadow: true,
  },
  generar: {
    buttoncolor: colorPalette.verdeClaro,
    hovercolor: colorPalette.verdeClaroHover,
    textcolor: colorPalette.blanco,
    withshadow: true,
  },
};
/*
export default function CustomButton({ 
  type = "guardar", 
  children, 
  onClick,
  loading = false,
  debounceTime = 600,
  disabled = false,
  ...props 
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef(null);
  
  const config = buttonConfigs[type] || buttonConfigs.guardar;
  
  const handleClick = useCallback((event) => {
    if (isProcessing || disabled) return;
    
    setIsProcessing(true);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    if (onClick) {
      onClick(event);
    }
    
    timerRef.current = setTimeout(() => {
      setIsProcessing(false);
      timerRef.current = null;
    }, debounceTime);
  }, [onClick, isProcessing, disabled, debounceTime]);
  
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  const isDisabled = disabled || isProcessing || loading;
  
  let startIcon = props.startIcon;
  if (loading) {
    startIcon = <CircularProgress size={20} color="inherit" />;
  }
  
  return (
    <StyledButton
      {...config}
      {...props}
      onClick={handleClick}
      disabled={isDisabled}
      startIcon={startIcon}
      variant={type === "cancelar" ? "outlined" : "contained"}
      sx={{
        // Permitir sobrescritura de estilos desde props
        ...props.sx,
        // Estilos específicos para el botón de cancelar
        ...(type === "cancelar" && {
          border: `2px solid ${colorPalette.azulOscuro}`,
          "&:hover": {
            border: `2px solid ${colorPalette.azulOscuro}`,
            backgroundColor: `${colorPalette.grisClaro} !important`,
          },
        }),
      }}
    >
      {children}
    </StyledButton>
  );
}*/
export default function CustomButton({
  type = "guardar",
  children,
  onClick,
  loading = false,
  debounceTime = 600,
  disabled = false,
  ...props
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef(null);

  // normalizamos el type
  const normalizedType = type.toLowerCase();
  const config = buttonConfigs[normalizedType] || buttonConfigs.guardar;

  const handleClick = useCallback(
    async (event) => {
      if (isProcessing || disabled) return;

      setIsProcessing(true);

      try {
        if (onClick) {
          const result = onClick(event);
          // 👇 Si el onClick devuelve una promesa, esperamos a que termine
          if (result instanceof Promise) {
            await result;
          }
        }
      } finally {
        // desbloquear después de debounceTime
        timerRef.current = setTimeout(() => {
          setIsProcessing(false);
          timerRef.current = null;
        }, debounceTime);
      }
    },
    [onClick, isProcessing, disabled, debounceTime]
  );

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const isDisabled = disabled || isProcessing || loading;

  let startIcon = props.startIcon;
  if (loading || isProcessing) {
    startIcon = <CircularProgress size={20} color="inherit" />;
  }

  return (
    <StyledButton
      {...config}
      {...props}
      onClick={handleClick}
      disabled={isDisabled}
      startIcon={startIcon}
      variant={normalizedType === "cancelar" ? "outlined" : "contained"}
      sx={{
        ...props.sx,
        ...(normalizedType === "cancelar" && {
          border: `2px solid ${colorPalette.azulOscuro}`,
          "&:hover": {
            border: `2px solid ${colorPalette.azulOscuro}`,
            backgroundColor: `${colorPalette.grisClaro} !important`,
          },
        }),
      }}
    >
      {children}
    </StyledButton>
  );
}