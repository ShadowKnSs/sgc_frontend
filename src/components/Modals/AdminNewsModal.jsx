import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    TextField,
    Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DialogActionButtons from '../DialogActionButtons';

const AdminNewsModal = ({ open, onClose, onSave, editItem }) => {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [file, setFile] = useState(null);     // Para almacenar el archivo subido
    const [preview, setPreview] = useState(null); // Para mostrar vista previa de la imagen
    const [fecha, setFecha] = useState(''); // Para mostrar la fecha sin edición


    useEffect(() => {
        if (editItem) {
            setTitulo(editItem.titulo || '');
            setDescripcion(editItem.descripcion || '');
            setFile(null);
            // Si ya hay una imagen previa (rutaImg), la mostramos
            setPreview(editItem.rutaImg || null);
            setFecha(editItem.fechaPublicacion || '');

        } else {
            setTitulo('');
            setDescripcion('');
            setFile(null);
            setPreview(null);
            const now = new Date().toLocaleString();
            setFecha(now);

        }
    }, [editItem]);

    // Cuando el usuario selecciona un archivo
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        // Generar URL local para vista previa
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setPreview(null);
        }
    };

    // Al dar clic en "Guardar/Crear/Editar"
    const handleSubmit = () => {
        // En un backend real, aquí subirías el archivo y obtendrías la URL final
        const formData = {
            titulo,
            descripcion,
            rutaImg: file
                ? URL.createObjectURL(file)  // Para la demo local
                : editItem?.rutaImg || ''    // Si no se sube archivo nuevo, conserva la imagen previa
        };
        // Llamamos a onRequestEdit en vez de cerrar directamente
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {editItem ? 'Editar Noticia' : 'Crear Noticia'}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {/* Campo solo lectura para fecha */}
                <TextField
                    label="Fecha de Publicación"
                    value={fecha}
                    fullWidth
                    margin="normal"
                    disabled
                />
                {/* Campo Título */}
                <TextField
                    label="Título"
                    fullWidth
                    margin="normal"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />

                {/* Campo Descripción */}
                <TextField
                    label="Descripción"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />

                {/* Subir Imagen */}
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


                {/* Vista previa */}
                {preview && (
                    <img
                        src={preview}
                        alt="Preview"
                        style={{ width: '100%', marginTop: '1em', borderRadius: '5px', }}
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

export default AdminNewsModal;
