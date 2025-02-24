import React from "react";
import { Container, Box, Typography, TextField, MenuItem } from "@mui/material";

const PlanControl = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Actividad de Control:
          </Typography>
          <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }} />
        </Box>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Procedimiento:
          </Typography>
          <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }} />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Criterio de Aceptación:
          </Typography>
          <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }} />
        </Box>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Características a Verificar:
          </Typography>
          <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }} />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Frecuencia:
          </Typography>
          <TextField fullWidth variant="filled" select sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }}>
            <MenuItem value="Diario">Diario</MenuItem>
            <MenuItem value="Semanal">Semanal</MenuItem>
            <MenuItem value="Mensual">Mensual</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Identificación de Salida:
          </Typography>
          <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }} />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Registro de Salidas no Conformes:
          </Typography>
          <TextField fullWidth variant="filled" sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }} />
        </Box>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Responsable de Liberación:
          </Typography>
          <TextField fullWidth variant="filled" select sx={{ backgroundColor: "#E0E0E0", borderRadius: "10px" }}>
            <MenuItem value="Supervisor">Supervisor</MenuItem>
            <MenuItem value="Gerente">Lider de proceso</MenuItem>
            <MenuItem value="Auditor">Auditor</MenuItem>
          </TextField>
        </Box>
      </Box>
    </Container>
  );
};

export default PlanControl;
