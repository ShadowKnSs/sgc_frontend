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
 *
 **/

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import axios from "axios";
import CustomButton from "../components/Button";
import FeedbackSnackbar from "../components/Feedback";

function DiagramaFlujo({ idProceso, soloLectura }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [imgLoading, setImgLoading] = useState(false);
  const [alerta, setAlerta] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    const fetchDiagrama = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get(`http://localhost:8000/api/mapaproceso/${idProceso}`);
        if (response.data?.diagramaFlujo) {
          setImgLoading(false);
          setImageURL(response.data.diagramaFlujo);
        } else {
          setImageURL(null);
        }
      } catch (error) {
        console.error("❌ Error al obtener el diagrama:", error);

      } finally {
        setIsFetching(false);
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
    setIsSaving(true);

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
        setImgLoading(true);
        setImageURL(response.data.url);
        setImage(null);
        setPreview(null);
        setAlerta({ tipo: "success", texto: "Imagen subida correctamente." });
      } else {
        setAlerta({ tipo: "warning", texto: "No se recibió la URL de la imagen" });
      }
    } catch (error) {
      setAlerta({ tipo: "error", texto: "Error al subir la imagen" });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (alerta.texto) {
      const timeout = setTimeout(() => setAlerta({ tipo: "", texto: "" }), 4000);
      return () => clearTimeout(timeout);
    }
  }, [alerta]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, mt: 4 }}>
      <FeedbackSnackbar
        open={!!alerta.texto}
        type={alerta.tipo}
        message={alerta.texto}
        onClose={() => setAlerta({ tipo: "", texto: "" })}
      />

      <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
        Diagrama de Flujo
      </Typography>

      {preview ? (
        <Card sx={{ width: "50%", textAlign: "center", p: 2 }}>
          <CardContent>
            <img src={preview} alt="Vista previa" style={{ width: "100%", borderRadius: "10px" }} />
          </CardContent>
        </Card>
      ) : imageURL ? (
        <Card sx={{ width: "50%", boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ position: "relative" }}>
              <img
                key={imageURL}
                src={imageURL}
                alt="Diagrama de Flujo"
                style={{ width: "100%", borderRadius: "10px", display: "block" }}
                onLoad={() => setImgLoading(false)}
                onError={() => {
                  setImgLoading(false);
                }}
              />
              {(isFetching || imgLoading) && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(255,255,255,0.7)",
                    borderRadius: "10px",
                  }}
                >
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Cargando diagrama de flujo…
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : isFetching ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, mt: 2 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Cargando diagrama de flujo…
          </Typography>
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No hay Diagrama de Flujo registrado aún.
        </Typography>
      )}

      {/* Selector de archivo SIEMPRE visible */}
      {!soloLectura && (
        <label htmlFor="upload-input">
          <input
            id="upload-input"
            type="file"
            hidden
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
          />
          <CustomButton component="span" type="subir" startIcon={<CloudUpload />}>
            Seleccionar Imagen
          </CustomButton>
        </label>
      )}

      {/* Botones: Guardar y Cancelar si hay nueva imagen */}
      {!soloLectura && image && (
        <Box sx={{ display: "flex", gap: 2 }}>
          <CustomButton
            type="guardar"
            onClick={handleSaveImage}
            disabled={isSaving}
          >
            {isSaving ? <CircularProgress size={22} color="inherit" /> : "Guardar Imagen"}
          </CustomButton>

          <CustomButton
            type="cancelar"
            onClick={handleRemoveImage}
            disabled={isSaving}
          >
            Cancelar
          </CustomButton>
        </Box>
      )}
    </Box>
  );
}

export default DiagramaFlujo;
