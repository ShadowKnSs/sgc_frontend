import React, { useState, useEffect } from "react";
import { Box, Fab, CircularProgress, Alert, Typography, Grid } from "@mui/material";
import { Add } from "@mui/icons-material";
import UserCard from "../components/userCard";
import UserTempCard from "../components/userTempCard";
import UserForm from "../components/userForms";
import ConfirmDelete from "../components/confirmDelete";
import axios from "axios";
import Title from "../components/Title";
import Button from "../components/Button";

const API_URL = 'http://127.0.0.1:8000/api';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [usuariosTemporales, setUsuariosTemporales] = useState([]);


    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/usuarios`);
            setUsers(response.data.data.map(transformUserData));
            setError(null);
        } catch (err) {
            setError("Error al cargar los usuarios");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };


    const fetchUsuariosTemporales = async () => {
        try {
            const res = await axios.get(`${API_URL}/usuarios-temporales`);
            setUsuariosTemporales(res.data);
        } catch (err) {
            console.error('Error al cargar usuarios temporales');
        }
    };

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



    const transformUserData = (user) => {
        return {
            id: user.idUsuario,
            firstName: user.nombre,
            lastName: user.apellidoPat,
            secondLastName: user.apellidoMat,
            email: user.correo,
            phone: user.telefono,
            academicDegree: user.gradoAcademico,
            roles: Array.isArray(user.roles) ? user.roles.map(r => r.nombreRol) : [], // ✅ CAMBIO AQUÍ
            supervisor: user.supervisor ? {
                id: user.supervisor.idUsuario,
                firstName: user.supervisor.nombre,
                lastName: user.supervisor.apellidoPat,
                secondLastName: user.supervisor.apellidoMat
            } : null
        };
    };


    useEffect(() => {
        fetchUsers();
        fetchUsuariosTemporales();
    }, []);

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


    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/usuarios/${id}`);
            setUsers(users.filter(user => user.id !== id));
            setOpenDelete(false);
        } catch (err) {
            setError("Error al eliminar el usuario");
        }
    };

    const handleAddNewUser = () => {
        setEditingUser(null);
        setOpenForm(true);
    };

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
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <>
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
                    {usuariosTemporales.length > 0 && (
                        <>
                            <Title text="Usuarios Temporales" />

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


                    {usuariosTemporales.length === 0 && (
                        <Typography variant="body2" color="text.secondary" mt={2}>
                            No hay usuarios temporales activos.
                        </Typography>
                    )}

                    <Fab
                        color="primary"
                        sx={{ position: "fixed", bottom: 16, right: 16 }}
                        onClick={handleAddNewUser}
                    >
                        <Add />
                    </Fab>
                </>

            )}


            <UserForm
                open={openForm}
                onClose={handleFormClose}
                onSubmit={handleAddUser}
                onTokenCreated={fetchUsuariosTemporales}
                editingUser={editingUser}
            />

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