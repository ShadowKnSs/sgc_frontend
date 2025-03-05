import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    Button, TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DialogActionButtons from '../DialogActionButtons';

const AdminEAModal = ({ open, onClose, onRequestEdit, editItem, tipo }) => {
    const [descripcion, setDescripcion] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [fecha, setFecha] = useState(''); // Para mostrar la fecha sin edición


    useEffect(() => {
        if (editItem) {
            setDescripcion(editItem.descripcion || '');
            setFile(null);
            setPreview(editItem.rutaImg || null);
            setFecha(editItem.fechaPublicacion || '');

        } else {
            setDescripcion('');
            setFile(null);
            setPreview(null);
            const now = new Date().toLocaleString();
            setFecha(now);

        }
    }, [editItem]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setPreview(null);
            
        }
    };

    const handleSubmit = () => {
        const formData = {
            descripcion,
            rutaImg: file
                ? URL.createObjectURL(file)
                : editItem?.rutaImg || ''
        };
        onRequestEdit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {editItem ? `Editar ${tipo}` : `Crear ${tipo}`}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <TextField
                    label="Fecha de Publicación"
                    value={fecha}
                    fullWidth
                    margin="normal"
                    disabled
                />

                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Subir Imagen
                </Typography>
                <Button
                    variant="contained"
                    component="label"
                >
                    Subir archivo
                    <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleFileChange}
                    />
                </Button>

                {preview && (
                    <img
                        src={preview}
                        alt="Preview"
                        style={{ width: '100%', marginTop: '1em', borderRadius: '5px' }}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <DialogActionButtons
                    onCancel={onClose}
                    onSave={handleSubmit}
                    saveText={editItem ? 'Editar' : 'Crear'}
                    cancelText="Cancelar"
                    saveColor="#f9b800"
                    cancelColor="#0056b3"
                />
            </DialogActions>
        </Dialog>
    );
};

export default AdminEAModal;
