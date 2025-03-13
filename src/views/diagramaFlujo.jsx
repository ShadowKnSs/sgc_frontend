import React, { useState } from "react";
import { Box, Button, Typography, Card, CardContent, IconButton } from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";

function DiagramaFlujo() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreview(null);
    };

    const handleSaveImage = () => {
        if (image) {
            console.log("Imagen guardada:", image.name);
            alert("Imagen subida con éxito."); // Simulación
            setImage(null);
            setPreview(null);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
                Subir Diagrama de Flujo
            </Typography>

            {preview ? (
                <Card sx={{ position: "relative", width: "50%", textAlign: "center", p: 2 }}>
                    <CardContent>
                        <img src={preview} alt="Vista previa" style={{ width: "100%", borderRadius: "10px" }} />
                    </CardContent>
                    <IconButton 
                        onClick={handleRemoveImage} 
                        sx={{ position: "absolute", top: 5, right: 5, color: "secondary.main" }}>
                        <Delete />
                    </IconButton>
                </Card>
            ) : (
                <Button
                    component="label"
                    variant="contained"
                    sx={{
                        backgroundColor: "secondary.main",
                        color: "#fff",
                        "&:hover": { backgroundColor: "primary.main" } 
                    }}
                    startIcon={<CloudUpload />}
                >
                    Seleccionar Imagen
                    <input type="file" hidden accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} />
                </Button>
            )}

            {image && (
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "secondary.main",
                        color: "#fff",
                        "&:hover": { backgroundColor: "primary.main" }
                    }}
                    onClick={handleSaveImage}
                >
                    Guardar Imagen
                </Button>
            )}
        </Box>
    );
}

export default DiagramaFlujo;
