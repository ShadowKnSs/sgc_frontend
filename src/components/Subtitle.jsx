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
