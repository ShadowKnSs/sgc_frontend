import React from "react";
import { Box, Container, TextField, Typography } from "@mui/material";

const formProcessMap = () => {
  return (
    <Container maxWidth="xl">
      {/* Título */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#007bff" }}>
          Mapa de Proceso: Control Escolar Facultad de Enfermería
        </Typography>
      </Box>

      {/* Documentos Relacionados */}
      <Box sx={{ marginTop: "40px" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Documentos Relacionados:
        </Typography>
        <TextField fullWidth variant="filled" disabled sx={{ backgroundColor: "#E0E0E0" }} />
      </Box>

      {/* Fuentes de Entrada */}
      <Box sx={{ marginTop: "30px" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Fuentes de Entrada:
        </Typography>
        <TextField fullWidth variant="filled" disabled sx={{ backgroundColor: "#E0E0E0" }} />
      </Box>

      {/* Material de Entrada y Requisito de Entrada */}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Material de Entrada:
          </Typography>
          <TextField fullWidth variant="filled" disabled sx={{ backgroundColor: "#E0E0E0" }} />
        </Box>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Requisito de Entrada:
          </Typography>
          <TextField fullWidth variant="filled" disabled sx={{ backgroundColor: "#E0E0E0" }} />
        </Box>
      </Box>

      {/* Salidas y Receptores */}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Salidas:
          </Typography>
          <TextField fullWidth variant="filled" disabled sx={{ backgroundColor: "#E0E0E0" }} />
        </Box>
        <Box sx={{ width: "48%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Receptores:
          </Typography>
          <TextField fullWidth variant="filled" disabled sx={{ backgroundColor: "#E0E0E0" }} />
        </Box>
      </Box>
    </Container>
  );
};

export default formProcessMap;