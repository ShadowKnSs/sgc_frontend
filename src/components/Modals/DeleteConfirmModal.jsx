import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const DeleteConfirmModal = ({ open, reportName, onConfirm, onCancel }) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle sx={{textAlign:"center", paddingBottom: 2, color:"primary.main", fontWeight: 'bold'}}>Confirmar eliminación</DialogTitle>
      <DialogContent>
        <Typography align="center">
          ¿Estás seguro que quieres eliminar el reporte{" "}
          <span style={{ color:"#0056b3", fontWeight: 'bold' }}>
            {reportName}
          </span>
          ?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={onCancel} color="primary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmModal;
