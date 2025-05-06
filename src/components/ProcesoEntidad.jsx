import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import useProcesoEntidad from "../hooks/useProcesoEntidad";

const colorPalette = {
  azulOscuro: "#185FA4",
  azulClaro: "#68A2C9",
};

const ContextoProcesoEntidad = ({ idProceso }) => {
  const { proceso, entidad, loading, error } = useProcesoEntidad(idProceso);

  if (loading) return <CircularProgress size={20} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mb: 4,
        px: 2,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: colorPalette.azulOscuro,
          fontWeight: "bold",
          position: "relative",
          textAlign: "center",
          "&::after": {
            content: '""',
            width: "100%",
            height: "4px",
            backgroundColor: colorPalette.azulClaro,
            position: "absolute",
            left: "50%",
            bottom: -6,
            transform: "translateX(-50%)",
            borderRadius: "2px",
          },
        }}
      >
        <strong>{entidad}</strong>: <strong>{proceso}</strong> 
      </Typography>
    </Box>
  );
};

export default ContextoProcesoEntidad;
