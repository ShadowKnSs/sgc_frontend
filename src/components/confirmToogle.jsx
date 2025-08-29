import React, { useState } from "react";
import { Dialog, DialogContent, DialogActions, Typography } from "@mui/material";
import DialogTitleCustom from "./TitleDialog";
import CustomButton from "./Button";

// Mensaje dinámico
const getToggleMessage = (type, name, isActive) => {
  switch (type) {
    case "usuario":
      return isActive
        ? `¿Estás seguro de que deseas desactivar al usuario "${name}"?`
        : `¿Estás seguro de que deseas activar al usuario "${name}"?`;
    case "entidad":
      return isActive
        ? `¿Estás seguro de que deseas desactivar la entidad "${name}"?`
        : `¿Estás seguro de que deseas activar la entidad "${name}"?`;
    default:
      return isActive
        ? `¿Estás seguro de que deseas desactivar "${name}"?`
        : `¿Estás seguro de que deseas activar "${name}"?`;
  }
};

// Título dinámico
const getDialogTitle = (type, isActive) => {
  switch (type) {
    case "usuario":
      return isActive ? "Desactivar Usuario" : "Activar Usuario";
    case "entidad":
      return isActive ? "Desactivar Entidad" : "Activar Entidad";
    default:
      return isActive ? "Desactivar" : "Activar";
  }
};

// Texto del botón dinámico
const getButtonText = (isActive, toggling) => {
  if (toggling) {
    return isActive ? "Desactivando..." : "Activando...";
  }
  return isActive ? "Desactivar" : "Activar";
};

const ConfirmToggle = ({
  open,
  onClose,
  entityType,
  entityName,
  isActive, // estado actual (1 o 0)
  onConfirm,
  description
}) => {
  const [toggling, setToggling] = useState(false);

  const handleConfirm = async () => {
    setToggling(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error en el cambio de estado:", error);
    } finally {
      setToggling(false);
    }
  };

  const handleClose = () => {
    if (!toggling) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitleCustom title={getDialogTitle(entityType, isActive)} />

      <DialogContent sx={{ py: 3 }}>
        <Typography variant="body1" gutterBottom>
          {getToggleMessage(entityType, entityName, isActive)}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {description}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <CustomButton type="cancelar" onClick={handleClose} disabled={toggling}>
          Cancelar
        </CustomButton>
        <CustomButton
          type={isActive ? "warning" : "success"} // warning = desactivar, success = activar
          onClick={handleConfirm}
          disabled={toggling}
          loading={toggling}
        >
          {getButtonText(isActive, toggling)}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmToggle;
