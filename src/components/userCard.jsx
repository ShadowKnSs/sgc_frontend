/**
 * Componente: UserCard
 * Descripción:
 * Representa visualmente un usuario normal del sistema.
 * Muestra nombre completo, correo, roles, y el supervisor si es un "Líder".
 * Incluye botones de acción para editar o eliminar el usuario.
 */
import React from "react";
import { Card, CardContent, Typography, Divider, Box, IconButton, Tooltip, Chip, Avatar } from "@mui/material";
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
        width: '100%',
        maxWidth: 320,
        minHeight: 380, // Altura mínima consistente
        borderRadius: 4,
        boxShadow: 4,
        overflow: "hidden",
        transition: "transform 0.3s ease",
        backgroundColor: "#fff",
        display: 'flex',
        flexDirection: 'column',
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 8,
        },
      }}
    >
      {/* Cabecera con avatar y nombre */}
      <Box
        sx={{
          backgroundColor: colorPalette.verdePastel,
          color: colorPalette.azulOscuro,
          textAlign: "center",
          py: 2,
          px: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          flexShrink: 0 // Evita que se encoja
        }}
      >
        <Avatar
          sx={{
            width: 60,
            height: 60,
            backgroundColor: colorPalette.azulOscuro,
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
        </Avatar>
        <Box sx={{ width: '100%' }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ 
              color: colorPalette.azulOscuro,
              lineHeight: 1.2,
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {user.lastName} {user.secondLastName}
          </Typography>
          <Typography 
            variant="subtitle1" 
            fontWeight="medium" 
            sx={{ 
              color: colorPalette.azulOscuro,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {user.firstName}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: colorPalette.grisOscuro,
              mt: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {user.email}
          </Typography>
        </Box>
      </Box>

      <CardContent 
        sx={{ 
          backgroundColor: colorPalette.verdeClaro,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          py: 2,
        }}
      >
        {/* Roles con mejor jerarquía */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" fontWeight="bold" sx={{ color: colorPalette.azulOscuro, mb: 1, display: 'block' }}>
            ROLES:
          </Typography>
          <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
            {user.roles.map((role, index) => (
              <Chip
                key={index}
                label={role}
                size="small"
                sx={{
                  backgroundColor: index % 2 === 0 ? colorPalette.azulClaro : colorPalette.azulOscuro,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  borderRadius: 2,
                  height: 24,
                  maxWidth: '100%',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Información de supervisor con mejor jerarquía */}
        {isLeader && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" fontWeight="bold" sx={{ color: colorPalette.azulOscuro, mb: 1, display: 'block' }}>
              SUPERVISOR:
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              <SupervisorAccount fontSize="small" sx={{ color: colorPalette.grisOscuro }} />
              {user.supervisor ? (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: "#4a4a4a", 
                    textAlign: "center",
                    fontSize: '0.85rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {user.supervisor.lastName} {user.supervisor.secondLastName} {user.supervisor.firstName}
                </Typography>
              ) : (
                <Chip
                  label="Sin asignar"
                  color="warning"
                  variant="outlined"
                  size="small"
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    borderRadius: 2,
                    height: 24
                  }}
                />
              )}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2, backgroundColor: colorPalette.grisClaro }} />

        {/* Botones de acción con tooltips mejorados */}
        <Box display="flex" justifyContent="center" gap={1} mt="auto">
          {isSupervisor && (
            <Tooltip title="Asignar procesos a este supervisor" arrow placement="top">
              <IconButton
                onClick={() => onAssign && onAssign(user)}
                sx={{
                  backgroundColor: colorPalette.verdeAgua, 
                  color: colorPalette.azulOscuro,
                  "&:hover": { backgroundColor: colorPalette.azulClaro, color: "#fff" },
                }}
              >
                <PlaylistAdd />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Editar información del usuario" arrow placement="top">
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

          <Tooltip title="Eliminar usuario del sistema" arrow placement="top">
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