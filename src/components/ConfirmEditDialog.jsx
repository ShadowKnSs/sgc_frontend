import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import DialogActionButtons from './DialogActionButtons';

const ConfirmEditDialog = ({ open, onClose, onConfirm, indicatorName }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar Edición</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que deseas guardar los cambios en el indicador <strong>{indicatorName}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <DialogActionButtons 
          onCancel={onClose} 
          onSave={onConfirm} 
          saveText="Confirmar"
          cancelText="Cancelar"
          saveColor="#F9B800"  // Por ejemplo, rojo para eliminar
          cancelColor="#0056b3"
        />
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmEditDialog;
