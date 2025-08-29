// src/hooks/useEntidades.js
import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/entidades';

export const useEntidades = () => {
    const [entidades, setEntidades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false); // Estado específico para creación
    const [updating, setUpdating] = useState(false); // Estado específico para actualización
    const [deleting, setDeleting] = useState(false); // Estado específico para eliminación
    const [error, setError] = useState(null);
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

    const obtenerEntidades = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL);
            setEntidades(response.data.entidades);
        } catch (error) {
            const message = error.response?.data?.error || 'Error al obtener las entidades';
            setError(message);
            showSnackbar('error', 'Error', message);
        } finally {
            setLoading(false);
        }
    }, [showSnackbar]);

    const crearEntidad = useCallback(async (data) => {
        setCreating(true);
        try {
            const response = await axios.post(API_URL, data);
            setEntidades(prev => [...prev, response.data.entidad]);
            showSnackbar('success', 'Éxito', 'Entidad creada correctamente');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || 'Error al crear la entidad';
            showSnackbar('error', 'Error', message);
            throw error;
        }
    }, [showSnackbar]);

    const actualizarEntidad = useCallback(async (id, data) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, data);
            setEntidades(prev =>
                prev.map(entidad =>
                    entidad.idEntidadDependencia === id ? response.data.entidad : entidad
                )
            );
            showSnackbar('success', 'Éxito', 'Entidad actualizada correctamente');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || 'Error al actualizar la entidad';
            showSnackbar('error', 'Error', message);
            throw error;
        }
    }, [showSnackbar]);

    const eliminarEntidad = useCallback(async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setEntidades(prev => prev.filter(entidad => entidad.idEntidadDependencia !== id));
            showSnackbar('success', 'Éxito', 'Entidad eliminada correctamente');
        } catch (error) {
            const message = error.response?.data?.error || 'Error al eliminar la entidad';
            showSnackbar('error', 'Error', message);
            throw error;
        }
    }, [showSnackbar]);

    const toggleEntidad = useCallback(async (id, estadoActual) => {
        try {
        // Si está activa (1) la desactivamos (0), y viceversa
        const nuevoEstado = estadoActual === 1 ? 0 : 1;

        // Enviar al backend el cambio de estado
        await axios.put(`${API_URL}/${id}`, { activo: nuevoEstado });

        // Actualizar el estado local
        setEntidades(prev =>
            prev.map(entidad =>
                entidad.idEntidadDependencia === id
                    ? { ...entidad, activo: nuevoEstado }
                    : entidad
            )
        );

        showSnackbar(
            'success',
            'Éxito',
            nuevoEstado === 1
                ? 'Entidad activada correctamente'
                : 'Entidad desactivada correctamente'
        );
        await axios.post(`${API_URL}/${id}/toggleProcesos`, { idEntidadDependencia: id });
    } catch (error) {
        const message =
            error.response?.data?.error ||
            'Error al cambiar el estado de la entidad';
        showSnackbar('error', 'Error', message);
        throw error;
    }
}, [showSnackbar]);


    return {
        entidades,
        loading,
        creating,
        updating,
        deleting,
        error,
        snackbar,
        obtenerEntidades,
        crearEntidad,
        actualizarEntidad,
        eliminarEntidad,
        toggleEntidad,
        showSnackbar,
        handleCloseSnackbar
    };
};