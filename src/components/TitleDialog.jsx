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

const DialogTitleCustom = ({ text }) => (
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
      }}
    >
      {text}
    </Typography>
  </Box>
);

export default DialogTitleCustom;
