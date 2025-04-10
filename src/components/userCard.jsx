import React from "react";
import { Card, CardContent, Typography, Divider, Box, IconButton, Tooltip, Chip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

function UserCard({ user, onEdit, onDelete }) {
  return (
    <Card
      sx={{
        width: 320,
        padding: 3,
        backgroundColor: "#F9F8F8",
        borderRadius: 3,
        boxShadow: 4,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 8,
        },
      }}
    >
      <CardContent>
        {/* Parte superior: Nombre y Correo */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" color="#004A98" noWrap>
            {user.lastName} {user.secondLastName} {user.firstName}
          </Typography>
          <Typography variant="body2" color="#00B2E3" sx={{ wordBreak: "break-word", mt: 1 }}>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Roles: Centrados en una fila con chips */}
        <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>
          {user.roles.map((role, index) => (
            <Chip
              key={index}
              label={role}
              sx={{
                backgroundColor: "#F9B800",
                color: "white",
                fontWeight: "bold",
                fontSize: "0.875rem",
                borderRadius: 20,
                padding: "4px 12px",
              }}
            />
          ))}
        </Box>

        {/* Supervisor: Solo si es Líder de Proceso */}
        {user.roles.includes("Líder") && user.supervisor && (
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="body2" color="#555">
              Supervisor: {user.supervisor.lastName} {user.supervisor.secondLastName} {user.supervisor.firstName}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Acciones: Botones centrados y estilizados */}
        <Box display="flex" justifyContent="center" gap={3}>
          <Tooltip title="Editar">
            <IconButton
              onClick={() => onEdit(user)}
              sx={{
                color: "#004A98",
                '&:hover': { backgroundColor: "#d0e0f1" },
                padding: 1.5,
                borderRadius: "50%",
                boxShadow: 2,
                transition: "all 0.2s ease",
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              onClick={() => onDelete(user)}
              sx={{
                color: "#F9B800",
                '&:hover': { backgroundColor: "#fbe7a2" },
                padding: 1.5,
                borderRadius: "50%",
                boxShadow: 2,
                transition: "all 0.2s ease",
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}

export default UserCard;