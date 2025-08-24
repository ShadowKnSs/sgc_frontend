import React, { useState } from "react";
import { Dialog, DialogContent, DialogActions, Typography } from "@mui/material";
import DialogTitleCustom from './TitleDialog';
import CustomButton from './Button';

const getDeleteMessage = (type, name) => {
  switch (type) {
    case "usuario":
      return `¿Estás seguro de que deseas eliminar al usuario "${name}"? Esta acción no se puede deshacer.`;
    case "proceso":
      return `¿Estás seguro de que deseas eliminar el proceso "${name}"?`;
    case "tokens":
      return `¿Estás seguro de que deseas eliminar todos los tokens expirados?`;
    default:
      return `¿Estás seguro de que deseas eliminar "${name}"?`;
  }
};

const ConfirmDelete = ({ open, onClose, entityType, entityName, onConfirm, description }) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error en la eliminación:", error);
      // El error debería ser manejado por la función onConfirm
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
      <DialogTitleCustom title="Confirmar Eliminación" />
      
      <DialogContent sx={{ py: 3 }}>
        <Typography variant="body1" gutterBottom>
          {getDeleteMessage(entityType, entityName)}
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
          type="eliminar"
          onClick={handleConfirm}
          disabled={deleting}
          loading={deleting}
        >
          {deleting ? "Eliminando..." : "Eliminar"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDelete;