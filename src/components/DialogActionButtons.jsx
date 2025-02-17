import React from 'react';
import { Button, Box } from '@mui/material';

const DialogActionButtons = ({ onCancel, onSave, saveText = "Guardar", cancelText = "Cancelar", saveColor, cancelColor }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
      <Button 
        onClick={onCancel} 
        variant="outlined"
        sx={{ 
          borderRadius: 2,
          transition: 'all 0.3s ease',
          backgroundColor: 'transparent',
          color: 'inherit', 
          borderColor: cancelColor ? cancelColor : 'inherit',
          '&:hover': {
            borderWidth: '2px',
            transform: 'scale(1.05)',
            // Opcional: puedes agregar un boxShadow para dar un efecto de "movimiento" al borde
            boxShadow: '0px 0px 8px rgba(0,0,0,0.2)',
          }
        }}
      >
        {cancelText}
      </Button>
      <Button 
        onClick={onSave} 
        variant="contained"
        sx={{ 
          borderRadius: 2,
          transition: 'all 0.3s ease',
          backgroundColor: saveColor ? saveColor : 'primary.main',
          '&:hover': {
            backgroundColor: saveColor ? saveColor : 'primary.dark',
            transform: 'scale(1.05)',
          }
        }}
      >
        {saveText}
      </Button>
    </Box>
  );
};

export default DialogActionButtons;
