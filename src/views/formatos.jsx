// src/views/Formatos.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Box, Modal, Typography, TextField, Card, CardContent, CardActions, CircularProgress, Grid, Chip, IconButton, InputAdornment, Avatar, alpha, Tooltip } from '@mui/material';
import { Search, PictureAsPdf, Description, Image as ImageIcon, InsertDriveFile, Close, CloudUpload, Download, Article, Delete } from '@mui/icons-material';
import Title from '../components/Title';
import FabCustom from "../components/FabCustom";
import Add from "@mui/icons-material/Add";
import CustomButton from '../components/Button';
import DialogTitleCustom from '../components/TitleDialog';
import FeedbackSnackbar from '../components/Feedback';
import BreadcrumbNav from "../components/BreadcrumbNav";
import usePermiso from '../hooks/userPermiso';
import ConfirmDelete from '../components/confirmDelete';

// Componente para previsualización de imagen
const ImagePreview = ({ file, onRemove }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  if (!preview) return null;

  return (
    <Box sx={{ position: 'relative', display: 'inline-block', mt: 2 }}>
      <Avatar
        src={preview}
        variant="rounded"
        sx={{ width: 100, height: 100, border: '1px dashed #ccc' }}
      />
      <IconButton
        size="small"
        onClick={onRemove}
        sx={{
          position: 'absolute',
          top: -10,
          right: -10,
          bgcolor: 'background.paper',
          '&:hover': { bgcolor: 'grey.100' }
        }}
      >
        <Close />
      </IconButton>
    </Box>
  );
};

