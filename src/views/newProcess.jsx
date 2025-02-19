import React, { useState, useEffect } from "react";
import { TextField, Card, CardContent, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DialogActionButtons from "../components/DialogActionButtons";

function NewProcess() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2002 }, (_, i) => 2003 + i);
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [name, setName] = useState("");
  const [leader, setLeader] = useState("");
  const [objective, setObjective] = useState("");
  const [reach, setReach] = useState("");
  const [norm, setNorm] = useState("");
  const [macroprocess, setMacroprocess] = useState("");
  const [processState, setProcessState] = useState("");
  const [certificationYear, setCertificationYear] = useState("");

  // Estados para las opciones de selects
  const [macroprocesos, setMacroprocesos] = useState([]);
  const [entidades, setEntidades] = useState([]);
  const [selectedEntidad, setSelectedEntidad] = useState("");
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/macroprocesos")
      .then(response => {
        setMacroprocesos(response.data.macroprocesos || []);
      })
      .catch(error => {
        console.error("Error al obtener macroprocesos:", error);
      });

    axios.get("http://127.0.0.1:8000/api/entidades")
      .then(response => {
        setEntidades(response.data.entidades || []);
      })
      .catch(error => {
        console.error("Error al obtener entidades:", error);
      });

    axios.get("http://127.0.0.1:8000/api/lideres")
      .then(response => {
        setLeaders(response.data.leaders || []);
      })
      .catch(error => {
        console.error("Error al obtener líderes:", error);
      });
  }, []);

  const handleSaveProcess = async () => {
    if (name.trim() === "") {
      alert("El nombre del proceso es obligatorio.");
      return;
    }

    const newProcess = {
      nombreProceso: name,
      idMacroproceso: macroprocess,
      idUsuario: leader,
      idEntidad: selectedEntidad,
      objetivo: objective,
      alcance: reach,
      anioCertificado: parseInt(certificationYear),
      norma: norm,
      duracionCetificado: 1, // Ajusta según necesites
      estado: processState,
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/procesos", newProcess);
      console.log("Proceso creado:", response.data);
      navigate("/procesos");
    } catch (error) {
      console.error("Error al crear el proceso", error);
      alert("Ocurrió un error al crear el proceso.");
    }
  };

  const handleCancel = () => {
    navigate("/procesos");
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", p: 4 }}>
      <Card sx={{ width: "100%", maxWidth: 800, p: 3, boxShadow: 3, borderRadius: "12px" }}>
        <CardContent>
          <h1 style={{ textAlign: "center", marginBottom: "32px", fontFamily: "'Roboto', sans-serif", color: "#004A98" }}>
            Nuevo Proceso
          </h1>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="Nombre del Proceso"
              placeholder="Ingrese el nombre del proceso"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                "& .MuiInputBase-root": { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1976d2" }
              }}
            />
            <TextField
              select
              fullWidth
              label="Líder del Proceso"
              value={leader}
              onChange={(e) => setLeader(parseInt(e.target.value))}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                "& .MuiInputBase-root": { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }
              }}
            >
              {leaders.map((l) => (
                <MenuItem key={l.idUsuario} value={l.idUsuario}>
                  {l.nombre} {l.apellidoPat} {l.apellidoMat}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Objetivo del Proceso"
              placeholder="Ingrese el objetivo del proceso"
              multiline
              rows={3}
              variant="outlined"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                "& .MuiInputBase-root": { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1976d2" }
              }}
            />
            <TextField
              fullWidth
              label="Alcance del Proceso"
              placeholder="Ingrese el alcance del proceso"
              multiline
              rows={3}
              variant="outlined"
              value={reach}
              onChange={(e) => setReach(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                "& .MuiInputBase-root": { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1976d2" }
              }}
            />
            <TextField
              select
              fullWidth
              label="Norma"
              value={norm}
              onChange={(e) => setNorm(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                "& .MuiInputBase-root": { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }
              }}
            >
              <MenuItem value="ISO 9001">ISO 9001</MenuItem>
              <MenuItem value="ISO 14001">ISO 14001</MenuItem>
              <MenuItem value="ISO 45001">ISO 45001</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="Macroproceso"
              value={macroprocess}
              onChange={(e) => setMacroprocess(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                "& .MuiInputBase-root": { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }
              }}
            >
              {macroprocesos.map((mp) => (
                <MenuItem key={mp.idMacroproceso} value={mp.idMacroproceso}>
                  {mp.tipoMacroproceso}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Estado"
              value={processState}
              onChange={(e) => setProcessState(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                "& .MuiInputBase-root": { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }
              }}
            >
              <MenuItem value="Activo">Activo</MenuItem>
              <MenuItem value="Inactivo">Inactivo</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="Entidad/Dependencia"
              value={selectedEntidad}
              onChange={(e) => setSelectedEntidad(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                "& .MuiInputBase-root": { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }
              }}
            >
              {entidades.map((ent) => (
                <MenuItem key={ent.idEntidadDependecia} value={ent.idEntidadDependecia}>
                  {ent.nombreEntidad}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Año de Certificación"
              value={certificationYear}
              onChange={(e) => setCertificationYear(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                "& .MuiInputBase-root": { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }
              }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <DialogActionButtons
              onCancel={handleCancel}
              onSave={handleSaveProcess}
              saveText="Guardar"
              cancelText="Cancelar"
              saveColor="terciary.main"
              cancelColor="primary.main"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default NewProcess;
