import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";

function ConfirmationDialog({ open, onClose, onConfirm, type, status, name }) {

    const getMessage = () => {
    switch (type) {
      case "usuario":
        return `la información de`;
      case "proceso":
        return `el proceso`;
      case "indicador":
        return `el indicador`;
      case "actividad":
        return `la actividad de mejora`;
      default:
        return `el elemento`;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "#E8E8E8",
          borderRadius: "16px",
          padding: "20px",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>
          Confirmación
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ textAlign: "center" }}> 
          ¿<span style={{ fontWeight: "bold", color: "#004A98" }}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>{" "}
          {getMessage()} <b>{name}</b>?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: "10px" }}>
  <Button
    onClick={onClose}
    sx={{
      backgroundColor: "#F9B800",
      color: "white",
      fontWeight: "bold",
      borderRadius: "8px", 
      border: "2px solid #E0A200",  
      "&:hover": { backgroundColor: "#E0A200" },
    }}
  >
    Cancelar
  </Button>
  <Button
    onClick={onConfirm}
    sx={{
      backgroundColor: "#004A98",
      color: "white",
      fontWeight: "bold",
      borderRadius: "8px",  
      border: "2px solid #003774",  
      "&:hover": { backgroundColor: "#003774" },
    }}
  >
    Confirmar
  </Button>
</DialogActions>

    </Dialog>
  );
}
export default ConfirmationDialog;
