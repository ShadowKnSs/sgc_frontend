import React, { useState, useEffect } from "react";
import { Box, Fab, CircularProgress, Alert } from "@mui/material";
import { Add } from "@mui/icons-material";
import UserCard from "../components/userCard";
import UserForm from "../components/userForms";
import ConfirmDelete from "../components/confirmDelete";
import axios from "axios";

const API_URL = 'http://127.0.0.1:8000/api';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

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

    const transformUserData = (user) => {
        return {
            id: user.idUsuario,
            firstName: user.nombre,
            lastName: user.apellidoPat,
            secondLastName: user.apellidoMat,
            email: user.correo,
            phone: user.telefono,
            academicDegree: user.gradoAcademico,
            roles: [user.tipo_usuario?.nombreRol],
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
    }, []);

    const handleAddUser = async (newUser) => {
        try {
            let response;
            if (editingUser) {
                response = await axios.put(`${API_URL}/usuarios/${editingUser.id}`, {
                    ...newUser,
                    id: editingUser.id
                });
                
                setUsers(prevUsers => 
                    prevUsers.map(user => 
                        user.id === editingUser.id ? transformUserData(response.data.data) : user
                    )
                );
            } else {
                response = await axios.post(`${API_URL}/usuarios`, newUser);
                setUsers(prevUsers => [...prevUsers, transformUserData(response.data.data)]);
            }
            
            setError(null);
        } catch (err) {
            console.error("Error al guardar usuario:", err);
            setError(err.response?.data?.message || "Error al guardar el usuario");
        }
    }

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