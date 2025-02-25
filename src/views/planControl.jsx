import React from "react";
import { Container, Box, Typography, TextField, MenuItem } from "@mui/material";

const PlanControl = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: "5px" }}>
            Actividad de Control:
          </Typography>
          <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }} />
        </Box>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: "5px" }}>
            Procedimiento:
          </Typography>
          <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }} />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "14px", gap: "10px" }}>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: "5px" }}>
            Criterio de Aceptación:
          </Typography>
          <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }} />
        </Box>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: "5px" }}>
            Características a Verificar:
          </Typography>
          <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }} />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "14px", gap: "10px" }}>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: "5px" }}>
            Frecuencia:
          </Typography>
          <TextField fullWidth variant="filled" select sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }}>
            <MenuItem value="Diario">Diario</MenuItem>
            <MenuItem value="Semanal">Semanal</MenuItem>
            <MenuItem value="Mensual">Mensual</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: "5px" }}>
            Identificación de Salida:
          </Typography>
          <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }} />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "14px", gap: "10px" }}>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: "5px" }}>
            Registro de Salidas no Conformes:
          </Typography>
          <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }} />
        </Box>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: "5px" }}>
            Responsable de Liberación:
          </Typography>
          <TextField fullWidth variant="filled" select sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }}>
            <MenuItem value="Supervisor">Supervisor</MenuItem>
            <MenuItem value="Gerente">Líder de proceso</MenuItem>
            <MenuItem value="Auditor">Auditor</MenuItem>
          </TextField>
        </Box>
      </Box>

      {/* Nuevo campo de Tratamiento, centrado y con menos espacio */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "14px" }}>
        <Box sx={{ width: "80%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: "5px" }}>
            Tratamiento:
          </Typography>
          <TextField
            fullWidth
            variant="filled"
            sx={{
              backgroundColor: "#E0E0E0",
              borderRadius: "10px",
              "& .MuiFilledInput-root": {
                borderRadius: "10px",
              },
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default PlanControl;
