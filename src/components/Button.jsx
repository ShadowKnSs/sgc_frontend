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
const buttonConfigs = {
  guardar: {
    variant: "contained",
    sx: {
      backgroundColor: colorPalette.azulOscuro,
      "&:hover": {
        backgroundColor: "#124B82",
      },
    },
  },
  cancelar: {
    variant: "outlined",
    sx: {
      color: colorPalette.grisOscuro,
      borderColor: colorPalette.grisOscuro,
      "&:hover": {
        backgroundColor: "#f5f5f5",
        borderColor: colorPalette.grisOscuro,
      },
    },
  },
  aceptar: {
    variant: "contained",
    sx: {
      backgroundColor: colorPalette.verdeAgua,
      color: "#000",
      "&:hover": {
        backgroundColor: "#A5CFCF",
      },
    },
  },
  descargar: {
    variant: "contained",
    sx: {
      backgroundColor: colorPalette.azulClaro,
      "&:hover": {
        backgroundColor: "#4F8BB5",
      },
    },
  },
  generar: {
    variant: "contained",
    sx: {
      backgroundColor: colorPalette.verdeClaro,
      color: "#000",
      "&:hover": {
        backgroundColor: "#CBE4CB",
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
