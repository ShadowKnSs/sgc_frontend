import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const MenuCard = ({ icon, title }) => {
  return (
    <Card
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
        transition: "0.3s",
        backgroundColor: "#E8E8E8",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {React.cloneElement(icon, { sx: { color: "#004A98", fontSize: 70 } })}
        <Typography variant="subtitle1" sx={{ marginTop: 1, fontWeight: "bold" }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
