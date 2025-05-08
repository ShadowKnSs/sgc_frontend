// src/components/FiltroOrigenIndicador.jsx
import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const FiltroOrigenIndicador = ({ origenSeleccionado, onChange }) => {
  return (
    <ToggleButtonGroup
    exclusive
    value={origenSeleccionado}
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
      <ToggleButton value="Todos">Todos</ToggleButton>
      <ToggleButton value="ActividadControl">Actividad</ToggleButton>
      <ToggleButton value="MapaProceso">Mapa Proceso</ToggleButton>
      <ToggleButton value="GestionRiesgo">Riesgo</ToggleButton>
      <ToggleButton value="Encuesta">Encuesta</ToggleButton>
      <ToggleButton value="Retroalimentacion">Retroalimentación</ToggleButton>
      <ToggleButton value="EvaluaProveedores">Proveedores</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default FiltroOrigenIndicador;
