/**
 * Vista: UserManagement
 * Descripción:
 * Esta vista permite gestionar usuarios del sistema, incluyendo:
 * - Visualización y edición de usuarios normales y temporales.
 * - Creación de nuevos usuarios.
 * - Eliminación de usuarios existentes.
 * - Generación y limpieza de tokens temporales.
 * Incluye tarjetas para usuarios (`UserCard`), tarjetas para usuarios temporales (`UserTempCard`),
 * formulario emergente (`UserForm`) y confirmación de eliminación (`ConfirmDelete`).
 */
import React, { useState, useEffect, useCallback } from "react";
import { Box, CircularProgress, Alert, Typography, Grid } from "@mui/material";
import UserCard from "../components/userCard";
import UserTempCard from "../components/userTempCard";
import UserForm from "../components/userForms";
import ConfirmDelete from "../components/confirmDelete";
import FabCustom from "../components/FabCustom";
import PersonaAddIcon from "@mui/icons-material/PersonAdd";
import axios from "axios";
import Title from "../components/Title";
import Button from "../components/Button";

// Ruta base de la API
const API_URL = 'http://127.0.0.1:8000/api';

function UserManagement() {
    // Estado de usuarios
    const [users, setUsers] = useState([]);
    const [usuariosTemporales, setUsuariosTemporales] = useState([]);
    // Estados de control
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Cargar usuarios normales
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/usuarios`);
            setUsers(response.data.data.map(transformUserData).filter(Boolean));

            setError(null);
        } catch (err) {
            setError("Error al cargar los usuarios");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar usuarios temporales
    const fetchUsuariosTemporales = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/usuarios-temporales`);
            setUsuariosTemporales(res.data);
        } catch (err) {
            console.error('Error al cargar usuarios temporales');
        }
    }, []);
    // Eliminar tokens expirados

    const handleEliminarYActualizar = async () => {
        try {
            const res = await axios.delete(`${API_URL}/usuarios-temporales/expirados`);
            alert(res.data.message);
            await fetchUsuariosTemporales(); // Refresca sin recargar
        } catch (err) {
            console.error("Error al eliminar tokens:", err);
            alert("Error al eliminar tokens expirados");
        }
    };


    // Transformar datos de API para uso en el frontend

    const transformUserData = (user) => {
        if (!user || typeof user !== 'object') return null;

        const hasSupervisor = user.supervisor && typeof user.supervisor === 'object';

        return {
            id: user.idUsuario,
            firstName: user.nombre,
            lastName: user.apellidoPat,
            secondLastName: user.apellidoMat,
            email: user.correo,
            phone: user.telefono,
            academicDegree: user.gradoAcademico,
            roles: Array.isArray(user.roles) ? user.roles.map(r => r.nombreRol) : [],
            supervisor: hasSupervisor ? {
                id: user.supervisor.idUsuario,
                firstName: user.supervisor.nombre,
                lastName: user.supervisor.apellidoPat,
                secondLastName: user.supervisor.apellidoMat
            } : null
        };
    };


    // Efecto inicial

    useEffect(() => {
        fetchUsers();
        fetchUsuariosTemporales();
    }, [fetchUsers, fetchUsuariosTemporales]);

    // Guardar usuario creado o editado

    const handleAddUser = (usuarioGuardado) => {
        if (editingUser) {
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === editingUser.id ? transformUserData(usuarioGuardado) : user
                )
            );
        } else {
            setUsers(prevUsers => [...prevUsers, transformUserData(usuarioGuardado)]);
        }

        setError(null);
        setEditingUser(null);
    };

    // Eliminar usuario

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/usuarios/${id}`);
            setUsers(users.filter(user => user.id !== id));
            setOpenDelete(false);
        } catch (err) {
            setError("Error al eliminar el usuario");
        }
    };
    // Crear nuevo usuario

    const handleAddNewUser = () => {
        setEditingUser(null);
        setOpenForm(true);
    };
    // Editar usuario existente

    const handleEdit = (user) => {
        setEditingUser(user);
        setOpenForm(true);
    };

    const handleFormClose = () => {
        setOpenForm(false);
        setEditingUser(null);
        fetchUsers();
    };

    return (
        <Box sx={{ p: 4, textAlign: "center" }}>
            {/* Loader o error */}

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <>
                    {/* Tarjetas de usuarios normales */}
                    <Box mb={4}>
                        <Title text="Gestión de Usuarios" />
                    </Box>
                    <Box
                        display="grid"
                        gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
                        gap={2}
                        justifyContent="center"
                    >
                        {users.map(user => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onEdit={() => handleEdit(user)}
                                onDelete={() => {
                                    setUserToDelete(user);
                                    setOpenDelete(true);
                                }}
                            />
                        ))}
                    </Box>
                    {/* Sección de usuarios temporales */}

                    {usuariosTemporales.length > 0 && (
                        <>
                            <Box sx={{ marginTop: 3 }}>
                                <Title text="Usuarios Temporales" />
                            </Box>


                            <Grid container spacing={3}>
                                {usuariosTemporales.map((temp) => (
                                    <Grid item xs={12} sm={6} md={4} key={temp.idToken}>
                                        <UserTempCard tempUser={temp} />
                                    </Grid>
                                ))}
                            </Grid>

                            <Box mt={4} display="flex" justifyContent="center">
                                <Button
                                    type="eliminar"
                                    onClick={handleEliminarYActualizar}
                                >
                                    Eliminar Tokens Expirados
                                </Button>
                            </Box>
                        </>
                    )}

                    {/* Si no hay usuarios temporales */}

                    {usuariosTemporales.length === 0 && (
                        <Typography variant="body2" color="text.secondary" mt={2} sx={{ marginTop: 9 }}>
                            No hay usuarios temporales activos.
                        </Typography>
                    )}

                    {/* Botón flotante para agregar */}

                    <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
                        <FabCustom
                            onClick={handleAddNewUser}
                            title="Agregar Usuario"
                            icon={<PersonaAddIcon />}
                        />
                    </Box>
                </>

            )}

            {/* Formulario emergente para crear o editar usuario */}

            <UserForm
                open={openForm}
                onClose={handleFormClose}
                onSubmit={handleAddUser}
                onTokenCreated={fetchUsuariosTemporales}
                editingUser={editingUser}
            />
            {/* Diálogo de confirmación de eliminación */}

            <ConfirmDelete
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                onConfirm={() => handleDelete(userToDelete?.id)}
                entityType="usuario"
                entityName={userToDelete?.firstName}
            />
        </Box>
    );
}

export default UserManagement;