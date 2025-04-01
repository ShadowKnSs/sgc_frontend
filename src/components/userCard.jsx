import React from "react";
import { Card, CardContent, Typography, Divider, Box, IconButton, Tooltip, Chip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

function UserCard({ user, onEdit, onDelete }) {
  return (
    <Card
      sx={{
        width: 300,
        padding: 2,
        textAlign: "center",
        backgroundColor: "#F9F8F8",
        borderRadius: 3,
        boxShadow: 4,
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        {/* Nombre Completo */}
        <Typography variant="h6" fontWeight="bold" color="#004A98" noWrap>
          {user.lastName} {user.secondLastName} {user.firstName}
        </Typography>

        {/* Correo Electrónico */}
        <Typography variant="body2" color="#00B2E3" sx={{ wordBreak: "break-word", mt: 1 }}>
          {user.email}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        {/* Roles */}
        <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
          {user.roles.map((role, index) => (
            <Chip key={index} label={role} sx={{ backgroundColor: "#F9B800", color: "white" }} />
          ))}
        </Box>

        {/* Supervisor (Solo si es Líder de Proceso) */}
        {user.roles.includes("Líder de Proceso") && user.supervisor && (
          <Typography variant="body2" color="#555" sx={{ mt: 1 }}>
            Supervisor: {user.supervisor.lastName} {user.supervisor.secondLastName} {user.supervisor.firstName}
          </Typography>
        )}

        <Divider sx={{ my: 1.5 }} />

        {/* Iconos de acción */}
        <Box display="flex" justifyContent="center" gap={1}>
          <Tooltip title="Editar">
            <IconButton onClick={() => onEdit(user)} sx={{ color: "#004A98", '&:hover': { backgroundColor: "#d0e0f1" } }}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton onClick={() => onDelete(user)} sx={{ color: "#F9B800", '&:hover': { backgroundColor: "#fbe7a2" } }}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}

export default UserCard;
