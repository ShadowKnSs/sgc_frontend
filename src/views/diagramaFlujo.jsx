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
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from "@mui/material";
import { CloudUpload, Delete, Visibility } from "@mui/icons-material";
import axios from "axios";
import CustomButton from "../components/Button";

function DiagramaFlujo({ idProceso, soloLectura, showSnackbar }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [imgLoading, setImgLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const imgRef = useRef(null);
  const [imgVersion, setImgVersion] = useState(0);

  // Función para cargar el diagrama
  const fetchDiagrama = async () => {
    try {
      setIsFetching(true);
      setError("");

      const response = await axios.get(`http://localhost:8000/api/mapaproceso/${idProceso}`);

      if (response.data?.diagramaFlujo) {
        setImgLoading(true);
        setImageURL(response.data.diagramaFlujo);
        setImgVersion(v => v + 1)
      } else {
        setImageURL(null);
      }
    } catch (error) {

      let errorMessage = "Error al cargar el diagrama de flujo";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "No se encontró un diagrama de flujo";
        } else if (error.response.status >= 500) {
          errorMessage = "Error del servidor al cargar el diagrama";
        }
      } else if (error.request) {
        errorMessage = "Error de conexión. Verifique su internet";
      }

      setError(errorMessage);
      setImageURL(null);

      if (showSnackbar) {
        showSnackbar(errorMessage, "error", "Error");
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (idProceso) fetchDiagrama();
  }, [idProceso]);

  useEffect(() => {
    if (imageURL && imgRef.current) {

      if (imgRef.current.complete) {
        setImgLoading(false);
      }
    }
  }, [imageURL, imgVersion]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        if (showSnackbar) {
          showSnackbar("Solo se permiten archivos PNG, JPEG, JPG, GIF o WEBP", "error", "Formato inválido");
        }
        return;
      }

      // Validar tamaño (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB en bytes
      if (file.size > maxSize) {
        if (showSnackbar) {
          showSnackbar("El archivo no debe exceder los 10MB", "error", "Archivo muy grande");
        }
        return;
      }

      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError(""); // Limpiar errores anteriores
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (preview) {
      URL.revokeObjectURL(preview); // Liberar memoria
    }
    setPreview(null);

    if (showSnackbar) {
      showSnackbar("Imagen removida", "info", "Cancelado");
    }
  };

  const handleSaveImage = async () => {
    if (!image) {
      if (showSnackbar) {
        showSnackbar("No hay imagen para guardar", "warning", "Advertencia");
      }
      return;
    }

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
        setImgVersion(v => v + 1)
        setImage(null);
        if (preview) {
          URL.revokeObjectURL(preview); // Liberar memoria
        }
        setPreview(null);

        if (showSnackbar) {
          showSnackbar("Diagrama de flujo guardado correctamente", "success", "Éxito");
        }
      } else {
        if (showSnackbar) {
          showSnackbar("No se recibió la URL de la imagen del servidor", "error", "Error del servidor");
        }
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);

      let errorMessage = "Error al subir el diagrama de flujo";

      if (error.response) {
        if (error.response.status === 413) {
          errorMessage = "El archivo es demasiado grande";
        } else if (error.response.status === 400) {
          errorMessage = "Formato de archivo no válido";
        } else if (error.response.status >= 500) {
          errorMessage = "Error del servidor al subir el archivo";
        }
      } else if (error.request) {
        errorMessage = "Error de conexión al subir el archivo";
      }

      if (showSnackbar) {
        showSnackbar(errorMessage, "error", "Error al subir");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDiagram = async () => {
    if (!imageURL) return;

    try {
      setIsSaving(true);
      await axios.delete(`http://localhost:8000/api/mapa-proceso/${idProceso}/eliminar-diagrama`);

      setImageURL(null);
      if (showSnackbar) {
        showSnackbar("Diagrama de flujo eliminado correctamente", "success", "Éxito");
      }
    } catch (error) {
      console.error("Error al eliminar el diagrama:", error);

      let errorMessage = "Error al eliminar el diagrama de flujo";
      if (error.response?.status === 404) {
        errorMessage = "No se encontró el diagrama para eliminar";
      }

      if (showSnackbar) {
        showSnackbar(errorMessage, "error", "Error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Función para abrir imagen en modal/pantalla completa
  const openPreviewModal = () => {
    setShowPreviewModal(true);
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
  };

  // Estado de carga mejorado
  if (isFetching) {
    return (
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        gap: 2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Cargando diagrama de flujo...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, p: 1}}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
        Diagrama de Flujo
      </Typography>

      {/* Manejo de errores */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, maxWidth: 600, width: "100%" }}>
          {error}
        </Alert>
      )}

      {/* Vista previa de nueva imagen */}
      {preview && (
        <Card sx={{ maxWidth: "800px", width: "100%", textAlign: "center", p: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              Vista previa - Nueva imagen
            </Typography>
            <Box sx={{ position: "relative", display: "inline-block", maxWidth: "100%" }}>
              <img
                src={preview}
                alt="Vista previa del diagrama"
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                }}
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Imagen guardada */}
      {imageURL && !preview && (
        <Card sx={{ maxWidth: "800px", width: "100%", boxShadow: 3 }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Box sx={{ position: "relative", display: "inline-block", maxWidth: "100%" }}>
              <img
                key={`${imageURL}-${imgVersion}`}
                ref={imgRef}
                src={`${imageURL}${imageURL.includes('?') ? '&' : '?'}v=${imgVersion}`}
                alt="Diagrama de Flujo del proceso"
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  cursor: "pointer"
                }}
                onClick={openPreviewModal}
                onLoad={() => setImgLoading(false)}
                onError={() => {
                  setImgLoading(false);
                  setError("Error al cargar la imagen del diagrama");
                  if (showSnackbar) {
                    showSnackbar("Error al cargar la imagen del diagrama", "error", "Error de carga");
                  }
                }}
              />
              {imgLoading && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(255,255,255,0.8)",
                    borderRadius: "10px",
                    mt: 2
                  }}
                >
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Cargando diagrama...
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Botones para imagen existente */}
            {!soloLectura && (
              <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                <CustomButton
                  type="generar"
                  startIcon={<Visibility />}
                  onClick={openPreviewModal}
                >
                  Ver en tamaño completo
                </CustomButton>
                <CustomButton
                  type="cancelar"
                  startIcon={<Delete />}
                  onClick={handleDeleteDiagram}
                  disabled={isSaving}
                >
                  Eliminar Diagrama
                </CustomButton>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Estado cuando no hay diagrama */}
      {!imageURL && !preview && !isFetching && !error && (
        <Card sx={{ maxWidth: "600px", width: "100%", textAlign: "center", p: 4, boxShadow: 2 }}>
          <CardContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              No hay diagrama de flujo registrado
            </Alert>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {soloLectura
                ? "No hay diagrama de flujo disponible para este proceso."
                : "Puede subir un diagrama de flujo usando el botón 'Seleccionar Imagen'."
              }
            </Typography>
            {!soloLectura && (
              <CloudUpload sx={{ fontSize: 64, color: "action.disabled", mb: 2 }} />
            )}
          </CardContent>
        </Card>
      )}

      {/* Selector de archivo - Solo para usuarios con permisos de escritura */}
      {!soloLectura && (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <label htmlFor="upload-input">
            <input
              id="upload-input"
              type="file"
              hidden
              accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
              onChange={handleImageChange}
            />
            <CustomButton
              component="span"
              type="subir"
              startIcon={<CloudUpload />}
              disabled={isSaving}
            >
              Seleccionar Imagen
            </CustomButton>
          </label>

          <Typography variant="caption" color="text.secondary" textAlign="center">
            Formatos permitidos: PNG, JPEG, JPG, GIF, WEBP<br />
            Tamaño máximo: 10MB
          </Typography>
        </Box>
      )}

      {/* Botones para guardar/cancelar cuando hay nueva imagen */}
      {!soloLectura && image && (
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
          <CustomButton
            type="cancelar"
            onClick={handleRemoveImage}
            disabled={isSaving}
          >
            Cancelar
          </CustomButton>
          <CustomButton
            type="guardar"
            onClick={handleSaveImage}
            loading={isSaving}
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar Diagrama"}
          </CustomButton>
        </Box>
      )}

      {/* Modal para vista en tamaño completo */}
      {showPreviewModal && imageURL && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            p: 2
          }}
          onClick={closePreviewModal}
        >
          <Box
            sx={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageURL}
              alt="Diagrama de Flujo - Vista completa"
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                borderRadius: '8px'
              }}
            />
            <CustomButton
              type="cancelar"
              onClick={closePreviewModal}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)'
                }
              }}
            >
              Cerrar
            </CustomButton>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default DiagramaFlujo;