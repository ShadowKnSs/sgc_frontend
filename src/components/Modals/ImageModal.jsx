import React from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ImageModal = ({ open, imageUrl, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      {/* Botón para cerrar */}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ textAlign: 'center' }}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Ampliada"
            style={{ maxWidth: '90%', borderRadius: '5px' }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
