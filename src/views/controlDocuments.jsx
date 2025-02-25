import React from "react";
import { Box, Container, Typography, TextField, FormGroup, FormControlLabel, Checkbox, Select, MenuItem } from "@mui/material";

const ControlDocuments = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Nombre del Documento:
          </Typography>
          <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }} />
        </Box>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Tipo:
          </Typography>
          <Select fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }}>
            <MenuItem value="interno">Interno</MenuItem>
            <MenuItem value="externo">Externo</MenuItem>
          </Select>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Fecha de Revisión:
          </Typography>
          <TextField type="date" fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }} />
        </Box>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Responsable:
          </Typography>
          <Select fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }}>
            <MenuItem value="persona1">Persona 1</MenuItem>
            <MenuItem value="persona2">Persona 2</MenuItem>
          </Select>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Medio de Almacenamiento:
          </Typography>
          <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }} />
        </Box>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Lugar de Almacenamiento:
          </Typography>
          <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }} />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Número de Copias:
          </Typography>
          <TextField type="number" fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }} />
        </Box>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Tipo de Almacenamiento:
          </Typography>
          <Select fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }}>
            <MenuItem value="fisico">Físico</MenuItem>
            <MenuItem value="digital">Digital</MenuItem>
            <MenuItem value="ambos">Ambos</MenuItem>
          </Select>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Disposición:
          </Typography>
          <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }} />
        </Box>
      </Box>

      <Box sx={{ marginTop: "20px" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "left" }}>
          Usuarios:
        </Typography>
        <FormGroup row>
          <FormControlLabel control={<Checkbox />} label="Alumnos" />
          <FormControlLabel control={<Checkbox />} label="Personal Administrativo" />
          <FormControlLabel control={<Checkbox />} label="Funcionariado" />
          <FormControlLabel control={<Checkbox />} label="Coordinadores" />
        </FormGroup>
      </Box>
    </Container>
  );
};

export default ControlDocuments;
