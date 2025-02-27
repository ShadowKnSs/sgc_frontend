import React from "react";
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

const FormularioCompromiso = ({ showForm, handleCancel, handleAdd, compromisoData, handleChange }) => {
    return (
        <Dialog open={showForm} onClose={handleCancel}>
            <DialogTitle sx={{ 
                textAlign: "center", 
                fontWeight: "bold", 
                color: "#1976d2", // Título en color azul
                padding: "16px" 
            }}>
                Agregar Compromiso
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: "#f7f7f7" }}> {/* Fondo gris claro */}
                <TextField
                    fullWidth
                    label="Compromiso"
                    name="compromiso"
                    value={compromisoData.compromiso}
                    onChange={handleChange}
                    sx={{
                        marginBottom: 2,
                        backgroundColor: "white", // Fondo blanco para el input
                        borderRadius: "4px",
                    }}
                />
                <TextField
                    fullWidth
                    label="Responsable"
                    name="responsable"
                    value={compromisoData.responsable}
                    onChange={handleChange}
                    sx={{
                        marginBottom: 2,
                        backgroundColor: "white", // Fondo blanco para el input
                        borderRadius: "4px",
                    }}
                />
                <TextField
                    fullWidth
                    label="Fecha"
                    name="fecha"
                    type="date"
                    value={compromisoData.fecha}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx={{
                        marginBottom: 2,
                        backgroundColor: "white", // Fondo blanco para el input
                        borderRadius: "4px",
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ 
                backgroundColor: "#f7f7f7", 
                display: "flex", 
                justifyContent: "center" // Centrar los botones
            }}>
                <Button onClick={handleCancel} sx={{ backgroundColor: "#1976d2", color: "white", marginRight: 2 }}>
                    Cancelar
                </Button>
                <Button onClick={handleAdd} sx={{ backgroundColor: "#1976d2", color: "white" }}>
                    Agregar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FormularioCompromiso;
