import React from 'react';
import { Dialog, DialogTitle, Box, DialogContent, DialogActions, Typography } from '@mui/material';
import DialogActionButtons from './DialogActionButtons';

const ConfirmDeleteDialog = ({ open, onClose, onConfirm, itemName }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar Eliminación</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que deseas eliminar{' '}
          <Box
            component="span"
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            {itemName}
          </Box>
          ?
        </Typography>
      </DialogContent>
      <DialogActions>
        <DialogActionButtons
          onCancel={onClose}
          onSave={onConfirm}
          saveText="Eliminar"
          cancelText="Cancelar"
          saveColor="#F9B800"  // Por ejemplo, rojo para eliminar
          cancelColor="#0056b3"
        />
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
