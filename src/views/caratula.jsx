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
    { nombre: "", cargo: "", fijo: "Responsable", editando: false },
    { nombre: "", cargo: "", fijo: "Revisó", editando: false },
    { nombre: "", cargo: "", fijo: "Aprobó", editando: false },
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
            { 
              nombre: data.responsableNombre || "", 
              cargo: data.responsableCargo || "", 
              fijo: "Responsable", 
              editando: false 
            },
            { 
              nombre: data.revisoNombre || "", 
              cargo: data.revisoCargo || "", 
              fijo: "Revisó", 
              editando: false 
            },
            { 
              nombre: data.aproboNombre || "", 
              cargo: data.aproboCargo || "", 
              fijo: "Aprobó", 
              editando: false 
            },
          ]);
        } else {
          setExiste(false);
          // Resetear a valores vacíos
          setPersonas([
            { nombre: "", cargo: "", fijo: "Responsable", editando: false },
            { nombre: "", cargo: "", fijo: "Revisó", editando: false },
            { nombre: "", cargo: "", fijo: "Aprobó", editando: false },
          ]);
        }
      })
      .catch(() => {
        setExiste(false);
        setPersonas([
          { nombre: "", cargo: "", fijo: "Responsable", editando: false },
          { nombre: "", cargo: "", fijo: "Revisó", editando: false },
          { nombre: "", cargo: "", fijo: "Aprobó", editando: false },
        ]);
      })
      .finally(() => setLoading(false));
  }, [idProceso]);

  useEffect(() => { cargar(); }, [cargar]);

  return { caratulaId, personas, setPersonas, loading, existe, setExiste, setCaratulaId, cargar };
};

const PersonaCard = ({ persona, index, onEdit, onChange, puedeEditar }) => (
  <Card elevation={3} sx={{ minWidth: 240, mx: 1, mb: 2 }}>
    <CardContent sx={{ textAlign: "center" }}>
      {persona.editando ? (
        <>
          <TextField 
            fullWidth 
            variant="standard" 
            value={persona.nombre}
            onChange={(e) => onChange(index, "nombre", e.target.value)} 
            label="Nombre" 
            placeholder="Ingrese el nombre completo"
            sx={{ mb: 1 }} 
            error={persona.nombre.length > 0 && persona.nombre.length > 125}
            helperText={
              persona.nombre.length > 0 && persona.nombre.length > 125 
                ? "Máximo 125 caracteres" 
                : `${persona.nombre.length}/125`
            }
          />
          <TextField 
            fullWidth 
            variant="standard" 
            value={persona.cargo}
            onChange={(e) => onChange(index, "cargo", e.target.value)} 
            label="Cargo" 
            placeholder="Ingrese el cargo correspondiente"
            sx={{ mb: 2 }} 
            error={persona.cargo.length > 0 && persona.cargo.length > 125}
            helperText={
              persona.cargo.length > 0 && persona.cargo.length > 125 
                ? "Máximo 125 caracteres" 
                : `${persona.cargo.length}/125`
            }
          />
        </>
      ) : (
        <>
          <Typography fontWeight="bold">
            {persona.nombre || "Sin asignar"}
          </Typography>
          <Typography fontWeight="bold">
            {persona.cargo || "Sin cargo"}
          </Typography>
          <Typography sx={{ color: "#004A98", fontWeight: "bold", mt: 1 }}>
            {persona.fijo}
          </Typography>
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
  const [guardando, setGuardando] = useState(false);

  const handleEdit = (index) => {
    if (!puedeEditar) return;
    const updated = [...personas];
    updated[index].editando = true;
    setPersonas(updated);
  };

  const handleCancel = () => {
    cargar(); // Reset al original
  };

  const handleChange = (index, field, value) => {
    const updated = [...personas];
    updated[index][field] = value;
    setPersonas(updated);
  };

  const validarCampos = () => {
    for (const persona of personas) {
      if ((persona.nombre.length > 0 && persona.nombre.length > 125) ||
          (persona.cargo.length > 0 && persona.cargo.length > 125)) {
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    // Validar longitudes mínimas
    if (!validarCampos()) {
      setAlerta({ 
        tipo: "error", 
        texto: "Los campos deben tener al menos 125 caracteres si se completan" 
      });
      return;
    }

    setGuardando(true);
    
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
      
      // Salir del modo edición
      const updated = personas.map(p => ({ ...p, editando: false }));
      setPersonas(updated);
    } catch (e) {
      console.error("Error guardando carátula", e);
      setAlerta({ tipo: "error", texto: "Error al guardar." });
    } finally {
      setTimeout(() => setAlerta({ tipo: "", texto: "" }), 4000);
      setGuardando(false);
    }
  };

  // Verificar si hay alguna tarjeta en modo edición
  const enEdicion = personas.some(p => p.editando);

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
              onChange={handleChange}
              puedeEditar={puedeEditar}
            />
          </Grid>
        ))}
      </Grid>

      {puedeEditar && enEdicion && (
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <CustomButton 
            type="cancelar" 
            onClick={handleCancel}
            disabled={guardando}
          >
            Cancelar
          </CustomButton>
          <CustomButton 
            type="guardar" 
            onClick={handleSave}
            loading={guardando}
            disabled={!validarCampos() || guardando}
          >
            {guardando ? "Guardando..." : "Guardar"}
          </CustomButton>
        </Box>
      )}
    </Box>
  );
};

export default Caratula;