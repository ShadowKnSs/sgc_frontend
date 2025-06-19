import React, { useState, useEffect, useCallback } from "react";
import {
  Box, TextField, Typography, Grid, Card, CardContent,
  CircularProgress, Tooltip, IconButton
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import axios from "axios";
import UASLPLogo from "../assests/UASLP_SICAL_Logo.png";
import FeedbackSnackbar from "../components/Feedback";
import CustomButton from "../components/Button";

// Hook para cargar y guardar datos de carátula
const useCaratulaData = (idProceso) => {
  const [caratulaId, setCaratulaId] = useState(null);
  const [personas, setPersonas] = useState([
    { nombre: "Sin registrar", cargo: "Sin cargo", fijo: "Responsable", editando: false },
    { nombre: "Sin registrar", cargo: "Sin cargo", fijo: "Revisó", editando: false },
    { nombre: "Sin registrar", cargo: "Sin cargo", fijo: "Aprobó", editando: false },
  ]);
  const [loading, setLoading] = useState(true);
  const [existe, setExiste] = useState(false);

  const cargar = useCallback(() => {
    axios.get(`http://localhost:8000/api/caratulas/proceso/${idProceso}`)
      .then(res => {
        const data = res.data;
        if (data?.idCaratula) {
          setExiste(true);
          setCaratulaId(data.idCaratula);
          setPersonas([
            { nombre: data.responsableNombre, cargo: data.responsableCargo, fijo: "Responsable", editando: false },
            { nombre: data.revisoNombre, cargo: data.revisoCargo, fijo: "Revisó", editando: false },
            { nombre: data.aproboNombre, cargo: data.aproboCargo, fijo: "Aprobó", editando: false },
          ]);
        } else {
          setExiste(false);
        }
      })
      .catch(() => setExiste(false))
      .finally(() => setLoading(false));
  }, [idProceso]);

  useEffect(() => { cargar(); }, [cargar]);

  return { caratulaId, personas, setPersonas, loading, existe, setExiste, setCaratulaId, cargar };
};

const PersonaCard = ({ persona, index, onEdit, onCancel, onChange, onSave, puedeEditar }) => (
  <Card elevation={3} sx={{ minWidth: 240, mx: 1, mb: 2 }}>
    <CardContent sx={{ textAlign: "center" }}>
      {persona.editando ? (
        <>
          <TextField fullWidth variant="standard" value={persona.nombre}
            onChange={(e) => onChange(index, "nombre", e.target.value)} label="Nombre" sx={{ mb: 1 }} />
          <TextField fullWidth variant="standard" value={persona.cargo}
            onChange={(e) => onChange(index, "cargo", e.target.value)} label="Cargo" sx={{ mb: 2 }} />
          {puedeEditar && (
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
              <CustomButton type="guardar" size="small" onClick={() => onSave(index)}>Guardar</CustomButton>
              <CustomButton type="cancelar" size="small" onClick={() => onCancel(index)}>Cancelar</CustomButton>
            </Box>
          )}
        </>
      ) : (
        <>
          <Typography fontWeight="bold">{persona.nombre}</Typography>
          <Typography fontWeight="bold">{persona.cargo}</Typography>
          <Typography sx={{ color: "#004A98", fontWeight: "bold", mt: 1 }}>{persona.fijo}</Typography>
          {puedeEditar && (
            <Tooltip title="Editar">
              <IconButton onClick={() => onEdit(index)}>
                <Edit sx={{ color: "#68A2C9" }} />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}
    </CardContent>
  </Card>
);

const Caratula = ({ puedeEditar }) => {
  const { idProceso } = useParams();
  const {
    caratulaId, personas, setPersonas, loading, existe, setExiste, setCaratulaId, cargar
  } = useCaratulaData(idProceso);

  const [alerta, setAlerta] = useState({ tipo: "", texto: "" });

  const handleEdit = (index) => {
    if (!puedeEditar) return;
    const updated = [...personas];
    updated[index].editando = true;
    setPersonas(updated);
  };

  const handleCancel = (index) => {
    cargar(); // Reset al original
  };

  const handleChange = (index, field, value) => {
    const updated = [...personas];
    updated[index][field] = value;
    setPersonas(updated);
  };

  const handleSave = async () => {
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
        setCaratulaId(res.data?.idCaratula || null);
        setExiste(true);
      } else {
        await axios.put(`http://localhost:8000/api/caratulas/${caratulaId}`, payload);
      }
      setAlerta({ tipo: "success", texto: "Carátula guardada correctamente." });
    } catch (e) {
      console.error("Error guardando carátula", e);
      setAlerta({ tipo: "error", texto: "Error al guardar." });
    } finally {
      setTimeout(() => setAlerta({ tipo: "", texto: "" }), 4000);
      cargar();
    }
  };

  if (loading) return <Box sx={{ textAlign: "center", mt: 4 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <FeedbackSnackbar
        open={!!alerta.texto}
        onClose={() => setAlerta({ tipo: "", texto: "" })}
        type={alerta.tipo}
        message={alerta.texto}
      />

      <Box sx={{ position: "relative", height: "250px", width: "250px", mb: 4 }}>
        <img src={UASLPLogo} alt="UASLP Logo" style={{ width: "70%" }} />
      </Box>

      <Grid container spacing={2} justifyContent="center">
        {personas.map((persona, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <PersonaCard
              persona={persona}
              index={index}
              onEdit={handleEdit}
              onCancel={handleCancel}
              onChange={handleChange}
              onSave={handleSave}
              puedeEditar={puedeEditar}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Caratula;
