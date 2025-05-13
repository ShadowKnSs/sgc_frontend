import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    Button,
    TextField, Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TitleDialog from '../TitleDialog';
import dayjs from 'dayjs';
import CustomButton from "../Button";

const AdminEAModal = ({ open, onClose, onRequestEdit, editItem, tipo }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [fecha, setFecha] = useState('');
    const [fileName, setFileName] = useState('');


    useEffect(() => {
        if (editItem) {
            setFile(null);
            setPreview(editItem.rutaImg || null);
            setFileName('');
            if (editItem.fechaPublicacion) {
                const dateFormatted = dayjs(editItem.fechaPublicacion).format('DD-MM-YYYY HH:mm');
                setFecha(dateFormatted);
            } else {
                setFecha('');
            }
        } else {
            setFile(null);
            setPreview(null);
            setFileName('');
            const now = dayjs().format('DD-MM-YYYY HH:mm');
            setFecha(now);
        }
    }, [editItem]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Validación de tipo y tamaño
        if (!selectedFile.type.startsWith('image/')) {
            alert('Solo se permiten archivos de imagen');
            return;
        }
        if (selectedFile.size > 2 * 1024 * 1024) {
            alert('El tamaño máximo permitido es 2MB');
            return;
        }

        setFile(selectedFile);
        setFileName(selectedFile.name);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const handleSubmit = () => {
        // En lugar de guardar la imagen en rutaImg con createObjectURL,
        // pasamos el File crudo y la descripción al padre
        const formData = {
            file // <-- este 'file' se convertirá en FormData en el padre
        };
        console.log("Este es el formData que se envía:", formData);
        onRequestEdit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

            <Box sx={{ position: 'relative' }}>
          <TitleDialog title={editItem ? `Editar ${tipo}` : `Crear ${tipo}` } subtitle={editItem ? `${tipo} #${editItem.idEventosAvisos} ` : null} />
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 12,
              top: 12,
              color: "#999"
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
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
                    sx={{ mt: 1, backgroundColor: "#68A2C9", display: "flex" }}
                >
                    Subir archivo
                    <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleFileChange}
                    />
                </Button>
                {/* Mostrar nombre de la imagen seleccionada */}
                <Typography variant="body2" sx={{ mt: 1 }}>
                    {fileName ? (
                        <>
                            Imagen Seleccionada:{' '}
                            <Box
                                component="span"
                                sx={{ fontWeight: 'bold', color: 'primary.main' }} // Ajusta tu color y estilo
                            >
                                {fileName}
                            </Box>
                        </>
                    ) : (
                        'Ninguna imagen seleccionada'
                    )}
                </Typography>
                {preview && (
                    <img
                        src={preview}
                        alt="Preview"
                        style={{ width: '100%', marginTop: '1em', borderRadius: '5px' }}
                    />
                )}
            </DialogContent>

            <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 2 }}>
                <CustomButton type="guardar" onClick={handleSubmit}>
                    {editItem ? "Editar" : "Crear"}
                </CustomButton>
                <CustomButton type="cancelar" onClick={onClose}>
                    Cancelar
                </CustomButton>
            </DialogActions>
        </Dialog>
    );
};

export default AdminEAModal;
