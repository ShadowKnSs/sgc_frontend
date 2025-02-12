import React from "react";
import { Card, CardContent, Box, IconButton, Typography } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

function ProcessCard({ process, onDelete, onEdit }) {
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
        <IconButton onClick={onEdit} sx={{ color: "#004A98" }}>
          <Edit />
        </IconButton>
        <IconButton onClick={onDelete} sx={{ color: "#F9B800" }}>
          <Delete />
        </IconButton>
      </Box>
    </Card>
  );
}

export default ProcessCard;
