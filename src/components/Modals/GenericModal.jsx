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

  // Cada vez que se abra el modal, si initialState cambia (por ejemplo, si hay datos guardados),
  // se actualiza el estado local.
  useEffect(() => {
    if (open) {
      setFormData(initialState);
    }
  }, [open, initialState]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {React.cloneElement(children, { formData, setFormData })}
      </DialogContent>
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
