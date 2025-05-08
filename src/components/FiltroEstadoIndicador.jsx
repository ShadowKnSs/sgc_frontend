// src/components/FiltroEstadoIndicador.jsx
import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const FiltroEstadoIndicador = ({ estadoSeleccionado, onChange }) => {
  return (
    <ToggleButtonGroup
      exclusive
      value={estadoSeleccionado}
      onChange={(_, newEstado) => newEstado && onChange(newEstado)}
      sx={{
        gap: 2,
        borderRadius: 6,
        "& .MuiToggleButton-root": {
          borderRadius: 6,
          px: 3,
          py: 1,
          textTransform: "none",
          fontWeight: "bold",
          fontSize: "1rem",
          bgcolor: "white",
          border: "1px solid #ccc",
          color: "black",
          "&.Mui-selected": {
            bgcolor: "secondary.main",
            color: "#fff",
            borderColor: "secondary.main"
          },
          "&:hover": {
            backgroundColor: "#f0f0f0"
          }
        }
      }}
    >
      <ToggleButton value="noRecord">Sin registrar</ToggleButton>
      <ToggleButton value="incomplete">Incompleto</ToggleButton>
      <ToggleButton value="complete">Completo</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default FiltroEstadoIndicador;
