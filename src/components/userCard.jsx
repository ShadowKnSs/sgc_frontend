/**
 * Componente: UserCard
 * Descripción:
 * Representa visualmente un usuario normal del sistema.
 * Muestra nombre completo, correo, roles, y el supervisor si es un "Líder".
 * Incluye botones de acción para editar o eliminar el usuario.
 */
import React from "react";
import { Card, CardContent, Typography, Divider, Box, IconButton, Tooltip, Chip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import SupervisorAccount from "@mui/icons-material/SupervisorAccount";
import PlaylistAdd from "@mui/icons-material/PlaylistAdd";

const colorPalette = {
  azulOscuro: "#185FA4",
  azulClaro: "#68A2C9",
  verdeAgua: "#BBD8D7",
  verdeClaro: "#DFECDF",
  verdePastel: "#E3EBDA",
  grisClaro: "#DEDFD1",
  grisOscuro: "#A4A7A0",
};

function UserCard({ user, onEdit, onDelete, onAssign }) {
  const isLeader = user.roles.includes("Líder");
  const isSupervisor = user.roles.includes("Supervisor");

  return (
    <Card
      sx={{
        width: 320,
        borderRadius: 4,
        boxShadow: 4,
        overflow: "hidden",
        transition: "transform 0.3s ease",
        backgroundColor: "#fff",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 8,
        },
      }}
    >
      {/* Cabecera con nombre y correo */}
      <Box
        sx={{
          backgroundColor: colorPalette.verdePastel,
          color: colorPalette.azulOscuro,
          textAlign: "center",
          py: 2,
          px: 1.5,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          noWrap
          sx={{ color: colorPalette.azulOscuro }}
        >
          {user.lastName} {user.secondLastName} {user.firstName}
        </Typography>
        <Typography variant="body2" sx={{ color: colorPalette.grisOscuro }}>
          {user.email}
        </Typography>
      </Box>

      <CardContent sx={{ backgroundColor: colorPalette.verdeClaro }}>
        {/* Roles */}
        <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap" mb={2}>
          {user.roles.map((role, index) => (
            <Chip
              key={index}
              label={role}
              sx={{
                backgroundColor: index % 2 === 0 ? colorPalette.azulClaro : colorPalette.azulOscuro,
                color: "#fff",
                fontWeight: 500,
                fontSize: "0.75rem",
                borderRadius: 2,
              }}
            />
          ))}
        </Box>

        {/* Información de supervisor */}
        {isLeader && (
          <Box display="flex" alignItems="center" justifyContent="center" gap={1} px={1} mb={2}>
            <SupervisorAccount fontSize="small" sx={{ color: colorPalette.grisOscuro }} />

            {user.supervisor ? (
              <Typography variant="body2" sx={{ color: "#4a4a4a", textAlign: "center" }}>
                Supervisor: {user.supervisor.lastName} {user.supervisor.secondLastName} {user.supervisor.firstName}
              </Typography>
            ) : (
              <Chip
                label="Sin supervisor asignado"
                color="warning"
                variant="outlined"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  borderRadius: 2,
                }}
              />
            )}
          </Box>
        )}

        <Divider sx={{ my: 2, backgroundColor: colorPalette.grisClaro }} />

        {/* Botones de acción */}
        <Box display="flex" justifyContent="center" gap={2}>
          {isSupervisor && (
            <Tooltip title="Asignar procesos">
              <IconButton
                onClick={() => onAssign && onAssign(user)}
                sx={{
                  backgroundColor: colorPalette.verdeAgua, color: colorPalette.azulOscuro,
                  "&:hover": { backgroundColor: colorPalette.azulClaro, color: "#fff" },
                }}
              >
                <PlaylistAdd />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Editar">
            <IconButton
              onClick={() => onEdit(user)}
              sx={{
                backgroundColor: colorPalette.verdePastel,
                color: colorPalette.azulOscuro,
                "&:hover": {
                  backgroundColor: colorPalette.azulClaro,
                  color: "#fff",
                },
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar">
            <IconButton
              onClick={() => onDelete(user)}
              sx={{
                backgroundColor: "#E57373",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#C62828",
                },
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
