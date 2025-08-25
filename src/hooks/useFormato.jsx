// src/hooks/useFormato.js
import { useState, useCallback } from 'react';
import axios from 'axios';

export const useFormato = () => {
  const [formatos, setFormatos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: 'info',
    title: '',
    message: ''
  });

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
      console.error('Error al obtener los formatos', error);
      showSnackbar('error', 'Error', 'No se pudieron cargar los formatos.');
    } finally {
      setIsLoading(false);
    }
  }, [showSnackbar]);

  const addFormato = useCallback(async (formData) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/formatos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormatos(prev => [...prev, response.data.formato]);
      showSnackbar('success', 'Formato guardado', 'El formato se ha subido correctamente.');
      return response.data;
    } catch (error) {
      console.error('Error al subir formato', error);
      const message = error.response?.data?.message || 'Hubo un problema al subir el formato.';
      showSnackbar('error', 'Error al subir', message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [showSnackbar]);

  return {
    formatos,
    isLoading,
    snackbar,
    fetchFormatos,
    addFormato,
    showSnackbar,
    handleCloseSnackbar
  };
};