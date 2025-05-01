import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import useProcesoEntidad from "../hooks/useProcesoEntidad";

const ContextoProcesoEntidad = ({ idRegistro }) => {
  const { proceso, entidad, loading, error } = useProcesoEntidad(idRegistro);

  if (loading) return <CircularProgress size={20} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ mb: 2, textAlign: "center", paddingTop: 3 }}>
      <Typography variant="subtitle1">
        Proceso: <strong>{proceso}</strong>   Entidad: <strong>{entidad}</strong>
      </Typography>
    </Box>
  );
};

export default ContextoProcesoEntidad;
