import React from "react";
import { Card, CardContent, Avatar, Typography, IconButton, Box, Divider } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

function UserCard({ user, onEdit, onDelete }) {
  return (
    <Card sx={{
      width: 250,
      height: 180,
      padding: 2,
      textAlign: "center",
      backgroundColor: "#f5f5f5",
      borderRadius: 2,
      boxShadow: 3,
      transition: "transform 0.2s ease-in-out",
      "&:hover": {
        transform: "scale(1.05)",
        boxShadow: 6,
      }
    }}>
      <Avatar src={user.photo} sx={{ width: 80, height: 80, margin: "auto", border: "2px solid #004A98" }} />
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" color="#004A98" noWrap>
          {user.lastName} {user.secondLastName} {user.firstName}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Box display="flex" justifyContent="center" gap={1}>
          <IconButton onClick={() => onEdit(user)} sx={{ color: "#004A98", '&:hover': { backgroundColor: "#d0e0f1" } }}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => onDelete(user)} sx={{ color: "#F9B800", '&:hover': { backgroundColor: "#fbe7a2" } }}>
            <Delete />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

export default UserCard;
