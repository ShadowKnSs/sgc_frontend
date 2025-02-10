import React, { useState } from "react";
import { TextField, Button, Card, CardContent, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

function NewProcess() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2002 }, (_, i) => 2003 + i);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (name.trim() === "") {
      alert("El nombre del proceso es obligatorio.");
      return;
    }

    const existingProcesses = JSON.parse(localStorage.getItem("processes") || "[]");
    const newProcess = { id: Date.now(), name };
    localStorage.setItem("processes", JSON.stringify([...existingProcesses, newProcess]));

    navigate("/procesos");
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", p: 4 }}>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "32px",
          fontFamily: "'Roboto', sans-serif",
          color: "#004A98"
        }}
      >
        Nuevo Proceso
      </h1>


      <Card sx={{ width: "100%", p: 3, boxShadow: 3, borderRadius: "12px" }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Nombre del Proceso"
                placeholder="Ingrese el nombre del proceso"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{
                  borderRadius: "12px", // Bordes redondeados
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px", // Bordes redondeados también en el input
                  },
                  "& .MuiInputBase-root": {
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Sombra suave
                  },
                  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2", // Cambiar color del borde cuando se selecciona
                  },
                }}
              />
              <TextField select fullWidth label="Líder del Proceso" defaultValue="" sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
                "& .MuiInputBase-root": {
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                },
              }}>
                <MenuItem value="1">Juan Pérez</MenuItem>
                <MenuItem value="2">María López</MenuItem>
                <MenuItem value="3">Carlos Gómez</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Objetivo del Proceso"
                placeholder="Ingrese el objetivo del proceso"
                multiline
                rows={3}
                variant="outlined"
                sx={{
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                  "& .MuiInputBase-root": {
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  },
                  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Alcance del Proceso"
                placeholder="Ingrese el alcance del proceso"
                multiline
                rows={3}
                variant="outlined"
                sx={{
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                  "& .MuiInputBase-root": {
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  },
                  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
              <TextField select fullWidth label="Norma" defaultValue="" sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
                "& .MuiInputBase-root": {
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                },
              }}>
                <MenuItem value="ISO 9001">ISO 9001</MenuItem>
                <MenuItem value="ISO 14001">ISO 14001</MenuItem>
                <MenuItem value="ISO 45001">ISO 45001</MenuItem>
              </TextField>
              <TextField select fullWidth label="Macroproceso" defaultValue="" sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
                "& .MuiInputBase-root": {
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                },
              }}>
                <MenuItem value="Producción">Producción</MenuItem>
                <MenuItem value="Logística">Logística</MenuItem>
                <MenuItem value="Calidad">Calidad</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
              <TextField select fullWidth label="Estado" defaultValue="" sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
                "& .MuiInputBase-root": {
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                },
              }}>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </TextField>
              <TextField select fullWidth label="Coordinador" defaultValue="" sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
                "& .MuiInputBase-root": {
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                },
              }}>
                <MenuItem value="Luis Hernández">Luis Hernández</MenuItem>
                <MenuItem value="Ana Torres">Ana Torres</MenuItem>
                <MenuItem value="Pedro Sánchez">Pedro Sánchez</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 2, alignItems: "center" }}>
              <TextField select fullWidth label="Año de Certificación" defaultValue="" sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
                "& .MuiInputBase-root": {
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                },
              }}>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: "#004A98", // Cambia el color de fondo
                  borderRadius: "30px",
                  "&:hover": {
                    backgroundColor: "#00B2E3", // Color del hover
                  },
                }}
              >
                Aceptar
              </Button>

            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default NewProcess;
