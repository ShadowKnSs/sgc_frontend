/**
 * Componente: Caratula
 * Ubicación: src/views/caratula.jsx
 * Props:
 *  - `puedeEditar` (boolean): si `true`, permite editar los campos de nombre y cargo de cada persona.
 *
 * Descripción:
 * Vista de portada (carátula) del manual del proceso, donde se registra quién lo elabora, revisa y aprueba.
 * Carga y guarda estos datos mediante API, con soporte para edición individual por campo.

 * Funcionalidades principales:
 * 1. ✅ Consulta si existe carátula para el `idProceso` vía GET `/api/caratulas/proceso/:idProceso`.
 * 2. ✅ Si existe, carga los datos en el estado `personas`.
 * 3. ✅ Si no existe, permite crearla vía POST `/api/caratula`.
 * 4. ✅ Si existe, actualiza la carátula vía PUT `/api/caratulas/:idCaratula`.
 * 5. ✅ Cada persona (Responsable, Revisó, Aprobó) puede editarse individualmente.
 * 6. ✅ Los campos pueden cancelarse o guardarse de forma individual.
 * 7. ✅ Muestra mensajes de éxito/error mediante `MensajeAlert`.

 * Estructura de personas:
 * [
 *   { nombre: string, cargo: string, fijo: "Responsable", editando: boolean },
 *   { nombre: string, cargo: string, fijo: "Revisó", editando: boolean },
 *   { nombre: string, cargo: string, fijo: "Aprobó", editando: boolean }
 * ]

 * Estados destacados:
 * - `existe`: booleano que indica si ya hay una carátula en la base de datos.
 * - `caratulaId`: ID del registro de carátula si existe.
 * - `alerta`: objeto para mostrar mensajes tipo snackbar (`{ tipo: "success" | "error", texto: string }`).
 * - `personas`: arreglo con la información editable de cada rol.
 * - `loading`: controla si los datos están siendo cargados.

 * Funciones destacadas:
 * - `cargarCaratula`: consulta la carátula actual y actualiza estado.
 * - `handleEdit(index)`: habilita el modo edición de una persona.
 * - `handleCancel(index, prevNombre, prevCargo)`: cancela los cambios de un campo.
 * - `handleChange(index, field, value)`: actualiza campo controlado por input.
 * - `handleSave(index)`: guarda la carátula, realizando POST o PUT según si ya existe.

 * Diseño UX:
 * - Muestra el logo de la UASLP.
 * - Diseño responsivo de tres columnas para los roles.
 * - Campos de texto solo visibles en modo edición.
 * - Botones de guardar y cancelar en cada bloque editable.
 * - Colores accesibles para mensajes y botones.
 *
 * Reutiliza:
 * - `MensajeAlert` para mostrar mensajes temporales de retroalimentación.
 *
 * Recomendaciones futuras:
 * - Añadir validación de campos vacíos o nombres inválidos.
 * - Mostrar fecha de última modificación.
 * - Permitir firmar electrónicamente por cada persona.
 */
import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import { Edit, Save, Close } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import axios from "axios";
import UASLPLogo from "../assests/UASLP_SICAL_Logo.png";
import MensajeAlert from "../components/MensajeAlert";

