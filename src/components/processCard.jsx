import React, { useState } from "react";
import { Card, Box, IconButton, Typography } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import ConfirmationDialog from "./MsgConfirmation";

function ProcessCard({ process, onDelete, onEdit }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const handleOpen = (action) => {
    setStatus(action);
    setType("proceso");
    setOpen(true);
  };

  const handleConfirm = () => {
    if (status === "eliminar") {
      onDelete(process.id);
    } else if (status === "actualizar") {
      onEdit(process.id);
    }
    setOpen(false);
  };

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 16px",
        borderRadius: "16px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#E8E8E8",
        marginBottom: "10px",
        minWidth: "300px",
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        {process.name}
      </Typography>
      <Box>
        <IconButton onClick={() => handleOpen("actualizar")} sx={{ color: "#004A98" }}>
          <Edit />
        </IconButton>
        <IconButton onClick={() => handleOpen("eliminar")} sx={{ color: "#F9B800" }}>
          <Delete />
        </IconButton>
      </Box>

      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        type={type}
        status={status}
        name={process.name}
      />
    </Card>
  );
}

export default ProcessCard;
