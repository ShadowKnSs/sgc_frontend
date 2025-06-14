import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const moduleColors = {
  "Manual Operativo": "#458cd4",
  "Gestión de Riesgo": "#f79734",
  "Análisis de Datos": "#4f9152",
  "Acciones de Mejora": "#8033a1",
  "Auditoría": "#db544f",
  "Seguimiento": "#0097a7"
};

const MenuCard = ({ icon, title, onClick, idProceso }) => {
  const handleClick = () => {
    if (onClick) onClick(idProceso);
  };

  const color = moduleColors[title] || "#1976d2";

  return (
    <Card
      onClick={handleClick}
      role="button"
      sx={{
        width: 220,
        height: 220,
        borderRadius: 4,
        cursor: "pointer",
        backgroundColor: color,
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease-in-out",
        boxShadow: `0 6px 18px ${color}66`, 
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: `0 12px 24px ${color}99`,
          "& .arrowIcon": {
            opacity: 1,
            transform: "translateX(0)"
          }
        }
      }}
    >
      <CardContent
        sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2
        }}
      >
        {React.cloneElement(icon, {
          sx: { fontSize: 60, mb: 1, color: "#fff" }
        })}
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
      </CardContent>

      <Box
        className="arrowIcon"
        sx={{
          position: "absolute",
          bottom: 12,
          right: 12,
          opacity: 0,
          transform: "translateX(10px)",
          transition: "all 0.3s ease-in-out"
        }}
      >
        <ArrowForwardIosIcon fontSize="small" sx={{ color: "#fff" }} />
      </Box>
    </Card>

  );
};

export default MenuCard;
