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

// helpers seguros
const S = v => (v ?? "");            // string seguro
const C0 = v => S(v).charAt(0);       // primer carácter seguro

function UserCard({ user = {}, onEdit, onDelete, onAssign, onReactivate, reactivating = false }) {
  // Normalización de datos (soporta API con nombre/apellidos y firstName/lastName)
  const rolesArr = Array.isArray(user.roles) ? user.roles : [];
  const isLeader = rolesArr.includes("Líder");
  const isSupervisor = rolesArr.includes("Supervisor");
  const isInactive = user?.activo === false ? true : false;

  const firstName = S(user.firstName ?? user.nombre);
  const lastName = S(user.lastName ?? user.apellidoPat);
  const secondLastName = S(user.secondLastName ?? user.apellidoMat);
  const email = S(user.email ?? user.correo);
  const rpe = S(user.rpe ?? user.RPE);
  const phone = S(user.phone ?? user.telefono);

  const initials = (C0(firstName) + C0(lastName)) || C0(rpe) || "?";
  const displayFullName =
    [lastName, secondLastName].filter(Boolean).join(" ") || rpe || email || "Usuario";
  const displayFirstLine = firstName || rpe || email || "—";

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
        "&:hover": { transform: isInactive ? "none" : "scale(1.02)", boxShadow: isInactive ? 2 : 8 },
        opacity: isInactive ? 0.9 : 1,
      }}
    >
      {isInactive && (
        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0,
          bgcolor: 'error.main', color: 'white', textAlign: 'center',
          py: 0.5, fontSize: '0.75rem', fontWeight: 'bold', zIndex: 2
        }}>
          USUARIO INACTIVO
        </Box>
      )}

      {/* Cabecera */}
      <Box
        sx={{
          backgroundColor: isInactive ? colorPalette.inactivoBorde : colorPalette.verdePastel,
          color: isInactive ? colorPalette.inactivoTexto : colorPalette.azulOscuro,
          textAlign: "center", py: isInactive ? 3 : 2, px: 1.5,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
          flexShrink: 0, position: 'relative', mt: isInactive ? 2 : 0,
        }}
      >
        <Avatar
          sx={{
            width: 60, height: 60,
            backgroundColor: isInactive ? colorPalette.grisOscuro : colorPalette.azulOscuro,
            fontSize: '1.5rem', fontWeight: 'bold', opacity: isInactive ? 0.7 : 1,
          }}
        >
          {initials}
        </Avatar>

        <Box sx={{ width: '100%' }}>
          <Typography
            variant="h6" fontWeight="bold"
            sx={{
              color: isInactive ? colorPalette.inactivoTexto : colorPalette.azulOscuro,
              lineHeight: 1.2, mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}
          >
            {displayFullName}
          </Typography>

          <Typography
            variant="subtitle1" fontWeight="medium"
            sx={{
              color: isInactive ? colorPalette.inactivoTexto : colorPalette.azulOscuro,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}
          >
            {displayFirstLine}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: colorPalette.grisOscuro, mt: 1,
              overflow: 'hidden', textOverflow: 'ellipsis',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}
          >
            {email || "—"}
          </Typography>
        </Box>
      </Box>

      <CardContent
        sx={{
          backgroundColor: isInactive ? colorPalette.inactivoFondo : colorPalette.verdeClaro,
          flexGrow: 1, display: 'flex', flexDirection: 'column', py: 2,
        }}
      >
        {/* Roles */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" fontWeight="bold" sx={{
            color: isInactive ? colorPalette.inactivoTexto : colorPalette.azulOscuro,
            mb: 1, display: 'block'
          }}>
            ROLES:
          </Typography>
          <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
            {rolesArr.length ? rolesArr.map((role, index) => (
              <Chip
                key={`${String(role)}-${index}`}
                label={String(role)}
                size="small"
                sx={{
                  backgroundColor: isInactive ? colorPalette.grisClaro :
                    (index % 2 === 0 ? colorPalette.azulClaro : colorPalette.azulOscuro),
                  color: isInactive ? colorPalette.inactivoTexto : "#fff",
                  fontWeight: 600, fontSize: "0.7rem", borderRadius: 2, height: 24, maxWidth: '100%',
                  opacity: isInactive ? 0.8 : 1,
                }}
              />
            )) : (
              <Chip label="Sin roles" size="small" variant="outlined" />
            )}
          </Box>
        </Box>

        {/* Supervisor */}
        {isLeader && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" fontWeight="bold" sx={{
              color: isInactive ? colorPalette.inactivoTexto : colorPalette.azulOscuro,
              mb: 1, display: 'block'
            }}>
              SUPERVISOR:
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              <SupervisorAccount fontSize="small" sx={{
                color: isInactive ? colorPalette.inactivoTexto : colorPalette.grisOscuro
              }} />
              {user?.supervisor ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: isInactive ? colorPalette.inactivoTexto : "#4a4a4a",
                    textAlign: "center", fontSize: '0.85rem',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}
                >
                  {S(user.supervisor.lastName ?? user.supervisor.apellidoPat)}{" "}
                  {S(user.supervisor.secondLastName ?? user.supervisor.apellidoMat)}{" "}
                  {S(user.supervisor.firstName ?? user.supervisor.nombre)}
                </Typography>
              ) : (
                <Chip
                  label="Sin asignar"
                  color={isInactive ? "default" : "warning"}
                  variant="outlined"
                  size="small"
                  sx={{ fontSize: "0.7rem", fontWeight: "bold", borderRadius: 2, height: 24 }}
                />
              )}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2, backgroundColor: isInactive ? colorPalette.inactivoBorde : colorPalette.grisClaro }} />

        {/* Botones */}
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
                    "&:hover": isInactive ? {} : { backgroundColor: colorPalette.azulClaro, color: "#fff" },
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
                onClick={() => !isInactive && onEdit && onEdit(user)}
                disabled={isInactive}
                sx={{
                  backgroundColor: isInactive ? colorPalette.grisClaro : colorPalette.verdePastel,
                  color: isInactive ? colorPalette.inactivoTexto : colorPalette.azulOscuro,
                  "&:hover": isInactive ? {} : { backgroundColor: colorPalette.azulClaro, color: "#fff" },
                  opacity: isInactive ? 0.6 : 1,
                }}
              >
                <Edit />
              </IconButton>
            </span>
          </Tooltip>

          {isInactive ? (
            <>
              <Tooltip title="Reactivar usuario" arrow placement="top">
                <CustomButton
                  type="aceptar"
                  size="small"
                  onClick={() => onReactivate && onReactivate(user)}
                  loading={reactivating}
                  disabled={reactivating}
                  sx={{ minWidth: '100px', height: '32px', fontSize: '0.75rem', fontWeight: 'bold' }}
                >
                  {reactivating ? 'Reactivando...' : 'Reactivar'}
                </CustomButton>
              </Tooltip>

              {typeof onDelete === 'function' && (
                <Tooltip title="Eliminar permanentemente" arrow placement="top">
                  <span>
                    <IconButton
                      onClick={() => onDelete(user)}
                      sx={{ backgroundColor: "#D32F2F", color: "#fff", "&:hover": { backgroundColor: "#B71C1C" } }}
                    >
                      <Delete />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </>
          ) : (
            typeof onDelete === 'function' ? (
              <Tooltip title="Desactivar usuario" arrow placement="top">
                <span>
                  <IconButton
                    onClick={() => onDelete(user)}
                    sx={{ backgroundColor: "#E57373", color: "#fff", "&:hover": { backgroundColor: "#C62828" } }}
                  >
                    <Delete />
                  </IconButton>
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="No puedes desactivarte a ti mismo" arrow placement="top">
                <span>
                  <IconButton disabled sx={{ backgroundColor: "#f5f5f5", color: "#999999" }}>
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
