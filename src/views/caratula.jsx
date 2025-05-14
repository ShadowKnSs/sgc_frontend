// 📁 src/views/caratula.jsx
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
