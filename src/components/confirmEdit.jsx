import React from "react";
import { Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import DialogTitleCustom from './TitleDialog';
import CustomButton from './Button';

const getEditMessage = (type, name, actionText = "Editar") => {
  switch (type) {
    case "usuario":
      return `¿Estás seguro de que deseas ${actionText.toLowerCase()} al usuario "${name}"?`;
    case "proceso":
      return `¿Estás seguro de que deseas ${actionText.toLowerCase()} el proceso "${name}"?`;
    case "minuta":
      return `¿Estás seguro de que deseas ${actionText.toLowerCase()} la minuta "${name}"?`;
    case "reporte":
      return `¿Deseas ${actionText.toLowerCase()} el reporte "${name}"?`;
    default:
      return `¿Estás seguro de que deseas ${actionText.toLowerCase()} "${name}"?`;
  }
};

const ConfirmEdit = ({ 
  open, 
  onClose, 
  entityType, 
  entityName, 
  onConfirm,
  actionText = "Editar" 
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitleCustom title={`Confirmar ${actionText}`} />

      <DialogContent sx={{ py: 3 }}>
        <Typography variant="body1" gutterBottom>
          {getEditMessage(entityType, entityName, actionText)}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <CustomButton 
          type="cancelar" 
          onClick={onClose}
        >
          Cancelar
        </CustomButton>
        <CustomButton 
          type={actionText === "Activar" ? "aceptar" : "guardar"}
          onClick={handleConfirm}
        >
          {actionText}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmEdit;