import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Card, CardContent, IconButton } from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import axios from "axios";

function DiagramaFlujo({ idProceso, rolActivo }) {
    const soloLectura = rolActivo === "Auditor";
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [imageURL, setImageURL] = useState(null);

    // ✅ Obtener imagen al montar
    useEffect(() => {
        const fetchDiagrama = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/mapaproceso/${idProceso}`);
                if (response.data?.diagramaFlujo) {
                    setImageURL(response.data.diagramaFlujo);
                    console.log("✅ Diagrama cargado:", response.data.diagramaFlujo);
                } else {
                    console.log("ℹ️ No hay diagramaFlujo en la respuesta.");
                }
            } catch (error) {
                console.error("❌ Error al obtener el diagrama desde la BD:", error);
            }
        };

        if (idProceso) fetchDiagrama();
    }, [idProceso]);

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

    const handleSaveImage = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append("imagen", image);

        try {
            const response = await axios.post(
                `http://localhost:8000/api/mapa-proceso/${idProceso}/subir-diagrama`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.data?.url) {
                alert("✅ Imagen subida con éxito");
                setImageURL(response.data.url);
                setImage(null);
                setPreview(null);
            } else {
                alert("⚠️ No se recibió la URL de la imagen");
            }
        } catch (error) {
            console.error("❌ Error al subir la imagen:", error);
            alert("Error al subir la imagen");
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
                Diagrama de Flujo
            </Typography>

            {/* Mostrar imagen (local o desde backend) */}
            {preview ? (
                <Card sx={{ position: "relative", width: "50%", textAlign: "center", p: 2 }}>
                    <CardContent>
                        <img src={preview} alt="Vista previa" style={{ width: "100%", borderRadius: "10px" }} />
                    </CardContent>
                    <IconButton
                        onClick={handleRemoveImage}
                        sx={{ position: "absolute", top: 5, right: 5, color: "secondary.main" }}
                    >
                        <Delete />
                    </IconButton>
                </Card>
            ) : imageURL ? (
                <Card sx={{ width: "50%", boxShadow: 3 }}>
                    <CardContent>
                        <img src={imageURL} alt="Diagrama de Flujo" style={{ width: "100%", borderRadius: "10px" }} />
                    </CardContent>
                </Card>
            ) : (
                <Typography variant="body1" color="text.secondary">
                    No hay Diagrama de Flujo registrado aún.
                </Typography>
            )}

            {/* Selector de archivo */}
            {!soloLectura && (
                <Button
                    component="label"
                    variant="contained"
                    sx={{
                        backgroundColor: "secondary.main",
                        color: "#fff",
                        "&:hover": { backgroundColor: "primary.main" },
                    }}
                    startIcon={<CloudUpload />}
                >
                    Seleccionar Imagen
                    <input type="file" hidden accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} />
                </Button>
            )}

            {/* Botón para subir */}
            {image && (
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "secondary.main",
                        color: "#fff",
                        "&:hover": { backgroundColor: "primary.main" },
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
