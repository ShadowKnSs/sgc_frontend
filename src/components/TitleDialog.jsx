/**
 * Componente: DialogTitleCustom
 * Descripción:
 * Encabezado personalizado para diálogos/modales utilizando Material UI.
 * Permite mostrar un título y un subtítulo opcional con estilos consistentes
 * con la paleta de colores institucional del sistema.

 * Props:
 * - title (string): Título principal del diálogo. Es obligatorio.
 * - subtitle (string, opcional): Texto secundario debajo del título. Se muestra solo si está definido.

 * Estilos aplicados:
 * - Fondo blanco (`#fff`)
 * - Borde inferior azul claro (`#68A2C9`) para delimitar visualmente el encabezado
 * - Título en color azul oscuro (`#185FA4`) con fuente semibold
 * - Subtítulo en gris (`text.secondary`) y alineado a la izquierda

 * Uso:
 * Este componente se utiliza como encabezado dentro de un `<Dialog>` de Material UI:
 *
 * ```jsx
 * <Dialog open={open} onClose={handleClose}>
 *   <DialogTitleCustom title="Editar Usuario" subtitle="Modifica los datos del usuario seleccionado" />
 *   <DialogContent>...</DialogContent>
 * </Dialog>
 * ```

 * Ventajas:
 * - Reutilizable: estandariza los encabezados de todos los diálogos
 * - Limpio: separación clara entre título, subtítulo y contenido
 * - Adaptable: solo muestra el subtítulo si está presente

 * Mejoras Futuras:
 * - 💡 Permitir personalizar el color del borde inferior mediante props
 * - 💡 Soporte para incluir íconos al lado del título
 * - 💡 Internacionalización (i18n) para textos multilenguaje

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

const DialogTitleCustom = ({ title, subtitle }) => (
  <Box
    sx={{
      padding: "16px 24px",
      borderBottom: `2px solid ${colorPalette.azulClaro}`,
      backgroundColor: "#fff",
    }}
  >
    <Typography
      variant="h6"
      sx={{
        color: colorPalette.azulOscuro,
        fontWeight: 600,
        textAlign: "left",
        mb: subtitle ? 0.5 : 0, // Agrega espacio si hay subtítulo
      }}
    >
      {title}
    </Typography>
    {subtitle && (
      <Typography
        variant="subtitle2"
        sx={{
          color: "text.secondary",
          textAlign: "left",
        }}
      >
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default DialogTitleCustom;
