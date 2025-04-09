// 📁 src/components/MensajeAlert.jsx
import React from 'react';
import { Alert, Box, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const MensajeAlert = ({ tipo = 'info', texto, onClose }) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <Box mb={2}>
      <Collapse in={open}>
        <Alert
          severity={tipo}
          action={
            <IconButton color="inherit" size="small" onClick={handleClose}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {texto}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default MensajeAlert;
