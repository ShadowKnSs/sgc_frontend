import { Dialog, DialogContent, DialogActions } from "@mui/material";
import DialogTitleCustom from './TitleDialog';
import CustomButton from './Button';

const getDeleteMessage = (type, name) => {
  switch (type) {
    case "usuario":
      return `¿Estás seguro de que deseas eliminar al usuario "${name}"? Esta acción no se puede deshacer.`;
    case "proceso":
      return `¿Estás seguro de que deseas eliminar el proceso "${name}"?`;
    case "minuta":
      return `¿Deseas eliminar la minuta "${name}" de forma permanente?`;
    case "reporte":
      return `¿Seguro que deseas eliminar el reporte "${name}"?`;
    default:
      return `¿Estás seguro de que deseas eliminar "${name}"?`;
  }
};

const ConfirmDelete = ({ open, onClose, entityType, entityName, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitleCustom text="Confirmar Eliminación" />

      <DialogContent
        sx={{
          backgroundColor: "#DFECDF",
          color: "#0D1321",
          fontSize: "16px",
          paddingY: 2,
        }}
      >
        {getDeleteMessage(entityType, entityName)}
      </DialogContent>

      <DialogActions
        sx={{ backgroundColor: "#E3EBDA", padding: "16px", gap: 1 }}
      >
        <CustomButton type="Cancelar" onClick={onClose}>
          Cancelar
        </CustomButton>
        <CustomButton
          type="Eliminar"
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
