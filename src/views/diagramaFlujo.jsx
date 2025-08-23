/**
 * Componente: DiagramaFlujo
 * Ubicación: src/components/DiagramaFlujo.jsx
 *
 * Descripción:
 * Componente visual y funcional que permite a los usuarios visualizar, subir o actualizar
 * el Diagrama de Flujo de un proceso específico del SGC.
 *
 * Props:
 * - `idProceso` (number): ID del proceso al cual se le vincula el diagrama.
 * - `soloLectura` (boolean): Si está activado, desactiva la capacidad de subir o modificar imágenes.
 *
 * Funcionalidad principal:
 * 1. Al montar el componente, se consulta el backend (`GET /api/mapaproceso/:idProceso`) para obtener el diagrama existente.
 * 2. Si hay una imagen cargada en el backend, se muestra como imagen principal.
 * 3. Si el usuario no está en modo `soloLectura`, puede:
 *    - Seleccionar una nueva imagen (`png`, `jpg`, `jpeg`).
 *    - Previsualizarla antes de subir.
 *    - Eliminar la imagen seleccionada antes de subir.
 *    - Guardar la nueva imagen mediante `POST /api/mapa-proceso/:idProceso/subir-diagrama`.
 *
 * Estado:
 * - `image`: Archivo temporal seleccionado por el usuario para cargar.
 * - `preview`: URL local de la imagen seleccionada (para vista previa).
 * - `imageURL`: URL pública de la imagen ya guardada en el backend.
 *
 * Lógica del flujo:
 * - Si `preview` está definido → se muestra la imagen seleccionada localmente + botón de eliminar.
 * - Si no hay `preview`, pero sí `imageURL` → se muestra la imagen oficial guardada.
 * - Si no hay imagen registrada, se muestra un mensaje indicativo.
 *
 * Consideraciones de diseño:
 * - Estética basada en MUI con tarjetas (`<Card>`), botones (`<Button>`, `<IconButton>`) y feedback visual.
 * - Los botones cambian de color en hover para mejorar UX.
 * - La imagen se presenta redondeada y escalada al 100% del contenedor para buena visualización.
 *
 * Consideraciones técnicas:
 * - La imagen se envía como `multipart/form-data` usando `FormData`.
 * - `useEffect` está condicionado al `idProceso` para evitar llamadas innecesarias.
 * - `alert()` se utiliza como feedback básico; puede mejorarse usando `Snackbar` o `FeedbackSnackbar`.
 *
 * Mejoras recomendadas:
 * - Añadir validación de tamaño (ej. máximo 2MB) y dimensiones.
 * - Reemplazar `alert` por un sistema visual de notificaciones.
 * - Agregar loader o indicador de subida en curso.
 * - Permitir eliminar permanentemente el diagrama guardado.
 */

import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Card, CardContent, IconButton } from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import axios from "axios";

function DiagramaFlujo({ idProceso, soloLectura }) {
    
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