const Caratula = ({ puedeEditar }) => {
  const { idProceso } = useParams();
  const [existe, setExiste] = useState(false);
  const [loading, setLoading] = useState(true);
  const [caratulaId, setCaratulaId] = useState(null);
  const [alerta, setAlerta] = useState({ tipo: "", texto: "" });

  const [personas, setPersonas] = useState([
    { nombre: "Sin registrar", cargo: "Sin cargo", fijo: "Responsable", editando: false },
    { nombre: "Sin registrar", cargo: "Sin cargo", fijo: "Revisó", editando: false },
    { nombre: "Sin registrar", cargo: "Sin cargo", fijo: "Aprobó", editando: false },
  ]);

  useEffect(() => {
    cargarCaratula();
  }, [idProceso]);  
  
  const cargarCaratula = () => {
    axios.get(`http://localhost:8000/api/caratulas/proceso/${idProceso}`)
      .then((res) => {
        const data = res.data;
          console.log("Datos recibidos del backend:", data); // 👈

        if (data && data.idCaratula) {
          setExiste(true);
          setCaratulaId(data.idCaratula);
          setPersonas([
            { nombre: data.responsableNombre, cargo: data.responsableCargo, fijo: "Responsable", editando: false },
            { nombre: data.revisoNombre, cargo: data.revisoCargo, fijo: "Revisó", editando: false },
            { nombre: data.aproboNombre, cargo: data.aproboCargo, fijo: "Aprobó", editando: false },
          ]);
        } else {
          setExiste(false);
          setCaratulaId(null);
        }
      })
      .catch(() => {
        setExiste(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  

  const handleEdit = (index) => {
    if (!puedeEditar) return;
    const updated = [...personas];
    updated[index].editando = true;
    setPersonas(updated);
  };

  const handleCancel = (index, prevNombre, prevCargo) => {
    const updated = [...personas];
    updated[index].nombre = prevNombre;
    updated[index].cargo = prevCargo;
    updated[index].editando = false;
    setPersonas(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...personas];
    updated[index][field] = value;
    setPersonas(updated);
  };

  const handleSave = async (index) => {
    const updated = [...personas];
    updated[index].editando = false;
    setPersonas(updated);

    const payload = {
      idProceso,
      responsable_nombre: personas[0].nombre,
      responsable_cargo: personas[0].cargo,
      reviso_nombre: personas[1].nombre,
      reviso_cargo: personas[1].cargo,
      aprobo_nombre: personas[2].nombre,
      aprobo_cargo: personas[2].cargo,
    };    

    try {
      if (!existe) {
        const res = await axios.post("http://localhost:8000/api/caratula", payload);
        const newId = res.data?.idCaratula;
        if (newId) {
          setExiste(true);
          setCaratulaId(newId);
        } else {
          throw new Error("No se recibió idCaratula del backend.");
        }
      } else {
        if (!caratulaId) {
          console.error("ID de carátula no definido");
          return;
        }
        await axios.put(`http://localhost:8000/api/caratulas/${caratulaId}`, payload);
        cargarCaratula();
      }
    
      setAlerta({ tipo: "success", texto: "Carátula guardada correctamente." });
      setTimeout(() => {
        setAlerta({ tipo: "", texto: "" });
      }, 4000);
    
    } catch (error) {
      console.error("Error al guardar la carátula:", error);
      // setAlerta({ tipo: "error", texto: "Ocurrió un error al guardar la carátula." });
      // setTimeout(() => {
      //   setAlerta({ tipo: "", texto: "" });
      // }, 4000);
    }    
  }; 

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {alerta.texto && (
        <MensajeAlert
          tipo={alerta.tipo}
          texto={alerta.texto}
          onClose={() => setAlerta({ tipo: "", texto: "" })}
        />
      )} 
      <Box sx={{ position: "relative", height: "320px", width: "250px", mb: 4, left: "-15px", display: "flex", justifyContent: "center" }}>
        <img src={UASLPLogo} alt="UASLP Logo" style={{ width: "100%" }} />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
        {personas.map((persona, index) => (
          <Box key={index} sx={{ textAlign: "center", width: "30%", position: "relative" }}>
            {persona.editando ? (
              <>
                <TextField
                  fullWidth variant="standard"
                  value={persona.nombre || ""}
                  onChange={(e) => handleChange(index, "nombre", e.target.value)}
                  sx={{ textAlign: "center", mb: 1 }}
                />
                <TextField
                  fullWidth variant="standard"
                  value={persona.cargo || ""}

                  onChange={(e) => handleChange(index, "cargo", e.target.value)}
                  sx={{ textAlign: "center", mb: 1 }}
                />
                {puedeEditar && (
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ backgroundColor: "#F9B800", color: "#000", "&:hover": { backgroundColor: "#004A98", color: "#fff" } }}
                      startIcon={<Save />}
                      onClick={() => handleSave(index)}
                    >
                      GUARDAR
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ backgroundColor: "#E0E0E0", color: "#000", "&:hover": { backgroundColor: "#BDBDBD" } }}
                      startIcon={<Close />}
                      onClick={() => handleCancel(index, persona.nombre, persona.cargo)}
                    >
                      CANCELAR
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <>
                <Typography sx={{ fontWeight: "bold" }}>{persona.nombre}</Typography>
                <Typography sx={{ fontWeight: "bold" }}>{persona.cargo}</Typography>
                <Typography sx={{ color: "#004A98", fontWeight: "bold", mt: 1 }}>{persona.fijo}</Typography>
                {puedeEditar && (
                  <Button
                    size="small"
                    variant="text"
                    startIcon={<Edit />}
                    onClick={() => handleEdit(index)}
                    sx={{ mt: 1, color: "#004A98" }}
                  >
                    Editar
                  </Button>
                )}
              </>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Caratula;
