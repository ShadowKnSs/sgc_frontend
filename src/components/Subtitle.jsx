/**
 * Componente: Subtitle
 * Descripción:
 * Componente estilizado para mostrar subtítulos dentro del sistema.
 * Permite alinear el texto y opcionalmente incluir un fondo de color pastel.

 * Props:
 * - text (string, requerido): Texto del subtítulo a mostrar.
 * - align (string, opcional): Alineación del texto (por defecto "left").
 * - withBackground (boolean, opcional): Si es `true`, muestra un fondo con color `verdePastel`.

 * Estilos:
 * - Usa `Typography` con variante `h6` para mantener consistencia con el diseño del sistema.
 * - Color de texto: gris oscuro (`#A4A7A0`).
 * - Si `withBackground` está activado:
 *    - Fondo: verde pastel (`#E3EBDA`)
 *    - Padding vertical y borde redondeado

 * Uso común:
 * - Como encabezado de secciones en formularios o tarjetas informativas.
 * - Para mejorar la jerarquía visual en vistas con múltiples bloques de contenido.

 * Ventajas:
 * - 🎨 Consistencia visual
 * - 🧩 Reutilizable y configurable

 * Mejoras futuras:
 * - 💡 Soporte para íconos decorativos
 * - 💡 Variantes adicionales de color
 */

import React from "react";
import { Typography, Box } from "@mui/material";

const colorPalette = {
  azulOscuro: "#185FA4",
  azulClaro: "#68A2C9",
  verdeAgua: "#BBD8D7",
  verdeClaro: "#DFECDF",
  verdePastel: "#E3EBDA",
  grisClaro: "#DEDFD1",
  grisOscuro: "#A4A7A0",
};

const Subtitle = ({ text, align = "left", withBackground = false }) => (
  <Box
    sx={{
      backgroundColor: withBackground ? colorPalette.verdePastel : "transparent",
      px: 2,
      py: withBackground ? 1 : 0,
      borderRadius: "8px",
      mb: 2,
    }}
  >
    <Typography
      variant="h6"
      sx={{
        color: colorPalette.grisOscuro,
        fontWeight: 500,
        textAlign: align,
      }}
    >
      {text}
    </Typography>
  </Box>
);

export default Subtitle;
