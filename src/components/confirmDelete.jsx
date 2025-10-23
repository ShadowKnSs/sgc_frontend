import React, { useState } from "react";
import { Dialog, DialogContent, DialogActions, Typography } from "@mui/material";
import DialogTitleCustom from './TitleDialog';
import CustomButton from './Button';

const getDeleteMessage = (type, name, isPermanent = false) => {
  switch (type) {
    case "usuario":
      return isPermanent
        ? `¿Estás seguro de que deseas eliminar permanentemente al usuario "${name}"? Esta acción no se puede deshacer. Los procesos asignados a este usuario quedarán disponibles para reasignación.`
        : `¿Estás seguro de que deseas desactivar al usuario "${name}"? El usuario se moverá a la sección de inactivos.`;
    case "proceso":
      return `¿Estás seguro de que deseas eliminar el proceso "${name}"?`;
    case "tokens":
      return `¿Estás seguro de que deseas eliminar todos los tokens expirados?`;
    default:
      return `¿Estás seguro de que deseas eliminar "${name}"?`;
  }
};


const getDialogTitle = (type, isPermanent = false) => {
  switch (type) {
    case "usuario":
      return isPermanent ? "Eliminar Usuario Permanentemente" : "Desactivar Usuario";
    default:
      return "Confirmar Eliminación";
  }
};

const getButtonText = (type, isPermanent = false, deleting = false) => {
  if (deleting) {
    return isPermanent ? "Eliminando..." : "Desactivando...";
  }

  switch (type) {
    case "usuario":
      return isPermanent ? "Eliminar Permanentemente" : "Desactivar";
    default:
      return "Eliminar";
  }
};
const ConfirmDelete = ({
  open,
  onClose,
  entityType,
  entityName,
  onConfirm,
  description,
  isPermanent = false
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (!deleting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitleCustom title={getDialogTitle(entityType, isPermanent)} />

      <DialogContent sx={{ py: 3 }}>
        <Typography variant="body1" gutterBottom>
          {getDeleteMessage(entityType, entityName, isPermanent)}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {description}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <CustomButton
          type="cancelar"
          onClick={handleClose}
          disabled={deleting}
        >
          Cancelar
        </CustomButton>
        <CustomButton
          type={isPermanent ? "eliminar" : "warning"} // Puedes usar "warning" para desactivar
          onClick={handleConfirm}
          disabled={deleting}
          loading={deleting}
        >
          {getButtonText(entityType, isPermanent, deleting)}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDelete;