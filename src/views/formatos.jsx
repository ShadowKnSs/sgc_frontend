/**
 * Componente: Formatos
 * Ubicación: src/views/Formatos.jsx
 *
 * Descripción:
 * Vista encargada de mostrar y gestionar la subida y descarga de **formatos institucionales** (archivos PDF).
 * Permite al usuario subir un nuevo formato con un nombre y archivo adjunto. Los formatos existentes se listan
 * en forma de tarjetas con opción para descarga.
 *
 * Estado:
 * - `openModal`: control de visibilidad del modal para subir nuevo formato.
 * - `nombreFormato`: campo de texto para nombre del formato.
 * - `archivo`: archivo PDF seleccionado por el usuario.
 * - `formatos`: lista de formatos obtenidos desde el backend.
 * - `isLoading`: control de carga durante el proceso de subida.
 * - `snackbar`: control para mostrar mensajes de retroalimentación (éxito, error, advertencia).
 *
 * Funcionalidades:
 * - `GET /api/formatos`: Carga los formatos existentes al montar el componente.
 * - `POST /api/formatos`: Envía nombre y archivo como `FormData` para registrar un nuevo formato.
 * - Valida que ambos campos (`nombreFormato` y `archivo`) estén presentes antes de enviar.
 * - Muestra mensajes de éxito o error mediante `FeedbackSnackbar`.
 * - Visualiza cada formato en una `Card` con botón para descargar (usando ruta de `storage`).
 *
 * Componentes externos utilizados:
 * - `FabSubirFormato`: botón flotante personalizado (FAB).
 * - `CustomButton`: botón reutilizable estilizado.
 * - `DialogTitleCustom`: título de modal personalizado.
 * - `FeedbackSnackbar`: componente para mostrar alertas amigables.
 *
 * Consideraciones:
 * - Acepta solo archivos con formato PDF.
 * - El botón de subida está deshabilitado mientras `isLoading` está activo.
 * - El backend espera que el archivo se suba mediante `multipart/form-data`.
 *
 * Mejoras sugeridas:
 * - Incluir eliminación o edición de formatos.
 * - Mostrar fecha de subida y tamaño del archivo.
 * - Validación de nombre duplicado.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Modal, Typography, TextField, Card, CardContent, CardActions, CircularProgress } from '@mui/material';
import Title from '../components/Title';
import FabSubirFormato from '../components/FabSubirFormato';
import CustomButton from '../components/Button';
import DialogTitleCustom from '../components/TitleDialog';
import FeedbackSnackbar from '../components/Feedback';

const Formatos = () => {
  const [openModal, setOpenModal] = useState(false);
  const [nombreFormato, setNombreFormato] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [formatos, setFormatos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: 'info',
    title: '',
    message: ''
  });

  const showSnackbar = (type, title, message) => {
    setSnackbar({ open: true, type, title, message });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const fetchFormatos = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/formatos');
        setFormatos(response.data);
      } catch (error) {
        console.error('Error al obtener los formatos', error);
      }
    };
    fetchFormatos();
  }, []);

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
    setNombreFormato('');
    setArchivo(null);
    setIsLoading(false);
  };

  const handleFileChange = (event) => {
    setArchivo(event.target.files[0]);
  };

  const handleFormatoSubmit = async () => {
    if (!nombreFormato && !archivo) {
      showSnackbar('warning', 'Campos requeridos', 'Faltan el nombre del formato y el archivo PDF.');
      return;
    }

    if (!nombreFormato) {
      showSnackbar('warning', 'Campo requerido', 'Por favor, ingrese el nombre del formato.');
      return;
    }

    if (!archivo) {
      showSnackbar('warning', 'Campo requerido', 'Por favor, seleccione un archivo PDF.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('nombreFormato', nombreFormato);
    formData.append('archivo', archivo);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/formatos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showSnackbar('success', 'Formato guardado', 'El formato se ha subido correctamente.');
      setFormatos([...formatos, response.data.formato]);
      handleCloseModal();
    } catch (error) {
      showSnackbar('error', 'Error al subir', 'Hubo un problema al subir el formato.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, position: 'relative', minHeight: '100vh' }}>
      <Box sx={{ textAlign: "center", paddingTop: 3 }}>
        <Title text="Formatos" />
      </Box>

      <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <FabSubirFormato onClick={handleOpenModal} />
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'white',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <Box sx={{
            '& .MuiTypography-h6': {
              textAlign: 'center !important',
            },
            '& .MuiTypography-subtitle2': {
              textAlign: 'center !important',
            },
          }}>
            <DialogTitleCustom title="Subir Formato" />
          </Box>

          <TextField
            label="Nombre del Formato"
            variant="outlined"
            fullWidth
            margin="normal"
            value={nombreFormato}
            onChange={(e) => setNombreFormato(e.target.value)}
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ marginBottom: 20, display: 'block', margin: '0 auto' }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <CustomButton type="guardar" onClick={handleFormatoSubmit} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Subir'}
            </CustomButton>
            <CustomButton type="cancelar" onClick={handleCloseModal} disabled={isLoading}>
              Cancelar
            </CustomButton>
          </Box>
        </Box>
      </Modal>

      {/* Lista de formatos */}
      <Box sx={{ mt: 6, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        {formatos.map((formato, index) => (
          <Card key={index} sx={{ width: 300 }}>
            <CardContent>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>{formato.nombreFormato}</Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <CustomButton
                type="descargar"
                href={`http://127.0.0.1:8000/storage/${formato.ruta}`}
                target="_blank"
              >
                Descargar
              </CustomButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      <FeedbackSnackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        type={snackbar.type}
        title={snackbar.title}
        message={snackbar.message}
      />
    </Box>
  );
};

export default Formatos;