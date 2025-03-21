// src/components/GenericModal.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DialogActionButtons from '../DialogActionButtons';

const GenericModal = ({
  open,
  onClose,
  onSave,
  title,
  children,
  saveText = 'Guardar',
  cancelText = 'Cancelar',
  saveColor,
  cancelColor,
  initialState = {}
}) => {
  const [formData, setFormData] = useState(initialState);

  // Actualizar el state solo cuando initialState cambia (no cada vez que se abra el modal)
  useEffect(() => {
    setFormData(initialState);
  }, [initialState]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <DialogActionButtons 
          onCancel={onClose} 
          onSave={handleSave} 
          saveText={saveText} 
          cancelText={cancelText}
          saveColor={saveColor}
          cancelColor={cancelColor}
        />
      </DialogActions>
    </Dialog>
  );
};

export default GenericModal;