// Componente Modal separado para mejor rendimiento
const FormatoModal = React.memo(({
  open,
  onClose,
  onSubmit,
  isLoading,
  acceptedFiles = "application/pdf,image/*,.doc,.docx"
}) => {
  const [nombreFormato, setNombreFormato] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState({ nombre: '', archivo: '' });
  const [isDragOver, setIsDragOver] = useState(false);

  // Reset del estado cuando se abre/cierra el modal
  useEffect(() => {
    if (!open) {
      setNombreFormato('');
      setArchivo(null);
      setError({ nombre: '', archivo: '' });
      setIsDragOver(false);
    }
  }, [open]);

  const validateForm = useCallback(() => {
    let isValid = true;
    const newError = { nombre: '', archivo: '' };

    if (!nombreFormato.trim()) {
      newError.nombre = 'El nombre es requerido';
      isValid = false;
    }

    if (!archivo) {
      newError.archivo = 'El archivo es requerido';
      isValid = false;
    }

    setError(newError);
    return isValid;
  }, [nombreFormato, archivo]);

  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      onSubmit({ nombreFormato, archivo });
    }
  }, [validateForm, onSubmit, nombreFormato, archivo]);

  const handleCloseInternal = useCallback(() => {
    setNombreFormato('');
    setArchivo(null);
    setError({ nombre: '', archivo: '' });
    setIsDragOver(false);
    onClose();
  }, [onClose]);

  const validateFile = useCallback((file) => {
    // Validar tamaño máximo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return 'El archivo no debe exceder 5MB';
    }

    // Validar tipo de archivo
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|jpg|jpeg|png)$/i)) {
      return 'Tipo de archivo no permitido. Use PDF, DOC, DOCX o imágenes.';
    }

    return null;
  }, []);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(prev => ({ ...prev, archivo: validationError }));
        return;
      }

      setArchivo(file);
      setError(prev => ({ ...prev, archivo: '' }));
    }
    // Reset del input file
    event.target.value = '';
  }, [validateFile]);

  // Funciones para drag & drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const validationError = validateFile(file);
      if (validationError) {
        setError(prev => ({ ...prev, archivo: validationError }));
        return;
      }

      setArchivo(file);
      setError(prev => ({ ...prev, archivo: '' }));
    }
  }, [validateFile]);

  const removeFile = useCallback(() => {
    setArchivo(null);
    setError(prev => ({ ...prev, archivo: '' }));
  }, []);

  const getFileIcon = useCallback((file) => {
    if (!file) return <InsertDriveFile />;

    if (file.type.startsWith('image/')) return <ImageIcon color="primary" />;
    if (file.type === 'application/pdf') return <PictureAsPdf color="error" />;
    if (file.type.includes('word') || file.name.match(/\.(doc|docx)$/i)) return <Description color="primary" />;

    return <InsertDriveFile />;
  }, []);

  return (
    <Modal open={open} onClose={handleCloseInternal}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 500 },
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 3,
        borderRadius: 2,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <DialogTitleCustom title="Subir Formato" />
          <IconButton onClick={handleCloseInternal} disabled={isLoading}>
            <Close />
          </IconButton>
        </Box>

        <TextField
          label="Nombre del Formato"
          variant="outlined"
          fullWidth
          margin="normal"
          value={nombreFormato}
          error={!!error.nombre}
          helperText={error.nombre}
          onChange={(e) => {
            setNombreFormato(e.target.value);
            setError(prev => ({ ...prev, nombre: '' }));
          }}
          disabled={isLoading}
        />

        <Box
          sx={{
            border: '2px dashed',
            borderColor: archivo ? 'success.main' :
              error.archivo ? 'error.main' :
                isDragOver ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            mt: 2,
            backgroundColor: archivo ? alpha('#4caf50', 0.08) :
              isDragOver ? alpha('#1976d2', 0.08) : 'grey.50',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            accept={acceptedFiles}
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple={false}
            type="file"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <label htmlFor="raised-button-file" style={{ cursor: 'pointer' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CloudUpload sx={{
                fontSize: 40,
                color: isDragOver ? 'primary.main' : 'primary.main',
                mb: 1
              }} />
              <Typography
                variant="body2"
                gutterBottom
                sx={{
                  color: archivo ? 'text.primary' : 'primary.main',
                  textDecoration: archivo ? 'none' : 'underline',
                  cursor: 'pointer',
                  '&:hover': {
                    color: archivo ? 'text.primary' : 'primary.dark',
                    textDecoration: 'underline'
                  }
                }}
              >
                {archivo ? 'Archivo seleccionado:' :
                  isDragOver ? 'Suelte el archivo aquí' :
                    'Haga clic o arrastre un archivo aquí'}
              </Typography>
              {archivo && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  {getFileIcon(archivo)}
                  <Typography variant="body2" sx={{ ml: 1, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {archivo.name}
                  </Typography>
                  <IconButton size="small" onClick={removeFile} disabled={isLoading}>
                    <Close />
                  </IconButton>
                </Box>
              )}
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                Formatos aceptados: PDF, DOC, DOCX, imágenes (Max. 5MB)
              </Typography>
              {error.archivo && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {error.archivo}
                </Typography>
              )}
            </Box>
          </label>
        </Box>

        {archivo && archivo.type.startsWith('image/') && (
          <ImagePreview file={archivo} onRemove={removeFile} />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
          <CustomButton
            type="cancelar"
            onClick={handleCloseInternal}
            disabled={isLoading}
          >
            Cancelar
          </CustomButton>
          <CustomButton
            type="guardar"
            onClick={handleSubmit}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isLoading ? 'Subiendo...' : 'Subir'}
          </CustomButton>
        </Box>
      </Box>
    </Modal>
  );
});

// Componente principal
const Formatos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [formatos, setFormatos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const idUsuario = usuario?.idUsuario || 0;


  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: 'info',
    title: '',
    message: ''
  });

  const { puedeEditar } = usePermiso("Formatos");

  const showSnackbar = useCallback((type, title, message) => {
    setSnackbar({ open: true, type, title, message });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const fetchFormatos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/formatos');
      setFormatos(response.data);
    } catch (error) {
      showSnackbar('error', 'Error', 'No se pudieron cargar los formatos.');
    } finally {
      setIsLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchFormatos();
  }, [fetchFormatos]);

  const handleOpenModal = useCallback(() => setModalOpen(true), []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleFormatoSubmit = useCallback(async (formData) => {
    if (!puedeEditar) {
      showSnackbar('error', 'Permiso denegado', 'No cuentas con permisos para subir formatos.');
      return;
    }

    const nombreExiste = formatos.some(
      (f) => f.nombreFormato.trim().toLowerCase() === formData.nombreFormato.trim().toLowerCase()
    );

    if (nombreExiste) {
      showSnackbar('warning', 'Nombre duplicado', 'Ya existe un formato con ese nombre.');
      return; 
    }

    setUploading(true);
    const submitData = new FormData();
    submitData.append('idUsuario', idUsuario);
    submitData.append('nombreFormato', formData.nombreFormato);
    submitData.append('archivo', formData.archivo);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/formatos', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showSnackbar('success', 'Formato guardado', 'El formato se ha subido correctamente.');
      setFormatos(prev => [...prev, response.data.formato]);
      handleCloseModal();
    } catch (error) {
      let message = 'Hubo un problema al subir el formato.';

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (errors.archivo) {
          message = errors.archivo[0];
        } else if (errors.nombreFormato) {
          message = errors.nombreFormato[0];
        }
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      showSnackbar('error', 'Error al subir', message);
      console.error(error);
    } finally {
      setUploading(false);
    }
  }, [puedeEditar, idUsuario, formatos, showSnackbar, handleCloseModal]);


  // Filtrar formatos basado en el término de búsqueda
  const filteredFormatos = useMemo(() => {
    if (!searchTerm) return formatos;

    return formatos.filter(formato =>
      formato.nombreFormato.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [formatos, searchTerm]);

  const getFileIcon = (ruta) => {
    const extension = ruta.split('.').pop().toLowerCase();

    switch (extension) {
      case 'pdf':
        return <PictureAsPdf color="error" sx={{ fontSize: 40 }} />;
      case 'doc':
      case 'docx':
        return <Description color="primary" sx={{ fontSize: 40 }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <ImageIcon color="primary" sx={{ fontSize: 40 }} />;
      default:
        return <InsertDriveFile sx={{ fontSize: 40 }} />;
    }
  };

  // Estados y funciones para eliminar formato
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    formato: null,
  });

  const handleOpenDeleteModal = (formato) => {
    setConfirmDelete({ open: true, formato });
  };

  const handleCloseDeleteModal = () => {
    setConfirmDelete({ open: false, formato: null });
  };

  const handleDeleteFormato = async () => {
    if (!confirmDelete.formato) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/formatos/${confirmDelete.formato.idFormato}`);

      setFormatos(prev => prev.filter(f => f.idFormato !== confirmDelete.formato.idFormato));
      showSnackbar('success', 'Formato eliminado', 'El formato se ha eliminado correctamente.');
    } catch (error) {
      showSnackbar('error', 'Error', 'No se pudo eliminar el formato.');
    } finally {
      handleCloseDeleteModal();
    }
  };

  return (
    <Box sx={{ p: 2, minHeight: '100vh', position: 'relative' }}>
      <BreadcrumbNav items={[{ label: "Formatos", icon: Article }]} />

      <Box sx={{ textAlign: "center", py: 1 }}>
        <Title text="Formatos" mode="sticky" />
        {!puedeEditar && (
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Aquí puedes revisar los formatos del sistema.
          </Typography>
        )}
      </Box>

      {/* Barra de búsqueda - Centrada y más pequeña */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <TextField
          variant="outlined"
          placeholder="Buscar formatos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: '100%',
            maxWidth: 400,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: alpha('#f5f5f5', 0.4),
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="primary" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setSearchTerm('')}
                  size="small"
                  sx={{ color: 'text.secondary' }}
                >
                  <Close />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* FAB para subir: solo visible si tiene permiso */}
      {puedeEditar && (
        <Box sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}>
          <FabCustom
            onClick={handleOpenModal}
            title="Agregar Formato"
            icon={<Add />}
          />
        </Box>
      )}

      {/* Modal para subir formatos */}
      {puedeEditar && (
        <FormatoModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormatoSubmit}
          isLoading={uploading}
        />
      )}

      {/* Lista de formatos */}
      {isLoading && formatos.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredFormatos.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="textSecondary">
            {searchTerm ? 'No se encontraron formatos' : 'No hay formatos disponibles'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ px: 2 }}>
          {filteredFormatos.map((formato) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={formato.idFormato}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}>
                <CardContent sx={{
                  flexGrow: 1,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2,
                    color: 'primary.main'
                  }}>
                    {getFileIcon(formato.ruta)}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{
                    wordBreak: 'break-word',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontWeight: 'medium'
                  }}>
                    {formato.nombreFormato}
                  </Typography>
                  <Chip
                    label={formato.ruta.split('.').pop().toUpperCase()}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
                  <CustomButton
                    type="descargar"
                    href={`http://127.0.0.1:8000/storage/${formato.ruta}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<Download />}
                  >
                    Descargar
                  </CustomButton>

                  {/* Botón de eliminar - Solo para usuarios con permiso */}
                  {puedeEditar && (
                    <Tooltip title="Eliminar Formato" >
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteModal(formato)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <FeedbackSnackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        type={snackbar.type}
        title={snackbar.title}
        message={snackbar.message}
      />

      {/* Modal de confirmación de eliminación */}
      <ConfirmDelete
        open={confirmDelete.open}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteFormato}
        entityType="formato"
        entityName={confirmDelete.formato?.nombreFormato}
        isPermanent={true}
        description="Esta acción no se puede deshacer. El formato será eliminado permanentemente del sistema."
      />
    </Box>
  );
};

export default React.memo(Formatos);