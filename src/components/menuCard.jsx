import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const MenuCard = ({ icon, title, onClick, idProceso }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(idProceso); // Pasar idProceso cuando se haga clic
    }
  };

  return (
    <Card
      onClick={handleClick}
      role="button"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 200,
        height: 200,
        borderRadius: 3,
        boxShadow: 3,
        cursor: "pointer",
        backgroundColor: "primary.main",
        transition: "transform 0.3s ease-in-out, background-color 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
          backgroundColor: "secondary.main",
          boxShadow: 6,
        }
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {React.cloneElement(icon, { sx: { color: "#FFFFFF", fontSize: 70 } })}
        <Typography variant="subtitle1" sx={{ marginTop: 1, fontWeight: "bold", color: "#FFF" }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
