/**
 * Componente: UserCard
 * Descripción:
 * Representa visualmente un usuario normal del sistema.
 * Muestra nombre completo, correo, roles, y el supervisor si es un "Líder".
 * Incluye botones de acción para editar o eliminar el usuario.
 */
import React from "react";
import { Card, CardContent, Typography, Divider, Box, IconButton, Tooltip, Chip, Avatar } from "@mui/material";
import { Edit, Delete, Refresh } from "@mui/icons-material";
import SupervisorAccount from "@mui/icons-material/SupervisorAccount";
import PlaylistAdd from "@mui/icons-material/PlaylistAdd";
import CustomButton from "./Button";

const colorPalette = {
  azulOscuro: "#185FA4",
  azulClaro: "#68A2C9",
  verdeAgua: "#BBD8D7",
  verdeClaro: "#DFECDF",
  verdePastel: "#E3EBDA",
  grisClaro: "#DEDFD1",
  grisOscuro: "#A4A7A0",
  inactivoFondo: "#F5F5F5",
  inactivoTexto: "#757575",
  inactivoBorde: "#E0E0E0",
};

function UserCard({ user, onEdit, onDelete, onAssign, onReactivate, reactivating = false }) {
  const isLeader = user.roles.includes("Líder");
  const isSupervisor = user.roles.includes("Supervisor");
  const isInactive = !user.activo;

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 320,
        minHeight: 380,
        borderRadius: 4,
        boxShadow: isInactive ? 1 : 4,
        overflow: "hidden",
        transition: "all 0.3s ease",
        backgroundColor: isInactive ? colorPalette.inactivoFondo : "#fff",
        border: isInactive ? `2px solid ${colorPalette.inactivoBorde}` : "none",
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        "&:hover": {
          transform: isInactive ? "none" : "scale(1.02)",
          boxShadow: isInactive ? 2 : 8,
        },
        opacity: isInactive ? 0.9 : 1,
      }}
    >
      {/* Banner de usuario inactivo */}
      {isInactive && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bgcolor: 'error.main',
          color: 'white',
          textAlign: 'center',
          py: 0.5,
          fontSize: '0.75rem',
          fontWeight: 'bold',
          zIndex: 2
        }}>
          USUARIO INACTIVO
        </Box>
      )}

      {/* Cabecera con avatar y nombre */}
      <Box
        sx={{
          backgroundColor: isInactive ? colorPalette.inactivoBorde : colorPalette.verdePastel,
          color: isInactive ? colorPalette.inactivoTexto : colorPalette.azulOscuro,
          textAlign: "center",
          py: isInactive ? 3 : 2,
          px: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          flexShrink: 0,
          position: 'relative',
          mt: isInactive ? 2 : 0,
        }}
      >
        <Avatar
          sx={{
            width: 60,
            height: 60,
            backgroundColor: isInactive ? colorPalette.grisOscuro : colorPalette.azulOscuro,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            opacity: isInactive ? 0.7 : 1,
          }}
        >
          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
        </Avatar>

        <Box sx={{ width: '100%' }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              color: isInactive ? colorPalette.inactivoTexto : colorPalette.azulOscuro,
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
              color: isInactive ? colorPalette.inactivoTexto : colorPalette.azulOscuro,
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
              color: isInactive ? colorPalette.grisOscuro : colorPalette.grisOscuro,
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
          backgroundColor: isInactive ? colorPalette.inactivoFondo : colorPalette.verdeClaro,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          py: 2,
        }}
      >
        {/* Roles con estilo para inactivos */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" fontWeight="bold" sx={{
            color: isInactive ? colorPalette.inactivoTexto : colorPalette.azulOscuro,
            mb: 1,
            display: 'block'
          }}>
            ROLES:
          </Typography>
          <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
            {user.roles.map((role, index) => (
              <Chip
                key={index}
                label={role}
                size="small"
                sx={{
                  backgroundColor: isInactive ? colorPalette.grisClaro :
                    (index % 2 === 0 ? colorPalette.azulClaro : colorPalette.azulOscuro),
                  color: isInactive ? colorPalette.inactivoTexto : "#fff",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  borderRadius: 2,
                  height: 24,
                  maxWidth: '100%',
                  opacity: isInactive ? 0.8 : 1,
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Información de supervisor */}
        {isLeader && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" fontWeight="bold" sx={{
              color: isInactive ? colorPalette.inactivoTexto : colorPalette.azulOscuro,
              mb: 1,
              display: 'block'
            }}>
              SUPERVISOR:
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              <SupervisorAccount fontSize="small" sx={{
                color: isInactive ? colorPalette.inactivoTexto : colorPalette.grisOscuro
              }} />
              {user.supervisor ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: isInactive ? colorPalette.inactivoTexto : "#4a4a4a",
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
                  color={isInactive ? "default" : "warning"}
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

        <Divider sx={{
          my: 2,
          backgroundColor: isInactive ? colorPalette.inactivoBorde : colorPalette.grisClaro
        }} />

        {/* Botones de acción - Deshabilitados para inactivos */}
        <Box display="flex" justifyContent="center" gap={1} mt="auto">
          {isSupervisor && (
            <Tooltip title={isInactive ? "Usuario inactivo - No editable" : "Asignar procesos a este supervisor"} arrow placement="top">
              <span>
                <IconButton
                  onClick={() => !isInactive && onAssign && onAssign(user)}
                  disabled={isInactive}
                  sx={{
                    backgroundColor: isInactive ? colorPalette.grisClaro : colorPalette.verdeAgua,
                    color: isInactive ? colorPalette.inactivoTexto : colorPalette.azulOscuro,
                    "&:hover": isInactive ? {} : {
                      backgroundColor: colorPalette.azulClaro,
                      color: "#fff"
                    },
                    opacity: isInactive ? 0.6 : 1,
                  }}
                >
                  <PlaylistAdd />
                </IconButton>
              </span>
            </Tooltip>
          )}

          <Tooltip title={isInactive ? "Usuario inactivo - No editable" : "Editar información del usuario"} arrow placement="top">
            <span>
              <IconButton
                onClick={() => !isInactive && onEdit(user)}
                disabled={isInactive}
                sx={{
                  backgroundColor: isInactive ? colorPalette.grisClaro : colorPalette.verdePastel,
                  color: isInactive ? colorPalette.inactivoTexto : colorPalette.azulOscuro,
                  "&:hover": isInactive ? {} : {
                    backgroundColor: colorPalette.azulClaro,
                    color: "#fff",
                  },
                  opacity: isInactive ? 0.6 : 1,
                }}
              >
                <Edit />
              </IconButton>
            </span>
          </Tooltip>

          {isInactive ? (
            // Para usuarios inactivos: Botón de reactivación y eliminación permanente
            <>
              <Tooltip title="Reactivar usuario" arrow placement="top">
                <CustomButton
                  type="aceptar"
                  size="small"
                  onClick={() => onReactivate && onReactivate(user)}
                  loading={reactivating}
                  disabled={reactivating}
                  sx={{
                    minWidth: '100px',
                    height: '32px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {reactivating ? 'Reactivando...' : 'Reactivar'}
                </CustomButton>
              </Tooltip>

              {typeof onDelete === 'function' && (
                <Tooltip title="Eliminar permanentemente" arrow placement="top">
                  <span>
                    <IconButton
                      onClick={() => onDelete(user)}
                      sx={{
                        backgroundColor: "#D32F2F",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#B71C1C",
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </>
          ) : (
            // Para usuarios activos: Solo botón de desactivar
            typeof onDelete === 'function' ? (
              <Tooltip title="Desactivar usuario" arrow placement="top">
                <span>
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
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="No puedes desactivarte a ti mismo" arrow placement="top">
                <span>
                  <IconButton
                    disabled
                    sx={{
                      backgroundColor: "#f5f5f5",
                      color: "#999999",
                    }}
                  >
                    <Delete />
                  </IconButton>
                </span>
              </Tooltip>
            )
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default UserCard;