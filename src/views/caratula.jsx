// 📁 src/views/caratula.jsx
import React, { useState } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import { Edit, Save, Close } from "@mui/icons-material";
import UASLPLogo from "../assests/UASLP_SICAL_Logo.png";

const Caratula = ({ puedeEditar }) => {

  const [personas, setPersonas] = useState([
    { nombre: "Dr. Juanito Perez", cargo: "Secretario General", fijo: "Responsable", editando: false },
    { nombre: "Dr. Pedro Sanchez", cargo: "Secretario Escolar", fijo: "Revisó", editando: false },
    { nombre: "Dra. Paola Rivera", cargo: "Directora de Facultad", fijo: "Aprobó", editando: false },
  ]);

  const handleEdit = (index) => {
    if (!puedeEditar) return;
    const updated = [...personas];
    updated[index].editando = true;
    setPersonas(updated);
  };

  const handleSave = (index) => {
    const updated = [...personas];
    updated[index].editando = false;
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

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Logo */}
      <Box sx={{ position: "relative", height: "320px", width: "250px", mb: 4, left: "-15px", display: "flex", justifyContent: "center" }}>
        <img src={UASLPLogo} alt="UASLP Logo" style={{ width: "100%" }} />
      </Box>

      {/* Nombres y cargos */}
      <Box sx={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
        {personas.map((persona, index) => (
          <Box key={index} sx={{ textAlign: "center", width: "30%", position: "relative" }}>
            {persona.editando ? (
              <>
                <TextField
                  fullWidth variant="standard"
                  value={persona.nombre}
                  onChange={(e) => handleChange(index, "nombre", e.target.value)}
                  sx={{ textAlign: "center", mb: 1 }}
                />
                <TextField
                  fullWidth variant="standard"
                  value={persona.cargo}
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
