import React from "react";
import { Snackbar, Alert, AlertTitle } from "@mui/material";

// Colores personalizados por tipo
const customColors = {
  success: {
    background: "#85E29A", // verde
    text: "#0D1321",
  },
  info: {
    background: "#0D1321", // azul 
    text: "#DFECDF",
  },
  warning: {
    background: "#0D1321", // amarillo
    text: "#E3EBDA",
  },
  error: {
    background: "#0D1321", //rojo
    text: "#F8D7DA",
  },
};

const FeedbackSnackbar = ({
  open,
  onClose,
  type = "", // success, info, warning, error
  title = "",
  message = "",
  autoHideDuration = 5000,
}) => {
  const { background, text } = customColors[type] || customColors.info;

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      

    >
      <Alert
        onClose={onClose}
        severity={type}
        sx={{
          backgroundColor: background,
          color: text,
          minWidth: 300,
          boxShadow: 3,
        }}
        variant="filled"
      >
        {title && <AlertTitle sx={{ color: text }}>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

export default FeedbackSnackbar;
