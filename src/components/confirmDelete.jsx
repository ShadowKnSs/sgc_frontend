import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const ConfirmDelete = ({ open, onClose, entityType, entityName, onConfirm }) => {

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ backgroundColor: '#004A98', color: '#FFFFFF' }}>
                Confirmación de Eliminación
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: '#F9F8F8', color: '#000000' }}>
                <p>
                    ¿Estás seguro de que deseas eliminar <strong>{entityType}</strong> "{entityName}"?
                </p>
            </DialogContent>
            <DialogActions>
                <Button
                    sx={{
                        backgroundColor: '#00B2E3',
                        color: '#FFFFFF',
                        '&:hover': {
                            backgroundColor: '#0091B7',
                        },
                    }}
                    onClick={onClose}
                >
                    Cancelar
                </Button>
                <Button
                    sx={{
                        backgroundColor: '#F9B800',
                        color: '#FFFFFF',
                        '&:hover': {
                            backgroundColor: '#F7A700',
                        },
                    }}
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                >
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDelete;
