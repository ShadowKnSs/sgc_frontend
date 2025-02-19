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

  // Reiniciamos el estado cada vez que se abre el modal
  useEffect(() => {
    if (open) {
      setFormData(initialState);
    }
  }, [open, initialState]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  // Clonamos el componente hijo para pasarle formData y setFormData
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
