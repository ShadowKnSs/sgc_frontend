/**
 * Componente: CustomButton
 * Descripción:
 * Botón estilizado reutilizable que adapta su apariencia según el tipo (`guardar`, `cancelar`, etc.).
 * Encapsula el botón de Material UI con variantes de color, bordes y estilos consistentes.
 */
import React from "react";
import Button from "@mui/material/Button";

// Colores personalizados (puedes meterlos también a theme si prefieres)
const colorPalette = {
  azulOscuro: "#185FA4",
  azulClaro: "#68A2C9",
  verdeAgua: "#BBD8D7",
  verdeClaro: "#DFECDF",
  verdePastel: "#E3EBDA",
  grisClaro: "#DEDFD1",
  grisOscuro: "#A4A7A0",
};

// Estilos según tipo de botón
const baseStyle = {
  textTransform: "none",
  borderRadius: "20px",
  fontWeight: 600,
  px: 3,
  py: 1,
  boxShadow: 2,
  transition: "all 0.3s ease-in-out",
};

const buttonConfigs = {
  guardar: {
    variant: "contained",
    sx: {
      ...baseStyle,
      backgroundColor: colorPalette.azulOscuro,
      color: "#fff",
      "&:hover": {
        backgroundColor: "#124B82",
        boxShadow: 4,
      },
    },
  },
  cancelar: {
    variant: "outlined",
    sx: {
      ...baseStyle,
      color: colorPalette.azulOscuro,
      borderColor: colorPalette.azulOscuro,
      backgroundColor: "#fff",
      borderWidth: "2px",
      "&:hover": {
        backgroundColor: colorPalette.azulClaro,
        borderColor: colorPalette.azulOscuro,
        boxShadow: 1,
      },
    },
  },
  aceptar: {
    variant: "contained",
    sx: {
      ...baseStyle,
      backgroundColor: colorPalette.verdeAgua,
      color: "#000",
      "&:hover": {
        backgroundColor: "#A5CFCF",
        boxShadow: 4,
      },
    },
  },
  descargar: {
    variant: "contained",
    sx: {
      ...baseStyle,
      backgroundColor: colorPalette.azulClaro,
      color: "#fff",
      "&:hover": {
        backgroundColor: "#4F8BB5",
        boxShadow: 4,
      },
    },
  },
  generar: {
    variant: "contained",
    sx: {
      ...baseStyle,
      backgroundColor: colorPalette.verdeClaro,
      color: "#000",
      "&:hover": {
        backgroundColor: "#CBE4CB",
        boxShadow: 4,
      },
    },
  },
};


export default function CustomButton({ type = "guardar", children, ...props }) {
  const config = buttonConfigs[type] || buttonConfigs.guardar;

  return (
    <Button {...config} {...props}>
      {children}
    </Button>
  );
}
