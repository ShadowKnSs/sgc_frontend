import React from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const WarningModal = ({ open, onClose, reportName, year }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h6" align="center" >
          Reporte Existente
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', my: 2 }}>
          <WarningIcon sx={{ fontSize: 64, color: 'orange' }} />
        </Box>
        <Typography variant="body1" align="center">
          Ya existe el reporte{" "}
          <span style={{ color: 'blue', fontWeight: 'bold' }}>
            {reportName} {year}
          </span>
          . No se puede generar uno nuevo.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={onClose} color="primary">
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarningModal;
