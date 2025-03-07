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
          right: 5,
          top: 5,
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
            style={{ width: '680px',
              height: '400px', borderRadius: '5px', padding: '10px 15px' }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
