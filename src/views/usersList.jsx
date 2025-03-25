import React, { useState } from "react";
import { Box, Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import UserCard from "../components/userCard";
import UserForm from "../components/userForms";
import ConfirmDelete from "../components/confirmDelete"; // Importa el diálogo de eliminación
import ConfirmEdit from "../components/confirmEdit"; // Importa el diálogo de edición

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [openEdit, setOpenEdit] = useState(false); // Nuevo estado para el diálogo de confirmación de edición
    const [userToEdit, setUserToEdit] = useState(null); // Estado para el usuario a editar

    const handleAddUser = (newUser) => {
        if (editingUser) {
            setUsers(users.map(user => 
                user.id === editingUser.id ? { ...editingUser, ...newUser } : user
            ));
        } else {
            setUsers([...users, { id: users.length + 1, ...newUser }]);
        }
        setEditingUser(null);  // 🔹 Reiniciar estado de edición
        setUserToEdit(null);
        setOpenForm(false);
    };
    const handleAddNewUser = () => {
        setEditingUser(null);
        setOpenForm(true);
    };

   const handleEdit = (user) => {
        setUserToEdit(user); 
        setOpenEdit(true); 
    };
    
    const handleConfirmEdit = () => {
        setEditingUser(userToEdit); // 🔹 Aquí establecemos correctamente el usuario en edición
        setOpenEdit(false);
        setOpenForm(true);
    }

    const handleDelete = (id) => {
        setUsers(users.filter((user) => user.id !== id));
        setOpenDelete(false);
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setOpenDelete(true);
    };

    return (
        <Box sx={{ p: 4, textAlign: "center" }}>
            <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
                gap={2}
                justifyContent="center"
            >
                {users.map((user) => (
                    <UserCard key={user.id} user={user} onEdit={() => handleEdit(user)} onDelete={() => handleDeleteClick(user)} />
                ))}
            </Box>

            <Fab
                color="primary"
                sx={{ position: "fixed", bottom: 16, right: 16, backgroundColor: "#004A98" }}
                onClick={handleAddNewUser}
            >
                <Add />
            </Fab>

            <UserForm open={openForm} onClose={() => setOpenForm(false)} onSubmit={handleAddUser} editingUser={editingUser} />

            {/* Diálogo de confirmación de eliminación */}
            <ConfirmDelete open={openDelete} onClose={() => setOpenDelete(false)} entityType="usuario" entityName={userToDelete?.firstName} onConfirm={() => handleDelete(userToDelete?.id)} />
            
            {/* Diálogo de confirmación de edición */}
            <ConfirmEdit open={openEdit} onClose={() => setOpenEdit(false)} entityType="usuario" entityName={userToEdit?.firstName} onConfirm={handleConfirmEdit} />
        </Box>
    );
}

export default UserManagement;
