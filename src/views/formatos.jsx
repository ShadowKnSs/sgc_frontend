import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Modal, Typography, TextField, Button, Card, CardContent, CardActions } from '@mui/material';
import Title from '../components/Title';
import FloatingActionButton from '../components/ButtonNewReport';

const Formatos = () => {
  const [openModal, setOpenModal] = useState(false);
  const [nombreFormato, setNombreFormato] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [formatos, setFormatos] = useState([]);

  // Cargar los formatos al montar el componente
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
  };

  const handleFileChange = (event) => {
    setArchivo(event.target.files[0]);
  };

  const handleFormatoSubmit = async () => {
    if (!nombreFormato || !archivo) {
      alert('Por favor, ingrese el nombre del formato y seleccione un archivo PDF.');
      return;
    }

    const formData = new FormData();
    formData.append('nombreFormato', nombreFormato);
    formData.append('archivo', archivo);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/formatos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Formato guardado correctamente');
      setFormatos([...formatos, response.data.formato]);
      handleCloseModal();
    } catch (error) {
      alert('Error al subir el formato');
      console.error(error);
    }
  };

  return (
    <Box sx={{ p: 2, position: 'relative', minHeight: '100vh' }}>
      <Box sx={{ textAlign: "center", paddingTop: 3 }}>
        <Title text="Formatos" />
      </Box>

      <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <FloatingActionButton onClick={handleOpenModal} />
      </Box>

      {/* Modal para subir formatos */}
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
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
            Subir Formato
          </Typography>
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
            <Button variant="contained" onClick={handleFormatoSubmit}>Subir</Button>
            <Button variant="outlined" onClick={handleCloseModal}>Cancelar</Button>
          </Box>
        </Box>
      </Modal>

      {/* Lista de formatos subidos en forma de tarjetas (Cards) */}
      <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        {formatos.map((formato, index) => (
          <Card key={index} sx={{ width: 300 }}>
            <CardContent>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>{formato.nombreFormato}</Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    href={`http://127.0.0.1:8000/storage/${formato.ruta}`} 
                    download
                >
                    Descargar
                </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Formatos;
