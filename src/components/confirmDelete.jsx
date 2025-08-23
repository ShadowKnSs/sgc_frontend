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
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
        <CustomButton type="cancelar" onClick={onClose}>
          Cancelar
        </CustomButton>
        <CustomButton
          type="eliminar"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Eliminar
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDelete;