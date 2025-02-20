import React from "react";
import { Button } from "@mui/material";

const CustomButton = ({ label, active, onClick }) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        backgroundColor: active ? "#FFC107" : "#E0E0E0",
        color: "#1A2B4C",
        fontWeight: "bold",
        borderRadius: "50px",
        padding: "10px 20px",
        boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
        textTransform: "none",
        minWidth: "250px",
        maxWidth: "250px",
        "&:hover": {
          backgroundColor: active ? "#E0A800" : "#C7C7C7",
        },
      }}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
