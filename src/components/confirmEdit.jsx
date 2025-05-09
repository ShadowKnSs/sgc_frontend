import React from 'react';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import DialogTitleCustom from './TitleDialog';
import CustomButton from './Button';

const getEditMessage = (type, name) => {
    switch (type) {
      case "usuario":
        return `¿Estás seguro de que deseas editar al usuario "${name}"?`;
      case "proceso":
        return `¿Estás seguro de que deseas editar el proceso "${name}"?`;
      case "minuta":
        return `¿Estás seguro de que deseas editar la minuta "${name}"?`;
      case "reporte":
        return `¿Deseas editar el reporte "${name}"?`;
      default:
        return `¿Estás seguro de que deseas editar "${name}"?`;
    }
  };
  
  const ConfirmEdit = ({ open, onClose, entityType, entityName, onConfirm }) => {
    console.log("entityName en ConfirmEdit:", entityName); 
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitleCustom title="Confirmar Edición" />
  
        <DialogContent
          sx={{
            backgroundColor: "#DFECDF",
            color: "#0D1321",
            fontSize: "16px",
            paddingY: 2,
          }}
        >
          {getEditMessage(entityType, entityName)}
        </DialogContent>
  
        <DialogActions
          sx={{ backgroundColor: "#E3EBDA", padding: "16px", gap: 1 }}
        >
          <CustomButton type = "Cancelar"onClick={onClose}>Cancelar</CustomButton>
          <CustomButton 
            type="Aceptar"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Editar
          </CustomButton>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ConfirmEdit;
