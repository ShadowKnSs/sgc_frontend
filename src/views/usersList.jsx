import React, { useState } from "react";
import { Box, Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import UserCard from "../components/userCard";
import UserForm from "../components/userForms";

const initialUsers = [
    { id: 1, firstName: "Carlos", lastName: "Pérez", secondLastName: "Gómez", photo: "https://via.placeholder.com/80" },
    { id: 2, firstName: "Ana", lastName: "López", secondLastName: "Martínez", photo: "https://via.placeholder.com/80" },
];

function UserManagement() {
    const [users, setUsers] = useState(initialUsers);
    const [openForm, setOpenForm] = useState(false);

    const handleAddUser = (newUser) => {
        setUsers([...users, { id: users.length + 1, ...newUser, photo: "https://via.placeholder.com/80" }]);
        setOpenForm(false);
    };

    const handleEdit = (id) => {
        console.log(`Editar usuario con id: ${id}`);
        
    };

    const handleDelete = (id) => {
        setUsers(users.filter((user) => user.id !== id));
    };

    return (
        <Box sx={{ p: 4, textAlign: "center" }}>
            <Box 
                display="grid" 
                gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" 
                gap={2} 
                justifyContent="center"
            >
                {users.map((user) => (
                    <UserCard key={user.id} user={user} onEdit={() => handleEdit(user.id)} onDelete={() => handleDelete(user.id)} />
                ))}
            </Box>

            <Fab
                color="primary"
                sx={{ position: "fixed", bottom: 16, right: 16, backgroundColor: "#004A98" }}
                onClick={() => setOpenForm(true)}
            >
                <Add />
            </Fab>
            <UserForm open={openForm} onClose={() => setOpenForm(false)} onSubmit={handleAddUser} />
        </Box>
    );
}

export default UserManagement;
