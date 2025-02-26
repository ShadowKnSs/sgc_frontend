import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const MenuCard = ({ icon, title, onClick }) => {
  return (
    <Card
      onClick={onClick} 
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
        backgroundColor: "#004A98",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {React.cloneElement(icon, { sx: { color: "#FFF", fontSize: 70 } })}
        <Typography
          variant="subtitle1"
          sx={{
            marginTop: 1,
            fontWeight: "bold",
            color: "#FFF",
            textAlign: "center",
            whiteSpace: "normal",
            wordWrap: "break-word",
            maxWidth: "100%",
            fontSize: title.length > 15 ? "0.9rem" : "1.1rem",
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
